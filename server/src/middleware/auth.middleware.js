const { verifyToken } = require('../utils/token');
const User = require('../models/User');

/**
 * Protect routes - verify JWT token from cookie
 */
const protect = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, no token provided',
            });
        }

        // Verify token
        const decoded = verifyToken(token);

        // Get user from token
        const user = await User.findById(decoded.id).select('-__v');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found',
            });
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({
            success: false,
            message: 'Not authorized, token failed',
        });
    }
};

module.exports = { protect };
