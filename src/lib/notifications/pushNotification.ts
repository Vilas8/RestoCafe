import { PushNotification } from '@/types/notification';

/**
 * Push Notification Service using Web Push API
 * Requires service worker setup and VAPID keys
 */

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

class PushNotificationService {
  private registration: ServiceWorkerRegistration | null = null;

  /**
   * Initialize push notification service
   */
  async initialize(): Promise<boolean> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.error('Push notifications not supported');
      return false;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered');
      return true;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return false;
    }
  }

  /**
   * Request permission for push notifications
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('Notifications not supported');
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  /**
   * Subscribe user to push notifications
   */
  async subscribe(): Promise<PushSubscription | null> {
    if (!this.registration) {
      await this.initialize();
    }

    if (!this.registration) {
      throw new Error('Service Worker not registered');
    }

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(VAPID_PUBLIC_KEY!) as BufferSource,
      });

      // Send subscription to backend
      await this.sendSubscriptionToBackend(subscription);
      return subscription;
    } catch (error) {
      console.error('Push subscription failed:', error);
      return null;
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribe(): Promise<boolean> {
    if (!this.registration) {
      return false;
    }

    const subscription = await this.registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
      // Notify backend
      await this.removeSubscriptionFromBackend(subscription);
      return true;
    }
    return false;
  }

  /**
   * Send local notification (for testing)
   */
  async sendLocalNotification(notification: PushNotification): Promise<void> {
    if (!this.registration) {
      await this.initialize();
    }

    if (!this.registration) {
      throw new Error('Service Worker not registered');
    }

    await this.registration.showNotification(notification.title, {
      body: notification.body,
      icon: notification.icon || '/icon-192.png',
      badge: notification.badge || '/badge-72.png',
      data: notification.data,
      actions: notification.actions,
    });
  }

  /**
   * Send subscription to backend
   */
  private async sendSubscriptionToBackend(
    subscription: PushSubscription
  ): Promise<void> {
    await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });
  }

  /**
   * Remove subscription from backend
   */
  private async removeSubscriptionFromBackend(
    subscription: PushSubscription
  ): Promise<void> {
    await fetch('/api/notifications/unsubscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });
  }

  /**
   * Convert VAPID key to Uint8Array
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

export const pushNotificationService = new PushNotificationService();