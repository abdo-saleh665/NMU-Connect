/**
 * API Client - Base HTTP client for making API requests
 * Handles common functionality like headers, error handling, and auth tokens
 */

import env from '../config/env';

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Whether the request was successful
 * @property {*} data - Response data
 * @property {string} [error] - Error message if failed
 * @property {number} status - HTTP status code
 */

/**
 * @typedef {Object} RequestOptions
 * @property {string} [method='GET'] - HTTP method
 * @property {Object} [headers] - Additional headers
 * @property {Object|FormData} [body] - Request body
 * @property {boolean} [auth=true] - Whether to include auth token
 */

const AUTH_STORAGE_KEY = 'nmu_auth_user';

/**
 * Get the auth token from storage
 * @returns {string|null}
 */
const getAuthToken = () => {
    try {
        const user = localStorage.getItem(AUTH_STORAGE_KEY);
        if (user) {
            const parsed = JSON.parse(user);
            return parsed.token || parsed.id?.toString();
        }
    } catch {
        return null;
    }
    return null;
};

/**
 * Build request headers
 * @param {boolean} includeAuth - Whether to include auth header
 * @param {Object} customHeaders - Additional custom headers
 * @returns {Headers}
 */
const buildHeaders = (includeAuth = true, customHeaders = {}) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
        ...customHeaders
    });

    if (includeAuth) {
        const token = getAuthToken();
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
    }

    return headers;
};

/**
 * Make an API request
 * @param {string} endpoint - API endpoint (will be appended to base URL)
 * @param {RequestOptions} options - Request options
 * @returns {Promise<ApiResponse>}
 */
export const apiRequest = async (endpoint, options = {}) => {
    const {
        method = 'GET',
        headers: customHeaders = {},
        body,
        auth = true
    } = options;

    // Check if mock mode is enabled
    if (env.MOCK_API) {
        console.log(`[Mock API] ${method} ${endpoint}`, body);
        // Return mock response - actual mock implementations done in service files
        return {
            success: true,
            data: null,
            status: 200,
            mock: true
        };
    }

    const url = `${env.API_URL}${endpoint}`;
    const headers = buildHeaders(auth, customHeaders);

    const config = {
        method,
        headers,
    };

    if (body && method !== 'GET') {
        config.body = body instanceof FormData ? body : JSON.stringify(body);
        if (body instanceof FormData) {
            headers.delete('Content-Type'); // Let browser set multipart boundary
        }
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json().catch(() => null);

        if (!response.ok) {
            return {
                success: false,
                data: null,
                error: data?.message || `HTTP Error: ${response.status}`,
                status: response.status
            };
        }

        return {
            success: true,
            data,
            status: response.status
        };
    } catch (error) {
        console.error('API Request Error:', error);
        return {
            success: false,
            data: null,
            error: error.message || 'Network error',
            status: 0
        };
    }
};

// Convenience methods
export const api = {
    get: (endpoint, options = {}) => 
        apiRequest(endpoint, { ...options, method: 'GET' }),
    
    post: (endpoint, body, options = {}) => 
        apiRequest(endpoint, { ...options, method: 'POST', body }),
    
    put: (endpoint, body, options = {}) => 
        apiRequest(endpoint, { ...options, method: 'PUT', body }),
    
    patch: (endpoint, body, options = {}) => 
        apiRequest(endpoint, { ...options, method: 'PATCH', body }),
    
    delete: (endpoint, options = {}) => 
        apiRequest(endpoint, { ...options, method: 'DELETE' })
};

export default api;
