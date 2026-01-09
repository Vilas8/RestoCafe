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

export default function Home() {
  const popularItems = MENU_ITEMS.filter((item) => item.popular).slice(0, 6);

  return (
    <div className="overflow-hidden">
      {/* Hero Section with Background Image */}
      <section className="relative text-white min-h-screen flex items-center overflow-hidden">
        {/* Background Image with Dark Overlay */}
        <Image
          src="https://agi-prod-file-upload-public-main-use1.s3.amazonaws.com/f6f439ae-c4ca-4c1f-a1bd-389038165f81"
          alt="RestoCafe Hero"
          fill
          className="absolute inset-0 object-cover -z-10"
          priority
        />
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/55 -z-5"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight">
              Welcome to RestoCafe
            </h1>
            <p className="text-xl sm:text-2xl mb-8 opacity-90">
              Experience authentic flavors and culinary excellence
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/menu"
                className="btn-primary text-lg px-8 py-4 bg-white text-primary hover:bg-gray-100"
              >
                View Menu
              </Link>
              <Link
                href="/reservations"
                className="btn-outline text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary"
              >
                Book Table
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
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
                className="card-shadow p-8 rounded-lg text-center bg-white"
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
