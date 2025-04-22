'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, Phone, MapPin, Instagram, Facebook, Twitter } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export function Header() {
  const { items } = useCart();
  const cartItemCount = items.length;

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-sm bg-[#1e1e1e]/95 border-b border-orange-900/20">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="hidden md:flex justify-between items-center py-2 text-sm border-b border-orange-900/10">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-slate-300">
              <Phone className="h-4 w-4 mr-2 text-orange-400" />
              <span>020 1234 5678</span>
            </div>
            <div className="flex items-center text-slate-300">
              <MapPin className="h-4 w-4 mr-2 text-orange-400" />
              <span>London, UK</span>
            </div>
          </div>
          
          {/* Add Social Media Icons */}
          <div className="flex items-center space-x-4">
            {/* Social Media Links */}
            <div className="flex items-center space-x-3 mr-6">
              <Link href="https://instagram.com/tkafro" target="_blank" className="text-slate-300 hover:text-orange-400 transition-colors">
                <Instagram className="h-4 w-4" />
              </Link>
              <Link href="https://facebook.com/tkafro" target="_blank" className="text-slate-300 hover:text-orange-400 transition-colors">
                <Facebook className="h-4 w-4" />
              </Link>
              <Link href="https://twitter.com/tkafro" target="_blank" className="text-slate-300 hover:text-orange-400 transition-colors">
                <Twitter className="h-4 w-4" />
              </Link>
            </div>
            
            {/* Navigation Links */}
            <nav className="flex items-center space-x-4">
              <Link href="/about" className="nav-link">About</Link>
              <Link href="/contact" className="nav-link">Contact</Link>
            </nav>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-10 h-10">
              <Image
                src="/images/brand/tklogo.jpg"
                alt="TK Afro Kitchen"
                fill
                className="object-contain rounded-full"
              />
            </div>
            <span className="text-xl font-bold text-gradient">
              TK Afro
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/menu" className="nav-link">Menu</Link>
            <Link href="/frozen" className="nav-link">Frozen</Link>
            <Link href="/catering" className="nav-link">Catering</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost"
              size="icon"
              className="relative"
            >
              <ShoppingCart className="h-5 w-5 text-slate-300" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
            <Button className="md:hidden" variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
            <Button className="hidden md:flex button-primary">
              Order Now
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
