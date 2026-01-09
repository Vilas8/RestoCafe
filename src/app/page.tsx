'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Utensils, Clock, MapPin, ChefHat, Star, Award } from 'lucide-react';
import { RESTAURANT_INFO, MENU_ITEMS } from '@/lib/constants';
import MenuItem from '@/components/MenuItem';
import Image from 'next/image';
import { useRef } from 'react';

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
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section ref={heroRef} className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Background Image */}
      <motion.div 
        style={{ y, scale }}
        className="absolute inset-0 w-full h-full"
      >
        <Image
          src="https://i.ibb.co/Kcvf88db/Hero-Banner-1.png"
          alt="RestoCafe Hero Banner"
          fill
          className="object-cover object-center"
          priority
          quality={95}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/10" />
      </motion.div>

      {/* Floating decorative elements */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-10 opacity-20"
      >
        <ChefHat size={80} className="text-white" />
      </motion.div>

      <motion.div
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-32 right-10 opacity-20"
      >
        <Utensils size={60} className="text-white" />
      </motion.div>

      {/* Content Overlay */}
      <motion.div 
        style={{ opacity }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
          className="space-y-8"
        >
          {/* Main Title with 3D effect */}
          <motion.h1
            className="text-6xl sm:text-7xl lg:text-8xl font-black leading-tight"
            style={{
              textShadow: '0 15px 35px rgba(0, 0, 0, 0.9), 0 5px 15px rgba(255, 107, 0, 0.5)',
              letterSpacing: '-0.02em',
              transform: 'perspective(1000px) rotateX(5deg)',
            }}
            whileHover={{ 
              scale: 1.05,
              rotateX: 0,
              transition: { duration: 0.3 }
            }}
          >
            <motion.span 
              className="block text-white"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Vilas's
            </motion.span>
            <motion.span 
              className="block bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500 bg-clip-text text-transparent"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              RestoCafe
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="text-2xl sm:text-3xl lg:text-4xl opacity-95 drop-shadow-lg font-light tracking-widest text-white"
          >
            Delicious Food For Every Mood
          </motion.p>

          {/* CTA Buttons with 3D effect */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-6 justify-center pt-8 items-center"
          >
            <motion.div
              whileHover={{ 
                scale: 1.12, 
                y: -8,
                rotateX: 10,
                rotateY: -5,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.95 }}
              style={{ perspective: 1000 }}
            >
              <Link
                href="/menu"
                className="inline-block px-10 sm:px-12 py-5 bg-white text-orange-600 font-black rounded-full hover:bg-orange-50 transition-all duration-300 shadow-2xl hover:shadow-3xl text-lg tracking-wide uppercase"
                style={{
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 10px 20px rgba(255,107,0,0.2)'
                }}
              >
                View Our Menu
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ 
                scale: 1.12, 
                y: -8,
                rotateX: 10,
                rotateY: 5,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.95 }}
              style={{ perspective: 1000 }}
            >
              <Link
                href="/reservations"
                className="inline-block px-10 sm:px-12 py-5 bg-orange-600 text-white font-black rounded-full hover:bg-orange-700 transition-all duration-300 shadow-2xl hover:shadow-3xl text-lg tracking-wide uppercase"
                style={{
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 10px 20px rgba(255,107,0,0.4)'
                }}
              >
                Book a Table
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function ParallaxSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const smoothY1 = useSpring(y1, { stiffness: 100, damping: 30 });
  const smoothY2 = useSpring(y2, { stiffness: 100, damping: 30 });

  return (
    <section ref={sectionRef} className="py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decorative elements */}
      <motion.div
        style={{ y: smoothY1 }}
        className="absolute top-20 left-5 opacity-5"
      >
        <Star size={200} className="text-orange-500" />
      </motion.div>
      <motion.div
        style={{ y: smoothY2 }}
        className="absolute bottom-20 right-5 opacity-5"
      >
        <Award size={180} className="text-orange-500" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-12 text-secondary"
          style={{
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}
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
              whileHover={{ 
                y: -15,
                rotateY: 5,
                rotateX: 5,
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
              style={{ 
                perspective: 1000,
                transformStyle: 'preserve-3d'
              }}
              className="card-shadow p-8 rounded-lg text-center bg-white hover:shadow-2xl transition-all"
            >
              <motion.div
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.6 }}
              >
                <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" />
              </motion.div>
              <h3 className="text-xl font-bold mb-3 text-secondary">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  const popularItems = MENU_ITEMS.filter((item) => item.popular).slice(0, 6);

  return (
    <div className="overflow-hidden">
      {/* Enhanced Hero Section with Parallax */}
      <HeroSection />

      {/* Features Section with Parallax */}
      <ParallaxSection />

      {/* Popular Items Section with 3D Cards */}
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
            <motion.div 
              key={item.id} 
              custom={i} 
              variants={featureVariants}
              whileHover={{
                rotateY: 5,
                rotateX: 5,
                scale: 1.03,
                transition: { duration: 0.3 }
              }}
              style={{ perspective: 1000 }}
            >
              <MenuItem item={item} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <motion.div
            whileHover={{ 
              scale: 1.1,
              rotateX: 5,
              y: -5
            }}
            whileTap={{ scale: 0.95 }}
            style={{ perspective: 1000 }}
          >
            <Link href="/menu" className="btn-primary text-lg px-8 py-4 inline-block">
              View Full Menu
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Contact Section with Gradient Animation */}
      <motion.section 
        className="py-16 bg-gradient-to-r from-secondary via-primary to-accent text-white relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {/* Animated background pattern */}
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h2 
            className="text-4xl font-bold mb-6"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            Ready to Order?
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 opacity-90"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {RESTAURANT_INFO.name} • {RESTAURANT_INFO.hours}
          </motion.p>
          <motion.p 
            className="text-lg opacity-75 mb-8"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {RESTAURANT_INFO.address}
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              whileHover={{ 
                scale: 1.1,
                rotateX: 5,
                y: -5
              }}
              whileTap={{ scale: 0.95 }}
              style={{ perspective: 1000 }}
            >
              <Link href="/menu" className="btn-primary text-lg px-8 py-4 bg-white text-orange-600 hover:bg-orange-50 inline-block font-bold">
                Place Order Now
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
