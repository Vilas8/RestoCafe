import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: "Vilas's RestoCafe - Delicious Food Online Ordering & Reservations",
  description: "Order your favorite meals online, make reservations, and explore our menu at Vilas's RestoCafe. Best restaurant in Bengaluru.",
  keywords: ['restaurant', 'food delivery', 'online ordering', 'reservations', 'cafe', 'bengaluru'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        <Providers>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
