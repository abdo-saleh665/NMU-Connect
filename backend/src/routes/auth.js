/**
 * Authentication Routes
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken, authenticate } = require('../middleware/auth');

/**
 * POST /api/auth/login
 * Login user with email and password
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required.'
            });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated.'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            user: user.toJSON(),
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed.'
        });
    }
});

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req, res) => {
    try {
        const { email, password, name, nameAr, role, studentId } = req.body;

        // Validate input
        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: 'Email, password, and name are required.'
            });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered.'
            });
        }

        // Create user
        const user = new User({
            email: email.toLowerCase(),
            password,
            name,
            nameAr: nameAr || name,
            role: role || 'student',
            studentId
        });

        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            user: user.toJSON(),
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed.'
        });
    }
});

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
router.get('/me', authenticate, async (req, res) => {
    res.json({
        success: true,
        ...req.user.toJSON()
    });
});

/**
 * POST /api/auth/logout
 * Logout user (client-side token removal)
 */
router.post('/logout', authenticate, async (req, res) => {
    res.json({
        success: true,
        message: 'Logged out successfully.'
    });
});

/**
 * POST /api/auth/refresh
 * Refresh authentication token
 */
router.post('/refresh', authenticate, async (req, res) => {
    const token = generateToken(req.user._id);
    res.json({
        success: true,
        token
    });
});

/**
 * PATCH /api/auth/profile
 * Update user profile
 */
router.patch('/profile', authenticate, async (req, res) => {
    try {
        const updates = {};
        const allowedFields = ['name', 'nameAr', 'phone', 'bio', 'bioAr', 'avatar'];
        
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updates,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            user: user.toJSON()
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile.'
        });
    }
});

/**
 * PATCH /api/auth/password
 * Change password
 */
router.patch('/password', authenticate, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current and new passwords are required.'
            });
        }

        // Verify current password
        const isMatch = await req.user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect.'
            });
        }

        // Update password
        req.user.password = newPassword;
        await req.user.save();

        res.json({
            success: true,
            message: 'Password changed successfully.'
        });
    } catch (error) {
        console.error('Password change error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to change password.'
        });
    }
});

module.exports = router;
