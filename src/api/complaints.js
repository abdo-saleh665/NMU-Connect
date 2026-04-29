/**
 * Complaints API Service
 * Handles all complaint-related API calls
 */

import api from './client';

/**
 * @typedef {Object} Complaint
 * @property {number} id - Complaint ID
 * @property {number} userId - User who submitted
 * @property {string} title - Complaint title
 * @property {string} description - Detailed description
 * @property {'facilities'|'academic'|'administrative'|'it'|'other'} category
 * @property {'pending'|'in_review'|'resolved'|'closed'} status
 * @property {'low'|'medium'|'high'} priority
 * @property {string} [response] - Admin/staff response
 * @property {string} createdAt - Creation timestamp
 * @property {string} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} CreateComplaintData
 * @property {string} title
 * @property {string} description
 * @property {'facilities'|'academic'|'administrative'|'it'|'other'} category
 * @property {'low'|'medium'|'high'} [priority]
 */

/**
 * Get complaints
 * @param {Object} [filters]
 * @param {string} [filters.status]
 * @param {string} [filters.category]
 * @returns {Promise<{success: boolean, complaints?: Complaint[]}>}
 */
export const getComplaints = async (filters = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.set(key, value);
    });

    const endpoint = `/complaints${queryParams.toString() ? `?${queryParams}` : ''}`;
    const response = await api.get(endpoint);

    return {
        success: response.success,
        complaints: response.data?.complaints || [],
        error: response.error
    };
};

/**
 * Get a single complaint by ID
 * @param {number} id
 * @returns {Promise<{success: boolean, complaint?: Complaint}>}
 */
export const getComplaint = async (id) => {
    const response = await api.get(`/complaints/${id}`);
    return {
        success: response.success,
        complaint: response.data,
        error: response.error
    };
};

/**
 * Create a new complaint
 * @param {CreateComplaintData} data
 * @returns {Promise<{success: boolean, complaint?: Complaint}>}
 */
export const createComplaint = async (data) => {
    const response = await api.post('/complaints', data);
    return {
        success: response.success,
        complaint: response.data,
        error: response.error
    };
};

/**
 * Update complaint status (admin/staff only)
 * @param {number} id
 * @param {string} status
 * @param {string} [response] - Staff response
 * @returns {Promise<{success: boolean}>}
 */
export const updateComplaintStatus = async (id, status, responseText) => {
    const response = await api.patch(`/complaints/${id}`, { status, response: responseText });
    return {
        success: response.success,
        error: response.error
    };
};

/**
 * Get current user's complaints
 * @returns {Promise<{success: boolean, complaints?: Complaint[]}>}
 */
export const getMyComplaints = async () => {
    const response = await api.get('/complaints/my');
    return {
        success: response.success,
        complaints: response.data?.complaints || response.data || [],
        error: response.error
    };
};

/**
 * Vote on a complaint
 * @param {string} complaintId
 * @param {'up'|'down'|'none'} vote
 * @returns {Promise<{success: boolean, voteCount?: number, userVote?: string}>}
 */
export const voteComplaint = async (complaintId, vote) => {
    const response = await api.post(`/complaints/${complaintId}/vote`, { vote });
    return {
        success: response.success,
        voteCount: response.data?.voteCount,
        userVote: response.data?.userVote,
        error: response.error
    };
};

export default {
    getComplaints,
    getComplaint,
    createComplaint,
    updateComplaintStatus,
    getMyComplaints,
    voteComplaint
};
