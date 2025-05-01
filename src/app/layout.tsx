import '@/app/globals.css';
import type { Metadata } from 'next';
import { CartProvider } from '@/contexts/CartContext';
import { SearchProvider } from '@/contexts/SearchContext';
import { CartModal } from "@/components/cart/CartModal";

export const metadata: Metadata = {
  title: 'TK Afro Kitchen',
  description: 'Authentic Nigerian Cuisine Delivered to Your Door',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
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
