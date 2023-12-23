// SPDX-FileCopyrightText: 2023 Digg - Agency for Digital Government
//
// SPDX-License-Identifier: MIT

import caller from './http-service';

global.fetch = jest.fn();

describe('Http-service', () => {
	beforeEach(() => {
		fetch.mockClear();
		console.error = jest.fn();
	});

	afterEach(() => {
		console.error.mockRestore();
	});

	describe('caller function', () => {
		it('makes a GET request with default headers', async () => {
			fetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ message: 'GET request successful' }),
			});

			const response = await caller('GET', '/some-api-endpoint');

			const expectedHeaders = new Headers({
				'Content-Type': 'application/json',
			});

			expect(fetch).toHaveBeenCalledWith(
				expect.stringMatching(/\/some-api-endpoint$/),
				expect.objectContaining({
					method: 'GET',
					headers: expectedHeaders,
					mode: 'cors',
					cache: 'default',
				})
			);

			expect(response).toEqual({ message: 'GET request successful' });
		});

		it('makes a POST request with custom headers and data', async () => {
			fetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ message: 'POST request successful' }),
			});

			const customHeaders = {
				Authorization: 'Bearer token123',
			};

			const postData = {
				name: 'John',
				email: 'john@example.com',
			};

			const response = await caller(
				'POST',
				'/some-other-endpoint',
				postData,
				customHeaders
			);

			const expectedHeaders = new Headers({
				'Content-Type': 'application/json',
				Authorization: 'Bearer token123',
			});

			expect(fetch).toHaveBeenCalledWith(
				expect.stringMatching(/\/some-other-endpoint$/),
				expect.objectContaining({
					method: 'POST',
					headers: expectedHeaders,
					mode: 'cors',
					cache: 'default',
					body: JSON.stringify(postData),
				})
			);

			expect(response).toEqual({ message: 'POST request successful' });
		});

		it('handles non-successful responses with an error', async () => {
			fetch.mockResolvedValueOnce({
				ok: false,
				status: 404,
				statusText: 'Not Found',
			});

			let error;
			try {
				await caller('GET', '/non-existent-endpoint');
			} catch (e) {
				error = e;
			}

			// Ensure that the error message matches exactly
			expect(error.message).toBe('HTTP Error: 404');
		});

		it('handles network errors', async () => {
			fetch.mockRejectedValueOnce(new Error('Network error'));

			let error;
			try {
				await caller('GET', '/some-api-endpoint');
			} catch (e) {
				error = e;
			}

			expect(fetch).toHaveBeenCalledWith(
				expect.stringMatching(/\/some-api-endpoint$/),
				expect.any(Object)
			);

			expect(error.message).toBe('Network error');
		});
	});
});
