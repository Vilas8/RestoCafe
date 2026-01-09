# RestoCafe Dynamic Features Guide

This guide explains the newly integrated dynamic features for your RestoCafe webpage.

## 📋 Table of Contents

1. [Menu Customization](#menu-customization)
2. [Combo Deals](#combo-deals)
3. [Daily Specials](#daily-specials)
4. [Time-based Pricing (Happy Hour)](#time-based-pricing)
5. [Notifications](#notifications)
6. [Database Setup](#database-setup)
7. [Integration Examples](#integration-examples)

---

## 🍕 Menu Customization

### Features
- Add extra ingredients (cheese, toppings, etc.)
- Remove items (no onions, no garlic, etc.)
- Modify cooking instructions (extra spicy, well done, less oil)
- Special instructions field
- Real-time price calculation

### Implementation

```tsx
import MenuItemCustomization from '@/components/menu/MenuItemCustomization';
import { MenuItem, CartItemCustomization } from '@/types/menu';
import { sampleCustomizations } from '@/lib/menu/customization';

const [showCustomization, setShowCustomization] = useState(false);
const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

const handleAddToCart = (
  customizations: CartItemCustomization[],
  specialInstructions: string
) => {
  // Add to cart with customizations
  const cartItem = {
    menuItem: selectedItem,
    quantity: 1,
    customizations,
    specialInstructions,
  };
  // ... add to cart logic
};

// In your component
{showCustomization && selectedItem && (
  <MenuItemCustomization
    menuItem={selectedItem}
    onAddToCart={handleAddToCart}
    onClose={() => setShowCustomization(false)}
  />
)}
```

### Sample Customizations

```typescript
// Add-ons
{ id: 'extra-cheese', name: 'Extra Cheese', price: 30, category: 'add' }
{ id: 'extra-paneer', name: 'Extra Paneer', price: 50, category: 'add' }

// Remove items
{ id: 'no-onions', name: 'No Onions', price: 0, category: 'remove' }

// Modifications
{ id: 'extra-spicy', name: 'Extra Spicy', price: 10, category: 'modify' }
```

---

## 🎁 Combo Deals

### Features
- Bundle multiple items together
- Automatic discount calculation
- Validity period (from/until dates)
- Percentage savings display
- Active/inactive status

### Implementation

```tsx
import ComboDeals from '@/components/menu/ComboDeals';
import { ComboDeal } from '@/types/menu';
import { sampleCombos } from '@/lib/menu/combos';

const handleAddComboToCart = (combo: ComboDeal) => {
  // Add combo to cart
  console.log('Adding combo:', combo);
};

<ComboDeals
  combos={sampleCombos}
  onAddToCart={handleAddComboToCart}
/>
```

### Sample Combo

```typescript
{
  id: 'combo-1',
  name: 'Family Feast',
  description: '2 Pizzas + Garlic Bread + 1.5L Coke',
  items: ['pizza-margherita', 'pizza-pepperoni', 'garlic-bread', 'coke-1.5l'],
  originalPrice: 899,
  discountedPrice: 699,
  discount: 200,
  image: '/combos/family-feast.jpg',
  validFrom: '2026-01-01',
  validUntil: '2026-12-31',
  isActive: true,
}
```

---

## ⭐ Daily Specials

### Features
- Day-specific offers (Monday-Sunday)
- Time-based availability (start/end time)
- Automatic rotation
- Discount percentage display
- Real-time active checking

### Implementation

```tsx
import DailySpecials from '@/components/menu/DailySpecials';
import { sampleDailySpecials } from '@/lib/menu/dailySpecials';

const handleAddSpecialToCart = (
  menuItem: MenuItem,
  discountedPrice: number
) => {
  // Add discounted item to cart
};

<DailySpecials
  specials={sampleDailySpecials}
  menuItems={menuItems}
  onAddToCart={handleAddSpecialToCart}
/>
```

### Sample Daily Special

```typescript
{
  id: 'special-1',
  menuItemId: 'pizza-margherita',
  dayOfWeek: 1, // Monday (0=Sunday, 6=Saturday)
  discountPercentage: 20,
  description: 'Monday Pizza Special - 20% off all pizzas!',
  startTime: '11:00',
  endTime: '23:00',
  isActive: true,
}
```

---

## 🎉 Time-based Pricing (Happy Hour)

### Features
- Multiple time slots per day
- Day-specific happy hours
- Category-specific discounts
- Countdown to next happy hour
- Real-time active status

### Implementation

```tsx
import HappyHourBanner from '@/components/menu/HappyHourBanner';
import { sampleHappyHours } from '@/lib/menu/happyHour';
import { HappyHourService } from '@/lib/menu/happyHour';

// Banner component
<HappyHourBanner pricings={sampleHappyHours} />

// Apply discount to menu item
const bestDiscount = HappyHourService.getBestDiscount(
  menuItem,
  sampleHappyHours
);

if (bestDiscount) {
  console.log(`Discounted price: ₹${bestDiscount.price}`);
  console.log(`Savings: ₹${bestDiscount.discount}`);
}
```

### Sample Happy Hour

```typescript
{
  id: 'hh-1',
  name: 'Evening Happy Hour',
  discountPercentage: 30,
  startTime: '17:00',
  endTime: '19:00',
  daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
  applicableCategories: ['beverages', 'appetizers'],
  isActive: true,
}
```

---

## 🔔 Notifications

### Push Notifications

#### Setup

1. Generate VAPID keys:
```bash
npm install -g web-push
web-push generate-vapid-keys
```

2. Add keys to `.env.local`:
```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key
VAPID_PRIVATE_KEY=your_private_key
```

3. Implement in your app:
```tsx
import { pushNotificationService } from '@/lib/notifications/pushNotification';

// Initialize service worker
await pushNotificationService.initialize();

// Request permission
const permission = await pushNotificationService.requestPermission();

// Subscribe user
if (permission === 'granted') {
  await pushNotificationService.subscribe();
}

// Send local notification (for testing)
await pushNotificationService.sendLocalNotification({
  title: 'Order Update',
  body: 'Your order is ready!',
  icon: '/icon-192.png',
});
```

### Email Notifications

#### Setup with Resend

1. Install Resend:
```bash
npm install resend
```

2. Add API key to `.env.local`:
```env
RESEND_API_KEY=your_resend_api_key
```

3. Update API route (`src/app/api/notifications/email/route.ts`):
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'RestoCafe <noreply@restocafe.com>',
  to: emailData.to,
  subject: emailData.subject,
  html: emailData.html,
});
```

#### Usage

```tsx
import { emailService } from '@/lib/notifications/emailService';

// Send order confirmation
await emailService.sendOrderConfirmation('user@example.com', orderDetails);

// Send status update
await emailService.sendOrderStatusUpdate('user@example.com', 'ORD123', 'preparing');

// Send promotional email
await emailService.sendPromotionalEmail(
  'user@example.com',
  'Special Offer!',
  'Get 20% off your next order!'
);
```

### SMS Notifications

#### Setup with Twilio

1. Install Twilio:
```bash
npm install twilio
```

2. Add credentials to `.env.local`:
```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

3. Update API route (`src/app/api/notifications/sms/route.ts`):
```typescript
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

await client.messages.create({
  body: smsData.message,
  from: process.env.TWILIO_PHONE_NUMBER,
  to: smsData.to,
});
```

#### Usage

```tsx
import { smsService } from '@/lib/notifications/smsService';

// Send order confirmation
await smsService.sendOrderConfirmation('+919876543210', 'ORD123', 599);

// Send status update
await smsService.sendOrderStatusUpdate('+919876543210', 'ORD123', 'ready');
```

### Notification Settings UI

```tsx
import NotificationSettings from '@/components/notifications/NotificationSettings';

const initialPreferences = {
  userId: 'user123',
  pushEnabled: false,
  emailEnabled: true,
  smsEnabled: false,
  marketingEmails: true,
  orderUpdates: true,
  specialOffers: true,
};

const handleSave = async (preferences: NotificationPreferences) => {
  // Save to database
  await updateUserPreferences(preferences);
};

<NotificationSettings
  userId="user123"
  initialPreferences={initialPreferences}
  onSave={handleSave}
/>
```

---

## 🗄️ Database Setup

### Supabase SQL Schema

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Menu Customizations Table
CREATE TABLE menu_customizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('add', 'remove', 'modify')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu Items Extended (add customizations support)
ALTER TABLE menu_items
ADD COLUMN available_customizations UUID[] DEFAULT '{}';

-- Combo Deals Table
CREATE TABLE combo_deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  item_ids UUID[] NOT NULL,
  original_price DECIMAL(10, 2) NOT NULL,
  discounted_price DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) NOT NULL,
  image TEXT,
  valid_from DATE NOT NULL,
  valid_until DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily Specials Table
CREATE TABLE daily_specials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_item_id UUID REFERENCES menu_items(id),
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  discount_percentage INTEGER NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
  description TEXT,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Happy Hour Pricing Table
CREATE TABLE happy_hour_pricing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  discount_percentage INTEGER NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  days_of_week INTEGER[] NOT NULL,
  applicable_categories TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notification Preferences Table
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  push_enabled BOOLEAN DEFAULT FALSE,
  email_enabled BOOLEAN DEFAULT TRUE,
  sms_enabled BOOLEAN DEFAULT FALSE,
  marketing_emails BOOLEAN DEFAULT TRUE,
  order_updates BOOLEAN DEFAULT TRUE,
  special_offers BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Push Subscriptions Table
CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  endpoint TEXT NOT NULL,
  subscription JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(endpoint)
);

-- Notification Logs Table
CREATE TABLE notification_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  type TEXT NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('push', 'email', 'sms')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'sent', 'failed')),
  sent_at TIMESTAMP WITH TIME ZONE,
  error TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_daily_specials_day ON daily_specials(day_of_week);
CREATE INDEX idx_daily_specials_active ON daily_specials(is_active);
CREATE INDEX idx_combo_deals_active ON combo_deals(is_active);
CREATE INDEX idx_happy_hour_active ON happy_hour_pricing(is_active);
CREATE INDEX idx_notification_logs_user ON notification_logs(user_id);
```

---

## 🚀 Integration Examples

### Complete Menu Page with All Features

```tsx
'use client';

import { useState, useEffect } from 'react';
import MenuItemCustomization from '@/components/menu/MenuItemCustomization';
import ComboDeals from '@/components/menu/ComboDeals';
import DailySpecials from '@/components/menu/DailySpecials';
import HappyHourBanner from '@/components/menu/HappyHourBanner';
import { MenuItem, ComboDeal } from '@/types/menu';
import { sampleCombos } from '@/lib/menu/combos';
import { sampleDailySpecials } from '@/lib/menu/dailySpecials';
import { sampleHappyHours } from '@/lib/menu/happyHour';
import { HappyHourService } from '@/lib/menu/happyHour';

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [showCustomization, setShowCustomization] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Load menu items from API/database
  useEffect(() => {
    // Fetch menu items
  }, []);

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setShowCustomization(true);
  };

  const handleAddToCart = (customizations, specialInstructions) => {
    console.log('Adding to cart:', customizations, specialInstructions);
    setShowCustomization(false);
  };

  const handleAddCombo = (combo: ComboDeal) => {
    console.log('Adding combo:', combo);
  };

  const handleAddSpecial = (menuItem: MenuItem, discountedPrice: number) => {
    console.log('Adding special:', menuItem, discountedPrice);
  };

  return (
    <div>
      {/* Happy Hour Banner */}
      <HappyHourBanner pricings={sampleHappyHours} />

      {/* Daily Specials */}
      <DailySpecials
        specials={sampleDailySpecials}
        menuItems={menuItems}
        onAddToCart={handleAddSpecial}
      />

      {/* Combo Deals */}
      <ComboDeals combos={sampleCombos} onAddToCart={handleAddCombo} />

      {/* Regular Menu Items */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8">Our Menu</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {menuItems.map(item => {
              // Apply happy hour discount if applicable
              const discount = HappyHourService.getBestDiscount(
                item,
                sampleHappyHours
              );

              return (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="cursor-pointer bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
                >
                  <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  {discount ? (
                    <div>
                      <p className="text-gray-400 line-through">₹{item.price}</p>
                      <p className="text-2xl font-bold text-red-600">
                        ₹{discount.price}
                      </p>
                      <p className="text-sm text-green-600">{discount.name}</p>
                    </div>
                  ) : (
                    <p className="text-2xl font-bold text-red-600">₹{item.price}</p>
                  )}
                </div>
              );
            })}
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

