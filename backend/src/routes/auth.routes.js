// src/routes/auth.routes.js
import express from 'express';
import {
    registerUser,
    verifyEmailOtp,
    resendVerificationOtp,
    loginUser,
    verifyLoginOtp,
    getMe
} from '../controllers/auth.controller.js';
import authenticate from '../middleware/auth.middleware.js';

const router = express.Router();

// Registration flow - needs password + OTP
router.post('/register', registerUser);
router.post('/verify-otp', verifyEmailOtp);
router.post('/resend-otp', resendVerificationOtp);

// Login flow - only email, sends OTP
router.post('/login', loginUser);
router.post('/verify-login-otp', verifyLoginOtp);

// Protected routes
router.get('/me', authenticate, getMe);

export default router;