// backend/src/middleware/auth.middleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

// Main authentication logic
const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized - No token provided'
            });
        }

        const token = authHeader.split(' ')[1];
        
        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (jwtError) {
            console.error('JWT verification failed:', jwtError.message);
            return res.status(401).json({
                success: false,
                message: 'Unauthorized - Invalid token'
            });
        }

        // Get user from database
        const user = await User.findById(decoded.userId).select('-password -otpHash -otpExpiresAt');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized - User not found'
            });
        }

        // Attach user to request object
        req.user = user;
        
        // Call next middleware
        if (typeof next === 'function') {
            next();
        } else {
            console.error('next is not a function in auth middleware');
            return res.status(500).json({
                success: false,
                message: 'Server error in authentication middleware'
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error in authentication',
            error: error.message
        });
    }
};

// Export as both 'authenticate' and 'protect' for compatibility
export const authenticate = auth;
export const protect = auth;
export default auth;
