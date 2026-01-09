/**
 * Notification Service
 * Handles sending email and SMS confirmations for orders and table bookings
 */

export interface OrderConfirmationData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  orderType: 'delivery' | 'pickup';
  address?: string;
  estimatedTime?: string;
}

export interface BookingConfirmationData {
  bookingId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  guests: number;
  tableNumber?: string;
  specialRequests?: string;
}

/**
 * Send order confirmation via Email and SMS
 */
export async function sendOrderConfirmation(data: OrderConfirmationData) {
  const results = {
    email: { success: false, error: null as string | null },
    sms: { success: false, error: null as string | null },
  };

  // Prepare email content (spam-friendly version)
  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6; 
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }
          .container { 
            max-width: 600px; 
            margin: 20px auto; 
            background-color: #ffffff;
            border: 1px solid #e0e0e0;
          }
          .header { 
            background-color: #667eea;
            color: white; 
            padding: 30px 20px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }
          .content { 
            padding: 30px 20px;
          }
          .order-details { 
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 4px;
            margin: 20px 0;
            border: 1px solid #e0e0e0;
          }
          .detail-row {
            padding: 8px 0;
            border-bottom: 1px solid #e0e0e0;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .detail-label {
            font-weight: 600;
            color: #555;
          }
          .item { 
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e0e0e0;
          }
          .item:last-child {
            border-bottom: none;
          }
          .total { 
            font-size: 18px;
            font-weight: bold;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 2px solid #667eea;
            display: flex;
            justify-content: space-between;
          }
          .footer { 
            background-color: #f5f5f5;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 14px;
            border-top: 1px solid #e0e0e0;
          }
          .footer a {
            color: #667eea;
            text-decoration: none;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>RestoCafe</h1>
            <p style="margin: 10px 0 0 0;">Order Confirmation</p>
          </div>
          
          <div class="content">
            <h2 style="margin-top: 0;">Thank you, ${data.customerName}</h2>
            <p>Your order has been confirmed and is being prepared.</p>
            
            <div class="order-details">
              <div class="detail-row">
                <span class="detail-label">Order ID:</span> ${data.orderId}
              </div>
              <div class="detail-row">
                <span class="detail-label">Order Type:</span> ${data.orderType === 'delivery' ? 'Delivery' : 'Pickup'}
              </div>
              ${data.address ? `
                <div class="detail-row">
                  <span class="detail-label">Delivery Address:</span><br>${data.address}
                </div>
              ` : ''}
              ${data.estimatedTime ? `
                <div class="detail-row">
                  <span class="detail-label">Estimated Time:</span> ${data.estimatedTime}
                </div>
              ` : ''}
              
              <h3 style="margin-top: 20px; margin-bottom: 10px;">Order Items</h3>
              ${data.items.map(item => `
                <div class="item">
                  <span>${item.quantity}x ${item.name}</span>
                  <span>Rs. ${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              `).join('')}
              
              <div class="total">
                <span>Total Amount:</span>
                <span>Rs. ${data.total.toFixed(2)}</span>
              </div>
            </div>
            
            <p>We will notify you when your order is ready.</p>
          </div>
          
          <div class="footer">
            <p><strong>RestoCafe</strong></p>
            <p>123 Food Street, Bangalore, Karnataka 560001, India</p>
            <p>Phone: +91-1234567890 | Email: <a href="mailto:support@restocafe.com">support@restocafe.com</a></p>
            <p style="margin-top: 15px; font-size: 12px; color: #999;">
              You received this email because you placed an order with RestoCafe.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  // Plain text version (important for spam filters)
  const emailText = `RestoCafe - Order Confirmation

Thank you, ${data.customerName}!

Your order has been confirmed and is being prepared.

Order Details:
- Order ID: ${data.orderId}
- Order Type: ${data.orderType === 'delivery' ? 'Delivery' : 'Pickup'}
${data.address ? `- Delivery Address: ${data.address}` : ''}
${data.estimatedTime ? `- Estimated Time: ${data.estimatedTime}` : ''}

Order Items:
${data.items.map(item => `${item.quantity}x ${item.name} - Rs. ${(item.price * item.quantity).toFixed(2)}`).join('\n')}

Total Amount: Rs. ${data.total.toFixed(2)}

We will notify you when your order is ready.

---
RestoCafe
123 Food Street, Bangalore, Karnataka 560001, India
Phone: +91-1234567890
Email: support@restocafe.com`;

  // Prepare SMS content
  const smsMessage = `RestoCafe Order Confirmed!
Order ID: ${data.orderId}
Total: Rs.${data.total.toFixed(2)}
Type: ${data.orderType === 'delivery' ? 'Delivery' : 'Pickup'}
${data.estimatedTime ? `Est. Time: ${data.estimatedTime}` : ''}
Thank you for ordering!`;

  // Send Email
  try {
    const emailResponse = await fetch('/api/notifications/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: data.customerEmail,
        subject: `RestoCafe Order Confirmation ${data.orderId}`,
        html: emailHtml,
        text: emailText,
      }),
    });

    const emailResult = await emailResponse.json();
    results.email.success = emailResult.success;
    if (!emailResult.success) {
      results.email.error = emailResult.message;
    }
  } catch (error: any) {
    results.email.error = error.message;
  }

  // Send SMS
  try {
    const smsResponse = await fetch('/api/notifications/sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: data.customerPhone,
        message: smsMessage,
      }),
    });

    const smsResult = await smsResponse.json();
    results.sms.success = smsResult.success;
    if (!smsResult.success) {
      results.sms.error = smsResult.message;
    }
  } catch (error: any) {
    results.sms.error = error.message;
  }

  return results;
}

