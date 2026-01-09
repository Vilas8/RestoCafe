# Fast2SMS Troubleshooting Guide

## Issue: SMS Not Being Received

If emails are working but SMS messages are not being received, follow these steps:

## Step 1: Verify Fast2SMS Configuration

### Check Environment Variable

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Verify `FAST2SMS_API_KEY` exists and has the correct value
4. Make sure it's applied to **Production** environment
5. **Important**: After adding/updating, you must **redeploy** the app

### Test Configuration

Visit: `https://your-app.vercel.app/api/notifications/sms`

You should see:
```json
{
  "configured": true,
  "service": "Fast2SMS",
  "apiKeyPresent": true,
  "apiKeyLength": 20  // Your actual key length
}
```

If `configured: false`, the API key is not properly set.

## Step 2: Check Fast2SMS Account

### Login to Fast2SMS Dashboard

1. Visit [Fast2SMS Dashboard](https://www.fast2sms.com/dashboard)
2. Check your **account balance**
   - If balance is 0 or negative, recharge your account
3. Check **API Key Status**
   - Navigate to Dashboard → API
   - Verify your API key is **Active**

### Verify API Key Permissions

Your API key should have:
- ✅ Transactional SMS permission
- ✅ Quick route access

## Step 3: Test SMS Manually

### Using Vercel Deployment

Test with a direct API call:

```bash
curl -X POST https://your-app.vercel.app/api/notifications/sms \
  -H "Content-Type: application/json" \
  -d '{
    "to": "9876543210",
    "message": "Test SMS from RestoCafe!"
  }'
```

**Expected Success Response:**
```json
{
  "success": true,
  "message": "SMS sent successfully via Fast2SMS",
  "data": {
    "return": true,
    "message": ["SMS sent successfully"]
  },
  "debug": {
    "to": "9876543210",
    "cleaned": "9876543210"
  }
}
```

**If Failed:**
```json
{
  "success": false,
  "error": "Error message here",
  "debug": {
    "to": "9876543210",
    "cleaned": "9876543210"
  }
}
```

## Step 4: Common Issues & Solutions

### Issue: "Invalid API Key"

**Solution:**
1. Copy your API key again from Fast2SMS dashboard
2. Update in Vercel environment variables
3. **Redeploy** your application
4. Test again

### Issue: "Insufficient Balance"

**Solution:**
1. Recharge your Fast2SMS account
2. Minimum balance required: ₹10-20
3. SMS costs: ₹0.15-0.25 per message

### Issue: "Invalid Phone Number"

**Solution:**
- Use 10-digit Indian mobile numbers only
- Valid formats:
  - `9876543210`
  - `+919876543210`
  - `+91 9876543210`
- Don't use landline numbers
- Don't use international numbers (except +91)

### Issue: "DND (Do Not Disturb) Number"

**Solution:**
- If the recipient has DND enabled, transactional SMS may be blocked
- Test with a non-DND number first
- For DND numbers, you may need to register your sender ID

### Issue: SMS Sent but Not Received

**Check Fast2SMS Dashboard:**
1. Login to Fast2SMS
2. Go to **Reports** → **Message History**
3. Look for recent messages
4. Check delivery status:
   - ✅ **Delivered**: Message reached the phone
   - ⏳ **Pending**: Still being processed
   - ❌ **Failed**: Check reason

**Possible Reasons:**
- Phone is switched off
- Poor network coverage
- Phone memory is full
- Carrier issues
- DND settings

## Step 5: Check Vercel Logs

1. Go to Vercel Dashboard
2. Click on your deployment
3. Go to **Functions** tab
4. Look for `/api/notifications/sms` logs

**What to look for:**
```
📱 Attempting to send SMS via Fast2SMS...
📱 Fast2SMS - Original phone: 9876543210
📱 Fast2SMS - Cleaned phone: 9876543210
📱 Fast2SMS - Calling API...
📱 Fast2SMS - Response status: 200
✅ SMS sent via Fast2SMS successfully
```

**If you see errors:**
```
❌ Fast2SMS error: [error message]
```
The error message will tell you what went wrong.

## Step 6: Alternative - Test with Fast2SMS Directly

Test Fast2SMS API directly to isolate the issue:

```bash
curl "https://www.fast2sms.com/dev/bulkV2?authorization=YOUR_API_KEY&message=Test&language=english&route=q&numbers=9876543210"
```

Replace:
- `YOUR_API_KEY` with your actual API key
- `9876543210` with your phone number

**Success Response:**
```json
{
  "return": true,
  "request_id": "...",
  "message": ["SMS sent successfully."]
}
```

## Step 7: Message Length Limits

Fast2SMS has message length restrictions:

- **English**: 160 characters per SMS
- **Unicode**: 70 characters per SMS
- Messages longer than this count as multiple SMS

**Current Implementation:**
Our SMS messages are around 100-120 characters, which is within limits.

## Step 8: Rate Limits

Fast2SMS has rate limits:
- **Free accounts**: Limited messages per day
- **Paid accounts**: Higher limits

Check your account type and limits in the dashboard.

## Step 9: Route Configuration

Our implementation uses route `q` (Quick route) which is for:
- ✅ Transactional messages
- ✅ OTPs
- ✅ Order confirmations
- ✅ Booking confirmations

**If using promotional route:**
- May require sender ID registration
- May have DND restrictions

## Debug Mode

The updated SMS route includes detailed logging. Check your Vercel function logs to see:

1. Which SMS service is being used
2. The phone number before and after cleaning
3. The API response from Fast2SMS
4. Any error messages

## Quick Checklist

- [ ] Fast2SMS API key added to Vercel
- [ ] Application redeployed after adding API key
- [ ] Fast2SMS account has sufficient balance
- [ ] API key is active in Fast2SMS dashboard
- [ ] Phone number is valid 10-digit Indian number
- [ ] Test endpoint returns `configured: true`
- [ ] Test SMS API call returns success
- [ ] Checked Fast2SMS dashboard for delivery status
- [ ] Checked Vercel function logs for errors
- [ ] Recipient phone is not on DND

## Still Not Working?

### Contact Fast2SMS Support

- **Email**: support@fast2sms.com
- **Dashboard**: Submit ticket through Fast2SMS dashboard
- **Phone**: Check website for support number

### Provide These Details:

1. Your Fast2SMS account ID
2. Phone number you're testing with
3. Timestamp of test
4. Error message from API (if any)
5. Screenshot of Fast2SMS dashboard showing balance and API status

## Alternative Solution: Use Twilio

If Fast2SMS continues to have issues, you can use Twilio:

```bash
# Add to Vercel environment variables
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

The system will automatically use Twilio as a fallback.

## Testing Script

Create a test file `test-sms.js`:

```javascript
const testSMS = async () => {
  const response = await fetch('https://your-app.vercel.app/api/notifications/sms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: '9876543210', // Your phone number
      message: 'Test SMS from RestoCafe!'
    })
  });
  
  const result = await response.json();
  console.log('Response:', JSON.stringify(result, null, 2));
};

testSMS();
```

Run: `node test-sms.js`

---

**Most Common Fix**: 
1. Verify API key is correct
2. Ensure sufficient balance in Fast2SMS account
3. **Redeploy** Vercel app after setting environment variable
4. Test with a non-DND number