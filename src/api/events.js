/**
 * Events API Service
 * Handles all event-related API calls
 */

import api from './client';

/**
 * @typedef {Object} Event
 * @property {number} id - Event ID
 * @property {string} title - Event title
 * @property {string} titleAr - Event title in Arabic
 * @property {string} description - Event description
 * @property {string} descriptionAr - Description in Arabic
 * @property {string} date - Event date
 * @property {string} time - Event time
 * @property {string} location - Event location
 * @property {string} locationAr - Location in Arabic
 * @property {'academic'|'social'|'career'|'workshop'|'sports'} category
 * @property {string} [image] - Event image URL
 * @property {number} attendeeCount - Number of RSVPs
 * @property {boolean} isRegistered - Whether current user is registered
 * @property {number} [maxCapacity] - Maximum capacity
 */

/**
 * Get all events
 * @param {Object} [filters]
 * @param {string} [filters.category]
 * @param {string} [filters.startDate]
 * @param {string} [filters.endDate]
 * @returns {Promise<{success: boolean, events?: Event[]}>}
 */
export const getEvents = async (filters = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.set(key, value);
    });

    const endpoint = `/events${queryParams.toString() ? `?${queryParams}` : ''}`;
    const response = await api.get(endpoint);

    return {
        success: response.success,
        events: response.data?.events || [],
        error: response.error
    };
};

/**
 * Get upcoming events
 * @param {number} [limit=5] - Number of events to return
 * @returns {Promise<{success: boolean, events?: Event[]}>}
 */
export const getUpcomingEvents = async (limit = 5) => {
    const response = await api.get(`/events/upcoming?limit=${limit}`);
    return {
        success: response.success,
        events: response.data || [],
        error: response.error
    };
};

/**
 * Get event by ID
 * @param {number} id
 * @returns {Promise<{success: boolean, event?: Event}>}
 */
export const getEvent = async (id) => {
    const response = await api.get(`/events/${id}`);
    return {
        success: response.success,
        event: response.data,
        error: response.error
    };
};

/**
 * RSVP to an event
 * @param {number} eventId
 * @returns {Promise<{success: boolean}>}
 */
export const rsvpEvent = async (eventId) => {
    const response = await api.post(`/events/${eventId}/rsvp`);
    return {
        success: response.success,
        isAttending: response.data?.isAttending,
        attendeeCount: response.data?.attendeeCount,
        error: response.error
    };
};

/**
 * Cancel RSVP for an event
 * @param {number} eventId
 * @returns {Promise<{success: boolean}>}
 */
export const cancelRsvp = async (eventId) => {
    const response = await api.delete(`/events/${eventId}/rsvp`);
    return {
        success: response.success,
        error: response.error
    };
};

export default {
    getEvents,
    getUpcomingEvents,
    getEvent,
    rsvpEvent,
    cancelRsvp
};
