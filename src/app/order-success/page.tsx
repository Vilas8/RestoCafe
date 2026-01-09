'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Home } from 'lucide-react';
import { useEffect, useState, Suspense } from 'react';

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
  }, [orderId]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="text-center max-w-2xl w-full"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="mb-6"
      >
        <CheckCircle className="w-24 h-24 text-green-500 mx-auto" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-5xl font-bold text-secondary mb-4"
      >
        Order Confirmed!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-xl text-gray-600 mb-8"
      >
        Thank you for your order. We're preparing your delicious meal!
      </motion.p>

      {order && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-8 mb-8"
        >
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-gray-600 text-sm mb-1">Order ID</p>
              <p className="text-2xl font-bold text-secondary">{order.id}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-primary">₹{order.total.toFixed(2)}</p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6 flex items-center space-x-4">
            <Clock className="w-8 h-8 text-blue-500 flex-shrink-0" />
            <div className="text-left">
              <p className="text-sm text-gray-600">Estimated Delivery Time</p>
              <p className="font-semibold text-secondary">30 minutes</p>
            </div>
          </div>

          <div className="text-left space-y-2 text-sm text-gray-600">
            <p><strong>Delivery Address:</strong> {order.address}, {order.city}</p>
            <p><strong>Contact:</strong> {order.phone}</p>
            <p><strong>Payment Method:</strong> {order.paymentMethod.toUpperCase()}</p>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Link
          href="/menu"
          className="btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2"
        >
          <Home size={20} />
          Back to Home
        </Link>
        <Link
          href="/reservations"
          className="btn-outline text-lg px-8 py-4"
        >
          Book a Table
        </Link>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-gray-500 text-sm mt-8"
      >
        Check your email for order confirmation and updates
      </motion.p>
    </motion.div>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4">
      <Suspense fallback={<div className="text-center text-gray-600">Loading order details...</div>}>
        <OrderSuccessContent />
      </Suspense>
    </div>
  );
}
