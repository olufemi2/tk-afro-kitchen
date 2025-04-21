'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, Menu } from "lucide-react";
import { useCart, CartItem } from "@/contexts/CartContext";
import { SearchBar } from "@/components/ui/search-bar";
import { useState } from "react";

export function Header() {
  const { items } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartItemCount = items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);

  return (
    <div className="sticky top-0 z-50 w-full backdrop-blur-sm bg-[#1e1e1e]/95">
      <header className="border-b border-orange-900/20">
        <div className="container mx-auto px-4 max-w-7xl h-16 flex items-center justify-between">
          {/* Logo section */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative w-10 h-10">
              <Image
                src="/images/brand/tklogo.jpg"
                alt="TK Afro Kitchen"
                fill
                priority
                sizes="(max-width: 768px) 40px, 40px"
                className="object-contain rounded-full hover:scale-105 transition-transform duration-300"
                style={{ filter: 'drop-shadow(0 0 8px rgba(255, 165, 0, 0.2))' }}
              />
            </div>
            <span className="font-semibold text-xl bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400">
              TK Afro
            </span>
          </Link>

          {/* Search bar - hidden on mobile */}
          <div className="hidden md:flex items-center max-w-md w-full mx-4">
            <SearchBar autoSearch={true} className="w-full" />
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {['Menu', 'Frozen', 'Services', 'About'].map((item) => (
              <Link 
                key={item}
                href={`/${item.toLowerCase()}`} 
                className="text-slate-300 hover:text-orange-400 hover:scale-105 transition-all duration-300"
              >
                {item}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-2">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden relative group hover:bg-orange-900/20 rounded-full transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5 text-slate-300 group-hover:text-orange-400 transition-colors duration-300" />
            </Button>

            {/* Cart button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative group hover:bg-orange-900/20 rounded-full transition-all duration-300"
            >
              <ShoppingCart className="h-5 w-5 text-slate-300 group-hover:text-orange-400 transition-colors duration-300" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce shadow-lg">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-b border-orange-900/20 bg-[#1e1e1e]/95">
          <nav className="container mx-auto px-4 py-4">
            {['Menu', 'Frozen', 'Services', 'About'].map((item) => (
              <Link 
                key={item}
                href={`/${item.toLowerCase()}`} 
                className="block py-2 text-slate-300 hover:text-orange-400 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Mobile search bar */}
      <div className="md:hidden border-b border-orange-900/20 px-4 py-2 bg-[#1e1e1e]/95">
        <SearchBar autoSearch={true} />
      </div>
    </div>
  );
}
