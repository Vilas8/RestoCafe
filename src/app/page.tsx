'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Utensils, Clock, MapPin } from 'lucide-react';
import { RESTAURANT_INFO, MENU_ITEMS } from '@/lib/constants';
import MenuItem from '@/components/MenuItem';
import Image from 'next/image';

const featureVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1 },
  }),
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="https://i.ibb.co/Kcvf88db/Hero-Banner-1.png"
          alt="RestoCafe Hero Banner"
          fill
          className="object-cover object-center"
          priority
          quality={95}
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
          className="space-y-8"
        >
          {/* Main Title */}
          <motion.h1
            className="text-6xl sm:text-7xl lg:text-8xl font-black leading-tight drop-shadow-2xl"
            style={{
              textShadow: '0 15px 35px rgba(0, 0, 0, 0.9)',
              letterSpacing: '-0.02em',
            }}
          >
            <span className="block text-white">Vilas's</span>
            <span className="block bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500 bg-clip-text text-transparent">
              RestoCafe
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-2xl sm:text-3xl lg:text-4xl opacity-95 drop-shadow-lg font-light tracking-widest text-white"
          >
            Delicious Food For Every Mood
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-6 justify-center pt-8 items-center"
          >
            <motion.div
              whileHover={{ scale: 1.12, y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Link
                href="/menu"
                className="inline-block px-10 sm:px-12 py-5 bg-white text-orange-600 font-black rounded-full hover:bg-orange-50 transition-all duration-300 shadow-2xl hover:shadow-3xl text-lg tracking-wide uppercase"
              >
                View Our Menu
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.12, y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Link
                href="/reservations"
                className="inline-block px-10 sm:px-12 py-5 bg-orange-600 text-white font-black rounded-full hover:bg-orange-700 transition-all duration-300 shadow-2xl hover:shadow-3xl text-lg tracking-wide uppercase"
              >
                Book a Table
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  const popularItems = MENU_ITEMS.filter((item) => item.popular).slice(0, 6);

  return (
    <div className="overflow-hidden">
      {/* Enhanced Hero Section */}
      <HeroSection />

      {/* Features Section with Parallax */}
      <section className="py-16 bg-gray-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12 text-secondary"
          >
            Why Choose RestoCafe?
          </motion.h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Utensils,
                title: 'Premium Quality',
                description: 'Fresh ingredients and authentic recipes prepared by our expert chefs',
              },
              {
                icon: Clock,
                title: 'Fast Delivery',
                description: 'Hot and fresh food delivered to your doorstep within 30 minutes',
              },
              {
                icon: MapPin,
                title: 'Multiple Cuisines',
                description: 'Explore Indian, Italian, and Continental delicacies all in one place',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={featureVariants}
                whileHover={{ y: -10 }}
                className="card-shadow p-8 rounded-lg text-center bg-white hover:shadow-xl transition-shadow"
              >
                <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3 text-secondary">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Popular Items Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-12 text-secondary"
        >
          Popular Dishes
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {popularItems.map((item, i) => (
            <motion.div key={item.id} custom={i} variants={featureVariants}>
              <MenuItem item={item} />
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <Link href="/menu" className="btn-primary text-lg px-8 py-4">
            View Full Menu
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-secondary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Order?</h2>
          <p className="text-xl mb-8 opacity-90">
            {RESTAURANT_INFO.name} • {RESTAURANT_INFO.hours}
          </p>
          <p className="text-lg opacity-75 mb-8">{RESTAURANT_INFO.address}</p>
          <Link href="/menu" className="btn-primary text-lg px-8 py-4 bg-primary text-white hover:bg-orange-700">
            Place Order Now
          </Link>
        </div>
      </section>
    </div>
  );
}
