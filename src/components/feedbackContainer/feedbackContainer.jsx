// SPDX-FileCopyrightText: 2023 Digg - Agency for Digital Government
//
// SPDX-License-Identifier: MIT

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import ApiService from '../../services/api-service';
import FeedbackHeader from '../feedbackHeader/feedbackHeader';
import RatingOption from '../ratingOption/ratingOption';
import FeedbackReceipt from '../feedbackReceipt/feedbackReceipt';
import './feedbackContainer.css';

const defaultOptions = [
	{
		score: 1,
		smiley: 'very-angry',
	},
	{
		score: 2,
		smiley: 'angry',
	},
	{
		score: 3,
		smiley: 'neutral',
	},
	{
		score: 4,
		smiley: 'happy',
	},
	{
		score: 5,
		smiley: 'very-happy',
	},
];

/**
 * Primary UI wrapper component
 *
 * @param {object} context
 * @param {object} styling
 * @param {object} config
 *
 * @returns {JSX.Element}
 */
const Container = ({ context, styling, config }) => {
	const { t } = useTranslation();
	const api = useMemo(
		() => new ApiService(config.apiKey, context.fingerprint),
		[config.apiKey, context.fingerprint]
	);

	const options = useMemo(
		() => config.options || defaultOptions,
		[config.options]
	);

	const alignment =
		styling.align === 'left' || styling.align === 'right'
			? styling.align
			: 'center';

	const [selectedOption, setSelectedOption] = useState(null);
	const [showReceipt, setShowReceipt] = useState(false);
	const [impressionId, setImpressionId] = useState(null);
	const [averageData, setAverageData] = useState({});

	/**
	 * Handle click on rating option
	 *
	 * @param {number} index
	 */
	async function clickHandler(index) {
		if (selectedOption === index) {
			setSelectedOption(null);
			return;
		}

		setSelectedOption(index);

		if (!impressionId) {
			//try to refire impression event
			impressionHandler();

			if (!impressionId) {
				return;
			}
		}

		// Send data to backend
		try {
			let response = await api.postRating(impressionId, options[index].score);

			if (response) {
				let timeout = setTimeout(() => {
					setShowReceipt(true);
				}, config.receiptTimeout || 4000);

				return () => clearTimeout(timeout);
			}
		} catch (error) {
			console.error('Failed to post rating:', error);
		}
	}

	/**
	 * Handle impression call
	 */
	const impressionHandler = useCallback(async () => {
		let response = await api.postImpression(context, config);

		if (response) {
			setImpressionId(response.id);
			setAverageData({
				average: (Math.round(response.avgRating * 10) / 10).toFixed(1),
				count: response.ratingCount,
			});
		}
	}, [api, context, config]);

	// fire onload event
	useEffect(() => {
		impressionHandler();
	}, [impressionHandler]);

	return (
		<div className={`user-feedback-container align-${alignment}`}>
			{!showReceipt && (
				<>
					<FeedbackHeader/>

					<div className="user-feedback-container-options">
						{
							// Display options
							options.map((option, index) => (
								<RatingOption
									key={index}
									index={index}
									label={option.label}
									smiley={config.hideSmiley ? '' : option.smiley}
									selected={selectedOption === index}
									onClick={() => clickHandler(index)}
								/>
							))
						}
					</div>

					{
						// Display selected option score
						selectedOption !== null && (
							<div className="user-feedback-container-scores">
								<p>
									{t('container.footer.choice', {
										score: options[selectedOption].score,
									})}
									{averageData && averageData.average && averageData.count > 2 && (
											<span>
												{` (${t('container.footer.average', averageData)})`}
											</span>
										)
									}
								</p>
							</div>
						)
					}
				</>
			)}

			{selectedOption !== null && showReceipt && <FeedbackReceipt />}
		</div>
	);
};

Container.propTypes = {
	/**
	 * Config provided by external wrapper
	 */
	config: PropTypes.shape({
		apiKey: PropTypes.string.isRequired,
		tags: PropTypes.arrayOf(PropTypes.string),
		labels: PropTypes.arrayOf(PropTypes.string),
		parentName: PropTypes.string,
	}).isRequired,

	/**
	 * Styling provided by external wrapper
	 */
	styling: PropTypes.shape({
		align: PropTypes.string,
	}),

	/**
	 * Context provided by external wrapper
	 */
	context: PropTypes.shape({
		fingerprint: PropTypes.string.isRequired,
		domain: PropTypes.string.isRequired,
		path: PropTypes.string.isRequired,
		locale: PropTypes.string,
		name: PropTypes.string.isRequired,
	}).isRequired,
};

Container.defaultProps = {
	styling: {
		align: 'center',
	},
};

export default Container;
