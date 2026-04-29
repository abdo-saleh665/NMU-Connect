/**
 * Socket.io Client Service
 * Manages WebSocket connection for real-time features
 */

import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

let socket = null;

/**
 * Initialize socket connection
 * @param {string} token - JWT auth token
 * @returns {Socket} Socket instance
 */
export const initSocket = (token) => {
    if (socket?.connected) {
        return socket;
    }

    socket = io(SOCKET_URL, {
        auth: { token },
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
    });

    socket.on('connect', () => {
        console.log('🔌 Socket connected:', socket.id);
    });

    socket.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error.message);
    });

    socket.on('disconnect', (reason) => {
        console.log('🔌 Socket disconnected:', reason);
    });

    socket.on('reconnect', (attemptNumber) => {
        console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
    });

    return socket;
};

/**
 * Get current socket instance
 * @returns {Socket|null}
 */
export const getSocket = () => socket;

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

/**
 * Join user's personal notification room
 * @param {string} userId
 */
export const joinUserRoom = (userId) => {
    if (socket?.connected) {
        socket.emit('join:user', userId);
    }
};

/**
 * Join a chat session room
 * @param {string} sessionId
 */
export const joinChatRoom = (sessionId) => {
    if (socket?.connected) {
        socket.emit('chat:join', sessionId);
    }
};

/**
 * Leave a chat session room
 * @param {string} sessionId
 */
export const leaveChatRoom = (sessionId) => {
    if (socket?.connected) {
        socket.emit('chat:leave', sessionId);
    }
};

/**
 * Send a chat message
 * @param {object} data - { sessionId, message, senderId }
 */
export const sendChatMessage = (data) => {
    if (socket?.connected) {
        socket.emit('chat:message', data);
    }
};

/**
 * Send typing indicator
 * @param {object} data - { sessionId, userId, isTyping }
 */
export const sendTypingIndicator = (data) => {
    if (socket?.connected) {
        socket.emit('chat:typing', data);
    }
};

export default {
    initSocket,
    getSocket,
    disconnectSocket,
    joinUserRoom,
    joinChatRoom,
    leaveChatRoom,
    sendChatMessage,
    sendTypingIndicator,
};
