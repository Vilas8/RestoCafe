'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Home, Sparkles } from 'lucide-react';
import { useEffect, useState, Suspense } from 'react';

function Confetti() {
  const confetti = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.3,
    duration: 2 + Math.random() * 1,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none">
      {confetti.map((conf) => (
        <motion.div
          key={conf.id}
          className="absolute w-2 h-2 rounded-full"
          initial={{
            left: `${conf.left}%`,
            top: -10,
            opacity: 1,
            backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA500', '#FF69B4'][Math.floor(Math.random() * 5)],
          }}
          animate={{
            top: '100vh',
            opacity: 0,
            rotate: Math.random() * 360,
          }}
          transition={{
            duration: conf.duration,
            delay: conf.delay,
            ease: 'easeIn',
          }}
        />
      ))}
    </div>
  );
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (orderId) {
      const orders = JSON.parse(localStorage.getItem('restocafe-orders') || '[]');
      const foundOrder = orders.find((o: any) => o.id === orderId);
      setOrder(foundOrder);
    }

    // Trigger confetti animation on page load
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [orderId]);

  return (
    <>
      <Confetti />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="text-center max-w-2xl w-full"
      >
        {/* Success Icon with Celebration Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
          className="relative mb-8"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mb-6"
          >
            <CheckCircle className="w-32 h-32 text-green-500 mx-auto drop-shadow-lg" />
          </motion.div>
          <motion.div
            animate={{ scale: [0, 1], opacity: [1, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Sparkles className="w-20 h-20 text-yellow-400" />
          </motion.div>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-6xl sm:text-7xl font-black text-secondary mb-4 leading-tight"
        >
          🎉 Order Confirmed!
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-2xl text-gray-600 mb-8 font-light"
        >
          Thank you for your order. We're preparing your delicious meal!
        </motion.p>

        {/* Order Details Card */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl p-8 mb-10 border-2 border-green-200"
          >
            {/* Order ID and Amount */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg"
              >
                <p className="text-gray-600 text-sm mb-2 font-semibold uppercase tracking-wide">Order ID</p>
                <p className="text-2xl font-black text-secondary font-mono">{order.id}</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg"
              >
                <p className="text-gray-600 text-sm mb-2 font-semibold uppercase tracking-wide">Total Amount</p>
                <p className="text-2xl font-black text-green-600 font-mono">₹{order.total.toFixed(2)}</p>
              </motion.div>
            </div>

            {/* Delivery Time */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg p-6 mb-6 flex items-center space-x-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                <Clock className="w-10 h-10 flex-shrink-0" />
              </motion.div>
              <div className="text-left">
                <p className="text-sm opacity-90 font-semibold">Estimated Delivery Time</p>
                <p className="font-black text-xl">30 minutes ⏱️</p>
              </div>
            </motion.div>

            {/* Delivery Details */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-left space-y-3 text-sm text-gray-700 bg-gray-100 p-5 rounded-lg"
            >
              <p className="flex items-start gap-2">
                <span className="text-lg">📍</span>
                <span>
                  <strong>Delivery Address:</strong> {order.address}, {order.city}
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-lg">📱</span>
                <span>
                  <strong>Contact:</strong> {order.phone}
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-lg">💳</span>
                <span>
                  <strong>Payment Method:</strong> {order.paymentMethod.toUpperCase()}
                </span>
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.08, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/menu"
              className="inline-block btn-primary text-lg px-10 py-4 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-full shadow-xl"
            >
              <Home size={24} />
              Back to Home
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.08, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/reservations"
              className="inline-block btn-outline text-lg px-10 py-4 border-2 border-secondary text-secondary hover:bg-secondary hover:text-white font-bold rounded-full shadow-xl transition-all"
            >
              📅 Book a Table
            </Link>
          </motion.div>
        </motion.div>

        {/* Email Confirmation Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-gray-500 text-base bg-blue-50 p-4 rounded-lg border border-blue-200"
        >
          📧 Check your email for order confirmation and real-time updates
        </motion.p>
      </motion.div>
    </>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 px-4 py-12">
      <Suspense fallback={<div className="text-center text-gray-600 text-lg">Loading order details...</div>}>
        <OrderSuccessContent />
      </Suspense>
    </div>
  );
}
