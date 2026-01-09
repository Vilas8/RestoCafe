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
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
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
                className="text-gray-600 hover:text-primary font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Cart & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Link
              href="/cart"
              className="relative inline-flex items-center justify-center p-2 text-gray-600 hover:text-primary transition-colors"
              title="Shopping Cart"
            >
              <ShoppingCart size={24} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-primary"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden pb-4 border-t">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2 text-gray-600 hover:text-primary font-medium"
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
