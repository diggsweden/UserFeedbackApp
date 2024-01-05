// SPDX-FileCopyrightText: 2023 Digg - Agency for Digital Government
//
// SPDX-License-Identifier: MIT

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './feedbackHeader.css';

/**
 * Header Component
 */
export const FeedbackHeader = () => {
	const { t } = useTranslation();
	const [clicked, setClicked] = useState(false);

	function handleClick() {
		setClicked(!clicked);
	}

	return (
		<div className="user-feedback-header">
			<h1 className="title">{t('header.title')}</h1>
			<div
				tabIndex="0"
				className="tooltip"
				onClick={handleClick}
				onKeyDown={(e) => {
					// Handle Enter or Space key
					if (e.key === 'Enter' || e.key === ' ') {
						handleClick();
					}
				}}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					title="tooltip"
					fill="none"
					className="tooltip-icon"
				>
					<title>{t('header.tooltip.alt_text')}</title>
					{clicked && (
						<path
							className="close-icon"
							d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 10.5858L9.17157 7.75736L7.75736 9.17157L10.5858 12L7.75736 14.8284L9.17157 16.2426L12 13.4142L14.8284 16.2426L16.2426 14.8284L13.4142 12L16.2426 9.17157L14.8284 7.75736L12 10.5858Z"
						/>
					)}
					{!clicked && (
						<path
							className="info-icon"
							d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 11V17H13V11H11ZM11 7V9H13V7H11Z"
						/>
					)}
				</svg>
			</div>
			<div
				className={`tooltip-content  ${clicked ? 'visible' : 'hidden'}`}
				style={{ visibility: clicked ? 'visible' : 'hidden' }}
			>
				<p className="text">{t('header.tooltip.text')}</p>
			</div>
		</div>
	);
};

export default FeedbackHeader;
