/**
 * Tutors & Sessions API Service
 * Handles peer tutoring related API calls
 */

import api from './client';

/**
 * Get available tutors
 */
export const getTutors = async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.subject) queryParams.set('subject', filters.subject);
    if (filters.available) queryParams.set('available', 'true');
    
    const endpoint = `/tutors${queryParams.toString() ? `?${queryParams}` : ''}`;
    const response = await api.get(endpoint);
    
    return {
        success: response.success,
        tutors: response.data?.tutors || [],
        error: response.error
    };
};

/**
 * Get user's tutoring sessions
 */
export const getSessions = async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.set('status', filters.status);
    
    const endpoint = `/tutors/sessions${queryParams.toString() ? `?${queryParams}` : ''}`;
    const response = await api.get(endpoint);
    
    return {
        success: response.success,
        sessions: response.data?.sessions || [],
        error: response.error
    };
};

/**
 * Request a tutoring session
 */
export const requestSession = async (data) => {
    const response = await api.post('/tutors/sessions', data);
    
    return {
        success: response.success,
        session: response.data?.session,
        error: response.error
    };
};

/**
 * Update session status
 */
export const updateSessionStatus = async (sessionId, status, rating, feedback) => {
    const response = await api.patch(`/tutors/sessions/${sessionId}`, { 
        status, rating, feedback 
    });
    
    return {
        success: response.success,
        session: response.data?.session,
        error: response.error
    };
};

/**
 * Get session messages
 */
export const getSessionMessages = async (sessionId) => {
    const response = await api.get(`/tutors/sessions/${sessionId}/messages`);
    
    return {
        success: response.success,
        messages: response.data?.messages || [],
        error: response.error
    };
};

/**
 * Send message in session
 */
export const sendSessionMessage = async (sessionId, message) => {
    const response = await api.post(`/tutors/sessions/${sessionId}/messages`, message);
    
    return {
        success: response.success,
        message: response.data?.message,
        error: response.error
    };
};

/**
 * Update tutor availability
 */
export const updateAvailability = async (isAvailable) => {
    const response = await api.patch('/tutors/availability', { isAvailable });
    
    return {
        success: response.success,
        isAvailable: response.data?.isAvailable,
        error: response.error
    };
};

export default {
    getTutors,
    getSessions,
    requestSession,
    updateSessionStatus,
    getSessionMessages,
    sendSessionMessage,
    updateAvailability
};
