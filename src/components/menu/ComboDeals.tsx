'use client';

import { useState } from 'react';
import { ComboDeal } from '@/types/menu';
import { ComboDealService } from '@/lib/menu/combos';
import { ShoppingCart, Clock } from 'lucide-react';
import Image from 'next/image';

interface ComboDealsProps {
  combos: ComboDeal[];
  onAddToCart: (combo: ComboDeal) => void;
}

export default function ComboDeals({ combos, onAddToCart }: ComboDealsProps) {
  const activeCombos = ComboDealService.getActiveCombos(combos);

  if (activeCombos.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Combo Deals</h2>
          <p className="text-gray-600 text-lg">
            Save more with our special meal combinations!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {activeCombos.map(combo => {
            const savings = ComboDealService.calculateSavings(combo);
            const discountPercentage =
              ComboDealService.getDiscountPercentage(combo);

            return (
              <div
                key={combo.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition group"
              >
                <div className="relative h-48">
                  <Image
                    src={combo.image}
                    alt={combo.name}
                    fill
                    className="object-cover group-hover:scale-110 transition duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full font-bold">
                    {discountPercentage}% OFF
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{combo.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {combo.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-gray-400 line-through">
                        ₹{combo.originalPrice}
                      </p>
                      <p className="text-2xl font-bold text-red-600">
                        ₹{combo.discountedPrice}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Save</p>
                      <p className="text-lg font-bold text-green-600">
                        ₹{savings}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onAddToCart(combo)}
                    className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}