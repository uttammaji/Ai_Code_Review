// backend/src/controllers/auth.controller.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendOTPEmail } from '../services/email.service.js';

const JWT_SECRET = process.env.JWT_SECRET;
const OTP_LIFETIME_MS = 10 * 60 * 1000;

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const createOtpPayload = async () => {
    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 12);
    return {
        otp,
        otpHash,
        otpExpiresAt: new Date(Date.now() + OTP_LIFETIME_MS)
    };
};

// Register User
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email and password are required'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        let user = await User.findOne({ email });

        const otpData = await createOtpPayload();

        if (user) {
            if (user.isVerified) {
                return res.status(409).json({
                    success: false,
                    message: 'User already exists. Please login.'
                });
            }

            user.name = name;
            user.password = await bcrypt.hash(password, 12);
            user.otpHash = otpData.otpHash;
            user.otpExpiresAt = otpData.otpExpiresAt;
            await user.save();
        } else {
            user = new User({
                name,
                email,
                password: await bcrypt.hash(password, 12),
                isVerified: false,
                otpHash: otpData.otpHash,
                otpExpiresAt: otpData.otpExpiresAt
            });
            await user.save();
        }

        // Try to send email
        try {
            await sendOTPEmail(email, otpData.otp);
        } catch (emailError) {
            console.warn('Email sending failed:', emailError.message);
        }

        return res.status(201).json({
            success: true,
            message: 'Verification code sent to your email.',
            demoOtp: otpData.otp,
            email
        });
    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again.',
            error: error.message
        });
    }
};

// Verify OTP for Registration
export const verifyEmailOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required'
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (!user.otpHash || !user.otpExpiresAt) {
            return res.status(400).json({
                success: false,
                message: 'No OTP found. Please request a new verification code.'
            });
        }

        if (new Date() > user.otpExpiresAt) {
            return res.status(400).json({
                success: false,
                message: 'OTP expired. Please request a new verification code.'
            });
        }

        const isOtpValid = await bcrypt.compare(otp, user.otpHash);
        if (!isOtpValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP. Please try again.'
            });
        }

        user.isVerified = true;
        user.otpHash = null;
        user.otpExpiresAt = null;
        await user.save();

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            success: true,
            message: 'Email verified successfully.',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified
            }
        });
    } catch (error) {
        console.error('Verify OTP error:', error);
        return res.status(500).json({
            success: false,
            message: 'OTP verification failed. Please try again.',
            error: error.message
        });
    }
};

// Resend OTP for Registration
export const resendVerificationOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: 'User is already verified. Please login.'
            });
        }

        const otpData = await createOtpPayload();

        user.otpHash = otpData.otpHash;
        user.otpExpiresAt = otpData.otpExpiresAt;
        await user.save();

        try {
            await sendOTPEmail(email, otpData.otp);
        } catch (emailError) {
            console.warn('Email sending failed:', emailError.message);
        }

        return res.status(200).json({
            success: true,
            message: 'OTP resent successfully.',
            demoOtp: otpData.otp
        });
    } catch (error) {
        console.error('Resend OTP error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to resend OTP. Please try again.',
            error: error.message
        });
    }
};

// Login User - OTP Only
export const loginUser = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found. Please register first.'
            });
        }

        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: 'Please verify your email before logging in.'
            });
        }

        const otpData = await createOtpPayload();

        user.otpHash = otpData.otpHash;
        user.otpExpiresAt = otpData.otpExpiresAt;
        await user.save();

        try {
            await sendOTPEmail(email, otpData.otp, 'login');
        } catch (emailError) {
            console.warn('Email sending failed:', emailError.message);
        }

        return res.status(200).json({
            success: true,
            message: 'Login OTP sent to your email.',
            demoOtp: otpData.otp,
            email
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Login failed. Please try again.',
            error: error.message
        });
    }
};

// Verify Login OTP
export const verifyLoginOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required'
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: 'Please verify your email first.'
            });
        }

        if (!user.otpHash || !user.otpExpiresAt) {
            return res.status(400).json({
                success: false,
                message: 'No OTP found. Please request a new login code.'
            });
        }

        if (new Date() > user.otpExpiresAt) {
            return res.status(400).json({
                success: false,
                message: 'OTP expired. Please request a new login code.'
            });
        }

        const isOtpValid = await bcrypt.compare(otp, user.otpHash);
        if (!isOtpValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP. Please try again.'
            });
        }

        user.otpHash = null;
        user.otpExpiresAt = null;
        await user.save();

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified
            }
        });
    } catch (error) {
        console.error('Verify login OTP error:', error);
        return res.status(500).json({
            success: false,
            message: 'Login failed. Please try again.',
            error: error.message
        });
    }
};

// Get Current User
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password -otpHash -otpExpiresAt');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get user profile',
            error: error.message
        });
    }
};

// Request Login OTP (alias)
export const requestLoginOtp = loginUser;
