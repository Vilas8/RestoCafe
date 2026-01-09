import { ComboDeal, MenuItem } from '@/types/menu';

/**
 * Combo Deals Management
 */

export class ComboDealService {
  /**
   * Calculate combo savings
   */
  static calculateSavings(combo: ComboDeal): number {
    return combo.originalPrice - combo.discountedPrice;
  }

  /**
   * Check if combo is currently valid
   */
  static isComboValid(combo: ComboDeal): boolean {
    if (!combo.isActive) return false;

    const now = new Date();
    const validFrom = new Date(combo.validFrom);
    const validUntil = new Date(combo.validUntil);

    return now >= validFrom && now <= validUntil;
  }

  /**
   * Get active combos
   */
  static getActiveCombos(combos: ComboDeal[]): ComboDeal[] {
    return combos.filter(combo => this.isComboValid(combo));
  }

  /**
   * Format combo items description
   */
  static formatComboItems(
    combo: ComboDeal,
    menuItems: MenuItem[]
  ): string {
    const items = combo.items
      .map(itemId => {
        const item = menuItems.find(mi => mi.id === itemId);
        return item?.name || 'Unknown Item';
      })
      .join(' + ');

    return items;
  }

  /**
   * Calculate combo discount percentage
   */
  static getDiscountPercentage(combo: ComboDeal): number {
    return Math.round((combo.discount / combo.originalPrice) * 100);
  }
}

/**
 * Sample combo deals
 */
export const sampleCombos: ComboDeal[] = [
  {
    id: 'combo-1',
    name: 'Family Feast',
    description: '2 Pizzas + Garlic Bread + 1.5L Coke',
    items: ['pizza-margherita', 'pizza-pepperoni', 'garlic-bread', 'coke-1.5l'],
    originalPrice: 899,
    discountedPrice: 699,
    discount: 200,
    image: '/combos/family-feast.jpg',
    validFrom: '2026-01-01',
    validUntil: '2026-12-31',
    isActive: true,
  },
  {
    id: 'combo-2',
    name: 'Burger Combo',
    description: 'Burger + Fries + Drink',
    items: ['burger-classic', 'french-fries', 'soft-drink'],
    originalPrice: 349,
    discountedPrice: 279,
    discount: 70,
    image: '/combos/burger-combo.jpg',
    validFrom: '2026-01-01',
    validUntil: '2026-12-31',
    isActive: true,
  },
  {
    id: 'combo-3',
    name: 'Breakfast Special',
    description: 'Sandwich + Coffee + Juice',
    items: ['veg-sandwich', 'cappuccino', 'orange-juice'],
    originalPrice: 299,
    discountedPrice: 229,
    discount: 70,
    image: '/combos/breakfast-special.jpg',
    validFrom: '2026-01-01',
    validUntil: '2026-12-31',
    isActive: true,
  },
  {
    id: 'combo-4',
    name: 'Pasta Paradise',
    description: '2 Pasta Dishes + Garlic Bread + Dessert',
    items: ['pasta-alfredo', 'pasta-arrabiata', 'garlic-bread', 'tiramisu'],
    originalPrice: 749,
    discountedPrice: 599,
    discount: 150,
    image: '/combos/pasta-paradise.jpg',
    validFrom: '2026-01-01',
    validUntil: '2026-12-31',
    isActive: true,
  },
];