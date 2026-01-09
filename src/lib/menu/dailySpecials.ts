import { DailySpecial, MenuItem } from '@/types/menu';

/**
 * Daily Specials Management
 */

export class DailySpecialService {
  /**
   * Get today's specials
   */
  static getTodaySpecials(specials: DailySpecial[]): DailySpecial[] {
    const today = new Date().getDay(); // 0-6 (Sunday-Saturday)
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    return specials.filter(special => {
      if (!special.isActive || special.dayOfWeek !== today) {
        return false;
      }

      const [startHour, startMin] = special.startTime.split(':').map(Number);
      const [endHour, endMin] = special.endTime.split(':').map(Number);

      const startTime = startHour * 60 + startMin;
      const endTime = endHour * 60 + endMin;

      return currentTime >= startTime && currentTime <= endTime;
    });
  }

  /**
   * Get specials for specific day
   */
  static getSpecialsForDay(
    specials: DailySpecial[],
    dayOfWeek: number
  ): DailySpecial[] {
    return specials.filter(
      special => special.isActive && special.dayOfWeek === dayOfWeek
    );
  }

  /**
   * Apply special discount to menu item
   */
  static applySpecialDiscount(
    menuItem: MenuItem,
    special: DailySpecial
  ): number {
    const discount = (menuItem.price * special.discountPercentage) / 100;
    return menuItem.price - discount;
  }

  /**
   * Get day name
   */
  static getDayName(dayOfWeek: number): string {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return days[dayOfWeek];
  }

  /**
   * Check if special is currently active
   */
  static isSpecialActive(special: DailySpecial): boolean {
    const today = new Date().getDay();
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    if (!special.isActive || special.dayOfWeek !== today) {
      return false;
    }

    const [startHour, startMin] = special.startTime.split(':').map(Number);
    const [endHour, endMin] = special.endTime.split(':').map(Number);

    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    return currentTime >= startTime && currentTime <= endTime;
  }
}

/**
 * Sample daily specials
 */
export const sampleDailySpecials: DailySpecial[] = [
  {
    id: 'special-1',
    menuItemId: 'pizza-margherita',
    dayOfWeek: 1, // Monday
    discountPercentage: 20,
    description: 'Monday Pizza Special - 20% off all pizzas!',
    startTime: '11:00',
    endTime: '23:00',
    isActive: true,
  },
  {
    id: 'special-2',
    menuItemId: 'burger-classic',
    dayOfWeek: 2, // Tuesday
    discountPercentage: 25,
    description: 'Tasty Tuesday - 25% off all burgers!',
    startTime: '12:00',
    endTime: '22:00',
    isActive: true,
  },
  {
    id: 'special-3',
    menuItemId: 'pasta-alfredo',
    dayOfWeek: 3, // Wednesday
    discountPercentage: 15,
    description: 'Pasta Wednesday - 15% off all pasta dishes!',
    startTime: '12:00',
    endTime: '21:00',
    isActive: true,
  },
  {
    id: 'special-4',
    menuItemId: 'biryani-veg',
    dayOfWeek: 4, // Thursday
    discountPercentage: 30,
    description: 'Biryani Thursday - 30% off all biryanis!',
    startTime: '11:30',
    endTime: '22:30',
    isActive: true,
  },
  {
    id: 'special-5',
    menuItemId: 'sandwich-club',
    dayOfWeek: 5, // Friday
    discountPercentage: 20,
    description: 'Friday Sandwich Special - 20% off!',
    startTime: '10:00',
    endTime: '20:00',
    isActive: true,
  },
  {
    id: 'special-6',
    menuItemId: 'momos-veg',
    dayOfWeek: 6, // Saturday
    discountPercentage: 25,
    description: 'Saturday Momos Mania - 25% off!',
    startTime: '12:00',
    endTime: '23:00',
    isActive: true,
  },
  {
    id: 'special-7',
    menuItemId: 'thali-special',
    dayOfWeek: 0, // Sunday
    discountPercentage: 20,
    description: 'Sunday Family Thali - 20% off!',
    startTime: '12:00',
    endTime: '22:00',
    isActive: true,
  },
];