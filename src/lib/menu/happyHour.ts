import { HappyHourPricing, MenuItem } from '@/types/menu';

/**
 * Happy Hour Pricing Management
 */

export class HappyHourService {
  /**
   * Check if currently in happy hour
   */
  static isHappyHour(pricing: HappyHourPricing): boolean {
    if (!pricing.isActive) return false;

    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    // Check if current day is in applicable days
    if (!pricing.daysOfWeek.includes(currentDay)) {
      return false;
    }

    // Parse time strings
    const [startHour, startMin] = pricing.startTime.split(':').map(Number);
    const [endHour, endMin] = pricing.endTime.split(':').map(Number);

    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    return currentTime >= startTime && currentTime <= endTime;
  }

  /**
   * Get all active happy hour pricings
   */
  static getActiveHappyHours(
    pricings: HappyHourPricing[]
  ): HappyHourPricing[] {
    return pricings.filter(pricing => this.isHappyHour(pricing));
  }

  /**
   * Apply happy hour discount to menu item
   */
  static applyHappyHourDiscount(
    menuItem: MenuItem,
    pricing: HappyHourPricing
  ): number | null {
    // Check if item category is applicable
    if (
      pricing.applicableCategories.length > 0 &&
      !pricing.applicableCategories.includes(menuItem.category)
    ) {
      return null;
    }

    const discount = (menuItem.price * pricing.discountPercentage) / 100;
    return menuItem.price - discount;
  }

  /**
   * Get best applicable discount for item
   */
  static getBestDiscount(
    menuItem: MenuItem,
    pricings: HappyHourPricing[]
  ): { price: number; discount: number; name: string } | null {
    const activeHappyHours = this.getActiveHappyHours(pricings);

    let bestDiscount: {
      price: number;
      discount: number;
      name: string;
    } | null = null;

    for (const pricing of activeHappyHours) {
      const discountedPrice = this.applyHappyHourDiscount(menuItem, pricing);

      if (discountedPrice !== null) {
        const discount = menuItem.price - discountedPrice;

        if (!bestDiscount || discount > bestDiscount.discount) {
          bestDiscount = {
            price: discountedPrice,
            discount,
            name: pricing.name,
          };
        }
      }
    }

    return bestDiscount;
  }

  /**
   * Format time range for display
   */
  static formatTimeRange(pricing: HappyHourPricing): string {
    return `${pricing.startTime} - ${pricing.endTime}`;
  }

  /**
   * Get time until next happy hour
   */
  static getTimeUntilNextHappyHour(
    pricing: HappyHourPricing
  ): { hours: number; minutes: number } | null {
    if (!pricing.isActive) return null;

    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const [startHour, startMin] = pricing.startTime.split(':').map(Number);
    const startTime = startHour * 60 + startMin;

    if (pricing.daysOfWeek.includes(currentDay)) {
      if (currentTime < startTime) {
        const diff = startTime - currentTime;
        return {
          hours: Math.floor(diff / 60),
          minutes: diff % 60,
        };
      }
    }

    // Find next applicable day
    for (let i = 1; i <= 7; i++) {
      const nextDay = (currentDay + i) % 7;
      if (pricing.daysOfWeek.includes(nextDay)) {
        const daysUntil = i;
        const minutesUntilMidnight = 24 * 60 - currentTime;
        const minutesFromMidnight = startTime;
        const totalMinutes =
          minutesUntilMidnight + (daysUntil - 1) * 24 * 60 + minutesFromMidnight;

        return {
          hours: Math.floor(totalMinutes / 60),
          minutes: totalMinutes % 60,
        };
      }
    }

    return null;
  }
}

/**
 * Sample happy hour pricings
 */
export const sampleHappyHours: HappyHourPricing[] = [
  {
    id: 'hh-1',
    name: 'Evening Happy Hour',
    discountPercentage: 30,
    startTime: '17:00',
    endTime: '19:00',
    daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
    applicableCategories: ['beverages', 'appetizers'],
    isActive: true,
  },
  {
    id: 'hh-2',
    name: 'Weekend Brunch Special',
    discountPercentage: 25,
    startTime: '11:00',
    endTime: '14:00',
    daysOfWeek: [0, 6], // Saturday and Sunday
    applicableCategories: ['breakfast', 'beverages'],
    isActive: true,
  },
  {
    id: 'hh-3',
    name: 'Late Night Deals',
    discountPercentage: 20,
    startTime: '21:00',
    endTime: '23:00',
    daysOfWeek: [5, 6], // Friday and Saturday
    applicableCategories: [], // All categories
    isActive: true,
  },
];