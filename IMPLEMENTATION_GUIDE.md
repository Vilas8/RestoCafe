# 🚀 RestoCafe Implementation Guide

## Current Status: ✅ Database Setup Complete

Now let's integrate all the new features into your application!

---

## 📋 Step-by-Step Implementation Checklist

### ✅ Phase 1: Environment Setup (5 minutes)

1. **Configure Environment Variables**

```bash
cp .env.example .env.local
```

2. **Update `.env.local` with your credentials:**

```env
# Supabase (You already have these)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Push Notifications (Generate VAPID keys - see below)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=

# Email Service (Choose one)
RESEND_API_KEY=          # Recommended: https://resend.com (Free tier available)
# OR
SENDGRID_API_KEY=        # Alternative: https://sendgrid.com

# SMS Service (Choose one)
TWILIO_ACCOUNT_SID=      # https://www.twilio.com
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. **Generate VAPID Keys for Push Notifications:**

```bash
# Install web-push globally
npm install -g web-push

# Generate keys
web-push generate-vapid-keys

# Copy the output to your .env.local
```

---

### ✅ Phase 2: Install Dependencies (2 minutes)

```bash
# Navigate to your project
cd RestoCafe

# Install existing dependencies
npm install

# Install notification service packages (choose what you need)

# For Push Notifications
npm install web-push

# For Email (choose one)
npm install resend        # Recommended - simple and free tier
# OR
npm install @sendgrid/mail

# For SMS (optional - if you want SMS notifications)
npm install twilio
```

---

### ✅ Phase 3: Create Supabase Helper Functions (10 minutes)

Create a file: `src/lib/supabase/queries.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Menu Items
export async function getMenuItems() {
  const { data, error } = await supabase
    .from('menu_items')
    .select(`
      *,
      category:menu_categories(*)
    `)
    .eq('is_available', true)
    .order('name');
  
  return { data, error };
}

export async function getMenuItemsByCategory(categoryId: string) {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('category_id', categoryId)
    .eq('is_available', true);
  
  return { data, error };
}

// Categories
export async function getCategories() {
  const { data, error } = await supabase
    .from('menu_categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order');
  
  return { data, error };
}

// Customizations
export async function getCustomizations() {
  const { data, error } = await supabase
    .from('menu_customizations')
    .select('*')
    .eq('is_active', true)
    .order('category', { ascending: true });
  
  return { data, error };
}

// Combo Deals
export async function getActiveCombos() {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('combo_deals')
    .select('*')
    .eq('is_active', true)
    .lte('valid_from', today)
    .gte('valid_until', today);
  
  return { data, error };
}

// Daily Specials
export async function getTodaySpecials() {
  const dayOfWeek = new Date().getDay();
  
  const { data, error } = await supabase
    .from('daily_specials')
    .select(`
      *,
      menu_item:menu_items(*)
    `)
    .eq('day_of_week', dayOfWeek)
    .eq('is_active', true);
  
  return { data, error };
}

// Happy Hour
export async function getActiveHappyHours() {
  const { data, error } = await supabase
    .from('happy_hour_pricing')
    .select('*')
    .eq('is_active', true);
  
  return { data, error };
}

// Cart Operations
export async function addToCart(userId: string, item: any) {
  const { data, error } = await supabase
    .from('cart_items')
    .insert({
      user_id: userId,
      menu_item_id: item.menuItemId,
      quantity: item.quantity,
      customizations: item.customizations,
      special_instructions: item.specialInstructions,
      price_at_addition: item.price,
    });
  
  return { data, error };
}

