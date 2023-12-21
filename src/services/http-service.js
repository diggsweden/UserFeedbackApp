/**
 * HTTP fetch based caller
 *
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE, etc.)
 * @param {string} url - The URL for the API endpoint
 * @param {object} data - The data to send in the request body (for POST and PUT requests)
 * @param {object} headers - Custom headers to include in the request
 * @returns {Promise<object>} - A promise that resolves to the JSON response
 */
const caller = async (method, url, data = null, headers = {}) => {
	const apiUrl = `${process.env.REACT_APP_API_URL}${url}`;
	const defaultHeaders = {
		'Content-Type': 'application/json',
		...headers,
	};

	const options = {
		method,
		headers: new Headers(defaultHeaders),
		mode: 'cors',
		cache: 'default',
	};

	if (data) {
		options.body = JSON.stringify(data);
	}

	try {
		const response = await fetch(apiUrl, options);

		// Handle non-successful responses (e.g., 404, 500, etc.)
		if (!response.ok) {
			throw new Error(`HTTP Error: ${response.status}`);
		}

		const json = await response.json();
		return json;
	} catch (error) {
		// Handle network errors and exceptions
		console.error(`Error calling ${apiUrl}:`, error);
		throw error;
	}
};

export default caller;
