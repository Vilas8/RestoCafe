# ⚡ RestoCafe Quick Start Guide

## 🎯 What You Have Now

✅ **Database**: Supabase with all tables created
✅ **Features Code**: All components and utilities added
✅ **Types**: TypeScript definitions for everything
✅ **API Routes**: Notification endpoints ready

---

## 🚀 Get Started in 3 Steps

### Step 1: Environment Setup (2 minutes)

```bash
# 1. Copy environment file
cp .env.example .env.local

# 2. Edit .env.local and add your Supabase credentials
# You already have these from Supabase dashboard
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
```

### Step 2: Install & Run (1 minute)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Step 3: Test Features (5 minutes)

Create a test page: `src/app/test-features/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import ComboDeals from '@/components/menu/ComboDeals';
import HappyHourBanner from '@/components/menu/HappyHourBanner';
import { sampleCombos } from '@/lib/menu/combos';
import { sampleHappyHours } from '@/lib/menu/happyHour';
import { sampleDailySpecials } from '@/lib/menu/dailySpecials';

export default function TestPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-center py-8">Testing RestoCafe Features</h1>
      
      {/* Test Happy Hour Banner */}
      <HappyHourBanner pricings={sampleHappyHours} />
      
      {/* Test Combo Deals */}
      <ComboDeals 
        combos={sampleCombos} 
        onAddToCart={(combo) => console.log('Combo:', combo)}
      />
    </div>
  );
}
```

Visit: [http://localhost:3000/test-features](http://localhost:3000/test-features)

---

## 📁 Key Files to Know

### Components
```
src/components/
├── menu/
│   ├── MenuItemCustomization.tsx  → Customization modal
│   ├── ComboDeals.tsx            → Combo deals display
│   ├── DailySpecials.tsx         → Daily specials
│   └── HappyHourBanner.tsx       → Happy hour banner
└── notifications/
    └── NotificationSettings.tsx   → User preferences
```

### Utilities
```
src/lib/
├── menu/
│   ├── customization.ts  → Customization logic
│   ├── combos.ts         → Combo deals utilities
│   ├── dailySpecials.ts  → Daily specials logic
│   └── happyHour.ts      → Happy hour pricing
└── notifications/
    ├── pushNotification.ts → Push notifications
    ├── emailService.ts     → Email sending
    └── smsService.ts       → SMS sending
```

### Types
```
src/types/
├── menu.ts         → Menu, customizations, combos types
└── notification.ts → Notification types
```

---

## 🎨 Using Components in Your Pages

### Example: Menu Page with All Features

```typescript
'use client';

import { useState } from 'react';
import MenuItemCustomization from '@/components/menu/MenuItemCustomization';
import ComboDeals from '@/components/menu/ComboDeals';
import DailySpecials from '@/components/menu/DailySpecials';
import HappyHourBanner from '@/components/menu/HappyHourBanner';
import { sampleCustomizations } from '@/lib/menu/customization';
import { sampleCombos } from '@/lib/menu/combos';
import { sampleDailySpecials } from '@/lib/menu/dailySpecials';
import { sampleHappyHours } from '@/lib/menu/happyHour';

export default function MenuPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showCustomization, setShowCustomization] = useState(false);

  // Sample menu items (replace with data from Supabase)
  const menuItems = [
    {
      id: '1',
      name: 'Margherita Pizza',
      description: 'Classic pizza with tomato and mozzarella',
      price: 299,
      image: '/menu/pizza.jpg',
      category: 'pizzas',
      availableCustomizations: sampleCustomizations,
      isAvailable: true,
      preparationTime: 25,
    },
    // Add more items...
  ];

  return (
    <div className="min-h-screen">
      {/* Happy Hour Banner */}
      <HappyHourBanner pricings={sampleHappyHours} />

      {/* Daily Specials */}
      <DailySpecials
        specials={sampleDailySpecials}
        menuItems={menuItems}
        onAddToCart={(item, price) => console.log('Added:', item, price)}
      />

      {/* Combo Deals */}
      <ComboDeals
        combos={sampleCombos}
        onAddToCart={(combo) => console.log('Combo added:', combo)}
      />

      {/* Menu Items Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8">Full Menu</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedItem(item);
                  setShowCustomization(true);
                }}
                className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-xl transition"
              >
                <h3 className="text-xl font-bold">{item.name}</h3>
                <p className="text-gray-600 my-2">{item.description}</p>
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
          onAddToCart={(customizations, instructions) => {
            console.log('Cart:', customizations, instructions);
            setShowCustomization(false);
          }}
          onClose={() => setShowCustomization(false)}
        />
      )}
    </div>
  );
}
```

---

## 🔧 Optional: Enable Notifications Later

Notifications work without initial setup, but to enable sending:

### Email (Resend - Free Tier)
```bash
# 1. Sign up: https://resend.com
# 2. Get API key
# 3. Add to .env.local:
RESEND_API_KEY=your_key

# 4. Install:
npm install resend
```

### Push Notifications
```bash
# 1. Generate keys:
npm install -g web-push
web-push generate-vapid-keys

# 2. Add to .env.local:
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key
VAPID_PRIVATE_KEY=your_private_key
```

### SMS (Twilio - Optional)
```bash
# 1. Sign up: https://twilio.com
# 2. Get credentials
# 3. Add to .env.local:
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=your_number

# 4. Install:
npm install twilio
```

---

## 📊 Fetch Data from Supabase

Replace sample data with real data:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Get menu items
const { data: menuItems } = await supabase
  .from('menu_items')
  .select('*')
  .eq('is_available', true);

// Get combo deals
const { data: combos } = await supabase
  .from('combo_deals')
  .select('*')
  .eq('is_active', true);

// Get today's specials
const today = new Date().getDay();
const { data: specials } = await supabase
  .from('daily_specials')
  .select(`
    *,
    menu_item:menu_items(*)
  `)
  .eq('day_of_week', today)
  .eq('is_active', true);
```

---

## ✅ You're Ready!

All features are integrated and ready to use:

1. ✅ Menu customizations work
2. ✅ Combo deals display correctly
3. ✅ Daily specials rotate automatically
4. ✅ Happy hour pricing applies in time slots
5. ✅ Notification system is ready

**Next Steps:**
- Integrate components into your existing pages
- Connect to Supabase data instead of sample data
- Configure notification services when ready
- Deploy to production

---

## 🆘 Common Issues

**Issue**: Components not found
**Fix**: Make sure you ran `npm install`

**Issue**: Supabase connection error
**Fix**: Check `.env.local` has correct credentials

**Issue**: Types errors
**Fix**: Restart TypeScript server (VS Code: Cmd+Shift+P → "Restart TS Server")

**Issue**: Styles not working
**Fix**: Ensure Tailwind CSS is configured in `tailwind.config.ts`

---

**Happy Building! 🚀**

For detailed implementation, see `IMPLEMENTATION_GUIDE.md`