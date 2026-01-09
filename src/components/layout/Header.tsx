'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { itemCount } = useCart();

  const navItems = [
    { label: 'Menu', href: '/menu' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
              V
            </div>
            <span className="text-xl font-bold text-secondary hidden sm:inline">Vilas's RestoCafe</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-600 hover:text-primary font-medium transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Cart & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Link
              href="/cart"
              className="relative group"
              title="Shopping Cart"
            >
              <div className="p-2 text-gray-600 hover:text-primary transition-colors duration-200 relative">
                <ShoppingCart size={28} strokeWidth={1.5} />
                
                {/* Cart Count Badge - Orange Color */}
                {itemCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center h-6 w-6 text-sm font-bold text-white bg-orange-500 rounded-full transform translate-x-1 -translate-y-1 shadow-lg animate-pulse">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </div>
              
              {/* Hover effect */}
              <div className="absolute inset-0 rounded-lg bg-primary opacity-0 group-hover:opacity-5 transition-opacity duration-200" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-primary transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden pb-4 border-t border-gray-200">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2 px-4 text-gray-600 hover:text-primary font-medium transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
