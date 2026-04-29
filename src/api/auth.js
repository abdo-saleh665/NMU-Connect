/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */

import api from './client';

/**
 * @typedef {Object} LoginCredentials
 * @property {string} email - User email
 * @property {string} password - User password
 */

/**
 * @typedef {Object} User
 * @property {number} id - User ID
 * @property {string} email - User email
 * @property {string} name - User full name
 * @property {string} nameAr - User name in Arabic
 * @property {'student'|'faculty'|'admin'} role - User role
 * @property {string} [studentId] - Student ID (for students)
 * @property {string} department - Department name
 * @property {string} departmentAr - Department name in Arabic
 * @property {string} avatar - Avatar URL
 */

/**
 * Login with credentials
 * @param {LoginCredentials} credentials
 * @returns {Promise<{success: boolean, user?: User, error?: string}>}
 */
export const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials, { auth: false });
    
    if (response.success) {
        return {
            success: true,
            user: response.data.user,
            token: response.data.token
        };
    }
    
    return {
        success: false,
        error: response.error || 'Login failed'
    };
};

/**
 * Logout current user
 * @returns {Promise<{success: boolean}>}
 */
export const logout = async () => {
    const response = await api.post('/auth/logout');
    return { success: response.success };
};

/**
 * Get current authenticated user
 * @returns {Promise<{success: boolean, user?: User}>}
 */
export const getCurrentUser = async () => {
    const response = await api.get('/auth/me');
    
    if (response.success) {
        return {
            success: true,
            user: response.data
        };
    }
    
    return {
        success: false,
        error: response.error
    };
};

/**
 * Refresh authentication token
 * @returns {Promise<{success: boolean, token?: string}>}
 */
export const refreshToken = async () => {
    const response = await api.post('/auth/refresh');
    
    if (response.success) {
        return {
            success: true,
            token: response.data.token
        };
    }
    
    return {
        success: false,
        error: response.error
    };
};

/**
 * Request password reset
 * @param {string} email
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export const requestPasswordReset = async (email) => {
    const response = await api.post('/auth/forgot-password', { email }, { auth: false });
    
    return {
        success: response.success,
        message: response.data?.message || response.error
    };
};

export default {
    login,
    logout,
    getCurrentUser,
    refreshToken,
    requestPasswordReset
};
