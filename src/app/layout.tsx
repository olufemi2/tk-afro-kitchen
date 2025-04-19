import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/contexts/CartContext";
import { CartModal } from "@/components/cart/CartModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tkafro - Authentic Nigerian Food Delivery in the UK",
  description: "Order authentic Nigerian food delicacies for delivery across the UK or local pickup. Explore our rich and flavorful menu of traditional dishes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#121212] text-slate-100`}>
        <CartProvider>
          <main className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#121212] relative">
            <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-10 mix-blend-overlay pointer-events-none" />
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
