import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

// Force IPv4 by using a custom fetch with node-fetch
// Resend will use the default fetch which should work with IPv4

export const sendEmail = async(to, subject, html) => {
    try {
        if (!process.env.RESEND_API_KEY) {
            console.log('RESEND_API_KEY not configured. Email not sent.');
            return { success: false, error: 'API key not configured' };
        }

        console.log(`📧 Sending email to ${to}...`);

        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject,
            html,
        });

        if (error) {
            console.error('Resend error:', error);
            return { success: false, error };
        }

        console.log(`Email sent to ${to}, ID: ${data?.id}`);
        return { success: true, id: data ?.id };
    } catch (error) {
        console.error('Email sending failed:', error.message);
        return { success: false, error: error.message };
    }
};

export const sendOTPEmail = async(email, otp, purpose = 'verification') => {
    const subject = purpose === 'login' ?
        '🔐 Login OTP - Ai_Code_Review' :
        '📧 Verify Your Email - Ai_Code_Review';

    const html = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f6f9fc;">
            <div style="background-color: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
                <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #e5e7eb;">
                    <h1 style="color: #c5a059; font-size: 28px; font-weight: 700; margin: 0;">🔐 Ai_Code_Review</h1>
                    <p style="color: #6b7280; font-size: 14px; margin: 4px 0 0 0;">AI Code Review Platform</p>
                </div>
                
                <div style="padding: 20px 0;">
                    <h2 style="color: #1f2937; font-size: 20px; font-weight: 600; text-align: center; margin: 0 0 8px 0;">
                        ${purpose === 'login' ? '🔐 Login Verification' : '📧 Verify Your Email'}
                    </h2>
                    
                    <p style="color: #6b7280; font-size: 14px; text-align: center; margin: 0 0 24px 0; line-height: 1.6;">
                        ${purpose === 'login' 
                            ? 'Use the code below to sign in to your CodeLens account.' 
                            : 'Thank you for registering with CodeLens. Please verify your email address to get started.'}
                    </p>
                    
                    <div style="background-color: #f3f4f6; border-radius: 8px; padding: 24px; text-align: center; margin: 16px 0;">
                        <div style="font-size: 40px; font-weight: 700; letter-spacing: 12px; color: #c5a059; font-family: 'Courier New', monospace; background-color: #ffffff; padding: 16px 24px; border-radius: 8px; display: inline-block; border: 2px solid #c5a059;">
                            ${otp}
                        </div>
                    </div>
                    
                    <p style="color: #6b7280; font-size: 13px; text-align: center; margin: 0;">
                        ⏰ This OTP will expire in <strong style="color: #1f2937;">10 minutes</strong>
                    </p>
                    <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 12px 0 0 0;">
                        If you didn't request this, please ignore this email.
                    </p>
                </div>
                
                <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
                    <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                        © ${new Date().getFullYear()} CodeLens. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    `;

    return sendEmail(email, subject, html);
};

export default { sendEmail, sendOTPEmail };