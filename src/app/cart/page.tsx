'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import CartItemCard from '@/components/CartItemCard';
import { ShoppingCart, Truck, Tag } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
  },
};

export default function CartPage() {
  const { cart, updateQuantity, removeItem, total, clearCart } = useCart();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="text-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mb-6"
          >
            <ShoppingCart className="w-32 h-32 text-gray-300 mx-auto" />
          </motion.div>
          <h1 className="text-5xl font-bold text-secondary mb-4">🛒 Your cart is empty</h1>
          <p className="text-gray-600 mb-8 text-lg font-medium">Start adding some delicious items to your order</p>
          <Link
            href="/menu"
            className="inline-block btn-primary text-lg px-10 py-4 bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300"
          >
            🍽️ Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  const taxAmount = total * 0.05;
  const finalTotal = total + taxAmount;

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold text-secondary mb-2">🛍️ Shopping Cart</h1>
          <p className="text-gray-600 text-lg">You have <span className="font-bold text-primary">{cart.length}</span> item(s) in your cart</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 space-y-4"
          >
            {cart.map((item) => (
              <motion.div key={item.id} variants={itemVariants} className="hover:shadow-lg transition-shadow duration-300">
                <CartItemCard
                  item={item}
                  onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
                  onRemove={() => removeItem(item.id)}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 h-fit sticky top-24 border border-gray-100">
              <h2 className="text-3xl font-bold text-secondary mb-8 flex items-center gap-2">
                📋 Order Summary
              </h2>

              {/* Price Breakdown */}
              <div className="space-y-5 mb-8">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Subtotal</span>
                  <span className="font-bold text-lg text-secondary">{formatPrice(total)}</span>
                </div>
                
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="flex items-center gap-2 text-gray-600 font-medium">
                    <Truck size={18} /> Delivery
                  </span>
                  <span className="font-bold text-green-600 text-lg">FREE</span>
                </div>

                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="flex items-center gap-2 text-gray-600 font-medium">
                    <Tag size={18} /> Taxes (5%)
                  </span>
                  <span className="font-bold text-secondary">{formatPrice(taxAmount)}</span>
                </div>

                {/* Total */}
                <div className="bg-gradient-to-r from-primary to-accent rounded-xl p-6 text-white mt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">Total Amount</span>
                    <span className="text-4xl font-black">{formatPrice(finalTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href="/checkout"
                    className="block w-full text-center btn-primary text-lg py-4 font-bold bg-gradient-to-r from-primary to-accent text-white rounded-xl hover:shadow-2xl transition-all duration-300"
                  >
                    ✓ Proceed to Checkout
                  </Link>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={clearCart}
                  className="w-full py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all duration-300"
                >
                  🗑️ Clear Cart
                </motion.button>

                <Link
                  href="/menu"
                  className="block text-center text-primary font-bold py-3 hover:text-orange-700 transition-colors duration-300"
                >
                  ← Continue Shopping
                </Link>
              </div>

              {/* Info Badge */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700 font-semibold">✓ Free delivery on all orders</p>
                <p className="text-sm text-blue-600 mt-1">Estimated delivery: 30 minutes</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
