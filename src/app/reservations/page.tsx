'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Calendar, Clock, Users, Mail, Phone } from 'lucide-react';
import Link from 'next/link';

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

export default function ReservationsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        status: 'pending' as const,
      };

      const reservations = JSON.parse(
        localStorage.getItem('restocafe-reservations') || '[]'
      );
      reservations.push(reservation);
      localStorage.setItem('restocafe-reservations', JSON.stringify(reservations));

      toast.success('Reservation confirmed! We look forward to your visit.');
      reset();
    } catch (error) {
      toast.error('Failed to process reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-secondary mb-4">Book a Table</h1>
          <p className="text-xl text-gray-600">
            Reserve your spot at RestoCafe for a memorable dining experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg card-shadow p-8"
          >
            <h2 className="text-2xl font-bold text-secondary mb-6">Reservation Details</h2>

            {/* Name */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Your Name *
              </label>
              <input
                {...register('name')}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-orange-200"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-orange-200"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-orange-200"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-orange-200"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-orange-200"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-orange-200"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-orange-200"
                placeholder="Any special occasions or dietary preferences?"
                rows={4}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Booking...' : 'Confirm Reservation'}
            </button>
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
                description: 'We are open from 10:00 AM to 11:00 PM daily',
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
                className="bg-white rounded-lg card-shadow p-6"
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

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-primary to-accent text-white rounded-lg p-6 text-center"
            >
              <h3 className="text-xl font-bold mb-4">Need Help?</h3>
              <div className="space-y-2">
                <p className="flex items-center justify-center gap-2">
                  <Phone size={18} />
                  +91-8899776655
                </p>
                <p className="flex items-center justify-center gap-2">
                  <Mail size={18} />
                  reservations@restocafe.com
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
