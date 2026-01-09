export interface MenuCustomization {
  id: string;
  name: string;
  price: number;
  category: 'add' | 'remove' | 'modify';
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  availableCustomizations: MenuCustomization[];
  isAvailable: boolean;
  preparationTime: number;
}

export interface CartItemCustomization {
  customizationId: string;
  name: string;
  price: number;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  customizations: CartItemCustomization[];
  totalPrice: number;
  specialInstructions?: string;
}

export interface ComboDeal {
  id: string;
  name: string;
  description: string;
  items: string[]; // Menu item IDs
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  image: string;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
}

export interface DailySpecial {
  id: string;
  menuItemId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  discountPercentage: number;
  description: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface HappyHourPricing {
  id: string;
  name: string;
  discountPercentage: number;
  startTime: string;
  endTime: string;
  daysOfWeek: number[]; // 0-6
  applicableCategories: string[];
  isActive: boolean;
}