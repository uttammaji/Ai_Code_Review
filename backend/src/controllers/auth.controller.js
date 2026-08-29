// backend/src/controllers/auth.controller.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendOTPEmail } from '../services/email.service.js';

const JWT_SECRET = process.env.JWT_SECRET ;
const OTP_LIFETIME_MS = 10 * 60 * 1000; // 10 minutes

// Generate 6-digit OTP
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Create OTP payload with hash and expiry
const createOtpPayload = async () => {
    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 12);
    return {
        otp,
        otpHash,
        otpExpiresAt: new Date(Date.now() + OTP_LIFETIME_MS)
    };
};

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        { 
            userId: user._id, 
            email: user.email 
        },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// Create user response object (without sensitive data)
const createUserResponse = (user) => {
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        avatar: user.avatar || null,
        role: user.role || 'user',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
};

// ==================== REGISTER USER ====================
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        console.log('Register attempt:', { name, email });

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email and password are required'
            });
        }

        // Validate name
        if (name.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Name must be at least 2 characters'
            });
        }

        // Validate password
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Check if user exists (including hidden fields)
        let user = await User.findByEmail(email);

        // Generate OTP
        const otpData = await createOtpPayload();

        if (user) {
            // Check if user is already verified
            if (user.isVerified) {
                return res.status(409).json({
                    success: false,
                    message: 'User already exists. Please login.'
                });
            }

            // Update existing unverified user
            user.name = name.trim();
            user.password = password; // Will be hashed by pre-save hook
            user.otpHash = otpData.otpHash;
            user.otpExpiresAt = otpData.otpExpiresAt;
            await user.save();
            
            console.log('Updated existing unverified user');
        } else {
            // Create new user
            user = new User({
                name: name.trim(),
                email: email.toLowerCase().trim(),
                password: password, // Will be hashed by pre-save hook
                isVerified: false,
                otpHash: otpData.otpHash,
                otpExpiresAt: otpData.otpExpiresAt
            });
            await user.save();
            
            console.log('Created new user');
        }

        // Try to send OTP email (don't fail if email fails)
        try {
            const emailResult = await sendOTPEmail(email, otpData.otp, 'verification');
            console.log('Email sending result:', emailResult);
        } catch (emailError) {
            console.warn('Email sending failed:', emailError.message);
        }

        return res.status(201).json({
            success: true,
            message: 'Verification code sent to your email.',
            demoOtp: otpData.otp, // Include for testing
            email: email
        });
    } catch (error) {
        console.error('Register error:', error);
        
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'User already exists. Please login.'
            });
        }
        
        return res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again.',
            error: error.message
        });
    }
};

// ==================== VERIFY EMAIL OTP ====================
export const verifyEmailOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required'
            });
        }

        // Find user with OTP fields
        const user = await User.findByEmail(email);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if already verified
        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: 'Email is already verified. Please login.'
            });
        }

        // Check if OTP exists
        if (!user.otpHash || !user.otpExpiresAt) {
            return res.status(400).json({
                success: false,
                message: 'No OTP found. Please request a new verification code.'
            });
        }

        // Check if OTP is expired
        if (new Date() > user.otpExpiresAt) {
            return res.status(400).json({
                success: false,
                message: 'OTP expired. Please request a new verification code.'
            });
        }

        // Verify OTP
        const isOtpValid = await bcrypt.compare(otp, user.otpHash);
        if (!isOtpValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP. Please try again.'
            });
        }

        // Mark as verified and clear OTP
        user.isVerified = true;
        user.otpHash = null;
        user.otpExpiresAt = null;
        await user.save();

        // Generate token
        const token = generateToken(user);

        return res.status(200).json({
            success: true,
            message: 'Email verified successfully.',
            token,
            user: createUserResponse(user)
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

// ==================== RESEND VERIFICATION OTP ====================
export const resendVerificationOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Find user with OTP fields
        const user = await User.findByEmail(email);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if already verified
        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: 'User is already verified. Please login.'
            });
        }

        // Generate new OTP
        const otpData = await createOtpPayload();

        // Update user with new OTP
        user.otpHash = otpData.otpHash;
        user.otpExpiresAt = otpData.otpExpiresAt;
        await user.save();

        // Try to send email
        try {
            await sendOTPEmail(email, otpData.otp, 'verification');
            console.log('OTP email resent successfully');
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

// ==================== LOGIN USER (OTP ONLY) ====================
export const loginUser = async (req, res) => {
    try {
        const { email } = req.body;

        console.log('Login attempt:', { email });

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Find user with OTP fields
        const user = await User.findByEmail(email);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found. Please register first.'
            });
        }

        // Check if user is verified
        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: 'Please verify your email before logging in.'
            });
        }

        // Generate OTP for login
        const otpData = await createOtpPayload();

        // Update user with login OTP
        user.otpHash = otpData.otpHash;
        user.otpExpiresAt = otpData.otpExpiresAt;
        await user.save();

        // Try to send email
        try {
            const emailResult = await sendOTPEmail(email, otpData.otp, 'login');
            console.log('Login OTP email result:', emailResult);
        } catch (emailError) {
            console.warn('Email sending failed:', emailError.message);
        }

        return res.status(200).json({
            success: true,
            message: 'Login OTP sent to your email.',
            demoOtp: otpData.otp,
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

// ==================== VERIFY LOGIN OTP ====================
export const verifyLoginOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required'
            });
        }

        // Find user with OTP fields
        const user = await User.findByEmail(email);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if user is verified
        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: 'Please verify your email first.'
            });
        }

        // Check if OTP exists
        if (!user.otpHash || !user.otpExpiresAt) {
            return res.status(400).json({
                success: false,
                message: 'No OTP found. Please request a new login code.'
            });
        }

        // Check if OTP is expired
        if (new Date() > user.otpExpiresAt) {
            return res.status(400).json({
                success: false,
                message: 'OTP expired. Please request a new login code.'
            });
        }

        // Verify OTP
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
        const token = generateToken(user);

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: createUserResponse(user)
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

// ==================== GET CURRENT USER ====================
export const getMe = async (req, res) => {
    try {
        // req.user is set by auth middleware
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            user: createUserResponse(user)
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

// ==================== REQUEST LOGIN OTP (ALIAS) ====================
export const requestLoginOtp = loginUser;

// ==================== LOGOUT ====================
export const logoutUser = async (req, res) => {
    try {
        // Since we're using JWT tokens, logout is handled client-side
        // by removing the token. This endpoint is just for consistency.
        return res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({
            success: false,
            message: 'Logout failed',
            error: error.message
        });
    }
};

// ==================== UPDATE USER PROFILE ====================
export const updateProfile = async (req, res) => {
    try {
        const { name, avatar } = req.body;
        
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update fields
        if (name) user.name = name.trim();
        if (avatar) user.avatar = avatar;
        
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: createUserResponse(user)
        });
    } catch (error) {
        console.error('Update profile error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: error.message
        });
    }
};

// ==================== DELETE USER ACCOUNT ====================
export const deleteAccount = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user._id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        console.error('Delete account error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete account',
            error: error.message
        });
    }
};
