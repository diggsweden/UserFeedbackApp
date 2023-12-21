import ApiService from './api-service';
import caller from './http-service';
jest.mock('./http-service');

describe('ApiService', () => {
	let apiService;
	let consoleSpy;

	beforeEach(() => {
		apiService = new ApiService('testApiKey', 'testFingerprint');
		consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		jest.clearAllMocks();
		consoleSpy.mockRestore();
	});

	describe('postImpression', () => {
		test('successfully sends impression and receives data', async () => {
			const mockResponse = {
				id: 123,
				contextId: 456,
				fingerprint: 'testFingerprint',
				createdAt: '2023-09-29',
				updatedAt: '2023-09-29',
			};
			caller.mockResolvedValue(mockResponse);
			const response = await apiService.postImpression({}, {});
			expect(response).toEqual(mockResponse);
		});

		test('handles 400 Bad Request error', async () => {
			let error = { status: 400, message: 'Bad Request' };
			caller.mockRejectedValue(error);
			await apiService.postImpression({}, {});
			expect(consoleSpy).toHaveBeenCalledWith(
				'Error posting impression:',
				error
			);
		});

		test('forms request with correct headers and body', async () => {
			await apiService.postImpression({}, {});
			expect(caller).toHaveBeenCalledWith(
				'POST',
				'/impression/create',
				expect.any(Object),
				{ 'X-API-KEY': 'testApiKey' }
			);
		});
	});

	describe('postRating', () => {
		test('successfully sends rating and receives data', async () => {
			const mockResponse = {
				id: 123,
				contextId: 456,
				impressionId: 789,
				fingerprint: 'testFingerprint',
				score: 5,
				createdAt: '2023-09-29',
				updatedAt: '2023-09-29',
			};
			caller.mockResolvedValue(mockResponse);
			const response = await apiService.postRating('impression123', 5);
			expect(response).toEqual(mockResponse);
		});

		test('handles 400 Bad Request error', async () => {
			let error = { status: 400, message: 'Bad Request' };
			caller.mockRejectedValue(error);
			await apiService.postRating('impression123', 5);
			expect(consoleSpy).toHaveBeenCalledWith(
				'Error posting rating:',
				error
			);
		});

		test('forms request with correct headers and body', async () => {
			await apiService.postRating('impression123', 5);
			expect(caller).toHaveBeenCalledWith(
				'POST',
				'/rating/create',
				expect.any(Object),
				{ 'X-API-KEY': 'testApiKey' }
			);
		});
	});
});
