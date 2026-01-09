'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Store message
      const messages = JSON.parse(localStorage.getItem('restocafe-messages') || '[]');
      messages.push({
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('restocafe-messages', JSON.stringify(messages));

      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      value: '+91-8899776655',
      description: 'Call us for orders and reservations',
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'hello@restocafe.com',
      description: 'Send us your queries anytime',
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'MG Road, Bengaluru',
      description: 'Visit us for dine-in experience',
    },
    {
      icon: Clock,
      title: 'Hours',
      value: '10:00 AM - 11:00 PM',
      description: 'Open daily for your convenience',
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-secondary mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600">We'd love to hear from you. Get in touch with us anytime!</p>
        </motion.div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-lg card-shadow p-6 text-center"
            >
              <info.icon className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-bold text-secondary mb-2">{info.title}</h3>
              <p className="font-semibold text-gray-700 mb-2">{info.value}</p>
              <p className="text-gray-600 text-sm">{info.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Contact Form & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg card-shadow p-8"
          >
            <h2 className="text-2xl font-bold text-secondary mb-6">Send us a Message</h2>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-orange-200"
                placeholder="John Doe"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-orange-200"
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-orange-200"
                placeholder="How can we help?"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-orange-200"
                rows={5}
                placeholder="Your message here..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </motion.form>

          {/* Map & Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Google Maps Embed */}
            <div className="rounded-lg overflow-hidden card-shadow h-96">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.886343658854!2d77.59501!3d12.97192!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15e4de73c4f5%3A0x5e5e5e5e5e5e5e5e!2sMG%20Road%2C%20Bengaluru!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Quick Contact */}
            <div className="bg-gradient-to-br from-primary to-accent text-white rounded-lg p-6 card-shadow">
              <h3 className="text-xl font-bold mb-4">Quick Contact</h3>
              <p className="mb-4 opacity-90">
                Can't wait? Call us directly or visit us in person. Our friendly team is always ready to help!
              </p>
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <Phone size={18} />
                  +91-8899776655
                </p>
                <p className="flex items-center gap-2">
                  <Mail size={18} />
                  hello@restocafe.com
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
