// SPDX-FileCopyrightText: 2023 Digg - Agency for Digital Government
//
// SPDX-License-Identifier: MIT

class PostMessageService {
	constructor() {
		this.eventHandlers = {};
		this.targetOrigin = null; // Initially null, to be set dynamically
	}

	listen() {
		window.addEventListener(
			'message',
			this.handleMessage.bind(this),
			false
		);
	}

	unlisten() {
		window.removeEventListener(
			'message',
			this.handleMessage.bind(this),
			false
		);
	}

	handleMessage(event) {
		const { type, data } = event.data;

		// Set targetOrigin dynamically if it's null and if the event has 'domain'
		if (
			!this.targetOrigin &&
			type === 'load' &&
			data.context &&
			data.context.domain
		) {
			const url = new URL(event.origin);
			this.targetOrigin =
				url.hostname === data.context.domain ? url.origin : null;
		}

		// Proceed with the handler if the origin matches
		if (event.origin === this.targetOrigin) {
			const handler = this.eventHandlers[type];
			if (handler) {
				handler(data);
			}
		}
	}

	sendMessage(type, data) {
		if (window.parent) {
			// If targetOrigin is null, send to any origin since we
			// don't know the origin of the parent window yet
			const targetOrigin = this.targetOrigin || '*';
			window.parent.postMessage({ type, data }, targetOrigin);
		}
	}

	registerHandler(eventType, handler) {
		this.eventHandlers[eventType] = handler;
	}

	removeHandler(eventType) {
		delete this.eventHandlers[eventType];
	}
}

const instance = new PostMessageService();
export default instance;
