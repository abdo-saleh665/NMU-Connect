/**
 * Appointments API Service
 * Handles all appointment-related API calls
 */

import api from './client';

/**
 * @typedef {Object} Appointment
 * @property {number} id - Appointment ID
 * @property {number} studentId - Student user ID
 * @property {number} facultyId - Faculty user ID
 * @property {string} date - Appointment date (ISO string)
 * @property {string} time - Appointment time
 * @property {string} reason - Reason for appointment
 * @property {'pending'|'accepted'|'declined'|'completed'|'cancelled'} status
 * @property {string} [notes] - Additional notes
 * @property {string} createdAt - Creation timestamp
 * @property {string} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} CreateAppointmentData
 * @property {number} facultyId - Faculty to meet with
 * @property {string} date - Requested date
 * @property {string} time - Requested time
 * @property {string} reason - Reason for appointment
 * @property {string} [notes] - Additional notes
 */

/**
 * Get appointments for current user
 * @param {Object} [filters] - Optional filters
 * @param {'pending'|'accepted'|'declined'|'completed'|'cancelled'} [filters.status]
 * @param {string} [filters.startDate]
 * @param {string} [filters.endDate]
 * @returns {Promise<{success: boolean, appointments?: Appointment[]}>}
 */
export const getAppointments = async (filters = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.set(key, value);
    });

    const endpoint = `/appointments${queryParams.toString() ? `?${queryParams}` : ''}`;
    const response = await api.get(endpoint);

    if (response.success) {
        return {
            success: true,
            appointments: response.data?.appointments || response.data || []
        };
    }

    return {
        success: false,
        error: response.error,
        appointments: []
    };
};

/**
 * Get a single appointment by ID
 * @param {number} id
 * @returns {Promise<{success: boolean, appointment?: Appointment}>}
 */
export const getAppointment = async (id) => {
    const response = await api.get(`/appointments/${id}`);

    if (response.success) {
        return {
            success: true,
            appointment: response.data
        };
    }

    return {
        success: false,
        error: response.error
    };
};

/**
 * Create a new appointment request
 * @param {CreateAppointmentData} data
 * @returns {Promise<{success: boolean, appointment?: Appointment}>}
 */
export const createAppointment = async (data) => {
    const response = await api.post('/appointments', data);

    if (response.success) {
        return {
            success: true,
            appointment: response.data
        };
    }

    return {
        success: false,
        error: response.error
    };
};

/**
 * Update appointment status (for faculty)
 * @param {number} id - Appointment ID
 * @param {'accepted'|'declined'} status - New status
 * @param {string} [notes] - Optional notes
 * @returns {Promise<{success: boolean, appointment?: Appointment}>}
 */
export const updateAppointmentStatus = async (id, status, notes) => {
    const response = await api.patch(`/appointments/${id}/status`, { status, notes });

    if (response.success) {
        return {
            success: true,
            appointment: response.data
        };
    }

    return {
        success: false,
        error: response.error
    };
};

/**
 * Cancel an appointment
 * @param {number} id
 * @returns {Promise<{success: boolean}>}
 */
export const cancelAppointment = async (id) => {
    const response = await api.patch(`/appointments/${id}/cancel`);
    return { success: response.success, error: response.error };
};

/**
 * Get available time slots for a faculty member
 * @param {number} facultyId
 * @param {string} date - Date to check (YYYY-MM-DD)
 * @returns {Promise<{success: boolean, slots?: string[]}>}
 */
export const getAvailableSlots = async (facultyId, date) => {
    const response = await api.get(`/appointments/slots?facultyId=${facultyId}&date=${date}`);

    if (response.success) {
        return {
            success: true,
            slots: response.data || []
        };
    }

    return {
        success: false,
        error: response.error,
        slots: []
    };
};

export default {
    getAppointments,
    getAppointment,
    createAppointment,
    updateAppointmentStatus,
    cancelAppointment,
    getAvailableSlots
};
