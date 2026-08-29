// backend/src/middleware/rateLimit.middleware.js
import rateLimit from 'express-rate-limit';

// General API rate limiter
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Increased limit to avoid blocking during testing
    message: {
        success: false,
        message: 'Too many requests, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // Skip rate limiting for health checks
        return req.path === '/health' || req.path === '/';
    }
});

// Auth endpoints rate limiter (stricter)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Increased for testing
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// OTP rate limiter (most strict)
export const otpLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 20, // Increased for testing
    message: {
        success: false,
        message: 'Too many OTP requests, please wait 5 minutes.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Review limiter
export const reviewLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 100, // Increased for testing
    message: {
        success: false,
        message: 'Too many review requests, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Default export
export default {
    apiLimiter,
    authLimiter,
    otpLimiter,
    reviewLimiter,
};
