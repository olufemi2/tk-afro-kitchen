import type { Metadata } from "next";
import { inter } from "@/lib/fonts";
import "./globals.css";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/contexts/CartContext";
import { CartModal } from "@/components/cart/CartModal";

export const metadata: Metadata = {
  title: "TK Afro Kitchen",
  description: "Authentic Nigerian cuisine delivered to your door",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <main className="min-h-screen bg-gradient-warm relative">
            <div 
              className="absolute inset-0 bg-[url('/images/frozen/jollof_rice.jpeg')] bg-cover bg-center opacity-5 pointer-events-none"
              style={{ 
                maskImage: 'linear-gradient(to bottom, transparent, black, transparent)',
                filter: 'saturate(1.2) contrast(1.1)'
              }}
            />
            <div className="relative">
              {children}
            </div>
          </main>
          <Footer />
          <CartModal />
        </CartProvider>
      </body>
    </html>
  );
}
