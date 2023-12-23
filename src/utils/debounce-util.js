// SPDX-FileCopyrightText: 2023 Digg - Agency for Digital Government
//
// SPDX-License-Identifier: MIT

/**
 * Debounce function
 * @param {Function} func - Function to be executed
 * @param {Number} wait - Time in milliseconds
 *
 * @returns {Function} - Callback function
 */
const debounce = (func, wait) => {
	let timeout;
	return function executedFunction(...args) {
		const later = () => {
			clearTimeout(timeout);
			func(...args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
};

export { debounce };
