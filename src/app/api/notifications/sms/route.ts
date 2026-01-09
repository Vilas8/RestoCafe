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
 * Send SMS via Fast2SMS using POST method
 */
async function sendViaFast2SMS(phone: string, message: string, apiKey: string) {
  const cleanedPhone = cleanPhoneForFast2SMS(phone);
  
  console.log('📱 Fast2SMS Debug Info:');
  console.log('   Original phone:', phone);
  console.log('   Cleaned phone:', cleanedPhone);
  console.log('   Message length:', message.length);
  console.log('   API Key length:', apiKey.length);
  
  // Validate phone number
  if (cleanedPhone.length !== 10) {
    throw new Error(`Invalid phone number format. Expected 10 digits, got ${cleanedPhone.length}. Cleaned: ${cleanedPhone}`);
  }
  
  // Validate API key
  if (!apiKey || apiKey.length < 10) {
    throw new Error('Invalid API key');
  }
  
  // Fast2SMS API endpoint - Using POST method
  const url = 'https://www.fast2sms.com/dev/bulkV2';
  
  // Prepare form data for POST request
  const formData = new URLSearchParams();
  formData.append('authorization', apiKey);
  formData.append('sender_id', 'FSTSMS'); // Default sender ID
  formData.append('message', message);
  formData.append('language', 'english');
  formData.append('route', 'p'); // promotional route - change to 'q' if you have DLT approval
  formData.append('numbers', cleanedPhone);

  console.log('📱 Fast2SMS - Calling API with POST method...');
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache',
      },
      body: formData.toString(),
    });

    const data = await response.json();
    
    console.log('📱 Fast2SMS - Response status:', response.status);
    console.log('📱 Fast2SMS - Response data:', JSON.stringify(data, null, 2));
    
    // Check for success
    if (!response.ok) {
      throw new Error(`Fast2SMS API error (${response.status}): ${data.message || response.statusText}`);
    }
    
    // Fast2SMS returns return: true on success
    if (data.return === false) {
      throw new Error(data.message || 'Fast2SMS returned failure status');
    }

    return data;
  } catch (fetchError: any) {
    console.error('📱 Fast2SMS - Fetch error:', fetchError);
    throw fetchError;
  }
}

/**
 * API Route: Send SMS notification
 * Supports Fast2SMS (recommended for India) or Twilio
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
    console.log('   Fast2SMS configured:', !!fast2smsKey);
    console.log('   Fast2SMS key length:', fast2smsKey?.length || 0);
    console.log('   Twilio configured:', !!(accountSid && authToken && twilioPhone));

    // Prioritize Fast2SMS for Indian numbers
    if (fast2smsKey) {
      try {
        console.log('📱 Attempting to send SMS via Fast2SMS...');
        
        const result = await sendViaFast2SMS(smsData.to, smsData.message, fast2smsKey);

        console.log('✅ SMS sent via Fast2SMS successfully');
        console.log('   Result:', JSON.stringify(result));
        
        return NextResponse.json(
          { 
            success: true, 
            message: 'SMS sent successfully via Fast2SMS',
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
        console.error('   Error message:', fast2smsError.message);
        console.error('   Error stack:', fast2smsError.stack);
        
        return NextResponse.json(
          { 
            success: false, 
            message: 'Fast2SMS error: ' + fast2smsError.message,
            error: fast2smsError.message,
            debug: {
              to: smsData.to,
              cleaned: cleanPhoneForFast2SMS(smsData.to),
              messageLength: smsData.message.length,
              timestamp: new Date().toISOString()
            }
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
    details: {
      fast2sms: {
        configured: !!fast2smsKey,
        keyLength: fast2smsKey ? fast2smsKey.length : 0,
        keyPrefix: fast2smsKey ? fast2smsKey.substring(0, 5) + '...' : 'Not set'
      },
      twilio: {
        configured: !!(accountSid && authToken && twilioPhone)
      }
    },
    note: 'Fast2SMS: Use 10-digit Indian mobile numbers (with or without +91)',
    timestamp: new Date().toISOString()
  });
}