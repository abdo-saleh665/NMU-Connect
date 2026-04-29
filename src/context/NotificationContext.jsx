import { createContext, useContext, useState, useCallback, useEffect } from 'react';

/**
 * Notification types
 */
export const NotificationType = {
    EVENT: 'event',
    APPOINTMENT: 'appointment',
    COMPLAINT: 'complaint',
    ANNOUNCEMENT: 'announcement',
    MESSAGE: 'message',
    SYSTEM: 'system'
};

/**
 * @typedef {Object} Notification
 * @property {string} id - Unique notification ID
 * @property {string} type - Notification type
 * @property {string} title - Notification title
 * @property {string} message - Notification message
 * @property {string} time - Human-readable time string
 * @property {Date} timestamp - Actual timestamp
 * @property {boolean} read - Whether notification has been read
 * @property {string} [icon] - Optional Material icon name
 * @property {string} [link] - Optional link to navigate to
 * @property {Object} [data] - Optional additional data
 */

const NotificationContext = createContext();

const STORAGE_KEY = 'nmu_notifications';

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

/**
 * Notification Provider - Manages app-wide notifications
 */
export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    // Load notifications from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Convert timestamp strings back to Date objects
                const restored = parsed.map(n => ({
                    ...n,
                    timestamp: new Date(n.timestamp)
                }));
                setNotifications(restored);
            }
        } catch (error) {
            console.error('Failed to load notifications:', error);
        }
    }, []);

    // Save notifications to localStorage when they change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
        } catch (error) {
            console.error('Failed to save notifications:', error);
        }
    }, [notifications]);

    /**
     * Play notification sound
     */
    const playNotificationSound = useCallback(() => {
        try {
            // Create a simple notification beep using Web Audio API
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800; // Hz
            oscillator.type = 'sine';
            gainNode.gain.value = 0.1;

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.15); // Short beep
        } catch (error) {
            console.log('Could not play notification sound:', error);
        }
    }, []);

    /**
     * Add a new notification
     */
    const addNotification = useCallback((notification) => {
        const id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const timestamp = new Date();

        const newNotification = {
            id,
            type: notification.type || NotificationType.SYSTEM,
            title: notification.title,
            message: notification.message,
            time: getRelativeTime(timestamp),
            timestamp,
            read: false,
            icon: notification.icon || getIconForType(notification.type),
            link: notification.link,
            data: notification.data
        };

        setNotifications(prev => [newNotification, ...prev]);

        // Play sound for new notifications (unless muted)
        if (!notification.silent) {
            playNotificationSound();
        }

        return id;
    }, [playNotificationSound]);

    /**
     * Mark notification as read
     */
    const markAsRead = useCallback((id) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    }, []);

    /**
     * Mark all notifications as read
     */
    const markAllAsRead = useCallback(() => {
        setNotifications(prev =>
            prev.map(n => ({ ...n, read: true }))
        );
    }, []);

    /**
     * Remove a notification
     */
    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    /**
     * Clear all notifications
     */
    const clearAll = useCallback(() => {
        setNotifications([]);
    }, []);

    /**
     * Get unread count
     */
    const unreadCount = notifications.filter(n => !n.read).length;

    const value = {
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

/**
 * Get relative time string from date
 */
function getRelativeTime(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;

    return date.toLocaleDateString();
}

/**
 * Get default icon for notification type
 */
function getIconForType(type) {
    const icons = {
        [NotificationType.EVENT]: 'event',
        [NotificationType.APPOINTMENT]: 'calendar_month',
        [NotificationType.COMPLAINT]: 'report_problem',
        [NotificationType.ANNOUNCEMENT]: 'campaign',
        [NotificationType.MESSAGE]: 'mail',
        [NotificationType.SYSTEM]: 'notifications'
    };
    return icons[type] || 'notifications';
}

export default NotificationContext;
