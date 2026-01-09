# Integration Examples - Order & Booking Confirmations

This document provides ready-to-use code examples for integrating SMS and email confirmations into your order and booking flows.

## Example 1: Order Confirmation Integration

### Step 1: Import the notification service

```typescript
import { sendOrderConfirmation } from '@/lib/notifications';
import { useState } from 'react';
```

### Step 2: Add state for notification status

```typescript
const [notificationStatus, setNotificationStatus] = useState({
  email: { sent: false, error: null },
  sms: { sent: false, error: null }
});
```

### Step 3: Integrate in your order submission handler

```typescript
const handleOrderSubmit = async (orderData: any) => {
  try {
    // 1. Create order in database (your existing code)
    const order = await createOrder(orderData);
    
    // 2. Send confirmations
    const confirmationResult = await sendOrderConfirmation({
      orderId: order.id,
      customerName: orderData.customerName,
      customerEmail: orderData.email,
      customerPhone: orderData.phone,
      items: orderData.items.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total: orderData.total,
      orderType: orderData.type, // 'delivery' or 'pickup'
      address: orderData.deliveryAddress,
      estimatedTime: '30-40 minutes'
    });
    
    // 3. Update notification status
    setNotificationStatus({
      email: {
        sent: confirmationResult.email.success,
        error: confirmationResult.email.error
      },
      sms: {
        sent: confirmationResult.sms.success,
        error: confirmationResult.sms.error
      }
    });
    
    // 4. Show success message to user
    if (confirmationResult.email.success || confirmationResult.sms.success) {
      alert('Order placed successfully! Confirmation sent.');
    } else {
      alert('Order placed successfully! (Confirmation delivery pending)');
    }
    
    // 5. Redirect to order confirmation page
    router.push(`/orders/${order.id}`);
    
  } catch (error) {
    console.error('Order submission error:', error);
    alert('Failed to place order. Please try again.');
  }
};
```

### Step 4: Display notification status (optional)

```typescript
<div className="notification-status">
  {notificationStatus.email.sent && (
    <p className="success">✅ Email confirmation sent</p>
  )}
  {notificationStatus.email.error && (
    <p className="warning">⚠️ Email: {notificationStatus.email.error}</p>
  )}
  
  {notificationStatus.sms.sent && (
    <p className="success">✅ SMS confirmation sent</p>
  )}
  {notificationStatus.sms.error && (
    <p className="warning">⚠️ SMS: {notificationStatus.sms.error}</p>
  )}
</div>
```

## Example 2: Table Booking Confirmation Integration

### Step 1: Import the notification service

```typescript
import { sendBookingConfirmation } from '@/lib/notifications';
import { format } from 'date-fns'; // for date formatting
```

### Step 2: Integrate in your booking submission handler

```typescript
const handleBookingSubmit = async (bookingData: any) => {
  try {
    // 1. Create booking in database (your existing code)
    const booking = await createBooking(bookingData);
    
    // 2. Format date and time
    const bookingDate = format(new Date(bookingData.date), 'dd MMMM yyyy');
    const bookingTime = format(new Date(bookingData.datetime), 'h:mm a');
    
    // 3. Send confirmations
    const confirmationResult = await sendBookingConfirmation({
      bookingId: booking.id,
      customerName: bookingData.name,
      customerEmail: bookingData.email,
      customerPhone: bookingData.phone,
      date: bookingDate,
      time: bookingTime,
      guests: bookingData.numberOfGuests,
      tableNumber: booking.assignedTable || undefined,
      specialRequests: bookingData.specialRequests
    });
    
    // 4. Show success message
    if (confirmationResult.email.success || confirmationResult.sms.success) {
      alert('Table booked successfully! Confirmation sent.');
    }
    
    // 5. Redirect to booking confirmation page
    router.push(`/bookings/${booking.id}`);
    
  } catch (error) {
    console.error('Booking error:', error);
    alert('Failed to book table. Please try again.');
  }
};
```

## Example 3: Handling Notification Errors Gracefully

