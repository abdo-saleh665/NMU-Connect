/**
 * Environment Configuration
 * Manages environment-specific settings
 */

const env = {
    // API Base URL - defaults to empty for mock mode
    API_URL: import.meta.env.VITE_API_URL || '',
    
    // Enable mock API for development
    MOCK_API: import.meta.env.VITE_ENABLE_MOCK_API === 'true' || !import.meta.env.VITE_API_URL,
    
    // Environment name
    NODE_ENV: import.meta.env.MODE || 'development',
    
    // Is production environment
    IS_PROD: import.meta.env.PROD,
    
    // Is development environment
    IS_DEV: import.meta.env.DEV
};

export default env;
