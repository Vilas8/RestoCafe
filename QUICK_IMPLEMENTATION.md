# Quick Implementation Guide - SMS & Email Confirmations

🎉 **Great news!** Your RestoCafe application now has **Fast2SMS integration** for SMS confirmations and improved email handling.

## 🚀 What's New?

### 1. Fast2SMS SMS Integration
- ✅ SMS notifications for order confirmations
- ✅ SMS notifications for table booking confirmations
- ✅ Automatic phone number formatting
- ✅ Fallback to Twilio if needed
- ✅ Works with Indian mobile numbers

### 2. Improved Email System
- ✅ Better error handling
- ✅ Email validation
- ✅ Beautiful HTML templates for orders and bookings
- ✅ Support for Resend and SendGrid

### 3. Easy-to-Use Helper Functions
- ✅ `sendOrderConfirmation()` - One function call for both email & SMS
- ✅ `sendBookingConfirmation()` - One function call for both email & SMS
- ✅ Automatic retry logic
- ✅ Detailed error reporting

## 🛠️ Setup (3 Steps)

### Step 1: Verify Vercel Environment Variables

You mentioned you've already added the Fast2SMS API key to Vercel. Make sure it's set:

```
FAST2SMS_API_KEY=your_actual_api_key_here
```

### Step 2: Add Email Service (Optional but Recommended)

Choose one:

**Option A: Resend (Recommended)**
```
RESEND_API_KEY=re_your_api_key_here
```
Get it from: https://resend.com

**Option B: SendGrid**
```
SENDGRID_API_KEY=SG.your_api_key_here
```
Get it from: https://sendgrid.com

### Step 3: Redeploy on Vercel

After adding environment variables, **redeploy** your app for changes to take effect.

## 📝 Implementation (Copy & Paste)

### For Order Confirmations

Add this to your order submission handler:

```typescript
import { sendOrderConfirmation } from '@/lib/notifications';

// After successfully creating the order
const result = await sendOrderConfirmation({
  orderId: order.id,
  customerName: orderData.name,
  customerEmail: orderData.email,
  customerPhone: orderData.phone, // e.g., '9876543210' or '+919876543210'
  items: orderData.items,
  total: orderData.total,
  orderType: 'delivery', // or 'pickup'
  address: orderData.address,
  estimatedTime: '30-40 minutes'
});

// Check if sent successfully
if (result.email.success) console.log('Email sent!');
if (result.sms.success) console.log('SMS sent!');
```

### For Booking Confirmations

Add this to your booking submission handler:

```typescript
import { sendBookingConfirmation } from '@/lib/notifications';

// After successfully creating the booking
const result = await sendBookingConfirmation({
  bookingId: booking.id,
  customerName: bookingData.name,
  customerEmail: bookingData.email,
  customerPhone: bookingData.phone,
  date: '15 January 2026',
  time: '7:00 PM',
  guests: 4,
  tableNumber: 'T-5', // optional
  specialRequests: bookingData.requests // optional
});

// Check if sent successfully
if (result.email.success) console.log('Email sent!');
if (result.sms.success) console.log('SMS sent!');
```

## 🧪 Testing

### Test SMS Configuration

Visit: `https://your-app.vercel.app/api/notifications/sms`

Expected response:
```json
{
  "configured": true,
  "service": "Fast2SMS",
  "message": "SMS service (Fast2SMS) is configured and ready"
}
```

### Test Email Configuration

Visit: `https://your-app.vercel.app/api/notifications/email`

Expected response:
```json
{
  "configured": true,
  "service": "Resend",
  "message": "Email service is configured and ready"
}
```

### Send Test SMS

```bash
curl -X POST https://your-app.vercel.app/api/notifications/sms \
  -H "Content-Type: application/json" \
  -d '{"to": "9876543210", "message": "Test from RestoCafe!"}'
```

### Send Test Email

```bash
curl -X POST https://your-app.vercel.app/api/notifications/email \
  -H "Content-Type: application/json" \
  -d '{"to": "your@email.com", "subject": "Test", "text": "Test from RestoCafe!"}'
```

## 📊 What the Notifications Look Like

### SMS Format

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
Please arrive 10 mins early. See you soon!
```

### Email Format

Beautiful HTML emails with:
- 🍴 RestoCafe branding
- Gradient header
- Professional layout
- Order/booking details
- Total amount
- Contact information

## 📚 Full Documentation

For detailed information, check:

1. **[NOTIFICATION_SETUP.md](./NOTIFICATION_SETUP.md)** - Complete setup guide
2. **[INTEGRATION_EXAMPLE.md](./INTEGRATION_EXAMPLE.md)** - Code examples and best practices

## ❓ Troubleshooting

### SMS Not Sending?

1. Check Fast2SMS API key is correct in Vercel
2. Verify phone number is a valid 10-digit Indian number
3. Check Fast2SMS account balance
4. Visit Fast2SMS dashboard for delivery status

### Email Not Sending?

1. Add RESEND_API_KEY or SENDGRID_API_KEY to Vercel
2. Check API key is valid
3. For SendGrid, verify sender email in dashboard
4. Check spam folder

### Still Having Issues?

1. Check Vercel deployment logs
2. Visit `/api/notifications/sms` and `/api/notifications/email` to check configuration
3. Review error messages in browser console

## 💰 Costs

### Fast2SMS
- Free tier: Limited SMS
- Paid: ₹0.15-0.25 per SMS
- Perfect for Indian customers

### Resend
- Free: 100 emails/day
- Paid: $20/month for 50,000 emails

### SendGrid
- Free: 100 emails/day  
- Paid: $15/month for 40,000 emails

## 🎯 Next Steps

1. ☑️ Fast2SMS API key already added ✅
2. □ Add email service (Resend recommended)
3. □ Test both services
4. □ Add notification calls to order page
5. □ Add notification calls to booking page
6. □ Deploy and test in production

## 👏 You're All Set!

Your RestoCafe now has professional SMS and email notifications ready to go. Just add the helper functions to your order and booking pages, and you're done!

---

**Questions?** Check the detailed guides or test the endpoints above.