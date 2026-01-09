# SMS Not Working - Debug Steps

## 🔴 Current Issue
Emails are working, but SMS notifications are not being received.

## ⚡ Quick Fix Steps

### Step 1: Redeploy Your Application

I've just updated the SMS code with:
- Changed from GET to POST method (more reliable)
- Added extensive debug logging
- Better error messages
- Validation improvements

**Action Required:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your RestoCafe project
3. Click "Redeploy" on the latest deployment
4. Wait for deployment to complete (~2 minutes)

### Step 2: Check Configuration

Once redeployed, visit:
```
https://your-app-url.vercel.app/api/notifications/sms
```

**Expected Response:**
```json
{
  "configured": true,
  "service": "Fast2SMS",
  "details": {
    "fast2sms": {
      "configured": true,
      "keyLength": 20,
      "keyPrefix": "abcde..."
    }
  }
}
```

**If configured is false:**
- API key is not set in Vercel environment variables
- Go to Vercel → Settings → Environment Variables
- Add `FAST2SMS_API_KEY` with your API key
- Redeploy

### Step 3: Test SMS Sending

#### Option A: Using curl

```bash
curl -X POST https://your-app-url.vercel.app/api/notifications/sms \
  -H "Content-Type: application/json" \
  -d '{
    "to": "9876543210",
    "message": "Test SMS from RestoCafe!"
  }'
```

Replace `9876543210` with your actual 10-digit mobile number.

#### Option B: Using Browser Console

Open your website, press F12, go to Console tab, and paste:

```javascript
fetch('/api/notifications/sms', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: '9876543210', // Your number
    message: 'Test SMS from RestoCafe!'
  })
})
.then(r => r.json())
.then(data => console.log('Response:', data))
.catch(err => console.error('Error:', err));
```

### Step 4: Check Logs in Vercel

1. Go to Vercel Dashboard
2. Click on your project
3. Go to "Deployments" tab
4. Click on the latest deployment
5. Click "Functions" tab
6. Find `/api/notifications/sms`
7. Click to view logs

**Look for these log entries:**

✅ **Success logs:**
```
📨 SMS Request received
🔧 SMS Service Configuration: Fast2SMS configured: true
📱 Attempting to send SMS via Fast2SMS...
📱 Fast2SMS Debug Info:
   Original phone: 9876543210
   Cleaned phone: 9876543210
📱 Fast2SMS - Calling API with POST method...
📱 Fast2SMS - Response status: 200
✅ SMS sent via Fast2SMS successfully
```

❌ **Error logs will show:**
- Exact error message from Fast2SMS
- Phone number format issues
- API key problems
- Balance issues

### Step 5: Check Fast2SMS Dashboard

