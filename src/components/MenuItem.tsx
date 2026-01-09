'use client';

import { MenuItem as MenuItemType } from '@/types';
import { Heart, Flame } from 'lucide-react';
import { useState } from 'react';
import { formatPrice, getSpicyLevel } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import toast from 'react-hot-toast';

interface Props {
  item: MenuItemType;
}

export default function MenuItem({ item }: Props) {
  const [isFavorite, setIsFavorite] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({ ...item, quantity: 1 });
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <div className="card-shadow rounded-lg overflow-hidden bg-white transition-transform duration-300 hover:scale-105">
      {/* Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        {item.popular && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Popular
          </div>
        )}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 left-3 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
        >
          <Heart
            size={18}
            className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-secondary mb-2">{item.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

        {/* Badges */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {item.vegetarian && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">
              Vegetarian
            </span>
          )}
          {item.spicy > 0 && (
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded font-semibold flex items-center gap-1">
              <Flame size={12} />
              {getSpicyLevel(item.spicy)}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-primary">{formatPrice(item.price)}</span>
          <button
            onClick={handleAddToCart}
            className="btn-primary text-sm py-2 px-4"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
