/**
 * Tutors & Sessions Routes
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const TutorSession = require('../models/TutorSession');
const { authenticate, optionalAuth } = require('../middleware/auth');

/**
 * GET /api/tutors
 * Get available tutors
 */
router.get('/', optionalAuth, async (req, res) => {
    try {
        const query = { isTutor: true, isActive: true };
        if (req.query.subject) {
            query.tutorSubjects = { $in: [req.query.subject] };
        }
        if (req.query.available === 'true') {
            query.isAvailable = true;
        }

        const tutors = await User.find(query)
            .select('name nameAr avatar department departmentAr tutorSubjects tutorRating tutorSessions isAvailable bio bioAr');

        res.json({ success: true, tutors });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get tutors.' });
    }
});

/**
 * GET /api/tutors/sessions
 * Get user's tutoring sessions
 */
router.get('/sessions', authenticate, async (req, res) => {
    try {
        const query = req.user.isTutor 
            ? { tutor: req.user._id }
            : { student: req.user._id };

        if (req.query.status) query.status = req.query.status;

        const sessions = await TutorSession.find(query)
            .populate('student', 'name nameAr avatar studentId')
            .populate('tutor', 'name nameAr avatar tutorSubjects tutorRating')
            .sort({ createdAt: -1 });

        res.json({ success: true, sessions });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get sessions.' });
    }
});

/**
 * POST /api/tutors/sessions
 * Request a tutoring session
 */
router.post('/sessions', authenticate, async (req, res) => {
    try {
        const { tutorId, subject, subjectAr, topic, topicAr, scheduledAt } = req.body;

        if (!tutorId || !subject) {
            return res.status(400).json({ success: false, message: 'Tutor and subject required.' });
        }

        const tutor = await User.findOne({ _id: tutorId, isTutor: true });
        if (!tutor) {
            return res.status(404).json({ success: false, message: 'Tutor not found.' });
        }

        const session = new TutorSession({
            student: req.user._id,
            tutor: tutorId,
            subject, subjectAr,
            topic, topicAr,
            scheduledAt: scheduledAt ? new Date(scheduledAt) : null
        });

        await session.save();
        await session.populate([
            { path: 'student', select: 'name nameAr avatar studentId' },
            { path: 'tutor', select: 'name nameAr avatar tutorSubjects' }
        ]);

        // Notify tutor via socket
        const io = req.app.get('io');
        if (io) {
            io.to(`user:${tutorId}`).emit('session:request', session);
        }

        res.status(201).json({ success: true, session });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to request session.' });
    }
});

/**
 * PATCH /api/tutors/sessions/:id
 * Update session status (accept/reject/complete)
 */
router.patch('/sessions/:id', authenticate, async (req, res) => {
    try {
        const { status, rating, feedback } = req.body;
        const session = await TutorSession.findById(req.params.id);

        if (!session) {
            return res.status(404).json({ success: false, message: 'Session not found.' });
        }

        const isParticipant = session.student.equals(req.user._id) || session.tutor.equals(req.user._id);
        if (!isParticipant) {
            return res.status(403).json({ success: false, message: 'Not authorized.' });
        }

        if (status) session.status = status;
        if (rating) session.rating = rating;
        if (feedback) session.feedback = feedback;

        await session.save();

        // Notify other participant
        const io = req.app.get('io');
        if (io) {
            const targetUser = session.student.equals(req.user._id) ? session.tutor : session.student;
            io.to(`user:${targetUser}`).emit('session:updated', session);
        }

        res.json({ success: true, session });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update session.' });
    }
});

/**
 * GET /api/tutors/sessions/:id/messages
 * Get session chat messages
 */
router.get('/sessions/:id/messages', authenticate, async (req, res) => {
    try {
        const session = await TutorSession.findById(req.params.id)
            .populate('messages.sender', 'name nameAr avatar');

        if (!session) {
            return res.status(404).json({ success: false, message: 'Session not found.' });
        }

        res.json({ success: true, messages: session.messages });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get messages.' });
    }
});

/**
 * POST /api/tutors/sessions/:id/messages
 * Send message in session chat
 */
router.post('/sessions/:id/messages', authenticate, async (req, res) => {
    try {
        const { text, image, file } = req.body;
        const session = await TutorSession.findById(req.params.id);

        if (!session) {
            return res.status(404).json({ success: false, message: 'Session not found.' });
        }

        const message = {
            sender: req.user._id,
            text, image, file
        };

        session.messages.push(message);
        await session.save();

        // Populate sender info for the new message
        const newMessage = session.messages[session.messages.length - 1];

        // Emit via socket
        const io = req.app.get('io');
        if (io) {
            io.to(`chat:${session._id}`).emit('chat:message', {
                sessionId: session._id,
                message: { ...newMessage.toObject(), sender: { _id: req.user._id, name: req.user.name, avatar: req.user.avatar } }
            });
        }

        res.json({ success: true, message: newMessage });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to send message.' });
    }
});

/**
 * PATCH /api/tutors/availability
 * Update tutor availability
 */
router.patch('/availability', authenticate, async (req, res) => {
    try {
        if (!req.user.isTutor) {
            return res.status(403).json({ success: false, message: 'Not a tutor.' });
        }

        req.user.isAvailable = req.body.isAvailable;
        await req.user.save();

        res.json({ success: true, isAvailable: req.user.isAvailable });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update availability.' });
    }
});

module.exports = router;
