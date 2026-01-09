import { SMSNotification } from '@/types/notification';

/**
 * SMS Service for sending order notifications
 * Uses API route to send SMS via service like Twilio, SNS, or other SMS providers
 */

class SMSService {
  /**
   * Format phone number to ensure it has space after country code
   * Converts +919876543210 to +91 9876543210
   */
  formatPhoneNumber(phoneNumber: string): string {
    // Remove all spaces first
    let cleaned = phoneNumber.replace(/\s+/g, '');
    
    // If starts with + and no space after country code, add it
    if (cleaned.startsWith('+')) {
      // Match country code (1-4 digits after +) and rest of number
      const match = cleaned.match(/^(\+\d{1,4})(\d+)$/);
      if (match) {
        return `${match[1]} ${match[2]}`;
      }
    }
    
    return cleaned;
  }

  /**
   * Send order confirmation SMS
   */
  async sendOrderConfirmation(
    phoneNumber: string,
    orderId: string,
    total: number
  ): Promise<boolean> {
    const message = `RestoCafe: Your order #${orderId} has been confirmed! Total: ₹${total}. Track your order at restocafe.com/orders/${orderId}`;

    return await this.sendSMS(phoneNumber, message);
  }

  /**
   * Send order status update SMS
   */
  async sendOrderStatusUpdate(
    phoneNumber: string,
    orderId: string,
    status: string
  ): Promise<boolean> {
    const statusMessages = {
      confirmed: 'Your order has been confirmed',
      preparing: 'Your order is being prepared',
      ready: 'Your order is ready for pickup',
      out_for_delivery: 'Your order is out for delivery',
      delivered: 'Your order has been delivered',
    };

    const message = `RestoCafe: Order #${orderId} - ${statusMessages[status as keyof typeof statusMessages]}. Track at restocafe.com/orders/${orderId}`;

    return await this.sendSMS(phoneNumber, message);
  }

  /**
   * Send promotional SMS
   */
  async sendPromotionalSMS(
    phoneNumber: string,
    message: string
  ): Promise<boolean> {
    const formattedMessage = `RestoCafe: ${message}. Reply STOP to unsubscribe.`;
    return await this.sendSMS(phoneNumber, formattedMessage);
  }

  /**
   * Send SMS via API route
   */
  private async sendSMS(phoneNumber: string, message: string): Promise<boolean> {
    try {
      // Format phone number before sending
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      
      const smsData: SMSNotification = {
        to: formattedPhone,
        message,
      };

      const response = await fetch('/api/notifications/sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(smsData),
      });

      return response.ok;
    } catch (error) {
      console.error('SMS sending failed:', error);
      return false;
    }
  }

  /**
   * Validate phone number format
   */
  validatePhoneNumber(phoneNumber: string): boolean {
    // Basic validation for international phone numbers
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    return phoneRegex.test(phoneNumber);
  }
}

export const smsService = new SMSService();