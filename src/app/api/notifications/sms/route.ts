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
  
  // If no +, add +91 for Indian numbers
  if (!cleaned.startsWith('+') && cleaned.length === 10) {
    cleaned = '+91' + cleaned;
  }
  
  return cleaned;
}

/**
 * Clean phone number for Fast2SMS (remove + and spaces, keep only digits)
 * For Indian numbers, remove country code if present
 */
function cleanPhoneForFast2SMS(phoneNumber: string): string {
  // Remove all non-digit characters
  let cleaned = phoneNumber.replace(/[^\d]/g, '');
  
  // If starts with 91 (Indian country code) and has more than 10 digits, remove it
  if (cleaned.startsWith('91') && cleaned.length > 10) {
    cleaned = cleaned.substring(2);
  }
  
  return cleaned;
}

/**
 * Send SMS via Fast2SMS using correct header authentication
 */
async function sendViaFast2SMS(phone: string, message: string, apiKey: string) {
  const cleanedPhone = cleanPhoneForFast2SMS(phone);
  
  console.log('📱 Fast2SMS Debug Info:');
  console.log('   Original phone:', phone);
  console.log('   Cleaned phone:', cleanedPhone);
  console.log('   Message length:', message.length);
  
  // Validate phone number
  if (cleanedPhone.length !== 10) {
    throw new Error(`Invalid phone number format. Expected 10 digits, got ${cleanedPhone.length}`);
  }
  
  // Fast2SMS API endpoint
  const url = 'https://www.fast2sms.com/dev/bulkV2';
  
  // Prepare request body as JSON
  const requestBody = {
    route: 'p',
    sender_id: 'FSTSMS',
    message: message,
    language: 'english',
    flash: 0,
    numbers: cleanedPhone
  };

  console.log('📱 Fast2SMS - Calling API...');
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'authorization': apiKey,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    },
    body: JSON.stringify(requestBody),
  });

  const data = await response.json();
  
  console.log('📱 Fast2SMS - Response:', response.status, data);
  
  if (!response.ok || data.return === false) {
    throw new Error(data.message || 'Fast2SMS API error');
  }

  return data;
}

/**
 * Send SMS via Twilio
 */
async function sendViaTwilio(
  phone: string, 
  message: string, 
  accountSid: string, 
  authToken: string, 
  twilioPhone: string
) {
  const formattedPhone = formatPhoneNumber(phone);
  
  console.log('📱 Twilio Debug Info:');
  console.log('   Original phone:', phone);
  console.log('   Formatted phone:', formattedPhone);
  console.log('   From:', twilioPhone);
  
  const twilio = require('twilio');
  const client = twilio(accountSid, authToken);

  const result = await client.messages.create({
    body: message,
    from: twilioPhone,
    to: formattedPhone,
  });

  console.log('✅ Twilio result:', result.sid, result.status);
  return result;
}

/**
 * API Route: Send SMS notification
 * Prioritizes Twilio (more reliable), falls back to Fast2SMS
 */
export async function POST(request: NextRequest) {
  try {
    const smsData: SMSNotification = await request.json();

    console.log('📨 SMS Request received:', {
      to: smsData.to,
      messageLength: smsData.message?.length
    });

    // Validate SMS data
    if (!smsData.to || !smsData.message) {
      console.error('❌ Missing required fields');
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

    console.log('🔧 SMS Service Configuration:');
    console.log('   Twilio configured:', !!(accountSid && authToken && twilioPhone));
    console.log('   Fast2SMS configured:', !!fast2smsKey);

    // Prioritize Twilio (more reliable and you have credits)
    if (accountSid && authToken && twilioPhone) {
      try {
        console.log('📱 Attempting to send SMS via Twilio...');
        
        const result = await sendViaTwilio(
          smsData.to, 
          smsData.message, 
          accountSid, 
          authToken, 
          twilioPhone
        );

        console.log('✅ SMS sent via Twilio successfully');
        
        return NextResponse.json(
          { 
            success: true, 
            message: 'SMS sent successfully via Twilio',
            service: 'Twilio',
            data: { 
              sid: result.sid, 
              status: result.status,
              to: formatPhoneNumber(smsData.to),
            },
            debug: {
              timestamp: new Date().toISOString()
            }
          },
          { status: 200 }
        );
      } catch (twilioError: any) {
        console.error('❌ Twilio error:', twilioError);
        console.log('⚠️ Twilio failed, trying Fast2SMS as fallback...');
        
        // Try Fast2SMS as fallback
        if (fast2smsKey) {
          try {
            const result = await sendViaFast2SMS(smsData.to, smsData.message, fast2smsKey);
            console.log('✅ SMS sent via Fast2SMS (fallback) successfully');
            
            return NextResponse.json(
              { 
                success: true, 
                message: 'SMS sent successfully via Fast2SMS (fallback)',
                service: 'Fast2SMS',
                data: result,
                note: 'Twilio failed, used Fast2SMS as backup'
              },
              { status: 200 }
            );
          } catch (fast2smsError: any) {
            console.error('❌ Fast2SMS fallback also failed:', fast2smsError);
          }
        }
        
        // Both failed
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
    } else if (fast2smsKey) {
      // Use Fast2SMS if Twilio not configured
      try {
        console.log('📱 Attempting to send SMS via Fast2SMS...');
        
        const result = await sendViaFast2SMS(smsData.to, smsData.message, fast2smsKey);

        console.log('✅ SMS sent via Fast2SMS successfully');
        
        return NextResponse.json(
          { 
            success: true, 
            message: 'SMS sent successfully via Fast2SMS',
            service: 'Fast2SMS',
            data: result,
            debug: {
              to: smsData.to,
              cleaned: cleanPhoneForFast2SMS(smsData.to),
              timestamp: new Date().toISOString()
            }
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
    } else {
      console.warn('⚠️ No SMS service configured');
      
      return NextResponse.json(
        { 
          success: false, 
          message: 'SMS service not configured. Please add TWILIO credentials or FAST2SMS_API_KEY to environment variables.',
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

  const twilioConfigured = !!(accountSid && authToken && twilioPhone);
  const fast2smsConfigured = !!fast2smsKey;
  
  const primaryService = twilioConfigured ? 'Twilio' : fast2smsConfigured ? 'Fast2SMS' : 'None';

  return NextResponse.json({
    configured: twilioConfigured || fast2smsConfigured,
    primaryService,
    fallbackAvailable: twilioConfigured && fast2smsConfigured,
    message: primaryService !== 'None'
      ? `SMS service ready. Primary: ${primaryService}${twilioConfigured && fast2smsConfigured ? ', Fallback: Fast2SMS' : ''}`
      : 'SMS service not configured. Add TWILIO credentials or FAST2SMS_API_KEY to environment variables.',
    details: {
      twilio: {
        configured: twilioConfigured,
        priority: 1
      },
      fast2sms: {
        configured: fast2smsConfigured,
        priority: 2,
        note: 'Used as fallback if Twilio fails'
      }
    },
    note: 'Twilio works for international numbers, Fast2SMS for Indian numbers only',
    timestamp: new Date().toISOString()
  });
}