import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendOTPEmail } from '../services/email.service.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
const OTP_LIFETIME_MS = 10 * 60 * 1000;

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const createOtpPayload = async () => {
    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 12);
    return {
        otp,
        otpHash,
        otpExpiresAt: new Date(Date.now() + OTP_LIFETIME_MS),
    };
};

// Register User
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        console.log('📝 Register attempt:', { name, email });

        // Validation
        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: 'Name and email are required'
            });
        }

        if (password && password.length < 6) {
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

        // Check existing user
        let user = await User.findOne({ email });

        const { otp, otpHash, otpExpiresAt } = await createOtpPayload();

        if (user) {
            if (user.isVerified) {
                return res.status(409).json({
                    success: false,
                    message: 'User already exists. Please login.'
                });
            }

            // Update existing unverified user
            user.name = name;
            if (password) {
                user.password = await bcrypt.hash(password, 12);
            }
            user.otpHash = otpHash;
            user.otpExpiresAt = otpExpiresAt;
            await user.save();
        } else {
            // Create new user
            user = new User({
                name,
                email,
                password: password ? await bcrypt.hash(password, 12) : undefined,
                isVerified: false,
                otpHash,
                otpExpiresAt,
            });
            await user.save();
        }

        // Send OTP - Don't await, let it run in background
        sendOTPEmail(email, otp).catch(err => {
            console.warn('⚠️ Email sending failed in background:', err.message);
        });

        return res.status(201).json({
            success: true,
            message: 'Verification code sent to your email.',
            demoOtp: otp, // For development
            email: email,
        });
    } catch (error) {
        console.error('❌ Register error:', error);
        return res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Verify OTP
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

        // Mark as verified
        user.isVerified = true;
        user.otpHash = null;
        user.otpExpiresAt = null;
        await user.save();

        // Generate token
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
                isVerified: user.isVerified,
            }
        });
    } catch (error) {
        console.error('❌ Verify OTP error:', error);
        return res.status(500).json({
            success: false,
            message: 'OTP verification failed. Please try again.'
        });
    }
};

// Resend OTP
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

        const { otp, otpHash, otpExpiresAt } = await createOtpPayload();
        user.otpHash = otpHash;
        user.otpExpiresAt = otpExpiresAt;
        await user.save();

        sendOTPEmail(email, otp).catch(err => {
            console.warn('⚠️ Email sending failed:', err.message);
        });

        return res.status(200).json({
            success: true,
            message: 'OTP resent successfully.',
            demoOtp: otp,
        });
    } catch (error) {
        console.error('❌ Resend OTP error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to resend OTP. Please try again.'
        });
    }
};

// Login User
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

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

        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: 'Please verify your email before logging in.'
            });
        }

        // If no password provided or user doesn't have password
        if (!password || !user.password) {
            const { otp, otpHash, otpExpiresAt } = await createOtpPayload();
            user.otpHash = otpHash;
            user.otpExpiresAt = otpExpiresAt;
            await user.save();
            sendOTPEmail(email, otp, 'login').catch(err => {
                console.warn('⚠️ Email sending failed:', err.message);
            });
            return res.status(200).json({
                success: true,
                message: 'Login OTP sent to your email.',
                demoOtp: otp,
            });
        }

        // Check password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

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
                isVerified: user.isVerified,
            }
        });
    } catch (error) {
        console.error('❌ Login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Login failed. Please try again.'
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
                isVerified: user.isVerified,
            }
        });
    } catch (error) {
        console.error('❌ Get user error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get user profile'
        });
    }
};
