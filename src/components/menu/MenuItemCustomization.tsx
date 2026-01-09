'use client';

import { useState } from 'react';
import { MenuItem, MenuCustomization, CartItemCustomization } from '@/types/menu';
import { X, Plus, Minus } from 'lucide-react';

interface MenuItemCustomizationProps {
  menuItem: MenuItem;
  onAddToCart: (customizations: CartItemCustomization[], specialInstructions: string) => void;
  onClose: () => void;
}

export default function MenuItemCustomization({
  menuItem,
  onAddToCart,
  onClose,
}: MenuItemCustomizationProps) {
  const [selectedCustomizations, setSelectedCustomizations] = useState<
    CartItemCustomization[]
  >([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleCustomizationToggle = (customization: MenuCustomization) => {
    const exists = selectedCustomizations.find(
      c => c.customizationId === customization.id
    );

    if (exists) {
      setSelectedCustomizations(
        selectedCustomizations.filter(
          c => c.customizationId !== customization.id
        )
      );
    } else {
      setSelectedCustomizations([
        ...selectedCustomizations,
        {
          customizationId: customization.id,
          name: customization.name,
          price: customization.price,
        },
      ]);
    }
  };

  const calculateTotal = () => {
    const customizationTotal = selectedCustomizations.reduce(
      (sum, c) => sum + c.price,
      0
    );
    return (menuItem.price + customizationTotal) * quantity;
  };

  const groupedCustomizations = menuItem.availableCustomizations.reduce(
    (groups, custom) => {
      if (!groups[custom.category]) {
        groups[custom.category] = [];
      }
      groups[custom.category].push(custom);
      return groups;
    },
    {} as Record<string, MenuCustomization[]>
  );

  const categoryLabels = {
    add: 'Add Extras',
    remove: 'Remove Items',
    modify: 'Modifications',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">{menuItem.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Item Info */}
          <div className="mb-6">
            <p className="text-gray-600 mb-2">{menuItem.description}</p>
            <p className="text-2xl font-bold text-red-600">₹{menuItem.price}</p>
          </div>

          {/* Customizations */}
          {Object.entries(groupedCustomizations).map(([category, items]) => (
            <div key={category} className="mb-6">
              <h3 className="text-lg font-semibold mb-3">
                {categoryLabels[category as keyof typeof categoryLabels]}
              </h3>
              <div className="space-y-2">
                {items.map(customization => {
                  const isSelected = selectedCustomizations.some(
                    c => c.customizationId === customization.id
                  );

                  return (
                    <button
                      key={customization.id}
                      onClick={() => handleCustomizationToggle(customization)}
                      className={`w-full p-3 rounded-lg border-2 transition flex justify-between items-center ${
                        isSelected
                          ? 'border-red-600 bg-red-50'
                          : 'border-gray-200 hover:border-red-300'
                      }`}
                    >
                      <span className="font-medium">{customization.name}</span>
                      {customization.price > 0 && (
                        <span className="text-green-600 font-semibold">
                          +₹{customization.price}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Special Instructions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Special Instructions</h3>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Any special requests? (e.g., less salt, well done)"
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-red-600 focus:outline-none"
              rows={3}
            />
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Quantity</h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="text-2xl font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t p-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-2xl font-bold text-red-600">
              ₹{calculateTotal()}
            </span>
          </div>
          <button
            onClick={() => onAddToCart(selectedCustomizations, specialInstructions)}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}