import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

async function testEmail() {
    console.log('📧 Testing Resend email...');
    console.log('From:', FROM_EMAIL);
    console.log('API Key:', process.env.RESEND_API_KEY ? '✅ Set' : '❌ Not set');
    console.log('To: sujitmaji990707@gmail.com');

    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: 'sujitmaji990707@gmail.com',
            subject: '✅ CodeLens - Email Test',
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f6f9fc;">
                    <div style="background-color: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
                        <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #e5e7eb;">
                            <h1 style="color: #c5a059; font-size: 28px; font-weight: 700; margin: 0;">🔐 CodeLens</h1>
                            <p style="color: #6b7280; font-size: 14px; margin: 4px 0 0 0;">AI Code Review Platform</p>
                        </div>
                        
                        <div style="padding: 20px 0;">
                            <h2 style="color: #1f2937; font-size: 20px; font-weight: 600; text-align: center;">✅ Email Test Successful</h2>
                            <p style="color: #6b7280; font-size: 14px; text-align: center; line-height: 1.6;">
                                Your Resend email configuration is working correctly!
                            </p>
                            <p style="color: #6b7280; font-size: 13px; text-align: center; margin-top: 12px;">
                                Sent at: ${new Date().toLocaleString()}
                            </p>
                        </div>
                        
                        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
                            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                                © ${new Date().getFullYear()} CodeLens. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            `,
        });

        if (error) {
            console.error('❌ Resend Error:', error);
            console.log('\n💡 Tips:');
            console.log('1. Check your API key is correct');
            console.log('2. Make sure you have verified your domain on Resend');
            console.log('3. Try using "onboarding@resend.dev" as the from email');
            return;
        }

        console.log('\n✅ Email sent successfully!');
        console.log('📧 Message ID:', data?.id);
        console.log('📨 Check your inbox at: sujitmaji990707@gmail.com');
        console.log('\n⚠️  Check spam folder if you don\'t see it in your inbox.');
    } catch (error) {
        console.error('❌ Failed:', error.message);
    }
}

testEmail();
