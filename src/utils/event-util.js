// SPDX-FileCopyrightText: 2023 Digg - Agency for Digital Government
//
// SPDX-License-Identifier: MIT

/**
 * Event listeners for the parent iframe.
 *
 * Names must match the messageType sent from the parent.
 *
 * Each handler can be supplied with the params below:
 * @param {Object} data - The message payload from the iframe.
 */
const eventListeners = {
	example: (data) => {
		console.log('eventListeners example', data);
	},
};

export { eventListeners };