export async function getCartItems(userId: string) {
  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      *,
      menu_item:menu_items(*)
    `)
    .eq('user_id', userId);
  
  return { data, error };
}

// Orders
export async function createOrder(orderData: any) {
  const { data, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single();
  
  return { data, error };
}

export async function getUserOrders(userId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  return { data, error };
}

// Notification Preferences
export async function getNotificationPreferences(userId: string) {
  const { data, error } = await supabase
    .from('notification_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  return { data, error };
}

export async function updateNotificationPreferences(userId: string, preferences: any) {
  const { data, error } = await supabase
    .from('notification_preferences')
    .upsert({
      user_id: userId,
      ...preferences,
    });
  
  return { data, error };
}
```

---

### ✅ Phase 4: Update Your Menu Page (15 minutes)

Update or create: `src/app/menu/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { MenuItem } from '@/types/menu';
import MenuItemCustomization from '@/components/menu/MenuItemCustomization';
import ComboDeals from '@/components/menu/ComboDeals';
import DailySpecials from '@/components/menu/DailySpecials';
import HappyHourBanner from '@/components/menu/HappyHourBanner';
import { getMenuItems, getActiveCombos, getTodaySpecials, getActiveHappyHours } from '@/lib/supabase/queries';
import toast from 'react-hot-toast';

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [combos, setCombos] = useState([]);
  const [specials, setSpecials] = useState([]);
  const [happyHours, setHappyHours] = useState([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showCustomization, setShowCustomization] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [menuData, comboData, specialData, happyHourData] = await Promise.all([
        getMenuItems(),
        getActiveCombos(),
        getTodaySpecials(),
        getActiveHappyHours(),
      ]);

      if (menuData.data) setMenuItems(menuData.data);
      if (comboData.data) setCombos(comboData.data);
      if (specialData.data) setSpecials(specialData.data);
      if (happyHourData.data) setHappyHours(happyHourData.data);
    } catch (error) {
      console.error('Error loading menu data:', error);
      toast.error('Failed to load menu');
    } finally {
      setLoading(false);
    }
  }

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setShowCustomization(true);
  };

  const handleAddToCart = async (customizations: any, specialInstructions: string) => {
    // Add to cart logic
    console.log('Adding to cart:', selectedItem, customizations, specialInstructions);
    toast.success('Added to cart!');
    setShowCustomization(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen">
      {/* Happy Hour Banner */}
      <HappyHourBanner pricings={happyHours} />

      {/* Daily Specials */}
      <DailySpecials
        specials={specials}
        menuItems={menuItems}
        onAddToCart={(item, price) => {
          console.log('Adding special:', item, price);
          toast.success('Added to cart!');
        }}
      />

      {/* Combo Deals */}
      <ComboDeals
        combos={combos}
        onAddToCart={(combo) => {
          console.log('Adding combo:', combo);
          toast.success('Combo added to cart!');
        }}
      />

      {/* Regular Menu */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8 text-center">Our Menu</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {menuItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition"
              >
                <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                <p className="text-gray-600 mb-4 text-sm">{item.description}</p>
                <p className="text-2xl font-bold text-red-600">₹{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customization Modal */}
      {showCustomization && selectedItem && (
        <MenuItemCustomization
          menuItem={selectedItem}
          onAddToCart={handleAddToCart}
          onClose={() => setShowCustomization(false)}
        />
      )}
    </div>
  );
}
```

---

### ✅ Phase 5: Setup Notification Services (10 minutes)

#### Option A: Email with Resend (Recommended)

1. Sign up at [Resend.com](https://resend.com) (Free tier: 100 emails/day)
2. Get your API key
3. Update `src/app/api/notifications/email/route.ts`:

```typescript
import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html } = await request.json();

    const data = await resend.emails.send({
      from: 'RestoCafe <noreply@yourdomain.com>',
      to,
      subject,
      html,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
```

#### Option B: SMS with Twilio (Optional)

1. Sign up at [Twilio.com](https://www.twilio.com)
2. Get credentials and phone number
3. Update `src/app/api/notifications/sms/route.ts`:

```typescript
import twilio from 'twilio';
import { NextRequest, NextResponse } from 'next/server';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(request: NextRequest) {
  try {
    const { to, message } = await request.json();

    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('SMS error:', error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
```

---

### ✅ Phase 6: Test Everything (10 minutes)

1. **Start Development Server:**
```bash
npm run dev
```

2. **Test Each Feature:**

- ✅ Visit `http://localhost:3000/menu`
- ✅ Check if Happy Hour banner appears (if within time)
- ✅ Verify Daily Specials show for today
- ✅ Test Combo Deals display
- ✅ Click on a menu item → Test customization modal
- ✅ Add items with customizations
- ✅ Test cart functionality

3. **Test Notifications:**

```typescript
// Test email (in browser console or API route)
fetch('/api/notifications/email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'your-email@example.com',
    subject: 'Test Email',
    html: '<h1>Hello from RestoCafe!</h1>',
  }),
});

// Test push notification
import { pushNotificationService } from '@/lib/notifications/pushNotification';
await pushNotificationService.initialize();
await pushNotificationService.requestPermission();
await pushNotificationService.subscribe();
```

---

### ✅ Phase 7: Add Notification Settings Page (5 minutes)

Create: `src/app/settings/notifications/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import NotificationSettings from '@/components/notifications/NotificationSettings';
import { getNotificationPreferences, updateNotificationPreferences } from '@/lib/supabase/queries';
import { useAuth } from '@/hooks/useAuth'; // Your auth hook

export default function NotificationSettingsPage() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadPreferences();
  }, [user]);

  async function loadPreferences() {
    const { data } = await getNotificationPreferences(user.id);
    setPreferences(data || {
      userId: user.id,
      pushEnabled: false,
      emailEnabled: true,
      smsEnabled: false,
      marketingEmails: true,
      orderUpdates: true,
      specialOffers: true,
    });
    setLoading(false);
  }

  async function handleSave(newPreferences: any) {
    await updateNotificationPreferences(user.id, newPreferences);
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <NotificationSettings
          userId={user.id}
          initialPreferences={preferences}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
```

---

## 🎯 Quick Integration Checklist

```
☐ Environment variables configured (.env.local)
☐ Dependencies installed (npm install)
☐ Supabase queries helper created
☐ Menu page updated with new components
☐ Email service configured (Resend/SendGrid)
☐ SMS service configured (optional - Twilio)
☐ Push notifications setup (VAPID keys)
☐ Notification settings page added
☐ Test all features locally
☐ Deploy to production
```

---

## 🚀 Deployment Checklist

When ready to deploy:

1. **Vercel/Netlify Environment Variables:**
   - Add all `.env.local` variables to your hosting platform
   - Don't forget VAPID keys and service API keys

2. **Supabase:**
   - Ensure RLS policies are enabled
   - Verify API keys are correct

3. **Service Worker:**
   - Ensure `public/sw.js` is accessible
   - Test push notifications in production

4. **Domain Setup:**
   - Update `NEXT_PUBLIC_APP_URL` to your domain
   - Configure email sender domain (if using custom domain)

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Resend Email Docs](https://resend.com/docs)
- [Twilio SMS Docs](https://www.twilio.com/docs/sms)
- [Web Push Notifications](https://web.dev/push-notifications-overview/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

## ❓ Need Help?

Check:
1. Browser console for errors
2. Supabase logs in dashboard
3. API route responses in Network tab
4. Environment variables are set correctly

---

**You're all set! 🎉 Start with Phase 1 and work through each phase.**