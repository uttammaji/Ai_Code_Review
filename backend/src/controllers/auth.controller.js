import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendOTPEmail } from '../services/email.service.js';

const JWT_SECRET = process.env.JWT_SECRET;
const OTP_LIFETIME_MS = 10 * 60 * 1000;

const generateOtp = function() {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const createOtpPayload = async function() {
    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 12);
    return {
        otp: otp,
        otpHash: otpHash,
        otpExpiresAt: new Date(Date.now() + OTP_LIFETIME_MS)
    };
};

// Register User - Name, Email, Password required + OTP verification
export const registerUser = async function(req, res) {
    try {
        const { name, email, password } = req.body;

        console.log('Register attempt:', { name: name, email: email });

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

        let user = await User.findOne({ email: email });

        const otpData = await createOtpPayload();
        const otp = otpData.otp;
        const otpHash = otpData.otpHash;
        const otpExpiresAt = otpData.otpExpiresAt;

        if (user) {
            if (user.isVerified) {
                return res.status(409).json({
                    success: false,
                    message: 'User already exists. Please login.'
                });
            }

            user.name = name;
            user.password = await bcrypt.hash(password, 12);
            user.otpHash = otpHash;
            user.otpExpiresAt = otpExpiresAt;
            await user.save();
        } else {
            user = new User({
                name: name,
                email: email,
                password: await bcrypt.hash(password, 12),
                isVerified: false,
                otpHash: otpHash,
                otpExpiresAt: otpExpiresAt
            });
            await user.save();
        }

        // Try to send email but don't fail if it doesn't work
        try {
            const emailResult = await sendOTPEmail(email, otp);
            console.log('Email sending result:', emailResult);
        } catch (emailError) {
            console.warn('Email sending failed in background:', emailError.message);
        }

        return res.status(201).json({
            success: true,
            message: 'Verification code sent to your email.',
            demoOtp: otp,
            email: email
        });
    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Verify OTP for Registration
export const verifyEmailOtp = async function(req, res) {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required'
            });
        }

        const user = await User.findOne({ email: email });
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

        const token = jwt.sign({ userId: user._id, email: user.email },
            JWT_SECRET, { expiresIn: '7d' }
        );

        return res.status(200).json({
            success: true,
            message: 'Email verified successfully.',
            token: token,
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
            message: 'OTP verification failed. Please try again.'
        });
    }
};

// Resend OTP for Registration
export const resendVerificationOtp = async function(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const user = await User.findOne({ email: email });
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
        const otp = otpData.otp;
        const otpHash = otpData.otpHash;
        const otpExpiresAt = otpData.otpExpiresAt;

        user.otpHash = otpHash;
        user.otpExpiresAt = otpExpiresAt;
        await user.save();

        // Try to send email but don't fail if it doesn't work
        try {
            await sendOTPEmail(email, otp);
            console.log('OTP email resent successfully');
        } catch (emailError) {
            console.warn('Email sending failed:', emailError.message);
        }

        return res.status(200).json({
            success: true,
            message: 'OTP resent successfully.',
            demoOtp: otp
        });
    } catch (error) {
        console.error('Resend OTP error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to resend OTP. Please try again.'
        });
    }
};

// Login User - OTP Only (No Password)
export const loginUser = async function(req, res) {
    try {
        const { email } = req.body;

        console.log('Login attempt:', { email: email });

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const user = await User.findOne({ email: email });
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

        // Generate and send OTP for login
        const otpData = await createOtpPayload();
        const otp = otpData.otp;
        const otpHash = otpData.otpHash;
        const otpExpiresAt = otpData.otpExpiresAt;

        user.otpHash = otpHash;
        user.otpExpiresAt = otpExpiresAt;
        await user.save();

        // Try to send email but don't fail if it doesn't work
        try {
            const emailResult = await sendOTPEmail(email, otp, 'login');
            console.log('Login OTP email result:', emailResult);
        } catch (emailError) {
            console.warn('Email sending failed:', emailError.message);
        }

        return res.status(200).json({
            success: true,
            message: 'Login OTP sent to your email.',
            demoOtp: otp,
            email: email
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

// Verify Login OTP - Complete Login
export const verifyLoginOtp = async function(req, res) {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required'
            });
        }

        const user = await User.findOne({ email: email });
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

        // Clear OTP after successful login
        user.otpHash = null;
        user.otpExpiresAt = null;
        await user.save();

        // Generate token
        const token = jwt.sign({ userId: user._id, email: user.email },
            JWT_SECRET, { expiresIn: '7d' }
        );

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token: token,
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
export const getMe = async function(req, res) {
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
            message: 'Failed to get user profile'
        });
    }
};

// Request Login OTP (alias for loginUser)
export const requestLoginOtp = loginUser;
