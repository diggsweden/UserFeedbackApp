// SPDX-FileCopyrightText: 2023 Digg - Agency for Digital Government
//
// SPDX-License-Identifier: MIT

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import RatingOption from './ratingOption';
import { useTranslation } from 'react-i18next';

jest.mock('react-i18next', () => ({
	useTranslation: jest.fn(),
}));

describe('RatingOption Component', () => {
	beforeEach(() => {
		useTranslation.mockReturnValue({
			t: (str) => {
				switch (str) {
					case 'option.very-happy':
						return 'Very Happy';
					case 'option.happy':
						return 'Happy';
					case 'option.neutral':
						return 'Neutral';
					case 'option.angry':
						return 'Angry';
					case 'option.very-angry':
						return 'Very Angry';
					default:
						return str;
				}
			},
		});
	});

	it('renders the label if provided', () => {
		const label = 'Custom Label';
		render(
			<RatingOption label={label} smiley="happy" onClick={() => {}} />
		);
		expect(screen.getByText(label)).toBeInTheDocument();
	});

	it('renders translated label if no label provided', () => {
		const smiley = 'happy';
		render(<RatingOption smiley={smiley} onClick={() => {}} />);
		expect(screen.getByText('Happy')).toBeInTheDocument();
	});

	it('renders correct smiley', () => {
		const smiley = 'happy';
		render(<RatingOption smiley={smiley} onClick={() => {}} />);
		const img = screen.getByAltText(smiley);
		expect(img).toBeInTheDocument();
		expect(img.src).toContain(`/smileys/${smiley}.svg`);
	});

	it('adds the selected class when selected', () => {
		render(
			<RatingOption smiley="happy" selected={true} onClick={() => {}} />
		);
		expect(screen.getByRole('button')).toHaveClass('rating-selected');
	});

	it('calls onClick when clicked', () => {
		const handleClick = jest.fn();
		render(<RatingOption smiley="happy" onClick={handleClick} />);
		fireEvent.click(screen.getByRole('button'));
		expect(handleClick).toHaveBeenCalledTimes(1);
	});
});
