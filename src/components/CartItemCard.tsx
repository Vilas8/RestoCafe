'use client';

import { CartItem } from '@/types';
import { Trash2, Plus, Minus } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface Props {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export default function CartItemCard({ item, onUpdateQuantity, onRemove }: Props) {
  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      {/* Image */}
      <img
        src={item.image}
        alt={item.name}
        className="w-24 h-24 object-cover rounded-lg"
      />

      {/* Details */}
      <div className="flex-1">
        <h3 className="font-bold text-secondary mb-1">{item.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{formatPrice(item.price)}</p>

        {/* Quantity Control */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onUpdateQuantity(item.quantity - 1)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <Minus size={18} className="text-gray-600" />
          </button>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => onUpdateQuantity(parseInt(e.target.value) || 0)}
            className="w-12 text-center border border-gray-300 rounded py-1"
            min="0"
          />
          <button
            onClick={() => onUpdateQuantity(item.quantity + 1)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <Plus size={18} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Price & Remove */}
      <div className="text-right flex flex-col justify-between">
        <div className="font-bold text-lg text-primary">
          {formatPrice(item.price * item.quantity)}
        </div>
        <button
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 transition-colors"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}
