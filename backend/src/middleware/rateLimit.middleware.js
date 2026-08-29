// backend/src/middleware/rateLimit.middleware.js
import rateLimit from 'express-rate-limit';

// General API rate limiter
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Auth endpoints rate limiter (stricter)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 requests per windowMs
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
    max: 5, // Limit each IP to 5 OTP requests per 5 minutes
    message: {
        success: false,
        message: 'Too many OTP requests, please wait 5 minutes.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// ✅ Add review limiter
export const reviewLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 50, // Limit each IP to 50 review requests per hour
    message: {
        success: false,
        message: 'Too many review requests, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export default {
    apiLimiter,
    authLimiter,
    otpLimiter,
    reviewLimiter, // ✅ Add to default export
};