### Order Notification Flow

```tsx
import { emailService } from '@/lib/notifications/emailService';
import { smsService } from '@/lib/notifications/smsService';
import { pushNotificationService } from '@/lib/notifications/pushNotification';

async function handleOrderPlaced(order: any, user: any, preferences: NotificationPreferences) {
  // Send order confirmation via enabled channels
  
  if (preferences.emailEnabled && preferences.orderUpdates) {
    await emailService.sendOrderConfirmation(user.email, order);
  }
  
  if (preferences.smsEnabled && preferences.orderUpdates) {
    await smsService.sendOrderConfirmation(user.phone, order.id, order.total);
  }
  
  if (preferences.pushEnabled && preferences.orderUpdates) {
    await pushNotificationService.sendLocalNotification({
      title: 'Order Confirmed!',
      body: `Your order #${order.id} has been confirmed. Total: ₹${order.total}`,
      data: { orderId: order.id, url: `/orders/${order.id}` },
    });
  }
}
```

---

## 📦 Package Dependencies

Add these packages if using specific services:

```bash
# Push notifications
npm install web-push

# Email services
npm install resend  # or
npm install @sendgrid/mail

# SMS services
npm install twilio  # or
npm install aws-sdk  # for AWS SNS
```

---

## 🎯 Next Steps

1. **Database Setup**: Run the SQL schema in Supabase
2. **Environment Variables**: Configure notification service credentials
3. **Test Features**: Test each feature individually
4. **Integration**: Integrate components into your existing pages
5. **Customization**: Adjust styles and behavior to match your brand

## 📞 Support

For issues or questions:
- Check the code comments in each file
- Review the type definitions in `src/types/`
- Refer to service documentation (Twilio, Resend, etc.)

---

**Happy Building! 🚀**