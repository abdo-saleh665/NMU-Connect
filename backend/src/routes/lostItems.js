/**
 * Lost & Found Routes
 */

const express = require('express');
const router = express.Router();
const LostItem = require('../models/LostItem');
const { authenticate, optionalAuth } = require('../middleware/auth');

/**
 * GET /api/lost-items
 */
router.get('/', optionalAuth, async (req, res) => {
    try {
        const query = { status: 'active' };
        if (req.query.type) query.type = req.query.type;
        if (req.query.category) query.category = req.query.category;

        const items = await LostItem.find(query)
            .populate('author', 'name nameAr avatar')
            .sort({ createdAt: -1 })
            .limit(parseInt(req.query.limit) || 50);

        res.json({ success: true, items });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get items.' });
    }
});

/**
 * GET /api/lost-items/my
 */
router.get('/my', authenticate, async (req, res) => {
    try {
        const items = await LostItem.find({ author: req.user._id })
            .sort({ createdAt: -1 });
        res.json({ success: true, items });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get items.' });
    }
});

/**
 * POST /api/lost-items
 */
router.post('/', authenticate, async (req, res) => {
    try {
        const { title, titleAr, description, descriptionAr, type, category, location, locationAr, date, images, contactPhone, contactEmail } = req.body;

        if (!title || !description || !type) {
            return res.status(400).json({ success: false, message: 'Title, description, and type required.' });
        }

        const item = new LostItem({
            title, titleAr,
            description, descriptionAr,
            type, category,
            location, locationAr,
            date: date || new Date(),
            images,
            author: req.user._id,
            contactPhone: contactPhone || req.user.phone,
            contactEmail: contactEmail || req.user.email
        });

        await item.save();
        await item.populate('author', 'name nameAr avatar');

        res.status(201).json({ success: true, item });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create item.' });
    }
});

/**
 * POST /api/lost-items/:id/claim
 */
router.post('/:id/claim', authenticate, async (req, res) => {
    try {
        const item = await LostItem.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found.' });
        }

        item.status = 'claimed';
        item.claimedBy = req.user._id;
        item.claimedAt = new Date();
        await item.save();

        // Notify owner
        const io = req.app.get('io');
        if (io) {
            io.to(`user:${item.author}`).emit('lostItem:claimed', item);
        }

        res.json({ success: true, item });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to claim item.' });
    }
});

/**
 * PATCH /api/lost-items/:id
 */
router.patch('/:id', authenticate, async (req, res) => {
    try {
        const item = await LostItem.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found.' });
        }

        if (!item.author.equals(req.user._id) && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized.' });
        }

        Object.assign(item, req.body);
        await item.save();

        res.json({ success: true, item });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update item.' });
    }
});

/**
 * DELETE /api/lost-items/:id
 */
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const item = await LostItem.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found.' });
        }

        if (!item.author.equals(req.user._id) && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized.' });
        }

        await item.deleteOne();
        res.json({ success: true, message: 'Item deleted.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete item.' });
    }
});

module.exports = router;
