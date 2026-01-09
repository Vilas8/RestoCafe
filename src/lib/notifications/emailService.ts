import { EmailNotification } from '@/types/notification';

/**
 * Email Service for sending transactional and marketing emails
 * Uses API route to send emails via service like SendGrid, Resend, or Nodemailer
 */

class EmailService {
  /**
   * Send order confirmation email
   */
  async sendOrderConfirmation(
    email: string,
    orderDetails: any
  ): Promise<boolean> {
    const emailData: EmailNotification = {
      to: email,
      subject: `Order Confirmation #${orderDetails.orderId}`,
      html: this.getOrderConfirmationTemplate(orderDetails),
      text: `Your order #${orderDetails.orderId} has been confirmed!`,
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
    const statusMessages = {
      preparing: 'Your order is being prepared',
      ready: 'Your order is ready for pickup/delivery',
      delivered: 'Your order has been delivered',
    };

    const emailData: EmailNotification = {
      to: email,
      subject: `Order Update #${orderId}`,
      html: this.getOrderStatusTemplate(orderId, statusMessages[status as keyof typeof statusMessages]),
      text: `Order #${orderId}: ${statusMessages[status as keyof typeof statusMessages]}`,
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
      subject,
      html: this.getPromotionalTemplate(subject, content),
      text: content,
    };

    return await this.sendEmail(emailData);
  }

  /**
   * Send newsletter
   */
  async sendNewsletter(
    subscribers: string[],
    subject: string,
    content: string
  ): Promise<{ sent: number; failed: number }> {
    const results = await Promise.allSettled(
      subscribers.map(email =>
        this.sendPromotionalEmail(email, subject, content)
      )
    );

    const sent = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return { sent, failed };
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

  /**
   * Order confirmation email template
   */
  private getOrderConfirmationTemplate(orderDetails: any): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ff6b6b; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .order-item { border-bottom: 1px solid #ddd; padding: 10px 0; }
            .total { font-size: 18px; font-weight: bold; margin-top: 20px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>RestoCafe Order Confirmation</h1>
            </div>
            <div class="content">
              <h2>Thank you for your order!</h2>
              <p>Order ID: <strong>#${orderDetails.orderId}</strong></p>
              <p>Order Date: ${new Date().toLocaleDateString()}</p>
              
              <h3>Order Items:</h3>
              ${orderDetails.items.map((item: any) => `
                <div class="order-item">
                  <p><strong>${item.name}</strong> x ${item.quantity}</p>
                  <p>₹${item.price}</p>
                </div>
              `).join('')}
              
              <div class="total">
                <p>Total: ₹${orderDetails.total}</p>
              </div>
              
              <p>Estimated delivery time: ${orderDetails.estimatedTime}</p>
            </div>
            <div class="footer">
              <p>RestoCafe | contact@restocafe.com</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Order status update template
   */
  private getOrderStatusTemplate(orderId: string, message: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4ecdc4; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .status { font-size: 24px; font-weight: bold; color: #4ecdc4; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Order Update</h1>
            </div>
            <div class="content">
              <p>Order ID: <strong>#${orderId}</strong></p>
              <div class="status">${message}</div>
              <p>Thank you for choosing RestoCafe!</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Promotional email template
   */
  private getPromotionalTemplate(subject: string, content: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ff6b6b; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .cta { background: #ff6b6b; color: white; padding: 15px 30px; text-decoration: none; display: inline-block; margin: 20px 0; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${subject}</h1>
            </div>
            <div class="content">
              ${content}
              <a href="https://restocafe.com" class="cta">Order Now</a>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}

export const emailService = new EmailService();