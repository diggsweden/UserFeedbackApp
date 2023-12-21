import postMessageService from './postmessage-service'; // Adjust the import path as needed

describe('PostMessageService', () => {
	const mockAddEventListener = jest.spyOn(window, 'addEventListener');
	const mockRemoveEventListener = jest.spyOn(window, 'removeEventListener');
	const mockPostMessage = jest.fn();

	beforeEach(() => {
		// Reset the singleton state
		postMessageService.eventHandlers = {};
		postMessageService.targetOrigin = null;

		Object.defineProperty(window, 'parent', {
			value: { postMessage: mockPostMessage },
			writable: true,
		});

		mockAddEventListener.mockClear();
		mockRemoveEventListener.mockClear();
		mockPostMessage.mockClear();
	});

	const simulateMessageEvent = (origin, type, data) => {
		postMessageService.handleMessage({
			origin,
			data: { type, data },
		});
	};

	it('initializes with empty eventHandlers and null targetOrigin', () => {
		expect(postMessageService.eventHandlers).toEqual({});
		expect(postMessageService.targetOrigin).toBeNull();
	});

	describe('listen and unlisten', () => {
		it('adds and removes event listener', () => {
			postMessageService.listen();
			expect(mockAddEventListener).toHaveBeenCalledWith(
				'message',
				expect.any(Function),
				false
			);

			postMessageService.unlisten();
			expect(mockRemoveEventListener).toHaveBeenCalledWith(
				'message',
				expect.any(Function),
				false
			);
		});
	});

	describe('handleMessage', () => {
		it('ignores messages from invalid origin', () => {
			const handler = jest.fn();
			postMessageService.registerHandler('test', handler);
			simulateMessageEvent('http://fake-origin.com', 'test', {});

			expect(handler).not.toHaveBeenCalled();
		});

		it('sets targetOrigin dynamically and handles message', () => {
			const handler = jest.fn();
			postMessageService.registerHandler('load', handler);
			simulateMessageEvent('http://valid-origin.com', 'load', {
				context: { domain: 'valid-origin.com' },
			});

			expect(postMessageService.targetOrigin).toBe(
				'http://valid-origin.com'
			);
			expect(handler).toHaveBeenCalledWith({
				context: { domain: 'valid-origin.com' },
			});
		});

		it('handles registered event types', () => {
			const handler = jest.fn();
			postMessageService.targetOrigin = 'http://valid-origin.com';
			postMessageService.registerHandler('test', handler);
			simulateMessageEvent('http://valid-origin.com', 'test', {});

			expect(handler).toHaveBeenCalledWith({});
		});

		it('ignores unregistered event types', () => {
			const handler = jest.fn();
			postMessageService.targetOrigin = 'http://valid-origin.com';
			postMessageService.registerHandler('test', handler);
			simulateMessageEvent('http://valid-origin.com', 'unknown', {});

			expect(handler).not.toHaveBeenCalled();
		});
	});

	describe('sendMessage', () => {
		it('sends message to parent window', () => {
			postMessageService.targetOrigin = 'http://valid-origin.com';
			postMessageService.sendMessage('test', {});

			expect(mockPostMessage).toHaveBeenCalledWith(
				{ type: 'test', data: {} },
				'http://valid-origin.com'
			);
		});

		it('sends message with target origin * if targetOrigin is null', () => {
			postMessageService.sendMessage('test', {});

			expect(mockPostMessage).toHaveBeenCalledWith(
				{ type: 'test', data: {} },
				'*'
			);
		});
	});

	describe('handler registration and removal', () => {
		it('registers and removes event handlers', () => {
			const handler = jest.fn();
			postMessageService.registerHandler('test', handler);
			expect(postMessageService.eventHandlers['test']).toBe(handler);

			postMessageService.removeHandler('test');
			expect(postMessageService.eventHandlers['test']).toBeUndefined();
		});
	});
});
