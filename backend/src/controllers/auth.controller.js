import bcrypt from 'bcryptjs';
import { Resend } from 'resend';
import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { buildUserResponse } from '../utils/transformers.js';

const OTP_LIFETIME_MS = 10 * 60 * 1000;
const includeDemoOtp = process.env.NODE_ENV !== 'production';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL;

const withDemoOtp = (payload, otp) => (
    includeDemoOtp ? {...payload, demoOtp: otp } : payload
);

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const createOtpPayload = async() => {
    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 12);
    return {
        otp,
        otpHash,
        otpExpiresAt: new Date(Date.now() + OTP_LIFETIME_MS),
    };
};

// Email templates using React-like HTML
const formatOtpEmail = (otp, purpose) => {
    const subject = purpose === 'login' ? 'Your AI Code Review login OTP' : 'Verify your AI Code Review account';
    const verb = purpose === 'login' ? 'login' : 'verification';

    return {
        subject,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f6f9fc; margin: 0; padding: 0;">
                <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <tr>
                        <td style="background-color: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
                            <!-- Header -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="text-align: center; padding-bottom: 20px;">
                                        <h1 style="color: #c5a059; font-size: 28px; font-weight: 700; margin: 0;">
                                            Ai_Code_review
                                        </h1>
                                        <p style="color: #6b7280; font-size: 14px; margin: 4px 0 0 0;">
                                            AI Code Review Platform
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Divider -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="border-top: 1px solid #e5e7eb; padding: 20px 0;"></td>
                                </tr>
                            </table>

                            <!-- Content -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="text-align: center;">
                                        <h2 style="color: #1f2937; font-size: 20px; font-weight: 600; margin: 0 0 8px 0;">
                                            ${purpose === 'login' ? '🔐 Login Verification' : '📧 Verify Your Email'}
                                        </h2>
                                        <p style="color: #6b7280; font-size: 14px; margin: 0 0 24px 0; line-height: 1.6;">
                                            ${purpose === 'login' 
                                                ? 'Use the code below to sign in to your AI Code Review account. This code is valid for 10 minutes.' 
                                                : 'Thank you for registering with AI Code Review. Please verify your email address to get started.'
                                            }
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="text-align: center; background-color: #f3f4f6; border-radius: 8px; padding: 24px; margin: 16px 0;">
                                        <div style="font-size: 40px; font-weight: 700; letter-spacing: 12px; color: #c5a059; font-family: 'Courier New', monospace; background-color: #ffffff; padding: 16px 24px; border-radius: 8px; display: inline-block; border: 2px solid #c5a059;">
                                            ${otp}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="text-align: center; padding-top: 24px;">
                                        <p style="color: #6b7280; font-size: 13px; margin: 0;">
                                            ⏰ This OTP will expire in <strong style="color: #1f2937;">10 minutes</strong>
                                        </p>
                                        <p style="color: #9ca3af; font-size: 12px; margin: 12px 0 0 0;">
                                            If you didn't request this, please ignore this email.
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Footer -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 20px;">
                                        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
                                            © ${new Date().getFullYear()} CodeLens. All rights reserved.
                                        </p>
                                        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 4px 0 0 0;">
                                            Built with ❤️ for better code quality
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `,
    };
};

const sendOtpEmail = async(email, otp, purpose = 'verification') => {
    if (!process.env.RESEND_API_KEY) {
        console.warn('RESEND_API_KEY not configured. Email not sent.');
        return;
    }

    try {
        const { subject, html } = formatOtpEmail(otp, purpose);

        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject,
            html,
        });

        if (error) {
            console.error('Resend error:', error);
            throw error;
        }

        console.log(`Email sent to ${email}, ID: ${data?.id}`);
        return { success: true, id: data ?.id };
    } catch (error) {
        console.error('Email sending failed:', error.message);
        throw error;
    }
};

const respondWithError = (res, status, message, error = null) => {
    return res.status(status).json({
        success: false,
        message,
        error: error || message,
    });
};

const issueTokenResponse = (res, user, message = 'Authentication successful') => {
    const token = generateToken(user._id);
    return res.status(200).json({
        success: true,
        message,
        token,
        user: buildUserResponse(user),
    });
};

const finalizeOtpAuthentication = async(res, user, otp, message = 'Authentication successful') => {
    const token = generateToken(user._id);
    user.otpHash = null;
    user.otpExpiresAt = null;
    if (!user.isVerified) {
        user.isVerified = true;
    }
    await user.save();

    return res.status(200).json({
        success: true,
        message,
        token,
        user: buildUserResponse(user),
    });
};

export const registerUser = async(req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email) {
            return respondWithError(res, 400, 'Name and email are required');
        }

        if (password && password.length < 6) {
            return respondWithError(res, 400, 'Password must be at least 6 characters');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return respondWithError(res, 400, 'Invalid email format');
        }

        const existingUser = await User.findOne({ email });
        const { otp, otpHash, otpExpiresAt } = await createOtpPayload();
        const hashedPassword = password ? await bcrypt.hash(password, 12) : undefined;

        if (existingUser) {
            if (existingUser.isVerified) {
                return respondWithError(res, 409, 'User already exists');
            }

            existingUser.name = name;
            if (hashedPassword) {
                existingUser.password = hashedPassword;
            }
            existingUser.otpHash = otpHash;
            existingUser.otpExpiresAt = otpExpiresAt;
            await existingUser.save();

            await sendOtpEmail(email, otp);
            return res.status(200).json(withDemoOtp({
                success: true,
                message: 'Verification code sent to your email.',
            }, otp));
        }

        const user = await User.create({
            name,
            email,
            ...(hashedPassword ? { password: hashedPassword } : {}),
            isVerified: false,
            otpHash,
            otpExpiresAt,
        });

        await sendOtpEmail(email, otp);

        return res.status(201).json(withDemoOtp({
            success: true,
            message: 'Verification code sent to your email.',
        }, otp));
    } catch (error) {
        console.error('Register error:', error);
        return respondWithError(res, 500, 'Server error', error.message);
    }
};

export const verifyEmailOtp = async(req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return respondWithError(res, 400, 'Email and OTP are required');
        }

        const user = await User.findOne({ email });
        if (!user) {
            return respondWithError(res, 404, 'User not found');
        }

        if (!user.otpHash || !user.otpExpiresAt) {
            return respondWithError(res, 400, 'No OTP found. Please request a new verification code.');
        }

        if (new Date() > user.otpExpiresAt) {
            return respondWithError(res, 400, 'OTP expired. Please request a new verification code.');
        }

        const isOtpValid = await bcrypt.compare(otp, user.otpHash);
        if (!isOtpValid) {
            return respondWithError(res, 400, 'Invalid OTP. Please try again.');
        }

        return finalizeOtpAuthentication(res, user, otp, user.isVerified ? 'Login successful.' : 'Email verified successfully.');
    } catch (error) {
        console.error(' Verify OTP error:', error);
        return respondWithError(res, 500, 'Server error', error.message);
    }
};

export const resendVerificationOtp = async(req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return respondWithError(res, 400, 'Email is required');
        }

        const user = await User.findOne({ email });
        if (!user) {
            return respondWithError(res, 404, 'User not found');
        }

        const { otp, otpHash, otpExpiresAt } = await createOtpPayload();
        user.otpHash = otpHash;
        user.otpExpiresAt = otpExpiresAt;
        await user.save();

        await sendOtpEmail(email, otp);

        return res.status(200).json(withDemoOtp({
            success: true,
            message: 'Verification OTP resent to your email.',
        }, otp));
    } catch (error) {
        console.error('Resend OTP error:', error);
        return respondWithError(res, 500, 'Server error', error.message);
    }
};

export const requestLoginOtp = async(req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return respondWithError(res, 400, 'Email is required');
        }

        const user = await User.findOne({ email });
        if (!user) {
            return respondWithError(res, 404, 'User not found');
        }

        if (!user.isVerified) {
            return respondWithError(res, 400, 'Please verify your email before requesting login OTP.');
        }

        const { otp, otpHash, otpExpiresAt } = await createOtpPayload();
        user.otpHash = otpHash;
        user.otpExpiresAt = otpExpiresAt;
        await user.save();

        await sendOtpEmail(email, otp, 'login');

        return res.status(200).json(withDemoOtp({
            success: true,
            message: 'Login OTP sent to your email.',
        }, otp));
    } catch (error) {
        console.error('Login OTP request error:', error);
        return respondWithError(res, 500, 'Server error', error.message);
    }
};

export const verifyLoginOtp = async(req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return respondWithError(res, 400, 'Email and OTP are required');
        }

        const user = await User.findOne({ email });
        if (!user) {
            return respondWithError(res, 404, 'User not found');
        }

        if (!user.otpHash || !user.otpExpiresAt) {
            return respondWithError(res, 400, 'No OTP found. Please request a new login code.');
        }

        if (new Date() > user.otpExpiresAt) {
            return respondWithError(res, 400, 'OTP expired. Please request a new login code.');
        }

        const isOtpValid = await bcrypt.compare(otp, user.otpHash);
        if (!isOtpValid) {
            return respondWithError(res, 400, 'Invalid OTP. Please try again.');
        }

        return finalizeOtpAuthentication(res, user, otp, 'Login successful.');
    } catch (error) {
        console.error('Verify login OTP error:', error);
        return respondWithError(res, 500, 'Server error', error.message);
    }
};

export const loginUser = async(req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            return respondWithError(res, 400, 'Email is required');
        }

        const user = await User.findOne({ email });
        if (!user) {
            return respondWithError(res, 404, 'User not found');
        }

        if (!user.isVerified) {
            return respondWithError(res, 403, 'Please verify your email before logging in.');
        }

        if (!password) {
            const { otp, otpHash, otpExpiresAt } = await createOtpPayload();
            user.otpHash = otpHash;
            user.otpExpiresAt = otpExpiresAt;
            await user.save();
            await sendOtpEmail(email, otp, 'login');
            return res.status(200).json(withDemoOtp({
                success: true,
                message: 'Login OTP sent to your email.',
            }, otp));
        }

        if (!user.password) {
            return respondWithError(res, 401, 'Please use email verification to sign in.');
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return respondWithError(res, 401, 'Invalid email or password');
        }

        return issueTokenResponse(res, user, 'Login successful');
    } catch (error) {
        console.error('Login error:', error);
        return respondWithError(res, 500, 'Server error', error.message);
    }
};

export const getMe = async(req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        if (!user) {
            return respondWithError(res, 404, 'User not found');
        }

        return res.status(200).json({
            success: true,
            user: buildUserResponse(user),
        });
    } catch (error) {
        console.error('Get current user error:', error);
        return respondWithError(res, 500, 'Server error', error.message);
    }
};