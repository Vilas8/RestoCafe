# Notification Setup Guide - RestoCafe

This guide explains how to set up email and SMS notifications for order and table booking confirmations in your RestoCafe application.

## Overview

RestoCafe supports multiple notification channels:
- **Email**: Order and booking confirmations via Resend or SendGrid
- **SMS**: Order and booking confirmations via Fast2SMS (India) or Twilio (International)

## SMS Setup - Fast2SMS (Recommended for India)

### Step 1: Get Fast2SMS API Key

1. Visit [Fast2SMS.com](https://www.fast2sms.com)
2. Sign up for an account
3. Complete your profile and verify your mobile number
4. Navigate to **Dashboard** → **API Keys**
5. Copy your API key

### Step 2: Add to Vercel Environment Variables

Since you've already added the Fast2SMS API key to Vercel, verify it's set correctly:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Ensure you have:
   ```
   FAST2SMS_API_KEY=your_actual_api_key_here
   ```
4. Apply to all environments (Production, Preview, Development)
5. **Redeploy** your application for changes to take effect

### Fast2SMS Features
- ✅ Free tier available (limited SMS)
- ✅ No sender verification required
- ✅ Supports all Indian mobile numbers
- ✅ Simple integration
- ✅ Affordable pricing for paid plans

### SMS Message Format

The SMS notifications are automatically formatted:

**Order Confirmation:**
```
RestoCafe Order Confirmed!
Order ID: RC-12345
Total: Rs.450.00
Type: Delivery
Est. Time: 30-40 mins
Thank you for ordering!
```

**Booking Confirmation:**
```
RestoCafe - Table Booked!
Booking ID: BK-12345
Date: 15 Jan 2026
Time: 7:00 PM
Guests: 4
Table: T-5
Please arrive 10 mins early. See you soon!
```

## Email Setup

### Option 1: Resend (Recommended)

1. Visit [Resend.com](https://resend.com)
2. Sign up for a free account (100 emails/day free)
3. Get your API key from the dashboard
4. Add to Vercel environment variables:
   ```
   RESEND_API_KEY=re_your_api_key_here
   ```
5. (Optional) For custom sender email:
   ```
   EMAIL_FROM=RestoCafe <hello@yourdomain.com>
   ```

### Option 2: SendGrid

1. Visit [SendGrid.com](https://sendgrid.com)
2. Sign up (100 emails/day free)
3. Create an API key
4. Verify your sender email/domain
5. Add to Vercel:
   ```
   SENDGRID_API_KEY=SG.your_api_key_here
   EMAIL_FROM=noreply@yourdomain.com
   ```

## Using the Notification Service

### In Your Order Page

```typescript
import { sendOrderConfirmation } from '@/lib/notifications';

// After order is successfully created
const confirmationResult = await sendOrderConfirmation({
  orderId: 'RC-12345',
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  customerPhone: '+919876543210', // or '9876543210'
  items: [
    { name: 'Margherita Pizza', quantity: 2, price: 199 },
    { name: 'Garlic Bread', quantity: 1, price: 99 }
  ],
  total: 497,
  orderType: 'delivery',
  address: '123 Main St, Bangalore',
  estimatedTime: '30-40 minutes'
});

// Check results
if (confirmationResult.email.success) {
  console.log('Email sent successfully!');
} else {
  console.error('Email failed:', confirmationResult.email.error);
}

if (confirmationResult.sms.success) {
  console.log('SMS sent successfully!');
} else {
  console.error('SMS failed:', confirmationResult.sms.error);
}
```

### In Your Booking Page

```typescript
import { sendBookingConfirmation } from '@/lib/notifications';

// After booking is successfully created
const confirmationResult = await sendBookingConfirmation({
  bookingId: 'BK-12345',
  customerName: 'Jane Smith',
  customerEmail: 'jane@example.com',
  customerPhone: '+919876543210',
  date: '15 January 2026',
  time: '7:00 PM',
  guests: 4,
  tableNumber: 'T-5',
  specialRequests: 'Window seat please'
});

// Handle results similar to order confirmation
```

## Phone Number Format

Fast2SMS accepts phone numbers in multiple formats:
- `+919876543210` (with country code)
- `9876543210` (without country code)
- `+91 9876543210` (with spaces)

The system automatically cleans and formats the number.

## Testing the Integration

### Test Email Configuration

```bash
curl https://your-app.vercel.app/api/notifications/email
```

Expected response:
```json
{
  "configured": true,
  "service": "Resend",
  "message": "Email service is configured and ready",
  "note": "For custom sender email, add EMAIL_FROM environment variable"
}
```

### Test SMS Configuration

```bash
curl https://your-app.vercel.app/api/notifications/sms
```

Expected response:
```json
{
  "configured": true,
  "service": "Fast2SMS",
  "message": "SMS service (Fast2SMS) is configured and ready",
  "note": "Fast2SMS is recommended for Indian phone numbers. Phone numbers can be in any format"
}
```

### Send Test Email

```bash
curl -X POST https://your-app.vercel.app/api/notifications/email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "your-email@example.com",
    "subject": "Test Email",
    "text": "This is a test email from RestoCafe",
    "html": "<h1>Test Email</h1><p>This is a test email from RestoCafe</p>"
  }'
```

### Send Test SMS

```bash
curl -X POST https://your-app.vercel.app/api/notifications/sms \
  -H "Content-Type: application/json" \
  -d '{
    "to": "9876543210",
    "message": "Test SMS from RestoCafe!"
  }'
```

## Troubleshooting

### Email Issues

**Problem**: "Email service not configured"
- **Solution**: Add `RESEND_API_KEY` or `SENDGRID_API_KEY` to Vercel environment variables and redeploy

**Problem**: "Invalid sender email"
- **Solution**: 
  - For Resend: Use the default sender or verify your domain
  - For SendGrid: Verify your sender email in SendGrid dashboard

**Problem**: "Invalid API key"
- **Solution**: Double-check your API key is correct and hasn't expired

### SMS Issues

**Problem**: "SMS service not configured"
- **Solution**: Add `FAST2SMS_API_KEY` to Vercel environment variables and redeploy

**Problem**: "Invalid phone number"
- **Solution**: Ensure phone number is a valid Indian mobile number (10 digits)

**Problem**: "Insufficient balance"
- **Solution**: Recharge your Fast2SMS account

**Problem**: SMS sent but not received
- **Solution**: 
  - Check if the number is correct
  - Verify DND (Do Not Disturb) settings on the recipient's phone
  - Check Fast2SMS dashboard for delivery status

## Environment Variables Summary

```bash
# Required for SMS (Choose one)
FAST2SMS_API_KEY=your_fast2sms_api_key        # Recommended for India
TWILIO_ACCOUNT_SID=your_twilio_sid            # Alternative
TWILIO_AUTH_TOKEN=your_twilio_token           # Alternative
TWILIO_PHONE_NUMBER=your_twilio_phone         # Alternative

# Required for Email (Choose one)
RESEND_API_KEY=your_resend_api_key            # Recommended
SENDGRID_API_KEY=your_sendgrid_api_key        # Alternative

# Optional
EMAIL_FROM=RestoCafe <hello@yourdomain.com>   # Custom sender email
```

## Cost Comparison

### SMS Services

| Service | Free Tier | Paid Pricing (India) | Best For |
|---------|-----------|---------------------|----------|
| Fast2SMS | Limited | ₹0.15-0.25/SMS | Indian customers |
| Twilio | Trial credit | $0.0079/SMS | International |

### Email Services

| Service | Free Tier | Paid Pricing | Best For |
|---------|-----------|--------------|----------|
| Resend | 100/day | $20/month (50k) | Developers |
| SendGrid | 100/day | $15/month (40k) | Scale |

## Next Steps

1. ✅ Fast2SMS API key already added to Vercel
2. Add email service (Resend recommended)
3. Test both services using the curl commands above
4. Integrate notification functions in your order and booking flows
5. Monitor delivery rates in respective dashboards

## Support

For issues:
- Fast2SMS: [support@fast2sms.com](mailto:support@fast2sms.com)
- Resend: [support@resend.com](mailto:support@resend.com)
- SendGrid: [support.sendgrid.com](https://support.sendgrid.com)

## Additional Features

The notification system also supports:
- Email templates with HTML styling
- SMS delivery status tracking
- Fallback to alternative services
- Error logging and monitoring
- Retry logic for failed deliveries

---

**Note**: Remember to redeploy your Vercel application after adding any new environment variables!