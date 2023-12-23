// SPDX-FileCopyrightText: 2023 Digg - Agency for Digital Government
//
// SPDX-License-Identifier: MIT

import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import './ratingOption.css';

const types = ['very-happy', 'happy', 'neutral', 'angry', 'very-angry'];

/**
 * Primary UI component for user interaction
 */
export const RatingOption = ({ label, smiley, selected, onClick }) => {
	const { t } = useTranslation();

	// Verify that the smiley is valid
	const smileyIsValid = types.includes(smiley);
	const ratingText = label ? label : t(`option.${smiley}`);

	return (
		<button
			className={`rating-option ${selected ? 'rating-selected' : ''}`}
			onClick={onClick}
		>
			{smileyIsValid && (
				<div className="rating-option-smiley">
					<img
						src={`/smileys/${smiley}.svg`}
						alt={smiley}
						className={`rating-option-smiley-${smiley}`}
					/>
				</div>
			)}

			<p className="text" style={{ fontWeight: 600 }}>
				{ratingText}
			</p>
		</button>
	);
};

RatingOption.propTypes = {
	/**
	 * What text should be shown inside the button?
	 */
	label: PropTypes.string,
	/**
	 * Which smiley to display?
	 */
	smiley: PropTypes.oneOf(types).isRequired,
	/**
	 * Is the option selected?
	 */
	selected: PropTypes.bool,

	/**
	 * What happens when the button is clicked?
	 */
	onClick: PropTypes.func.isRequired,
};

RatingOption.defaultProps = {
	label: '',
	smiley: null,
	selected: false,
	onClick: undefined,
};

export default RatingOption;
