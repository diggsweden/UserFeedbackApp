import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import FeedbackContainer from './feedbackContainer';
import ApiService from '../../services/api-service';

jest.mock('react-i18next', () => ({
	useTranslation: () => ({
		t: (key) => key,
	}),
}));

jest.mock('../../services/api-service');

const mockContext = {
	domain: 'test.com',
	path: '/test',
	name: 'TestComponent',
	fingerprint: 'testFingerprint',
	locale: 'en',
};

const mockStyling = {};

const mockConfig = {
	apiKey: 'testApiKey',
	labels: [],
	tags: [],
	name: 'testServiceName',
};

describe('FeedbackContainer Component', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('renders without crashing', () => {
		render(
			<FeedbackContainer
				context={mockContext}
				styling={mockStyling}
				config={mockConfig}
			/>
		);
		expect(screen.getByText('header.title')).toBeInTheDocument();
	});

	it('handles rating selection', async () => {
		// Mock postImpression to return an impression ID
		const postImpressionMock = jest.fn(() =>
			Promise.resolve({ id: 'test-id', average: 3 })
		);
		ApiService.prototype.postImpression = postImpressionMock;

		// Mock postRating method
		const postRatingMock = jest.fn(() => Promise.resolve({}));
		ApiService.prototype.postRating = postRatingMock;

		render(
			<FeedbackContainer
				context={mockContext}
				styling={mockStyling}
				config={mockConfig}
			/>
		);

		// Ensure impression was made and we received an impressionId
		await waitFor(() => {
			expect(postImpressionMock).toHaveBeenCalled();
		});

		const ratingOption = 'option.very-angry';

		// Introduce a delay to ensure component state updates with new impressionId
		await new Promise((resolve) => setTimeout(resolve, 100));

		fireEvent.click(screen.getByText(ratingOption));

		await waitFor(() => {
			// Check if the postRating method was called
			expect(postRatingMock).toHaveBeenCalled();
		});
	});

	it('handles errors gracefully', async () => {
		const consoleSpy = jest
			.spyOn(console, 'error')
			.mockImplementation(() => {});

		// Mock postImpression to return an impression ID
		const postImpressionMock = jest.fn(() =>
			Promise.resolve({ id: 123, average: 3 })
		);
		ApiService.prototype.postImpression = postImpressionMock;

		// Explicitly mock the postRating method to reject with an error
		const postRatingMock = jest.fn(() =>
			Promise.reject(new Error('API Error'))
		);
		ApiService.prototype.postRating = postRatingMock;

		render(
			<FeedbackContainer
				context={mockContext}
				styling={mockStyling}
				config={mockConfig}
			/>
		);

		await waitFor(() => {
			expect(postImpressionMock).toHaveBeenCalled(); // Ensure impression was made
		});

		const ratingOption = 'option.very-angry';

		// Introduce a delay to ensure component state updates with new impressionId
		await new Promise((resolve) => setTimeout(resolve, 100));

		fireEvent.click(screen.getByText(ratingOption));

		await waitFor(() => {
			// Check if the postRating method was called
			expect(postRatingMock).toHaveBeenCalled();
		});

		expect(consoleSpy).toHaveBeenCalledWith(
			'Failed to post rating:',
			new Error('API Error')
		);
		consoleSpy.mockRestore();
	});

	// Additional tests can be added as needed.
});
