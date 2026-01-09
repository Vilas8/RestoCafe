import { NextRequest, NextResponse } from 'next/server';

/**
 * Test endpoint to verify notification services are working
 * GET /api/notifications/test
 */
export async function GET() {
  const services = {
    email: {
      resend: !!process.env.RESEND_API_KEY,
      sendgrid: !!process.env.SENDGRID_API_KEY,
    },
    sms: {
      twilio: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER),
    },
    push: {
      vapid: !!(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY),
    },
  };

  const configured = {
    email: services.email.resend || services.email.sendgrid,
    sms: services.sms.twilio,
    push: services.push.vapid,
  };

  return NextResponse.json({
    status: 'Notification services status',
    services,
    configured,
    summary: {
      total: Object.values(configured).filter(Boolean).length,
      configured: Object.keys(configured).filter(key => configured[key as keyof typeof configured]),
      missing: Object.keys(configured).filter(key => !configured[key as keyof typeof configured]),
    },
    instructions: {
      email: !configured.email ? 'Add RESEND_API_KEY (recommended) or SENDGRID_API_KEY' : 'Configured ✓',
      sms: !configured.sms ? 'Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER' : 'Configured ✓',
      push: !configured.push ? 'Add NEXT_PUBLIC_VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY' : 'Configured ✓',
    },
  });
}

/**
 * Test sending notifications
 * POST /api/notifications/test
 */
export async function POST(request: NextRequest) {
  try {
    const { type, to, subject, message } = await request.json();

    if (!type || !to) {
      return NextResponse.json(
        { error: 'Missing required fields: type, to' },
        { status: 400 }
      );
    }

    if (type === 'email') {
      const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/notifications/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to,
          subject: subject || 'Test Email from RestoCafe',
          html: `<h1>Test Email</h1><p>${message || 'This is a test email from RestoCafe notification system.'}</p>`,
          text: message || 'This is a test email from RestoCafe notification system.',
        }),
      });

      const result = await emailResponse.json();
      return NextResponse.json({ type: 'email', ...result });
    }

    if (type === 'sms') {
      const smsResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/notifications/sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to,
          message: message || 'Test SMS from RestoCafe notification system',
        }),
      });

      const result = await smsResponse.json();
      return NextResponse.json({ type: 'sms', ...result });
    }

    return NextResponse.json(
      { error: 'Invalid type. Use "email" or "sms"' },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}