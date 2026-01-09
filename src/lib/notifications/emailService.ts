import { EmailNotification } from '@/types/notification';

/**
 * Email Service for sending order and promotional notifications
 * Uses API route to send emails via service like Resend, SendGrid, or other providers
 */

class EmailService {
  /**
   * Send order confirmation email
   */
  async sendOrderConfirmation(
    email: string,
    orderDetails: {
      orderId: string;
      items: Array<{ name: string; quantity: number; price: number }>;
      total: number;
      estimatedTime: string;
    }
  ): Promise<boolean> {
    const emailData: EmailNotification = {
      to: email,
      subject: `Order Confirmation #${orderDetails.orderId} - Vilas's RestoCafe`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Order Confirmed!</h1>
          <p>Thank you for your order from Vilas's RestoCafe.</p>
          <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
          <p><strong>Total:</strong> ₹${orderDetails.total}</p>
          <p><strong>Estimated Time:</strong> ${orderDetails.estimatedTime}</p>
          <h3>Order Items:</h3>
          <ul>
            ${orderDetails.items.map(item => `<li>${item.name} x${item.quantity} - ₹${item.price * item.quantity}</li>`).join('')}
          </ul>
        </div>
      `,
      text: `Order Confirmation #${orderDetails.orderId}\n\nThank you for your order from Vilas's RestoCafe!\nTotal: ₹${orderDetails.total}\nEstimated Time: ${orderDetails.estimatedTime}`,
    };

    return await this.sendEmail(emailData);
  }

  /**
   * Send order status update email
   */
  async sendOrderStatusUpdate(
    email: string,
    orderId: string,
    status: string
  ): Promise<boolean> {
    const emailData: EmailNotification = {
      to: email,
      subject: `Order ${orderId} Status Update - Vilas's RestoCafe`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Order Status Update</h1>
          <p>Your order #${orderId} status has been updated to: <strong>${status}</strong></p>
        </div>
      `,
      text: `Order Status Update\n\nYour order #${orderId} status: ${status}`,
    };

    return await this.sendEmail(emailData);
  }

  /**
   * Send promotional email
   */
  async sendPromotionalEmail(
    email: string,
    subject: string,
    content: string
  ): Promise<boolean> {
    const emailData: EmailNotification = {
      to: email,
      subject: `${subject} - Vilas's RestoCafe`,
      html: content,
      text: content.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    };

    return await this.sendEmail(emailData);
  }

  /**
   * Send email via API route
   */
  private async sendEmail(emailData: EmailNotification): Promise<boolean> {
    try {
      const response = await fetch('/api/notifications/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      return response.ok;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();