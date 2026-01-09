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

    // Check which email service is configured
    const resendKey = process.env.RESEND_API_KEY;
    const sendgridKey = process.env.SENDGRID_API_KEY;

    if (resendKey) {
      // Use Resend (Recommended)
      const { Resend } = await import('resend');
      const resend = new Resend(resendKey);

      const result = await resend.emails.send({
        from: emailData.from || 'RestoCafe <onboarding@resend.dev>', // Update this after domain verification
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html || emailData.text || '',
        text: emailData.text,
      });

      console.log('✅ Email sent via Resend:', result);
      return NextResponse.json(
        { success: true, message: 'Email sent successfully', data: result },
        { status: 200 }
      );
    } else if (sendgridKey) {
      // Use SendGrid (Alternative)
      const sgMail = await import('@sendgrid/mail');
      sgMail.default.setApiKey(sendgridKey);

      await sgMail.default.send({
        to: emailData.to,
        from: emailData.from || 'noreply@yourdomain.com', // Must be verified in SendGrid
        subject: emailData.subject,
        html: emailData.html || emailData.text || '',
        text: emailData.text,
      });

      console.log('✅ Email sent via SendGrid');
      return NextResponse.json(
        { success: true, message: 'Email sent successfully' },
        { status: 200 }
      );
    } else {
      // No email service configured
      console.warn('⚠️ No email service configured. Email would be sent to:', emailData.to);
      console.log('Email data:', emailData);
      
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email service not configured. Please add RESEND_API_KEY or SENDGRID_API_KEY to environment variables.',
          debug: {
            to: emailData.to,
            subject: emailData.subject,
            hasHtml: !!emailData.html,
            hasText: !!emailData.text,
          }
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
  });
}