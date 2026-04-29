/**
 * Events Routes
 */

const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { authenticate, optionalAuth, authorize } = require('../middleware/auth');

/**
 * GET /api/events
 */
router.get('/', optionalAuth, async (req, res) => {
    try {
        const query = { isPublished: true };
        if (req.query.category) query.category = req.query.category;
        if (req.query.upcoming === 'true') query.date = { $gte: new Date() };

        const events = await Event.find(query)
            .populate('organizer', 'name nameAr avatar')
            .sort({ date: 1 })
            .limit(parseInt(req.query.limit) || 50);

        const eventsWithRsvp = events.map(e => {
            const obj = e.toObject();
            obj.attendeeCount = e.attendees?.length || 0;
            if (req.user) {
                obj.isAttending = e.attendees.some(id => id.equals(req.user._id));
            }
            return obj;
        });

        res.json({ success: true, events: eventsWithRsvp });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get events.' });
    }
});

/**
 * GET /api/events/upcoming
 * Get upcoming events (for dashboard widgets)
 */
router.get('/upcoming', optionalAuth, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const events = await Event.find({
            isPublished: true,
            date: { $gte: new Date() }
        })
            .populate('organizer', 'name nameAr avatar')
            .sort({ date: 1 })
            .limit(limit);

        const eventsWithDetails = events.map(e => {
            const obj = e.toObject();
            obj.attendeeCount = e.attendees?.length || 0;
            if (req.user) {
                obj.isAttending = e.attendees.some(id => id.equals(req.user._id));
            }
            return obj;
        });

        res.json(eventsWithDetails);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get upcoming events.' });
    }
});

/**
 * GET /api/events/:id
 */
router.get('/:id', optionalAuth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('organizer', 'name nameAr avatar')
            .populate('attendees', 'name nameAr avatar');

        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found.' });
        }

        res.json({ success: true, event });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get event.' });
    }
});

/**
 * POST /api/events
 */
router.post('/', authenticate, authorize('admin', 'faculty'), async (req, res) => {
    try {
        const event = new Event({
            ...req.body,
            organizer: req.user._id
        });
        await event.save();
        res.status(201).json({ success: true, event });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create event.' });
    }
});

/**
 * POST /api/events/:id/rsvp
 */
router.post('/:id/rsvp', authenticate, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found.' });
        }

        const isAttending = event.attendees.some(id => id.equals(req.user._id));

        if (isAttending) {
            event.attendees = event.attendees.filter(id => !id.equals(req.user._id));
        } else {
            if (event.capacity && event.attendees.length >= event.capacity) {
                return res.status(400).json({ success: false, message: 'Event is full.' });
            }
            event.attendees.push(req.user._id);
        }

        await event.save();

        res.json({
            success: true,
            isAttending: !isAttending,
            attendeeCount: event.attendees.length
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update RSVP.' });
    }
});

/**
 * PATCH /api/events/:id
 */
router.patch('/:id', authenticate, authorize('admin', 'faculty'), async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, event });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update event.' });
    }
});

/**
 * DELETE /api/events/:id
 */
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Event deleted.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete event.' });
    }
});

module.exports = router;
