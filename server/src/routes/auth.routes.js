const express = require('express');
const router = express.Router();
const {
    googleAuth,
    googleCallback,
    getMe,
    logout,
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

// @route   GET /auth/google
// @desc    Initiate Google OAuth
// @access  Public
router.get('/google', googleAuth);

// @route   GET /auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get('/google/callback', ...googleCallback);

// @route   GET /auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, getMe);

// @route   POST /auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', protect, logout);

module.exports = router;
