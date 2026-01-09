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

  // Prepare email content
  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .total { font-size: 18px; font-weight: bold; margin-top: 15px; padding-top: 15px; border-top: 2px solid #667eea; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🍴 RestoCafe</h1>
            <p>Order Confirmed!</p>
          </div>
          <div class="content">
            <h2>Thank you, ${data.customerName}!</h2>
            <p>Your order has been confirmed and is being prepared.</p>
            
            <div class="order-details">
              <p><strong>Order ID:</strong> ${data.orderId}</p>
              <p><strong>Order Type:</strong> ${data.orderType === 'delivery' ? '🚚 Delivery' : '🍽️ Pickup'}</p>
              ${data.address ? `<p><strong>Delivery Address:</strong> ${data.address}</p>` : ''}
              ${data.estimatedTime ? `<p><strong>Estimated Time:</strong> ${data.estimatedTime}</p>` : ''}
              
              <h3>Order Items:</h3>
              ${data.items.map(item => `
                <div class="item">
                  <span>${item.quantity}x ${item.name}</span>
                  <span>₹${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              `).join('')}
              
              <div class="total">
                <div style="display: flex; justify-content: space-between;">
                  <span>Total Amount:</span>
                  <span>₹${data.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <p>We'll notify you when your order is ready!</p>
            
            <div class="footer">
              <p>RestoCafe - Delicious food, delivered with love 💜</p>
              <p>Need help? Contact us at support@restocafe.com</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

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
        subject: `🍴 Order Confirmed - ${data.orderId}`,
        html: emailHtml,
        text: `Order Confirmed!\n\nThank you ${data.customerName},\n\nYour order ${data.orderId} has been confirmed.\nTotal: Rs.${data.total.toFixed(2)}\n\nWe'll notify you when it's ready!`,
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

  // Prepare email content
  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🍽️ RestoCafe</h1>
            <p>Table Booking Confirmed!</p>
          </div>
          <div class="content">
            <h2>Hi ${data.customerName}!</h2>
            <p>Your table has been successfully booked. We're excited to serve you!</p>
            
            <div class="booking-details">
              <h3>Booking Details:</h3>
              <div class="detail-row">
                <span><strong>Booking ID:</strong></span>
                <span>${data.bookingId}</span>
              </div>
              <div class="detail-row">
                <span><strong>Date:</strong></span>
                <span>📅 ${data.date}</span>
              </div>
              <div class="detail-row">
                <span><strong>Time:</strong></span>
                <span>🕒 ${data.time}</span>
              </div>
              <div class="detail-row">
                <span><strong>Number of Guests:</strong></span>
                <span>👥 ${data.guests}</span>
              </div>
              ${data.tableNumber ? `
                <div class="detail-row">
                  <span><strong>Table Number:</strong></span>
                  <span>${data.tableNumber}</span>
                </div>
              ` : ''}
              ${data.specialRequests ? `
                <div class="detail-row">
                  <span><strong>Special Requests:</strong></span>
                  <span>${data.specialRequests}</span>
                </div>
              ` : ''}
            </div>
            
            <p><strong>Important:</strong> Please arrive 10 minutes before your booking time. Your table will be held for 15 minutes.</p>
            
            <div class="footer">
              <p>RestoCafe - Where every meal is a celebration 🎉</p>
              <p>Need to modify? Contact us at support@restocafe.com or call +91-1234567890</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

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
        subject: `🍽️ Table Booking Confirmed - ${data.bookingId}`,
        html: emailHtml,
        text: `Table Booking Confirmed!\n\nHi ${data.customerName},\n\nBooking ID: ${data.bookingId}\nDate: ${data.date}\nTime: ${data.time}\nGuests: ${data.guests}\n\nPlease arrive 10 minutes early. See you soon!`,
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