// backend/src/routes/auth.routes.js
import express from 'express';
import {
    registerUser,
    verifyEmailOtp,
    resendVerificationOtp,
    loginUser,
    verifyLoginOtp,
    getMe,
    requestLoginOtp,
    logoutUser,
    updateProfile,
    deleteAccount
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authLimiter, otpLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router();

// ==================== REGISTRATION ====================

//  Register new user
router.post('/register', authLimiter, registerUser);
router.post('/verify-otp', otpLimiter, verifyEmailOtp);
router.post('/resend-otp', otpLimiter, resendVerificationOtp);

// ==================== LOGIN ====================

// Login with email & password
router.post('/login', authLimiter, loginUser);

// Request OTP for login
router.post('/login-otp', otpLimiter, requestLoginOtp);
router.post('/verify-login-otp', otpLimiter, verifyLoginOtp);

//  Logout user
router.post('/logout', logoutUser);

// ==================== PROTECTED ROUTES ====================
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.delete('/account', protect, deleteAccount);

export default router;
