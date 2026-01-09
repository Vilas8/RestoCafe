'use client';

import { useState, useEffect } from 'react';
import { DailySpecial, MenuItem } from '@/types/menu';
import { DailySpecialService } from '@/lib/menu/dailySpecials';
import { Clock, Calendar, Percent } from 'lucide-react';
import Image from 'next/image';

interface DailySpecialsProps {
  specials: DailySpecial[];
  menuItems: MenuItem[];
  onAddToCart: (menuItem: MenuItem, discountedPrice: number) => void;
}

export default function DailySpecials({
  specials,
  menuItems,
  onAddToCart,
}: DailySpecialsProps) {
  const [todaySpecials, setTodaySpecials] = useState<DailySpecial[]>([]);

  useEffect(() => {
    const updateSpecials = () => {
      const active = DailySpecialService.getTodaySpecials(specials);
      setTodaySpecials(active);
    };

    updateSpecials();
    const interval = setInterval(updateSpecials, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [specials]);

  if (todaySpecials.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Calendar className="w-8 h-8 text-orange-600" />
            <h2 className="text-4xl font-bold">Today's Specials</h2>
          </div>
          <p className="text-gray-600 text-lg">
            {DailySpecialService.getDayName(new Date().getDay())} Special Offers - Limited Time!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {todaySpecials.map(special => {
            const menuItem = menuItems.find(item => item.id === special.menuItemId);
            if (!menuItem) return null;

            const discountedPrice = DailySpecialService.applySpecialDiscount(
              menuItem,
              special
            );

            return (
              <div
                key={special.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition group"
              >
                <div className="relative h-56">
                  <Image
                    src={menuItem.image}
                    alt={menuItem.name}
                    fill
                    className="object-cover group-hover:scale-110 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-4 left-4 bg-orange-600 text-white px-4 py-2 rounded-full font-bold flex items-center space-x-2">
                    <Percent className="w-4 h-4" />
                    <span>{special.discountPercentage}% OFF</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white text-2xl font-bold">
                      {menuItem.name}
                    </h3>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 mb-4">{special.description}</p>

                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                    <Clock className="w-4 h-4" />
                    <span>
                      Valid: {special.startTime} - {special.endTime}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-gray-400 line-through text-sm">
                        ₹{menuItem.price}
                      </p>
                      <p className="text-3xl font-bold text-orange-600">
                        ₹{discountedPrice.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">You Save</p>
                      <p className="text-xl font-bold text-green-600">
                        ₹{(menuItem.price - discountedPrice).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onAddToCart(menuItem, discountedPrice)}
                    className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition"
                  >
                    Order Now
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