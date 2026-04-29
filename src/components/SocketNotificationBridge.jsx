/**
 * Socket Notification Bridge
 * Bridges SocketContext and NotificationContext to forward real-time notifications
 */

import { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useNotifications } from '../context/NotificationContext';

const SocketNotificationBridge = () => {
    const { socket, isConnected } = useSocket();
    const { addNotification } = useNotifications();

    useEffect(() => {
        if (!socket || !isConnected) return;

        // Listen for socket notifications and forward to NotificationContext
        const handleNotification = (data) => {
            addNotification({
                type: data.type,
                title: data.title,
                message: data.message,
                icon: data.icon,
                link: data.link,
                data: data.data
            });
        };

        // Listen for various real-time events
        socket.on('notification:new', handleNotification);

        // Appointment updates
        socket.on('appointment:status', (data) => {
            addNotification({
                type: 'appointment',
                title: 'Appointment Update',
                message: `Your appointment status changed to ${data.status}`,
                link: '/appointment'
            });
        });

        // Complaint updates
        socket.on('complaint:update', (data) => {
            addNotification({
                type: 'complaint',
                title: 'Complaint Update',
                message: data.message || 'Your complaint has been updated',
                link: '/complaints'
            });
        });

        // Event reminders
        socket.on('event:reminder', (data) => {
            addNotification({
                type: 'event',
                title: 'Event Reminder',
                message: data.message || `Upcoming event: ${data.title}`,
                link: '/events'
            });
        });

        // Chat messages
        socket.on('chat:message', (data) => {
            addNotification({
                type: 'message',
                title: 'New Message',
                message: data.message?.substring(0, 50) + (data.message?.length > 50 ? '...' : ''),
                link: '/tutoring'
            });
        });

        return () => {
            socket.off('notification:new', handleNotification);
            socket.off('appointment:status');
            socket.off('complaint:update');
            socket.off('event:reminder');
            socket.off('chat:message');
        };
    }, [socket, isConnected, addNotification]);

    // This component doesn't render anything
    return null;
};

export default SocketNotificationBridge;
