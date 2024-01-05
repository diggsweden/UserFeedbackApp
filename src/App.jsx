// SPDX-FileCopyrightText: 2023 Digg - Agency for Digital Government
//
// SPDX-License-Identifier: MIT

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import FeedbackContainer from './components/feedbackContainer/feedbackContainer.jsx';
import PostMessageService from './services/postmessage-service.js';
import { eventListeners } from './utils/event-util.js';
import { debounce } from './utils/debounce-util.js';
import './assets/css/App.css';

const App = () => {
	const { i18n, t } = useTranslation();
	const [data, setData] = useState(null);
	const wrapper = useRef();

	// Debounce the resize event to avoid performance issues
	const handleResize = useCallback(() => {
		const debouncedResize = debounce(() => {
			const { offsetWidth: width, offsetHeight: height } = wrapper.current;

			PostMessageService.sendMessage('resize', {
				width: `${width}`,
				height: `${height}`,
			});
		}, 50);

		// Call the debounced function
		debouncedResize();
	}, []);

	useEffect(() => {
		const observer = new ResizeObserver(handleResize);

		if (data) {
			// Enforce language based on context
			if (data.context && data.context.locale) {
				i18n.changeLanguage(data.context.locale);
			}

			// Send message to parent that the app has loaded
			PostMessageService.sendMessage('loaded');

			// Listen for resize events
			if (wrapper.current) {
				observer.observe(wrapper.current);
			}
		}

		// Cleanup
		return () => observer.disconnect();
	}, [data, handleResize, i18n]);

	/*
	 * Load dark mode styles
	 */
	useEffect(() => {
		if (data) {
			const theme = data.styling.hasOwnProperty('theme') ? data.styling.theme : "auto";

			switch (theme) {
				case 'light':
					import('./assets/css/theme/light.css');
					break;
				case 'dark':
					import('./assets/css/theme/dark.css');
					break;
				case 'auto':
					import('./assets/css/theme/auto.css');
					break;
				default:
					import('./assets/css/theme/auto.css');
			}
		}


	}, [data]);

	useEffect(() => {
		// add event listeners
		const events = { load: setData, ...eventListeners };
		Object.entries(events).forEach(([eventType, handler]) => {
			PostMessageService.registerHandler(eventType, handler);
		});

		// listen for messages
		PostMessageService.listen();

		// remove event listeners
		return () => {
			PostMessageService.unlisten();
		};
	}, []);

	if (!data) {
		return <div>{t('app.loading')}</div>;
	}

	return (
		<div className="user-feedback-app" ref={wrapper}>
			<FeedbackContainer
				config={data.config}
				styling={data.styling}
				context={data.context}
			/>
		</div>
	);
};

export default App;
