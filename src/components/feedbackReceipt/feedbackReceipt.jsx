import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import './feedbackReceipt.css';

/**
 * Component for showing a receipt after a rating or survey.
 *
 * @param {string} title - Title of the receipt.
 * @param {string} subtitle - Subtitle of the receipt.
 * @param {bool} survey - Type/level of receipt.
 */
const Receipt = ({ title, subtitle, survey }) => {
	const { t } = useTranslation();

	const receiptTitle = survey
		? 'receipt.survey.title'
		: 'receipt.rating.title';
	const receiptSubtitle = survey
		? 'receipt.survey.subtitle'
		: 'receipt.rating.subtitle';

	return (
		<div className="user-feedback-receipt">
			<h1 className="user-feedback-receipt-title">{title || t(receiptTitle)}</h1>
			<h2 className="user-feedback-receipt-subtitle">
				{subtitle || t(receiptSubtitle)}
			</h2>
		</div>
	);
};

Receipt.propTypes = {
	/**
	 * What title text should be shown?
	 */
	title: PropTypes.string,
	/**
	 * What subtitle text should be shown?
	 */
	subtitle: PropTypes.string,
	/**
	 * Type/level of receipt
	 */
	survey: PropTypes.bool,
};

Receipt.defaultProps = {
	title: '',
	subtitle: '',
	survey: false,
};

export default Receipt;
