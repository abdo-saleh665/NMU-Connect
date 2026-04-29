/**
 * Socket Context
 * Provides socket instance and real-time features across the app
 */

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { initSocket, disconnectSocket, getSocket, joinUserRoom } from '../services/socket';

const SocketContext = createContext(null);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

export const SocketProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [isConnected, setIsConnected] = useState(false);
    const [notifications, setNotifications] = useState([]);

    // Initialize socket on login
    useEffect(() => {
        if (isAuthenticated && user) {
            const token = localStorage.getItem('nmu_auth_token');
            const socket = initSocket(token);

            socket.on('connect', () => {
                setIsConnected(true);
                // Join user's notification room
                joinUserRoom(user._id || user.id);
            });

            socket.on('disconnect', () => {
                setIsConnected(false);
            });

            // Listen for notifications
            socket.on('notification:new', (notification) => {
                setNotifications(prev => [notification, ...prev]);
            });

            return () => {
                disconnectSocket();
                setIsConnected(false);
            };
        }
    }, [isAuthenticated, user]);

    // Add notification
    const addNotification = useCallback((notification) => {
        setNotifications(prev => [notification, ...prev]);
    }, []);

    // Mark notification as read
    const markAsRead = useCallback((notificationId) => {
        setNotifications(prev =>
            prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        );
        const socket = getSocket();
        if (socket?.connected) {
            socket.emit('notification:read', notificationId);
        }
    }, []);

    // Clear all notifications
    const clearNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    const value = {
        socket: getSocket(),
        isConnected,
        notifications,
        addNotification,
        markAsRead,
        clearNotifications,
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContext;
