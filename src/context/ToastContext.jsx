import { createContext, useContext, useState, useCallback } from 'react';

/**
 * Toast types for different message styles
 */
export const ToastType = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
};

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

/**
 * Toast Provider - Manages toast notifications
 */
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    /**
     * Show a toast notification
     * @param {Object} options
     * @param {string} options.message - Toast message
     * @param {string} options.type - Toast type (success, error, warning, info)
     * @param {number} [options.duration=3000] - Duration in ms before auto-dismiss
     * @param {string} [options.title] - Optional title
     */
    const showToast = useCallback(({ message, type = ToastType.INFO, duration = 3000, title }) => {
        const id = Date.now() + Math.random();

        const newToast = {
            id,
            message,
            type,
            title,
            duration
        };

        setToasts(prev => [...prev, newToast]);

        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }

        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    // Convenience methods
    const success = useCallback((message, title) =>
        showToast({ message, type: ToastType.SUCCESS, title }), [showToast]);

    const error = useCallback((message, title) =>
        showToast({ message, type: ToastType.ERROR, title }), [showToast]);

    const warning = useCallback((message, title) =>
        showToast({ message, type: ToastType.WARNING, title }), [showToast]);

    const info = useCallback((message, title) =>
        showToast({ message, type: ToastType.INFO, title }), [showToast]);

    const value = {
        toasts,
        showToast,
        removeToast,
        success,
        error,
        warning,
        info
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
        </ToastContext.Provider>
    );
};

export default ToastContext;
