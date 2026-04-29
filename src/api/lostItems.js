/**
 * Lost & Found API Service
 * Handles lost items related API calls
 */

import api from './client';

/**
 * Get lost/found items
 */
export const getLostItems = async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.type) queryParams.set('type', filters.type);
    if (filters.category) queryParams.set('category', filters.category);
    if (filters.limit) queryParams.set('limit', filters.limit);

    const endpoint = `/lost-items${queryParams.toString() ? `?${queryParams}` : ''}`;
    const response = await api.get(endpoint);

    return {
        success: response.success,
        items: response.data?.items || response.data || [],
        error: response.error
    };
};

/**
 * Get user's posted items
 */
export const getMyItems = async () => {
    const response = await api.get('/lost-items/my');

    return {
        success: response.success,
        items: response.data?.items || response.data || [],
        error: response.error
    };
};

/**
 * Create a new lost/found item
 */
export const createItem = async (data) => {
    const response = await api.post('/lost-items', data);

    return {
        success: response.success,
        item: response.data?.item,
        error: response.error
    };
};

/**
 * Claim an item
 */
export const claimItem = async (itemId) => {
    const response = await api.post(`/lost-items/${itemId}/claim`);

    return {
        success: response.success,
        item: response.data?.item,
        error: response.error
    };
};

/**
 * Update an item
 */
export const updateItem = async (itemId, data) => {
    const response = await api.patch(`/lost-items/${itemId}`, data);

    return {
        success: response.success,
        item: response.data?.item,
        error: response.error
    };
};

/**
 * Delete an item
 */
export const deleteItem = async (itemId) => {
    const response = await api.delete(`/lost-items/${itemId}`);

    return {
        success: response.success,
        error: response.error
    };
};

export default {
    getLostItems,
    getMyItems,
    createItem,
    claimItem,
    updateItem,
    deleteItem
};
