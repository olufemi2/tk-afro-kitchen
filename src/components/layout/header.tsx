'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, Phone, MapPin, Instagram, Facebook, Twitter, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

export function Header() {
  const { items, setIsCartOpen } = useCart();
  const cartItemCount = items.length;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

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
              TKAfro Kitchen
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
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="h-5 w-5 text-slate-300" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
            <Button 
              className="md:hidden" 
              variant="ghost" 
              size="icon"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
            <Button className="hidden md:flex button-primary">
              Order Now
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#1e1e1e] border-t border-orange-900/20">
            <nav className="flex flex-col py-4">
              <Link 
                href="/menu" 
                className="px-4 py-2 text-slate-300 hover:bg-orange-500/10 hover:text-orange-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Menu
              </Link>
              <Link 
                href="/frozen" 
                className="px-4 py-2 text-slate-300 hover:bg-orange-500/10 hover:text-orange-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Frozen
              </Link>
              <Link 
                href="/catering" 
                className="px-4 py-2 text-slate-300 hover:bg-orange-500/10 hover:text-orange-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Catering
              </Link>
              <Link 
                href="/about" 
                className="px-4 py-2 text-slate-300 hover:bg-orange-500/10 hover:text-orange-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="px-4 py-2 text-slate-300 hover:bg-orange-500/10 hover:text-orange-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}