export type NotificationType = 'order_placed' | 'order_confirmed' | 'order_preparing' | 'order_ready' | 'order_delivered' | 'promotional' | 'newsletter' | 'special_offer';

export interface NotificationPreferences {
  userId: string;
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  marketingEmails: boolean;
  orderUpdates: boolean;
  specialOffers: boolean;
}

export interface PushNotification {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: Record<string, any>;
  actions?: {
    action: string;
    title: string;
  }[];
}

export interface EmailNotification {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export interface SMSNotification {
  to: string;
  message: string;
}

export interface NotificationLog {
  id: string;
  userId: string;
  type: NotificationType;
  channel: 'push' | 'email' | 'sms';
  status: 'pending' | 'sent' | 'failed';
  sentAt?: string;
  error?: string;
  metadata?: Record<string, any>;
}