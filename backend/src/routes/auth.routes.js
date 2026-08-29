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

const router = express.Router();

// Registration flow
router.post('/register', registerUser);
router.post('/verify-otp', verifyEmailOtp);
router.post('/resend-otp', resendVerificationOtp);

// Login flow
router.post('/login', loginUser);
router.post('/login-otp', requestLoginOtp);
router.post('/verify-login-otp', verifyLoginOtp);
router.post('/logout', logoutUser);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.delete('/account', protect, deleteAccount);

export default router;
