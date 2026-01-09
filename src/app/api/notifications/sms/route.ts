import { NextRequest, NextResponse } from 'next/server';
import { SMSNotification } from '@/types/notification';

/**
 * API Route: Send SMS notification
 * Uses Twilio for SMS delivery
 */
export async function POST(request: NextRequest) {
  try {
    const smsData: SMSNotification = await request.json();

    // Validate SMS data
    if (!smsData.to || !smsData.message) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: to, message' },
        { status: 400 }
      );
    }

    // Check if Twilio is configured
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !twilioPhone) {
      console.warn('⚠️ Twilio not configured');
      
      return NextResponse.json(
        { 
          success: false, 
          message: 'SMS service not configured. Please add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER to environment variables.',
        },
        { status: 503 }
      );
    }

    try {
      // Use Twilio
      const twilio = require('twilio');
      const client = twilio(accountSid, authToken);

      const result = await client.messages.create({
        body: smsData.message,
        from: twilioPhone,
        to: smsData.to,
      });

      console.log('✅ SMS sent via Twilio:', result.sid);
      return NextResponse.json(
        { 
          success: true, 
          message: 'SMS sent successfully via Twilio',
          data: { sid: result.sid, status: result.status }
        },
        { status: 200 }
      );
    } catch (twilioError: any) {
      console.error('❌ Twilio error:', twilioError);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Twilio error: ' + twilioError.message,
          error: twilioError.message,
          code: twilioError.code,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('❌ Failed to send SMS:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to send SMS',
        error: error.message || 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for testing SMS configuration
 */
export async function GET() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

  return NextResponse.json({
    configured: !!(accountSid && authToken && twilioPhone),
    message: accountSid && authToken && twilioPhone
      ? 'SMS service (Twilio) is configured and ready'
      : 'SMS service not configured. Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER to environment variables.',
  });
}