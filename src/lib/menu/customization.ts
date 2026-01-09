import { CartItemCustomization, MenuItem, MenuCustomization } from '@/types/menu';

/**
 * Menu Customization Utilities
 */

export class MenuCustomizationService {
  /**
   * Calculate total price with customizations
   */
  static calculateItemPrice(
    menuItem: MenuItem,
    customizations: CartItemCustomization[],
    quantity: number = 1
  ): number {
    const basePrice = menuItem.price;
    const customizationTotal = customizations.reduce(
      (sum, custom) => sum + custom.price,
      0
    );
    return (basePrice + customizationTotal) * quantity;
  }

  /**
   * Validate customizations
   */
  static validateCustomizations(
    menuItem: MenuItem,
    customizations: CartItemCustomization[]
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    customizations.forEach(custom => {
      const available = menuItem.availableCustomizations.find(
        c => c.id === custom.customizationId
      );

      if (!available) {
        errors.push(`Customization "${custom.name}" is not available for this item`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Format customizations for display
   */
  static formatCustomizations(customizations: CartItemCustomization[]): string {
    if (customizations.length === 0) return 'No customizations';

    return customizations
      .map(c => `${c.name} (+₹${c.price})`)
      .join(', ');
  }

  /**
   * Group customizations by category
   */
  static groupCustomizationsByCategory(
    customizations: MenuCustomization[]
  ): Record<string, MenuCustomization[]> {
    return customizations.reduce((groups, custom) => {
      const category = custom.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(custom);
      return groups;
    }, {} as Record<string, MenuCustomization[]>);
  }
}

/**
 * Sample customization data
 */
export const sampleCustomizations: MenuCustomization[] = [
  // Add-ons
  { id: 'extra-cheese', name: 'Extra Cheese', price: 30, category: 'add' },
  { id: 'extra-sauce', name: 'Extra Sauce', price: 20, category: 'add' },
  { id: 'extra-paneer', name: 'Extra Paneer', price: 50, category: 'add' },
  { id: 'extra-mushroom', name: 'Extra Mushroom', price: 40, category: 'add' },
  { id: 'extra-olives', name: 'Extra Olives', price: 35, category: 'add' },
  
  // Remove items
  { id: 'no-onions', name: 'No Onions', price: 0, category: 'remove' },
  { id: 'no-garlic', name: 'No Garlic', price: 0, category: 'remove' },
  { id: 'no-tomatoes', name: 'No Tomatoes', price: 0, category: 'remove' },
  { id: 'no-capsicum', name: 'No Capsicum', price: 0, category: 'remove' },
  
  // Modifications
  { id: 'less-spicy', name: 'Less Spicy', price: 0, category: 'modify' },
  { id: 'extra-spicy', name: 'Extra Spicy', price: 10, category: 'modify' },
  { id: 'well-done', name: 'Well Done', price: 0, category: 'modify' },
  { id: 'less-oil', name: 'Less Oil', price: 0, category: 'modify' },
];