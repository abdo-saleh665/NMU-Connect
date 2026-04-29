/**
 * NotificationToast Component
 * Displays toast notifications when new notifications arrive
 */

import { useEffect, useState } from 'react';
import { useNotifications, NotificationType } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';

const NotificationToast = () => {
    const { notifications } = useNotifications();
    const { isRTL } = useLanguage();
    const [toasts, setToasts] = useState([]);

    // Watch for new notifications
    useEffect(() => {
        if (notifications.length > 0) {
            const latest = notifications[0];
            // Only show toast if notification is less than 5 seconds old
            const age = Date.now() - new Date(latest.timestamp).getTime();
            if (age < 5000 && !toasts.find(t => t.id === latest.id)) {
                setToasts(prev => [...prev, latest]);

                // Auto-remove after 4 seconds
                setTimeout(() => {
                    setToasts(prev => prev.filter(t => t.id !== latest.id));
                }, 4000);
            }
        }
    }, [notifications]);

    const getIconColor = (type) => {
        switch (type) {
            case NotificationType.EVENT:
                return 'text-purple-500 bg-purple-100 dark:bg-purple-900/30';
            case NotificationType.APPOINTMENT:
                return 'text-blue-500 bg-blue-100 dark:bg-blue-900/30';
            case NotificationType.COMPLAINT:
                return 'text-amber-500 bg-amber-100 dark:bg-amber-900/30';
            case NotificationType.MESSAGE:
                return 'text-green-500 bg-green-100 dark:bg-green-900/30';
            default:
                return 'text-primary bg-primary/10';
        }
    };

    const dismissToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    if (toasts.length === 0) return null;

    return (
        <div className={`fixed top-4 ${isRTL ? 'left-4' : 'right-4'} z-[100] flex flex-col gap-2`}>
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className="animate-slide-in bg-white dark:bg-[#2a1a1a] rounded-xl shadow-2xl border border-gray-200 dark:border-[#3a2a2a] p-4 min-w-[300px] max-w-[400px] flex items-start gap-3"
                    style={{
                        animation: 'slideIn 0.3s ease-out'
                    }}
                >
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-lg ${getIconColor(toast.type)} flex items-center justify-center flex-shrink-0`}>
                        <span className="material-symbols-outlined text-xl">
                            {toast.icon || 'notifications'}
                        </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                            {toast.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-xs mt-0.5 line-clamp-2">
                            {toast.message}
                        </p>
                        <span className="text-gray-400 dark:text-gray-500 text-xs mt-1 block">
                            {toast.time}
                        </span>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={() => dismissToast(toast.id)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 -mt-1 -mr-1"
                    >
                        <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                </div>
            ))}

            {/* Slide-in animation styles */}
            <style>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(${isRTL ? '-100%' : '100%'});
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};

export default NotificationToast;
