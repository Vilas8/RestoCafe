'use client';

import { useState, useEffect } from 'react';
import { HappyHourPricing } from '@/types/menu';
import { HappyHourService } from '@/lib/menu/happyHour';
import { Clock, Sparkles } from 'lucide-react';

interface HappyHourBannerProps {
  pricings: HappyHourPricing[];
}

export default function HappyHourBanner({ pricings }: HappyHourBannerProps) {
  const [activeHappyHours, setActiveHappyHours] = useState<HappyHourPricing[]>([]);
  const [nextHappyHour, setNextHappyHour] = useState<{
    pricing: HappyHourPricing;
    time: { hours: number; minutes: number };
  } | null>(null);

  useEffect(() => {
    const updateHappyHours = () => {
      const active = HappyHourService.getActiveHappyHours(pricings);
      setActiveHappyHours(active);

      if (active.length === 0) {
        // Find next happy hour
        for (const pricing of pricings) {
          const time = HappyHourService.getTimeUntilNextHappyHour(pricing);
          if (time) {
            setNextHappyHour({ pricing, time });
            break;
          }
        }
      } else {
        setNextHappyHour(null);
      }
    };

    updateHappyHours();
    const interval = setInterval(updateHappyHours, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [pricings]);

  if (activeHappyHours.length === 0 && !nextHappyHour) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white py-4">
      <div className="container mx-auto px-4">
        {activeHappyHours.length > 0 ? (
          <div className="flex items-center justify-center space-x-4 animate-pulse">
            <Sparkles className="w-8 h-8" />
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-1">Happy Hour Active Now!</h3>
              {activeHappyHours.map(pricing => (
                <p key={pricing.id} className="text-lg">
                  {pricing.name} - {pricing.discountPercentage}% OFF{' '}
                  {pricing.applicableCategories.length > 0
                    ? `on ${pricing.applicableCategories.join(', ')}`
                    : 'on all items'}
                  {' '}until {pricing.endTime}
                </p>
              ))}
            </div>
            <Sparkles className="w-8 h-8" />
          </div>
        ) : nextHappyHour ? (
          <div className="flex items-center justify-center space-x-4">
            <Clock className="w-6 h-6" />
            <p className="text-lg">
              Next Happy Hour: <strong>{nextHappyHour.pricing.name}</strong> starts in{' '}
              {nextHappyHour.time.hours > 0 && `${nextHappyHour.time.hours}h `}
              {nextHappyHour.time.minutes}m
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}