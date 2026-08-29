// backend/src/routes/auth.routes.js
import express from 'express';
import {
    registerUser,
    verifyEmailOtp,
    resendVerificationOtp,
    loginUser,
    verifyLoginOtp,
    getMe,
    requestLoginOtp
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Registration flow
router.post('/register', registerUser);
router.post('/verify-otp', verifyEmailOtp);
router.post('/resend-otp', resendVerificationOtp);

// Login flow
router.post('/login', loginUser);
router.post('/login-otp', requestLoginOtp || loginUser);
router.post('/verify-login-otp', verifyLoginOtp);
router.post('/logout', (_req, res) => {
    res.status(200).json({ 
        success: true, 
        message: 'Logged out successfully' 
    });
});

// Protected routes
router.get('/me', protect, getMe);

export default router;
