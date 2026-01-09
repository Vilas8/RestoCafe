'use client';

import { motion } from 'framer-motion';
import { Award, Users, Clock, Leaf } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Award,
    title: 'Award-Winning',
    description: 'Recognized for culinary excellence and outstanding service',
  },
  {
    icon: Leaf,
    title: 'Fresh Ingredients',
    description: 'Sourced daily from local organic farms',
  },
  {
    icon: Users,
    title: 'Expert Chefs',
    description: 'Experienced team passionate about food',
  },
  {
    icon: Clock,
    title: 'Quick Service',
    description: 'Fast delivery without compromising quality',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold mb-6 text-center"
          >
            About RestoCafe
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-center opacity-90"
          >
            Your favorite destination for authentic flavors and exceptional dining
          </motion.p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          <div>
            <h2 className="text-4xl font-bold text-secondary mb-6">Our Story</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              RestoCafe began as a dream to bring authentic culinary experiences to the heart of Bengaluru. What started as a small kitchen has grown into a beloved restaurant known for its diverse menu and warm hospitality.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              We believe in using the freshest ingredients, employing traditional cooking methods, and infusing modern creativity into every dish we serve. Every meal is a celebration of flavors.
            </p>
          </div>
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            src="https://images.unsplash.com/photo-1504674900967-a8fb7a91c537?w=600&h=400&fit=crop"
            alt="RestoCafe Restaurant"
            className="rounded-lg card-shadow"
          />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-secondary text-center mb-12"
          >
            Why We Stand Out
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-lg card-shadow text-center"
              >
                <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-secondary mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-secondary text-center mb-12"
        >
          Our Team
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Chef Rajesh Kumar', role: 'Head Chef' },
            { name: 'Priya Sharma', role: 'Manager' },
            { name: 'Arjun Singh', role: 'Chef' },
          ].map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-50 rounded-lg card-shadow p-8 text-center"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4" />
              <h3 className="text-xl font-bold text-secondary mb-1">{member.name}</h3>
              <p className="text-primary font-semibold">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">Ready to Taste Excellence?</h2>
          <p className="text-xl opacity-90 mb-8">
            Book a table or place an order now and experience the RestoCafe difference
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/menu" className="btn-primary text-lg px-8 py-4 bg-primary text-white hover:bg-orange-700">
              View Menu
            </Link>
            <Link href="/reservations" className="btn-outline text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-secondary">
              Book Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
