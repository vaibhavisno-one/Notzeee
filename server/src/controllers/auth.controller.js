const passport = require('passport');
const { generateToken } = require('../utils/token');

/**
 * @desc    Initiate Google OAuth
 * @route   GET /auth/google
 * @access  Public
 */
const googleAuth = passport.authenticate('google', {
    scope: ['profile', 'email'],
});

/**
 * @desc    Google OAuth callback
 * @route   GET /auth/google/callback
 * @access  Public
 */
const googleCallback = [
    passport.authenticate('google', {
        failureRedirect: `${process.env.CLIENT_URL}/login?error=auth_failed`,
        session: false,
    }),
    (req, res) => {
        try {
            // Generate JWT token
            const token = generateToken(req.user);

            // Set HTTP-only cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // HTTPS only in production
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            // Redirect to frontend
            res.redirect(`${process.env.CLIENT_URL}/app`);
        } catch (error) {
            console.error('Google callback error:', error);
            res.redirect(`${process.env.CLIENT_URL}/login?error=server_error`);
        }
    },
];

/**
 * @desc    Get current user
 * @route   GET /auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            data: {
                id: req.user._id,
                email: req.user.email,
                name: req.user.name,
                avatar: req.user.avatar,
                createdAt: req.user.createdAt,
            },
        });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @desc    Logout user
 * @route   POST /auth/logout
 * @access  Private
 */
const logout = (req, res) => {
    try {
        // Clear cookie
        res.cookie('token', '', {
            httpOnly: true,
            expires: new Date(0),
        });

        res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

module.exports = {
    googleAuth,
    googleCallback,
    getMe,
    logout,
};
