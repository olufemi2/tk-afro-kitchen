import '@/app/globals.css';
import type { Metadata } from 'next';
import { CartProvider } from '@/contexts/CartContext';
import { SearchProvider } from '@/contexts/SearchContext';
import { CartModal } from "@/components/cart/CartModal";
import { HeaderDeliveryInfo } from '@/components/banners/HeaderDeliveryInfo';

export const metadata: Metadata = {
  title: 'TK Afro Kitchen',
  description: 'Authentic Nigerian Cuisine Delivered to Your Door',
  keywords: ['Nigerian food', 'African cuisine', 'Jollof rice', 'delivery', 'authentic Nigerian meals'],
  authors: [{ name: 'TK Afro Kitchen' }],
  creator: 'TK Afro Kitchen',
  publisher: 'TK Afro Kitchen',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/images/brand/tklogo.jpg', sizes: '192x192', type: 'image/jpeg' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/images/brand/tklogo.jpg', sizes: '180x180', type: 'image/jpeg' },
    ],
  },
  openGraph: {
    title: 'TK Afro Kitchen - Authentic Nigerian Cuisine',
    description: 'Authentic Nigerian Cuisine Delivered to Your Door',
    url: 'https://tkafrokitchen.com',
    siteName: 'TK Afro Kitchen',
    images: [
      {
        url: '/images/brand/tklogo.jpg',
        width: 400,
        height: 400,
        alt: 'TK Afro Kitchen Logo',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TK Afro Kitchen - Authentic Nigerian Cuisine',
    description: 'Authentic Nigerian Cuisine Delivered to Your Door',
    images: ['/images/brand/tklogo.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <HeaderDeliveryInfo />
        <SearchProvider>
          <CartProvider>
            {children}
            <CartModal />
          </CartProvider>
        </SearchProvider>
      </body>
    </html>
  );
}