1. Login to [Fast2SMS Dashboard](https://www.fast2sms.com/dashboard)
2. Check these things:

**Account Balance:**
- Go to Dashboard home
- Check balance in top right
- **Required**: At least ₹10-20
- If low, click "Recharge"

**Message History:**
- Go to "Reports" → "Message History"
- Look for recent messages
- Check delivery status:
  - ✅ Delivered
  - ⏳ Pending
  - ❌ Failed (will show reason)

**API Key Status:**
- Go to "API" section
- Verify API key is "Active"
- Check permissions include "Transactional SMS"

## 👁️ Common Issues and Solutions

### Issue 1: "Invalid API Key"

**Solution:**
```bash
# Test your API key directly with Fast2SMS
curl "https://www.fast2sms.com/dev/bulkV2?authorization=YOUR_API_KEY&message=Test&language=english&route=p&numbers=9876543210"
```

If this fails, your API key is invalid:
1. Go to Fast2SMS dashboard
2. Generate a new API key
3. Update in Vercel environment variables
4. Redeploy

### Issue 2: "Insufficient Balance"

**Check:**
```bash
# Login to Fast2SMS dashboard and check balance
```

**Solution:**
- Recharge your account with at least ₹20
- Each SMS costs ₹0.15-0.25

### Issue 3: "Invalid Phone Number"

**Valid formats:**
- `9876543210` ✅
- `+919876543210` ✅
- `+91 9876543210` ✅

**Invalid:**
- `123456789` ❌ (not 10 digits)
- `0987654321` ❌ (starts with 0)
- Landline numbers ❌

### Issue 4: Route 'q' Not Allowed

**If you see this error:**
Route 'q' (Quick/Transactional) requires DLT (Distributed Ledger Technology) registration.

**Solution:**
I've updated the code to use route 'p' (Promotional) which works without DLT.

**To use route 'q' (better delivery):**
1. Register your business with DLT
2. Get DLT template approval
3. Change `route: 'p'` to `route: 'q'` in the code

### Issue 5: DND (Do Not Disturb) Number

**If recipient has DND enabled:**
- Promotional messages may be blocked
- Try with a non-DND number first

**Check if number has DND:**
Send SMS to your own number (without DND) first to test.

## 🧪 Debugging Checklist

- [ ] Redeployed application after latest code update
- [ ] Configuration endpoint shows `configured: true`
- [ ] Fast2SMS account has balance > ₹10
- [ ] API key is active in Fast2SMS dashboard
- [ ] Tested with valid 10-digit Indian mobile number
- [ ] Checked Vercel function logs for errors
- [ ] Checked Fast2SMS dashboard for message history
- [ ] Tested with non-DND mobile number
- [ ] API key has correct permissions

## 📝 Test with This Exact Command

After redeploying, run this (replace with your details):

```bash
# Replace YOUR_APP_URL and YOUR_PHONE_NUMBER
curl -X POST https://YOUR_APP_URL/api/notifications/sms \
  -H "Content-Type: application/json" \
  -d '{
    "to": "YOUR_PHONE_NUMBER",
    "message": "RestoCafe Test: If you receive this, SMS is working!"
  }' \
  -v
```

The `-v` flag shows detailed output.

**Success response:**
```json
{
  "success": true,
  "message": "SMS sent successfully via Fast2SMS",
  "debug": {
    "to": "9876543210",
    "cleaned": "9876543210",
    "timestamp": "2026-01-09T13:15:00.000Z"
  }
}
```

**Error response:**
```json
{
  "success": false,
  "message": "Fast2SMS error: [specific error]",
  "error": "Detailed error message",
  "debug": {
    "to": "9876543210",
    "cleaned": "9876543210"
  }
}
```

## 📞 What to Check Right Now

### 1. Verify API Key in Vercel

```bash
# In your terminal, check environment variables
vercel env ls
```

Look for `FAST2SMS_API_KEY` in Production environment.

### 2. Test API Key Directly

```bash
# Replace YOUR_API_KEY with actual key
curl "https://www.fast2sms.com/dev/bulkV2?authorization=YOUR_API_KEY&message=DirectTest&language=english&route=p&numbers=9876543210"
```

If this returns `{"return":true}`, your API key works.

If this fails, the issue is with your Fast2SMS account/API key.

### 3. Check Recent Changes

**Did you:**
- Change the API key recently?
- Run out of balance?
- Get any emails from Fast2SMS about account issues?

## 🎯 Next Steps Based on Results

### If configuration shows "not configured":
1. Add/verify API key in Vercel
2. Redeploy
3. Test again

### If test SMS returns error:
1. Copy the exact error message
2. Check the error in Fast2SMS dashboard
3. Fix the specific issue (balance, API key, etc.)

### If test SMS returns success but not received:
1. Wait 2-5 minutes (sometimes delayed)
2. Check Fast2SMS dashboard delivery status
3. Try different phone number
4. Check if phone has DND enabled

### If everything looks good but still not working:
1. Share the error message from Vercel logs
2. Check Fast2SMS support/documentation
3. Consider trying Twilio as alternative

## 📧 Still Need Help?

Provide these details:

1. Response from: `https://your-app/api/notifications/sms` (GET)
2. Response from test SMS curl command
3. Screenshot of Fast2SMS dashboard showing balance
4. Vercel function logs for the SMS API call
5. Error message (if any)

---

**Most likely cause**: Fast2SMS account balance is 0 or API key needs to be regenerated. Check dashboard first!