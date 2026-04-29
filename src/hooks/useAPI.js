/**
 * useAPI Custom Hook
 * Provides standardized API call handling with loading, error, and retry functionality
 */

import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook for handling API calls
 * @param {Function} apiFunction - The API function to call
 * @param {Object} options - Configuration options
 * @returns {Object} { data, isLoading, error, execute, reset }
 */
export const useAPI = (apiFunction, options = {}) => {
    const {
        immediate = false,      // Call immediately on mount
        initialData = null,     // Initial data state
        onSuccess = null,       // Success callback
        onError = null,         // Error callback
        retryCount = 0,         // Number of retries on failure
        retryDelay = 1000,      // Delay between retries
    } = options;

    const [data, setData] = useState(initialData);
    const [isLoading, setIsLoading] = useState(immediate);
    const [error, setError] = useState(null);
    const [retries, setRetries] = useState(0);

    const mountedRef = useRef(true);
    const abortControllerRef = useRef(null);

    // Execute the API call
    const execute = useCallback(async (...args) => {
        // Cancel any pending request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        setIsLoading(true);
        setError(null);

        try {
            const result = await apiFunction(...args);

            if (!mountedRef.current) return;

            if (result.success === false) {
                throw new Error(result.error || 'Request failed');
            }

            setData(result.data || result);
            onSuccess?.(result.data || result);
            setRetries(0);
            return result;
        } catch (err) {
            if (!mountedRef.current) return;

            // Retry logic
            if (retries < retryCount) {
                setRetries(prev => prev + 1);
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                return execute(...args);
            }

            const errorMessage = err.message || 'An error occurred';
            setError(errorMessage);
            onError?.(errorMessage);
            throw err;
        } finally {
            if (mountedRef.current) {
                setIsLoading(false);
            }
        }
    }, [apiFunction, onSuccess, onError, retryCount, retryDelay, retries]);

    // Reset state
    const reset = useCallback(() => {
        setData(initialData);
        setError(null);
        setIsLoading(false);
        setRetries(0);
    }, [initialData]);

    // Cancel pending request on unmount
    useEffect(() => {
        mountedRef.current = true;

        if (immediate) {
            execute();
        }

        return () => {
            mountedRef.current = false;
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    return {
        data,
        isLoading,
        error,
        execute,
        reset,
        retry: () => execute()
    };
};

/**
 * Simple debounce hook for search inputs
 */
export const useDebounce = (value, delay = 300) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
};

/**
 * Hook for localStorage with automatic serialization
 */
export const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    const setValue = useCallback((value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, storedValue]);

    const removeValue = useCallback(() => {
        try {
            window.localStorage.removeItem(key);
            setStoredValue(initialValue);
        } catch (error) {
            console.error(`Error removing localStorage key "${key}":`, error);
        }
    }, [key, initialValue]);

    return [storedValue, setValue, removeValue];
};

export default useAPI;
