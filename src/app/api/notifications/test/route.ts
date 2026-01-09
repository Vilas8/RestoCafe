import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const resendKey = process.env.RESEND_API_KEY;
  const sendgridKey = process.env.SENDGRID_API_KEY;
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
  const twilioWhatsapp = process.env.TWILIO_WHATSAPP_NUMBER;
  const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const vapidPrivate = process.env.VAPID_PRIVATE_KEY;

  return NextResponse.json({
    status: 'Notification services status',
    services: {
      email: {
        resend: !!resendKey,
        sendgrid: !!sendgridKey,
      },
      sms: {
        twilio: !!(twilioSid && twilioToken && twilioPhone),
      },
      whatsapp: {
        twilio: !!(twilioSid && twilioToken),
        customNumber: !!twilioWhatsapp,
        sandboxAvailable: true,
      },
      push: {
        vapid: !!(vapidPublic && vapidPrivate),
      },
    },
    configured: {
      email: !!(resendKey || sendgridKey),
      sms: !!(twilioSid && twilioToken && twilioPhone),
      whatsapp: !!(twilioSid && twilioToken),
      push: !!(vapidPublic && vapidPrivate),
    },
    summary: {
      total: 4,
      configured: [
        (resendKey || sendgridKey) ? 'email' : null,
        (twilioSid && twilioToken && twilioPhone) ? 'sms' : null,
        (twilioSid && twilioToken) ? 'whatsapp' : null,
        (vapidPublic && vapidPrivate) ? 'push' : null,
      ].filter(Boolean),
      missing: [
        !(resendKey || sendgridKey) ? 'email' : null,
        !(twilioSid && twilioToken && twilioPhone) ? 'sms' : null,
        !(twilioSid && twilioToken) ? 'whatsapp' : null,
        !(vapidPublic && vapidPrivate) ? 'push' : null,
      ].filter(Boolean),
    },
    instructions: {
      email: resendKey || sendgridKey ? 'Configured ✓' : 'Add RESEND_API_KEY or SENDGRID_API_KEY',
      sms: twilioSid && twilioToken && twilioPhone ? 'Configured ✓' : 'Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER',
      whatsapp: twilioSid && twilioToken ? 'Configured ✓ (Use sandbox or add TWILIO_WHATSAPP_NUMBER)' : 'Add TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN',
      push: vapidPublic && vapidPrivate ? 'Configured ✓' : 'Add VAPID keys',
    },
    whatsappSetup: {
      sandbox: 'https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn',
      note: 'WhatsApp uses same Twilio credentials as SMS, separate free tier'
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    const { type, to, subject, message, html, text } = await request.json();

    if (!type || !to) {
      return NextResponse.json(
        { success: false, message: 'Missing type or to field' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'email':
        result = await fetch(`${request.nextUrl.origin}/api/notifications/email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to, subject, html, text, message }),
        });
        break;

      case 'sms':
        result = await fetch(`${request.nextUrl.origin}/api/notifications/sms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to, message }),
        });
        break;

      case 'whatsapp':
        result = await fetch(`${request.nextUrl.origin}/api/notifications/whatsapp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to, message }),
        });
        break;

      default:
        return NextResponse.json(
          { success: false, message: `Unknown notification type: ${type}` },
          { status: 400 }
        );
    }

    const data = await result.json();
    return NextResponse.json(data, { status: result.status });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Test failed', error: error.message },
      { status: 500 }
    );
  }
}