/**
 * Send table booking confirmation via Email and SMS
 */
export async function sendBookingConfirmation(data: BookingConfirmationData) {
  const results = {
    email: { success: false, error: null as string | null },
    sms: { success: false, error: null as string | null },
  };

  // Prepare email content (spam-friendly version)
  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6; 
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }
          .container { 
            max-width: 600px; 
            margin: 20px auto; 
            background-color: #ffffff;
            border: 1px solid #e0e0e0;
          }
          .header { 
            background-color: #667eea;
            color: white; 
            padding: 30px 20px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }
          .content { 
            padding: 30px 20px;
          }
          .booking-details { 
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 4px;
            margin: 20px 0;
            border: 1px solid #e0e0e0;
          }
          .detail-row { 
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #e0e0e0;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .detail-label {
            font-weight: 600;
            color: #555;
          }
          .footer { 
            background-color: #f5f5f5;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 14px;
            border-top: 1px solid #e0e0e0;
          }
          .footer a {
            color: #667eea;
            text-decoration: none;
          }
          .notice {
            background-color: #fff3cd;
            border: 1px solid #ffc107;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>RestoCafe</h1>
            <p style="margin: 10px 0 0 0;">Table Booking Confirmed</p>
          </div>
          
          <div class="content">
            <h2 style="margin-top: 0;">Hi ${data.customerName}</h2>
            <p>Your table has been successfully booked. We look forward to serving you.</p>
            
            <div class="booking-details">
              <h3 style="margin-top: 0;">Booking Details</h3>
              <div class="detail-row">
                <span class="detail-label">Booking ID:</span>
                <span>${data.bookingId}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span>${data.date}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Time:</span>
                <span>${data.time}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Number of Guests:</span>
                <span>${data.guests}</span>
              </div>
              ${data.tableNumber ? `
                <div class="detail-row">
                  <span class="detail-label">Table Number:</span>
                  <span>${data.tableNumber}</span>
                </div>
              ` : ''}
              ${data.specialRequests ? `
                <div class="detail-row">
                  <span class="detail-label">Special Requests:</span>
                  <span>${data.specialRequests}</span>
                </div>
              ` : ''}
            </div>
            
            <div class="notice">
              <strong>Please Note:</strong> Arrive 10 minutes before your booking time. 
              Your table will be held for 15 minutes after the booking time.
            </div>
          </div>
          
          <div class="footer">
            <p><strong>RestoCafe</strong></p>
            <p>123 Food Street, Bangalore, Karnataka 560001, India</p>
            <p>Phone: +91-1234567890 | Email: <a href="mailto:support@restocafe.com">support@restocafe.com</a></p>
            <p style="margin-top: 15px; font-size: 12px; color: #999;">
              You received this email because you booked a table at RestoCafe.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  // Plain text version
  const emailText = `RestoCafe - Table Booking Confirmed

Hi ${data.customerName},

Your table has been successfully booked. We look forward to serving you.

Booking Details:
- Booking ID: ${data.bookingId}
- Date: ${data.date}
- Time: ${data.time}
- Number of Guests: ${data.guests}
${data.tableNumber ? `- Table Number: ${data.tableNumber}` : ''}
${data.specialRequests ? `- Special Requests: ${data.specialRequests}` : ''}

Please Note: Arrive 10 minutes before your booking time. Your table will be held for 15 minutes after the booking time.

---
RestoCafe
123 Food Street, Bangalore, Karnataka 560001, India
Phone: +91-1234567890
Email: support@restocafe.com`;

  // Prepare SMS content
  const smsMessage = `RestoCafe - Table Booked!
Booking ID: ${data.bookingId}
Date: ${data.date}
Time: ${data.time}
Guests: ${data.guests}
${data.tableNumber ? `Table: ${data.tableNumber}\n` : ''}Please arrive 10 mins early. See you soon!`;

  // Send Email
  try {
    const emailResponse = await fetch('/api/notifications/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: data.customerEmail,
        subject: `RestoCafe Table Booking Confirmed ${data.bookingId}`,
        html: emailHtml,
        text: emailText,
      }),
    });

    const emailResult = await emailResponse.json();
    results.email.success = emailResult.success;
    if (!emailResult.success) {
      results.email.error = emailResult.message;
    }
  } catch (error: any) {
    results.email.error = error.message;
  }

  // Send SMS
  try {
    const smsResponse = await fetch('/api/notifications/sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: data.customerPhone,
        message: smsMessage,
      }),
    });

    const smsResult = await smsResponse.json();
    results.sms.success = smsResult.success;
    if (!smsResult.success) {
      results.sms.error = smsResult.message;
    }
  } catch (error: any) {
    results.sms.error = error.message;
  }

  return results;
}