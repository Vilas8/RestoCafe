'use client';

import { Toaster } from 'react-hot-toast';
import { ReactNode } from 'react';
import { CartProvider } from '@/context/CartContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      {children}
      <Toaster position="bottom-right" />
    </CartProvider>
  );
}
