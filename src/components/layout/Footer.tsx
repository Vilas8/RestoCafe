'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from 'lucide-react';
import { RESTAURANT_INFO } from '@/lib/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">RestoCafe</h3>
            <p className="text-gray-300 text-sm">
              Experience authentic flavors and culinary excellence with our carefully curated menu.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/menu" className="text-gray-300 hover:text-white transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/reservations" className="text-gray-300 hover:text-white transition-colors">
                  Make Reservation
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone size={18} className="text-primary" />
                <span className="text-gray-300">{RESTAURANT_INFO.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={18} className="text-primary" />
                <span className="text-gray-300">{RESTAURANT_INFO.email}</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin size={18} className="text-primary flex-shrink-0 mt-1" />
                <span className="text-gray-300 text-sm">{RESTAURANT_INFO.address}</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={24} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <p className="text-center text-gray-300 text-sm">
            &copy; {currentYear} RestoCafe. All rights reserved. | Made with ❤️ for food lovers
          </p>
        </div>
      </div>
    </footer>
  );
}
