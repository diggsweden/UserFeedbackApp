// SPDX-FileCopyrightText: 2023 Digg - Agency for Digital Government
//
// SPDX-License-Identifier: CC0-1.0

import i18n from './i18n';
import '../src/assets/css/index.css';

/** @type { import('@storybook/react').Preview } */
const preview = {
	globals: {
		locale: 'sv',
		locales: {
			sv: 'Svenska',
			en: 'English',
		},
	},
	parameters: {
		actions: { argTypesRegex: '^on[A-Z].*' },
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/,
			},
		},
		i18n,
	},
};

export default preview;
