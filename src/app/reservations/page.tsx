'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Calendar, Clock, Users, Mail, Phone, Sparkles, Check, X } from 'lucide-react';
import { RESTAURANT_INFO } from '@/lib/constants';

const reservationSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Phone must be 10 digits'),
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time'),
  guests: z.string().refine(
    (val) => {
      const num = parseInt(val);
      return num >= 1 && num <= 20;
    },
    'Number of guests must be between 1 and 20'
  ),
  specialRequests: z.string().optional(),
});

type ReservationForm = z.infer<typeof reservationSchema>;

function Confetti() {
  const confetti = Array.from({ length: 40 }).map((_, i) => ({
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
          className="absolute w-3 h-3 rounded-full"
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

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservationData: ReservationForm | null;
}

function ConfirmationModal({ isOpen, onClose, reservationData }: ConfirmationModalProps) {
  if (!isOpen || !reservationData) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white rounded-lg max-w-md w-full p-8 card-shadow text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.2 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Check className="w-10 h-10 text-green-600" />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-secondary mb-2"
        >
          Booking Confirmed! ✨
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-gray-600 mb-6"
        >
          Thank you for booking with us!
        </motion.p>

        {/* Booking Details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-50 rounded-lg p-6 mb-6 text-left space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Name:</span>
            <span className="font-semibold text-secondary">{reservationData.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-semibold text-secondary">{new Date(reservationData.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Time:</span>
            <span className="font-semibold text-secondary">{reservationData.time}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Guests:</span>
            <span className="font-semibold text-secondary">{reservationData.guests}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Email:</span>
            <span className="font-semibold text-secondary text-sm">{reservationData.email}</span>
          </div>
        </motion.div>

        {/* Confirmation Message */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="text-sm text-gray-600 mb-6"
        >
          A confirmation email has been sent to <span className="font-semibold">{reservationData.email}</span>
        </motion.p>

        {/* Close Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="w-full btn-primary py-3 bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all font-bold"
        >
          Great! Let's Go
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default function ReservationsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [lastReservation, setLastReservation] = useState<ReservationForm | null>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ReservationForm>({
    resolver: zodResolver(reservationSchema),
  });

  const onSubmit = async (data: ReservationForm) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Store reservation
      const reservation = {
        id: `RES-${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
        status: 'confirmed' as const,
      };

      const reservations = JSON.parse(
        localStorage.getItem('restocafe-reservations') || '[]'
      );
      reservations.push(reservation);
      localStorage.setItem('restocafe-reservations', JSON.stringify(reservations));

      setLastReservation(data);
      setShowConfirmation(true);
      setShowCelebration(true);
      toast.success('🎉 Reservation confirmed! We look forward to your visit.', {
        duration: 4,
        icon: '✨',
      });
      reset();

      // Hide celebration after animation
      setTimeout(() => setShowCelebration(false), 3000);
    } catch (error) {
      toast.error('Failed to process reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50 relative">
      {showCelebration && <Confetti />}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        reservationData={lastReservation}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-secondary mb-4">📅 Book a Table</h1>
          <p className="text-xl text-gray-600">
            Reserve your spot at {RESTAURANT_INFO.name} for a memorable dining experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg card-shadow p-8 hover:shadow-2xl transition-shadow"
          >
            <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-2">
              <Sparkles size={24} className="text-primary" />
              Reservation Details
            </h2>

            {/* Name */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Your Name *
              </label>
              <input
                {...register('name')}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-orange-200 transition-all"
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Email *
              </label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-orange-200 transition-all"
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Phone Number *
              </label>
              <input
                {...register('phone')}
                type="tel"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-orange-200 transition-all"
                placeholder="9876543210"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>

            {/* Date */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Preferred Date *
              </label>
              <input
                {...register('date')}
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-orange-200 transition-all"
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
              )}
            </div>

            {/* Time */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Preferred Time *
              </label>
              <select
                {...register('time')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-orange-200 transition-all"
              >
                <option value="">Select time</option>
                {Array.from({ length: 18 }).map((_, i) => {
                  const hour = Math.floor(10 + i / 2);
                  const minute = i % 2 === 0 ? '00' : '30';
                  const time = `${String(hour).padStart(2, '0')}:${minute}`;
                  return (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  );
                })}
              </select>
              {errors.time && (
                <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>
              )}
            </div>

            {/* Guests */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Number of Guests *
              </label>
              <select
                {...register('guests')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-orange-200 transition-all"
              >
                <option value="">Select guests</option>
                {Array.from({ length: 20 }).map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
              {errors.guests && (
                <p className="text-red-500 text-sm mt-1">{errors.guests.message}</p>
              )}
            </div>

            {/* Special Requests */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Special Requests
              </label>
              <textarea
                {...register('specialRequests')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-orange-200 transition-all"
                placeholder="Any special occasions or dietary preferences?"
                rows={4}
              />
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-primary text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed font-bold bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all"
            >
              {isSubmitting ? '⏳ Booking...' : '✨ Confirm Reservation'}
            </motion.button>
          </motion.form>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {[
              {
                icon: Calendar,
                title: 'Flexible Dates',
                description: 'Book any day of the week that suits you best',
              },
              {
                icon: Clock,
                title: 'Available Hours',
                description: `We are open from 10:00 AM to 11:00 PM daily`,
              },
              {
                icon: Users,
                title: 'Group Bookings',
                description: 'Accommodate from 1 to 20 guests per reservation',
              },
              {
                icon: Mail,
                title: 'Instant Confirmation',
                description: 'Get confirmation email immediately after booking',
              },
            ].map((info, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg card-shadow p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-start space-x-4">
                  <info.icon className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-secondary mb-2">{info.title}</h3>
                    <p className="text-gray-600 text-sm">{info.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Contact Info with Env Values */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-primary to-accent text-white rounded-lg p-6 text-center card-shadow hover:shadow-2xl transition-all"
            >
              <h3 className="text-xl font-bold mb-2 flex items-center justify-center gap-2">
                <Phone size={20} />
                Need Help?
              </h3>
              <div className="space-y-3 text-white/95">
                <p className="flex items-center justify-center gap-2 hover:opacity-80 transition-opacity">
                  <Phone size={18} />
                  <a href={`tel:${RESTAURANT_INFO.phone}`} className="font-semibold hover:underline">
                    {RESTAURANT_INFO.phone}
                  </a>
                </p>
                <p className="flex items-center justify-center gap-2 hover:opacity-80 transition-opacity">
                  <Mail size={18} />
                  <a href={`mailto:${RESTAURANT_INFO.email}`} className="font-semibold hover:underline">
                    {RESTAURANT_INFO.email}
                  </a>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
