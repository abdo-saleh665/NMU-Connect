/**
 * Complaints Routes
 */

const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const { authenticate, optionalAuth } = require('../middleware/auth');

/**
 * GET /api/complaints
 * Get all complaints with filtering
 */
router.get('/', optionalAuth, async (req, res) => {
    try {
        const query = {};
        
        // Filters
        if (req.query.type) query.type = req.query.type;
        if (req.query.status) query.status = req.query.status;
        if (req.query.category) query.category = req.query.category;

        // Sorting
        let sort = { createdAt: -1 };
        if (req.query.sort === 'votes') {
            sort = { 'votes.up': -1 };
        }

        const complaints = await Complaint.find(query)
            .populate('author', 'name nameAr avatar')
            .sort(sort)
            .limit(parseInt(req.query.limit) || 50);

        // Add user vote status if authenticated
        const complaintsWithVote = complaints.map(c => {
            const obj = c.toObject();
            if (req.user) {
                obj.userVote = c.votes.up.includes(req.user._id) ? 'up' 
                    : c.votes.down.includes(req.user._id) ? 'down' : null;
            }
            return obj;
        });

        res.json({
            success: true,
            complaints: complaintsWithVote
        });
    } catch (error) {
        console.error('Get complaints error:', error);
        res.status(500).json({ success: false, message: 'Failed to get complaints.' });
    }
});

/**
 * GET /api/complaints/my
 * Get current user's complaints
 */
router.get('/my', authenticate, async (req, res) => {
    try {
        const complaints = await Complaint.find({ author: req.user._id })
            .sort({ createdAt: -1 });

        res.json({ success: true, complaints });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get complaints.' });
    }
});

/**
 * POST /api/complaints
 * Create new complaint
 */
router.post('/', authenticate, async (req, res) => {
    try {
        const { title, titleAr, description, descriptionAr, type, category, isAnonymous, professor, subject, subjectAr } = req.body;

        if (!title || !description) {
            return res.status(400).json({ success: false, message: 'Title and description required.' });
        }

        const complaint = new Complaint({
            author: req.user._id,
            title, titleAr,
            description, descriptionAr,
            type: type || 'university',
            category: category || 'other',
            isAnonymous: isAnonymous || false,
            professor, subject, subjectAr
        });

        await complaint.save();
        await complaint.populate('author', 'name nameAr avatar');

        res.status(201).json({ success: true, complaint });
    } catch (error) {
        console.error('Create complaint error:', error);
        res.status(500).json({ success: false, message: 'Failed to create complaint.' });
    }
});

/**
 * POST /api/complaints/:id/vote
 * Vote on a complaint
 */
router.post('/:id/vote', authenticate, async (req, res) => {
    try {
        const { vote } = req.body; // 'up', 'down', or 'none'
        const complaint = await Complaint.findById(req.params.id);
        
        if (!complaint) {
            return res.status(404).json({ success: false, message: 'Complaint not found.' });
        }

        // Remove existing votes
        complaint.votes.up = complaint.votes.up.filter(id => !id.equals(req.user._id));
        complaint.votes.down = complaint.votes.down.filter(id => !id.equals(req.user._id));

        // Add new vote
        if (vote === 'up') {
            complaint.votes.up.push(req.user._id);
        } else if (vote === 'down') {
            complaint.votes.down.push(req.user._id);
        }

        await complaint.save();

        res.json({
            success: true,
            voteCount: complaint.voteCount,
            userVote: vote === 'none' ? null : vote
        });
    } catch (error) {
        console.error('Vote error:', error);
        res.status(500).json({ success: false, message: 'Failed to vote.' });
    }
});

/**
 * POST /api/complaints/:id/comments
 * Add comment to complaint
 */
router.post('/:id/comments', authenticate, async (req, res) => {
    try {
        const { text, isAnonymous } = req.body;
        
        if (!text) {
            return res.status(400).json({ success: false, message: 'Comment text required.' });
        }

        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) {
            return res.status(404).json({ success: false, message: 'Complaint not found.' });
        }

        complaint.comments.push({
            user: req.user._id,
            text,
            isAnonymous: isAnonymous || false
        });

        await complaint.save();
        await complaint.populate('comments.user', 'name nameAr avatar');

        res.json({ success: true, comments: complaint.comments });
    } catch (error) {
        console.error('Comment error:', error);
        res.status(500).json({ success: false, message: 'Failed to add comment.' });
    }
});

/**
 * PATCH /api/complaints/:id/status
 * Update complaint status (admin/faculty only)
 */
router.patch('/:id/status', authenticate, async (req, res) => {
    try {
        if (!['admin', 'faculty'].includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Not authorized.' });
        }

        const { status, resolution } = req.body;
        const updates = { status };
        
        if (status === 'resolved') {
            updates.resolvedAt = new Date();
            updates.resolvedBy = req.user._id;
            updates.resolution = resolution;
        }

        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id, updates, { new: true }
        ).populate('author', 'name nameAr avatar');

        res.json({ success: true, complaint });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update status.' });
    }
});

module.exports = router;
