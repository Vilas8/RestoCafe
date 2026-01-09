import { NextRequest, NextResponse } from 'next/server';
import { EmailNotification } from '@/types/notification';

/**
 * API Route: Send email notification
 * Supports Resend (recommended) or SendGrid
 */
export async function POST(request: NextRequest) {
  try {
    const emailData: EmailNotification = await request.json();

    // Validate email data
    if (!emailData.to || !emailData.subject) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: to, subject' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailData.to)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address format' },
        { status: 400 }
      );
    }

    // Check which email service is configured
    const resendKey = process.env.RESEND_API_KEY;
    const sendgridKey = process.env.SENDGRID_API_KEY;

    if (resendKey) {
      try {
        // Use Resend (Recommended)
        const { Resend } = require('resend');
        const resend = new Resend(resendKey);

        const result = await resend.emails.send({
          from: process.env.EMAIL_FROM || 'RestoCafe <onboarding@resend.dev>',
          to: emailData.to,
          subject: emailData.subject,
          html: emailData.html || emailData.text || '',
          text: emailData.text,
        });

        console.log('✅ Email sent via Resend:', result);
        return NextResponse.json(
          { success: true, message: 'Email sent successfully via Resend', data: result },
          { status: 200 }
        );
      } catch (resendError: any) {
        console.error('❌ Resend error:', resendError);
        
        // Provide helpful error messages
        let errorMessage = resendError.message;
        if (resendError.message?.includes('API key')) {
          errorMessage = 'Invalid Resend API key. Please check your RESEND_API_KEY environment variable.';
        } else if (resendError.message?.includes('from')) {
          errorMessage = 'Invalid sender email. Please verify your domain in Resend or use the default sender.';
        }
        
        return NextResponse.json(
          { 
            success: false, 
            message: 'Resend error: ' + errorMessage,
            error: resendError.message,
          },
          { status: 500 }
        );
      }
    } else if (sendgridKey) {
      try {
        // Use SendGrid (Alternative)
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(sendgridKey);

        const senderEmail = process.env.EMAIL_FROM || 'noreply@restocafe.com';
        
        await sgMail.send({
          to: emailData.to,
          from: senderEmail, // Must be verified in SendGrid
          subject: emailData.subject,
          html: emailData.html || emailData.text || '',
          text: emailData.text,
        });

        console.log('✅ Email sent via SendGrid');
        return NextResponse.json(
          { success: true, message: 'Email sent successfully via SendGrid' },
          { status: 200 }
        );
      } catch (sendgridError: any) {
        console.error('❌ SendGrid error:', sendgridError);
        
        // Provide helpful error messages
        let errorMessage = sendgridError.message;
        if (sendgridError.code === 401) {
          errorMessage = 'Invalid SendGrid API key. Please check your SENDGRID_API_KEY environment variable.';
        } else if (sendgridError.message?.includes('from')) {
          errorMessage = 'Sender email not verified in SendGrid. Please verify your sender email or domain.';
        }
        
        return NextResponse.json(
          { 
            success: false, 
            message: 'SendGrid error: ' + errorMessage,
            error: sendgridError.message,
          },
          { status: 500 }
        );
      }
    } else {
      // No email service configured
      console.warn('⚠️ No email service configured');
      
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email service not configured. Please add RESEND_API_KEY or SENDGRID_API_KEY to environment variables.',
        },
        { status: 503 }
      );
    }
  } catch (error: any) {
    console.error('❌ Failed to send email:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to send email',
        error: error.message || 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for testing email configuration
 */
export async function GET() {
  const resendKey = process.env.RESEND_API_KEY;
  const sendgridKey = process.env.SENDGRID_API_KEY;

  return NextResponse.json({
    configured: !!(resendKey || sendgridKey),
    service: resendKey ? 'Resend' : sendgridKey ? 'SendGrid' : 'None',
    message: resendKey || sendgridKey 
      ? 'Email service is configured and ready' 
      : 'No email service configured. Add RESEND_API_KEY or SENDGRID_API_KEY to environment variables.',
    note: 'For custom sender email, add EMAIL_FROM environment variable (e.g., RestoCafe <hello@yourdomain.com>)'
  });
}