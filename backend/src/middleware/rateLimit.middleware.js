// backend/src/middleware/rateLimit.middleware.js
import rateLimit from 'express-rate-limit';

// General API rate limiter
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000,
    message: {
        success: false,
        message: 'Too many requests, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Fix for X-Forwarded-For error
    validate: {
        xForwardedForHeader: false,
        trustProxy: true
    },
    keyGenerator: (req) => {
        // Use IP from request, fallback to a default
        return req.ip || req.connection.remoteAddress || 'unknown';
    },
    skip: (req) => {
        // Skip rate limiting for health checks
        return req.path === '/health' || req.path === '/';
    }
});

// Auth endpoints rate limiter
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: {
        xForwardedForHeader: false,
        trustProxy: true
    },
    keyGenerator: (req) => {
        return req.ip || req.connection.remoteAddress || 'unknown';
    }
});

// OTP rate limiter
export const otpLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 20,
    message: {
        success: false,
        message: 'Too many OTP requests, please wait 5 minutes.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: {
        xForwardedForHeader: false,
        trustProxy: true
    },
    keyGenerator: (req) => {
        return req.ip || req.connection.remoteAddress || 'unknown';
    }
});

// Review limiter
export const reviewLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: 'Too many review requests, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: {
        xForwardedForHeader: false,
        trustProxy: true
    },
    keyGenerator: (req) => {
        return req.ip || req.connection.remoteAddress || 'unknown';
    }
});

export default {
    apiLimiter,
    authLimiter,
    otpLimiter,
    reviewLimiter,
};
