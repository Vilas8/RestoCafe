import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route: Send WhatsApp notification
 * Uses Twilio WhatsApp API
 * 
 * Setup Instructions:
 * 1. Go to https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
 * 2. Join the WhatsApp Sandbox by sending the code to the sandbox number
 * 3. Use same TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN
 * 4. Set TWILIO_WHATSAPP_NUMBER to the sandbox number (starts with whatsapp:+14155238886)
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { to, message } = data;

    // Validate data
    if (!to || !message) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: to, message' },
        { status: 400 }
      );
    }

    // Check if Twilio is configured
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886'; // Sandbox number

    if (!accountSid || !authToken) {
      console.warn('⚠️ Twilio not configured');
      return NextResponse.json(
        { 
          success: false, 
          message: 'WhatsApp service not configured. Please add TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN to environment variables.',
        },
        { status: 503 }
      );
    }

    try {
      // Use Twilio WhatsApp API
      const twilio = require('twilio');
      const client = twilio(accountSid, authToken);

      // Format phone number for WhatsApp (must include whatsapp: prefix)
      const whatsappTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to.replace(/\s+/g, '')}`;

      const result = await client.messages.create({
        body: message,
        from: whatsappNumber,
        to: whatsappTo,
      });

      console.log('✅ WhatsApp sent via Twilio:', result.sid);
      return NextResponse.json(
        { 
          success: true, 
          message: 'WhatsApp message sent successfully',
          data: { 
            sid: result.sid, 
            status: result.status,
            to: whatsappTo
          }
        },
        { status: 200 }
      );
    } catch (twilioError: any) {
      console.error('❌ Twilio WhatsApp error:', twilioError);
      
      // Provide helpful error messages
      let errorMessage = twilioError.message;
      if (twilioError.code === 63016) {
        errorMessage = 'WhatsApp recipient not in sandbox. Please join the WhatsApp sandbox first by sending the join code to the sandbox number.';
      } else if (twilioError.code === 21408) {
        errorMessage = 'Permission to send to this number has not been enabled. Please join the WhatsApp sandbox.';
      }

      return NextResponse.json(
        { 
          success: false, 
          message: 'WhatsApp error: ' + errorMessage,
          error: errorMessage,
          code: twilioError.code,
          helpUrl: 'https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn'
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('❌ Failed to send WhatsApp message:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to send WhatsApp message',
        error: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for testing WhatsApp configuration
 */
export async function GET() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;

  return NextResponse.json({
    configured: !!(accountSid && authToken),
    sandboxNumber: 'whatsapp:+14155238886',
    customNumber: whatsappNumber || 'Not set (using sandbox)',
    message: accountSid && authToken
      ? 'WhatsApp service (Twilio) is configured and ready'
      : 'WhatsApp service not configured. Add TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN to environment variables.',
    setup: {
      step1: 'Go to https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn',
      step2: 'Send the join code (e.g., "join <code>") to the WhatsApp sandbox number',
      step3: 'Test by sending a message to whatsapp:+919606171757',
    }
  });
}