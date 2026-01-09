'use client';

import { useState } from 'react';
import { NotificationPreferences } from '@/types/notification';
import { pushNotificationService } from '@/lib/notifications/pushNotification';
import { Bell, Mail, MessageSquare, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface NotificationSettingsProps {
  userId: string;
  initialPreferences: NotificationPreferences;
  onSave: (preferences: NotificationPreferences) => Promise<void>;
}

export default function NotificationSettings({
  userId,
  initialPreferences,
  onSave,
}: NotificationSettingsProps) {
  const [preferences, setPreferences] =
    useState<NotificationPreferences>(initialPreferences);
  const [saving, setSaving] = useState(false);

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleEnablePush = async () => {
    try {
      const permission = await pushNotificationService.requestPermission();
      
      if (permission === 'granted') {
        await pushNotificationService.subscribe();
        setPreferences(prev => ({ ...prev, pushEnabled: true }));
        toast.success('Push notifications enabled!');
      } else {
        toast.error('Push notification permission denied');
      }
    } catch (error) {
      console.error('Failed to enable push notifications:', error);
      toast.error('Failed to enable push notifications');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(preferences);
      toast.success('Notification preferences saved!');
    } catch (error) {
      console.error('Failed to save preferences:', error);
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-bold mb-6">Notification Preferences</h2>

      {/* Push Notifications */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Bell className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-semibold">Push Notifications</h3>
        </div>
        <div className="space-y-3 ml-9">
          {!preferences.pushEnabled ? (
            <button
              onClick={handleEnablePush}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Enable Push Notifications
            </button>
          ) : (
            <div className="flex items-center space-x-2 text-green-600">
              <Check className="w-5 h-5" />
              <span>Push notifications enabled</span>
            </div>
          )}
        </div>
      </div>

      {/* Email Notifications */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Mail className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-semibold">Email Notifications</h3>
        </div>
        <div className="space-y-3 ml-9">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.emailEnabled}
              onChange={() => handleToggle('emailEnabled')}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span>Enable email notifications</span>
          </label>
        </div>
      </div>

      {/* SMS Notifications */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <MessageSquare className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-semibold">SMS Notifications</h3>
        </div>
        <div className="space-y-3 ml-9">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.smsEnabled}
              onChange={() => handleToggle('smsEnabled')}
              className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
            />
            <span>Enable SMS notifications</span>
          </label>
        </div>
      </div>

      {/* Notification Types */}
      <div className="border-t pt-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Notification Types</h3>
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.orderUpdates}
              onChange={() => handleToggle('orderUpdates')}
              className="w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500"
            />
            <div>
              <p className="font-medium">Order Updates</p>
              <p className="text-sm text-gray-600">
                Get notified about your order status
              </p>
            </div>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.specialOffers}
              onChange={() => handleToggle('specialOffers')}
              className="w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500"
            />
            <div>
              <p className="font-medium">Special Offers</p>
              <p className="text-sm text-gray-600">
                Receive notifications about deals and discounts
              </p>
            </div>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.marketingEmails}
              onChange={() => handleToggle('marketingEmails')}
              className="w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500"
            />
            <div>
              <p className="font-medium">Marketing Emails</p>
              <p className="text-sm text-gray-600">
                Get newsletters and promotional content
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? 'Saving...' : 'Save Preferences'}
      </button>
    </div>
  );
}