```typescript
const sendNotificationsWithRetry = async (data: any, type: 'order' | 'booking') => {
  const maxRetries = 2;
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      const result = type === 'order' 
        ? await sendOrderConfirmation(data)
        : await sendBookingConfirmation(data);
      
      // If at least one notification succeeded, we're good
      if (result.email.success || result.sms.success) {
        return result;
      }
      
      // Both failed, retry
      attempt++;
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s before retry
      }
    } catch (error) {
      attempt++;
      if (attempt >= maxRetries) {
        console.error('All notification attempts failed:', error);
        return {
          email: { success: false, error: 'Max retries exceeded' },
          sms: { success: false, error: 'Max retries exceeded' }
        };
      }
    }
  }
};
```

## Example 4: Admin Notification Dashboard

Create a simple admin page to test notifications:

```typescript
// pages/admin/test-notifications.tsx
import { useState } from 'react';

export default function TestNotifications() {
  const [testEmail, setTestEmail] = useState('');
  const [testPhone, setTestPhone] = useState('');
  const [result, setResult] = useState<any>(null);
  
  const testOrderNotification = async () => {
    const result = await fetch('/api/notifications/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: testEmail,
        subject: 'Test Order Confirmation',
        html: '<h1>Test Order</h1><p>This is a test notification</p>'
      })
    });
    
    const data = await result.json();
    setResult(data);
  };
  
  const testSMSNotification = async () => {
    const result = await fetch('/api/notifications/sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: testPhone,
        message: 'Test SMS from RestoCafe!'
      })
    });
    
    const data = await result.json();
    setResult(data);
  };
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Notifications</h1>
      
      <div className="space-y-4">
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            className="border p-2 ml-2"
          />
          <button 
            onClick={testOrderNotification}
            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Test Email
          </button>
        </div>
        
        <div>
          <label>Phone:</label>
          <input 
            type="tel" 
            value={testPhone}
            onChange={(e) => setTestPhone(e.target.value)}
            className="border p-2 ml-2"
            placeholder="9876543210"
          />
          <button 
            onClick={testSMSNotification}
            className="ml-2 bg-green-500 text-white px-4 py-2 rounded"
          >
            Test SMS
          </button>
        </div>
      </div>
      
      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-bold">Result:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
```

## Example 5: React Hook for Notifications

Create a reusable hook:

```typescript
// hooks/useNotifications.ts
import { useState } from 'react';
import { sendOrderConfirmation, sendBookingConfirmation } from '@/lib/notifications';

export const useNotifications = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const sendOrder = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await sendOrderConfirmation(data);
      setLoading(false);
      return result;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };
  
  const sendBooking = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await sendBookingConfirmation(data);
      setLoading(false);
      return result;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };
  
  return { sendOrder, sendBooking, loading, error };
};

// Usage in component:
const { sendOrder, loading } = useNotifications();

const handleSubmit = async () => {
  const result = await sendOrder(orderData);
  // Handle result
};
```

## Testing Checklist

- [ ] Test email notifications with valid email
- [ ] Test SMS notifications with valid Indian phone number
- [ ] Test with invalid email format
- [ ] Test with invalid phone number
- [ ] Test order confirmation flow end-to-end
- [ ] Test booking confirmation flow end-to-end
- [ ] Verify HTML email rendering in different email clients
- [ ] Check SMS delivery status in Fast2SMS dashboard
- [ ] Test error handling when services are down
- [ ] Verify notifications work in production environment

## Common Phone Number Formats (All Supported)

```typescript
// All these formats work:
const validPhones = [
  '9876543210',
  '+919876543210',
  '+91 9876543210',
  '91 9876543210'
];
```

## Best Practices

1. **Always validate user input** before sending notifications
2. **Don't block user flow** - send notifications asynchronously
3. **Handle failures gracefully** - order/booking should succeed even if notification fails
4. **Log notification attempts** for debugging
5. **Respect user preferences** - allow users to opt-out of notifications
6. **Test in development** before deploying to production
7. **Monitor delivery rates** using Fast2SMS and Resend dashboards

---

**Ready to implement?** Follow the examples above and refer to [NOTIFICATION_SETUP.md](./NOTIFICATION_SETUP.md) for configuration details.