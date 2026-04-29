/**
 * API Service - Central export for all API services
 * 
 * Usage:
 * import { authApi, appointmentsApi, complaintsApi, eventsApi, tutorsApi, lostItemsApi } from './api';
 * 
 * // Or import specific functions
 * import { login, logout } from './api/auth';
 */

export { default as api, apiRequest } from './client';
export { default as authApi } from './auth';
export { default as appointmentsApi } from './appointments';
export { default as complaintsApi } from './complaints';
export { default as eventsApi } from './events';
export { default as tutorsApi } from './tutors';
export { default as lostItemsApi } from './lostItems';

// Re-export individual functions for convenience
export * from './auth';
export * from './appointments';
export * from './complaints';
export * from './events';
export * from './tutors';
export * from './lostItems';

