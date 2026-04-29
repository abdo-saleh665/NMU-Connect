/**
 * Appointments Routes
 */

const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/appointments
 * Get user's appointments (student or faculty)
 */
router.get('/', async (req, res) => {
    try {
        const query = req.user.role === 'faculty' 
            ? { faculty: req.user._id }
            : { student: req.user._id };

        // Apply filters
        if (req.query.status) {
            query.status = req.query.status;
        }

        const appointments = await Appointment.find(query)
            .populate('student', 'name nameAr email studentId avatar')
            .populate('faculty', 'name nameAr email department departmentAr avatar')
            .sort({ scheduledAt: -1 })
            .limit(parseInt(req.query.limit) || 50);

        res.json({
            success: true,
            appointments
        });
    } catch (error) {
        console.error('Get appointments error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get appointments.'
        });
    }
});

/**
 * GET /api/appointments/faculty
 * Get available faculty for appointments
 */
router.get('/faculty', async (req, res) => {
    try {
        const faculty = await User.find({ 
            role: 'faculty',
            isActive: true 
        }).select('name nameAr email department departmentAr avatar');

        res.json({
            success: true,
            faculty
        });
    } catch (error) {
        console.error('Get faculty error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get faculty list.'
        });
    }
});

/**
 * POST /api/appointments
 * Create new appointment request
 */
router.post('/', async (req, res) => {
    try {
        const { facultyId, scheduledAt, title, notes, duration } = req.body;

        if (!facultyId || !scheduledAt) {
            return res.status(400).json({
                success: false,
                message: 'Faculty and schedule time are required.'
            });
        }

        // Check if faculty exists
        const faculty = await User.findOne({ _id: facultyId, role: 'faculty' });
        if (!faculty) {
            return res.status(404).json({
                success: false,
                message: 'Faculty member not found.'
            });
        }

        const appointment = new Appointment({
            student: req.user._id,
            faculty: facultyId,
            scheduledAt: new Date(scheduledAt),
            title,
            notes,
            duration: duration || 30
        });

        await appointment.save();

        // Populate for response
        await appointment.populate([
            { path: 'student', select: 'name nameAr email studentId avatar' },
            { path: 'faculty', select: 'name nameAr email department departmentAr avatar' }
        ]);

        // Emit socket event for real-time notification
        const io = req.app.get('io');
        if (io) {
            io.to(`user:${facultyId}`).emit('appointment:new', appointment);
        }

        res.status(201).json({
            success: true,
            appointment
        });
    } catch (error) {
        console.error('Create appointment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create appointment.'
        });
    }
});

/**
 * PATCH /api/appointments/:id
 * Update appointment status (confirm/cancel)
 */
router.patch('/:id', async (req, res) => {
    try {
        const { status, cancelReason } = req.body;

        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found.'
            });
        }

        // Check authorization
        const isOwner = appointment.student.equals(req.user._id) || 
                        appointment.faculty.equals(req.user._id);
        if (!isOwner && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this appointment.'
            });
        }

        // Update status
        if (status) {
            appointment.status = status;
        }
        if (status === 'cancelled') {
            appointment.cancelledBy = req.user._id;
            appointment.cancelReason = cancelReason;
        }

        await appointment.save();

        // Populate for response
        await appointment.populate([
            { path: 'student', select: 'name nameAr email studentId avatar' },
            { path: 'faculty', select: 'name nameAr email department departmentAr avatar' }
        ]);

        // Emit socket event
        const io = req.app.get('io');
        if (io) {
            const targetUser = appointment.student.equals(req.user._id) 
                ? appointment.faculty._id 
                : appointment.student._id;
            io.to(`user:${targetUser}`).emit('appointment:updated', appointment);
        }

        res.json({
            success: true,
            appointment
        });
    } catch (error) {
        console.error('Update appointment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update appointment.'
        });
    }
});

/**
 * DELETE /api/appointments/:id
 * Delete/cancel appointment
 */
router.delete('/:id', async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found.'
            });
        }

        // Check authorization
        const isOwner = appointment.student.equals(req.user._id) || 
                        appointment.faculty.equals(req.user._id);
        if (!isOwner && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this appointment.'
            });
        }

        await appointment.deleteOne();

        res.json({
            success: true,
            message: 'Appointment deleted.'
        });
    } catch (error) {
        console.error('Delete appointment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete appointment.'
        });
    }
});

module.exports = router;
