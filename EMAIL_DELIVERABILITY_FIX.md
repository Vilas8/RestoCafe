# Email Deliverability - Fix Spam Issues

## 🔴 Problem
Order and booking confirmation emails are landing in spam folders.

## ✅ Solutions (Step by Step)

### Solution 1: Verify Your Domain with Resend (Recommended)

**Why emails go to spam:**
- Using default sender `onboarding@resend.dev` looks suspicious
- No domain verification means no SPF/DKIM records
- Email providers don't trust unverified domains

**Steps to Fix:**

#### Step 1: Add Your Custom Domain to Resend

1. Login to [Resend Dashboard](https://resend.com/domains)
2. Click **"Add Domain"**
3. Enter your domain (e.g., `restocafe.com` or `yourdomain.com`)
4. Click **Add**

#### Step 2: Add DNS Records

Resend will show you DNS records to add. You need to add these to your domain registrar:

**Records to Add:**

1. **SPF Record** (TXT)
   ```
   Type: TXT
   Name: @
   Value: v=spf1 include:amazonses.com ~all
   ```

2. **DKIM Record** (TXT)
   ```
   Type: TXT
   Name: resend._domainkey
   Value: [Provided by Resend]
   ```

3. **DMARC Record** (TXT)
   ```
   Type: TXT
   Name: _dmarc
   Value: v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com
   ```

**Where to Add DNS Records:**

- **Vercel Domain**: Vercel Dashboard → Your Domain → DNS
- **GoDaddy**: Domain Settings → DNS Management
- **Namecheap**: Domain List → Manage → Advanced DNS
- **Cloudflare**: DNS → Add Record

#### Step 3: Verify Domain in Resend

1. After adding DNS records, wait 10-30 minutes
2. Go back to Resend Dashboard
3. Click **"Verify"** next to your domain
4. Once verified, you'll see a green checkmark ✅

#### Step 4: Update Environment Variable

Add to Vercel environment variables:
```
EMAIL_FROM=RestoCafe <hello@yourdomain.com>
```

Or use:
```
EMAIL_FROM=RestoCafe <noreply@yourdomain.com>
```

#### Step 5: Redeploy

Redeploy your Vercel application for changes to take effect.

---

### Solution 2: Use Resend's Verified Domain (Quick Fix)

If you don't have a custom domain yet:

1. Use Resend's verified sending domains
2. Update `EMAIL_FROM` in Vercel:
   ```
   EMAIL_FROM=RestoCafe <onboarding@resend.dev>
   ```

This is better than nothing, but custom domain is recommended.

---

### Solution 3: Improve Email Content

Update email content to avoid spam triggers.

**Current Issues:**
- Too many emojis (🍴🚚🍽️💜) - spam filters don't like this
- Urgent/promotional language
- No unsubscribe link

**Fixes:**

#### Reduce Emojis
Use 1-2 emojis maximum, not in subject line.

#### Add Unsubscribe Link
Every transactional email should have one.

#### Add Physical Address
Include your business address in footer.

---

### Solution 4: Update Email Templates

Let me create improved email templates with better deliverability.

---

## 🎯 Immediate Actions

### Action 1: Update Email Sender Name (5 minutes)

**In Vercel Environment Variables, add:**
```
EMAIL_FROM=RestoCafe <noreply@resend.dev>
```

Then redeploy.

### Action 2: Verify Domain (30 minutes)

1. Add your domain to Resend
2. Add DNS records
3. Wait for verification
4. Update `EMAIL_FROM` to use your domain
5. Redeploy

### Action 3: Improve Email Content (Immediate)

I'll create updated email templates now.

---

## 📊 Spam Score Factors

| Factor | Current | Should Be |
|--------|---------|----------|
| Verified Domain | ❌ Using resend.dev | ✅ Custom domain |
| SPF Record | ❌ Not set | ✅ Set |
| DKIM Record | ❌ Not set | ✅ Set |
| DMARC Record | ❌ Not set | ✅ Set |
| Sender Name | ⚠️ Generic | ✅ Recognizable |
| Emojis in Subject | ⚠️ Using | ❌ Avoid |
| Physical Address | ❌ Missing | ✅ Add |
| Unsubscribe Link | ❌ Missing | ✅ Add |

---

## 🔍 Test Email Deliverability

### Option 1: Mail Tester

1. Visit [Mail-Tester.com](https://www.mail-tester.com)
2. Send a test email to the address they provide
3. Check your score (aim for 10/10)
4. Follow their recommendations

### Option 2: Check Your IP

1. Visit [MXToolbox Blacklist Check](https://mxtoolbox.com/blacklists.aspx)
2. Enter: `amazonses.com` (Resend uses AWS SES)
3. Verify it's not blacklisted

---

## 🚀 Best Practices

### Subject Lines

**❌ Bad (Spam Triggers):**
- "🍴 Order Confirmed!"
- "ACT NOW! Your booking"
- "FREE delivery!!!"
- "$$$$ Save money"

**✅ Good:**
- "Your RestoCafe Order #12345"
- "Table Booking Confirmed - RestoCafe"
- "Order Confirmation - RestoCafe"

### Email Body

**❌ Avoid:**
- ALL CAPS TEXT
- Multiple !!!
- Too many colors
- Large images
- Shortened URLs (bit.ly)
- Words: free, urgent, act now, limited time

**✅ Include:**
- Clear sender identity
- Order/booking details
- Contact information
- Physical address
- Unsubscribe link
- Plain text version

---

## 📝 Priority Order

1. **Immediate** (Do now):
   - Add `EMAIL_FROM` environment variable
   - Redeploy application
   - Test emails

2. **Short-term** (Within 1 day):
   - Verify custom domain with Resend
   - Add DNS records
   - Update email templates (I'll provide)

3. **Long-term** (Within 1 week):
   - Monitor delivery rates in Resend dashboard
   - Test with Mail-Tester
   - Get feedback from customers
   - Add email preferences page

---

## 🎁 Quick Wins

### Win 1: Use Custom Sender Name

Instead of showing "Vilas's RestoCafe", use:
```
EMAIL_FROM=RestoCafe <noreply@resend.dev>
```

This looks more professional.

### Win 2: Simpler Subject Lines

Change from:
```
"🍴 Order Confirmed - RC-12345"
```

To:
```
"RestoCafe Order Confirmation #12345"
```

### Win 3: Remove Multiple Emojis

Use 1 emoji maximum in email body, NONE in subject.

---

## 📞 Need Help?

### If Domain Verification Fails:

1. Check DNS propagation: [WhatsMyDNS.net](https://www.whatsmydns.net)
2. Wait 24-48 hours for DNS to propagate globally
3. Contact Resend support if still failing

### If Still Going to Spam:

1. Send test email to Mail-Tester.com
2. Share the report
3. Check Resend dashboard for bounce/complaint rates
4. Consider using SendGrid as alternative

---

## ✅ After Following This Guide

**Expected Results:**
- Emails land in inbox (not spam)
- Professional sender name
- Higher open rates
- Better customer trust
- Verified domain badge

**Timeline:**
- Immediate improvement: 1 hour (after redeploy with EMAIL_FROM)
- Full improvement: 1-2 days (after domain verification)

---

**Most Important:** Verify your domain with Resend and update the EMAIL_FROM variable!