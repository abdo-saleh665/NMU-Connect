/**
 * NMU Connect - Express Server
 * Main application entry point
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const appointmentsRoutes = require('./routes/appointments');
const complaintsRoutes = require('./routes/complaints');
const eventsRoutes = require('./routes/events');
const tutorsRoutes = require('./routes/tutors');
const lostItemsRoutes = require('./routes/lostItems');
const uploadRoutes = require('./routes/upload');

// Create Express app
const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/complaints', complaintsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/tutors', tutorsRoutes);
app.use('/api/lost-items', lostItemsRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join user's personal room for notifications
    socket.on('join:user', (userId) => {
        socket.join(`user:${userId}`);
        console.log(`User ${userId} joined their room`);
    });

    // Join chat room
    socket.on('chat:join', (sessionId) => {
        socket.join(`chat:${sessionId}`);
        console.log(`Socket joined chat room: ${sessionId}`);
    });

    // Handle chat messages
    socket.on('chat:message', (data) => {
        io.to(`chat:${data.sessionId}`).emit('chat:message', data);
    });

    // Handle typing indicator
    socket.on('chat:typing', (data) => {
        socket.to(`chat:${data.sessionId}`).emit('chat:typing', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Make io available to routes
app.set('io', io);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Database connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nmu_connect');
        console.log('✅ MongoDB connected');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        // Continue without database for development
        console.log('⚠️  Running without database - using mock data');
    }
};

// Start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`
🚀 NMU Connect Backend Server
📡 Port: ${PORT}
🌐 Environment: ${process.env.NODE_ENV || 'development'}
🔗 API: http://localhost:${PORT}/api
        `);
    });
});

module.exports = { app, io };
