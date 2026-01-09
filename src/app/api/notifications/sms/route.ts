import { NextRequest, NextResponse } from 'next/server';
import { SMSNotification } from '@/types/notification';

/**
 * Format phone number to ensure space after country code
 * Converts +919876543210 to +91 9876543210
 */
function formatPhoneNumber(phoneNumber: string): string {
  // Remove all spaces first
  let cleaned = phoneNumber.replace(/\s+/g, '');
  
  // If starts with + and no space after country code, add it
  if (cleaned.startsWith('+')) {
    // Match country code (1-4 digits after +) and rest of number
    const match = cleaned.match(/^(\+\d{1,4})(\d+)$/);
    if (match) {
      return `${match[1]} ${match[2]}`;
    }
  }
  
  return cleaned;
}

/**
 * Clean phone number for Fast2SMS (remove + and spaces, keep only digits)
 */
function cleanPhoneForFast2SMS(phoneNumber: string): string {
  return phoneNumber.replace(/[^\d]/g, '');
}

/**
 * Send SMS via Fast2SMS
 */
async function sendViaPast2SMS(phone: string, message: string, apiKey: string) {
  const cleanedPhone = cleanPhoneForFast2SMS(phone);
  
  // Fast2SMS API endpoint
  const url = 'https://www.fast2sms.com/dev/bulkV2';
  
  const params = new URLSearchParams({
    authorization: apiKey,
    message: message,
    language: 'english',
    route: 'q',
    numbers: cleanedPhone,
  });

  const response = await fetch(`${url}?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Cache-Control': 'no-cache',
    },
  });

  const data = await response.json();
  
  if (!response.ok || !data.return) {
    throw new Error(data.message || 'Fast2SMS API error');
  }

  return data;
}

/**
 * API Route: Send SMS notification
 * Supports Fast2SMS (recommended for India) or Twilio
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

    // Check which SMS service is configured
    const fast2smsKey = process.env.FAST2SMS_API_KEY;
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

    // Prioritize Fast2SMS for Indian numbers
    if (fast2smsKey) {
      try {
        console.log('📱 Sending SMS via Fast2SMS to:', smsData.to);
        
        const result = await sendViaPast2SMS(smsData.to, smsData.message, fast2smsKey);

        console.log('✅ SMS sent via Fast2SMS:', result);
        return NextResponse.json(
          { 
            success: true, 
            message: 'SMS sent successfully via Fast2SMS',
            data: result
          },
          { status: 200 }
        );
      } catch (fast2smsError: any) {
        console.error('❌ Fast2SMS error:', fast2smsError);
        return NextResponse.json(
          { 
            success: false, 
            message: 'Fast2SMS error: ' + fast2smsError.message,
            error: fast2smsError.message,
          },
          { status: 500 }
        );
      }
    } else if (accountSid && authToken && twilioPhone) {
      try {
        // Fallback to Twilio
        const formattedPhone = formatPhoneNumber(smsData.to);
        console.log('📱 Sending SMS via Twilio to:', formattedPhone);
        
        const twilio = require('twilio');
        const client = twilio(accountSid, authToken);

        const result = await client.messages.create({
          body: smsData.message,
          from: twilioPhone,
          to: formattedPhone,
        });

        console.log('✅ SMS sent via Twilio:', result.sid);
        return NextResponse.json(
          { 
            success: true, 
            message: 'SMS sent successfully via Twilio',
            data: { 
              sid: result.sid, 
              status: result.status,
              to: formattedPhone,
            }
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
    } else {
      console.warn('⚠️ No SMS service configured');
      
      return NextResponse.json(
        { 
          success: false, 
          message: 'SMS service not configured. Please add FAST2SMS_API_KEY or Twilio credentials to environment variables.',
        },
        { status: 503 }
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
  const fast2smsKey = process.env.FAST2SMS_API_KEY;
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

  const service = fast2smsKey 
    ? 'Fast2SMS' 
    : (accountSid && authToken && twilioPhone) 
      ? 'Twilio' 
      : 'None';

  return NextResponse.json({
    configured: !!(fast2smsKey || (accountSid && authToken && twilioPhone)),
    service,
    message: service !== 'None'
      ? `SMS service (${service}) is configured and ready`
      : 'SMS service not configured. Add FAST2SMS_API_KEY or Twilio credentials to environment variables.',
    note: 'Fast2SMS is recommended for Indian phone numbers. Phone numbers can be in any format (+919876543210 or 9876543210)'
  });
}