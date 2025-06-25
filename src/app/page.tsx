'use client';

import { Header } from "@/components/layout/header";
import { CategoryCard } from "@/components/food/category-card";
import { FoodCard } from "@/components/food/food-card";
import { categories, featuredDishes } from "@/data/sample-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    // Detect Safari for specific handling
    const userAgent = navigator.userAgent;
    const safari = /Safari/.test(userAgent) && !/Chrome|CriOS|FxiOS/.test(userAgent);
    setIsSafari(safari);
    
    if (safari) {
      console.log('📱 Safari detected on homepage - applying Safari-specific fixes');
    }
  }, []);

  // Safari-specific link handler
  const handleSafariLink = (e: React.MouseEvent, href: string) => {
    console.log('🔗 Navigation clicked:', href, 'Safari:', isSafari);
    if (isSafari) {
      e.preventDefault();
      console.log('🍎 Safari navigation - using window.location.href');
      // Force navigation in Safari
      window.location.href = href;
    } else {
      console.log('🖥️ Standard browser - using Next.js router');
    }
  };

  return (
    <>
      <Header />
      <div className="pt-24 pb-16">
        {/* Hero Section - Navigation buttons fixed for production deployment */}
        <section className="relative min-h-[600px] bg-[#1e1e1e] overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/dishes/Jollof.jpeg')] bg-cover bg-center opacity-5 mix-blend-overlay" />
          <div className="container mx-auto px-4 h-full flex flex-col justify-center py-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400">
              Authentic Nigerian Cuisine
              <br />
              Delivered to Your Door
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl">
              Experience the rich flavors of Nigeria with our carefully crafted dishes,
              available for delivery across the UK or local pickup.
            </p>
            <div className="flex gap-4">
              <Link 
                href="/menu"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-10 px-6 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
                onClick={(e) => handleSafariLink(e, '/menu')}
              >
                Browse Our Menu
              </Link>
              <Link 
                href="/about"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-10 px-6 border border-orange-900/20 bg-[#242424] hover:bg-[#2a2a2a] text-slate-200"
                onClick={(e) => handleSafariLink(e, '/about')}
              >
                About Us
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400">
              Menu Categories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <CategoryCard key={category.id} {...category} />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Dishes - We'll keep this but with fewer dishes to not overwhelm */}
        <section className="py-16 relative overflow-hidden rounded-3xl mx-4 bg-[#1e1e1e] border border-orange-900/20">
          <div className="absolute inset-0 bg-[url('/images/dishes/efo-riro.png')] bg-cover bg-center opacity-5 mix-blend-overlay" />
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400">
              Popular Dishes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredDishes.slice(0, 3).map((dish) => (
                <FoodCard key={dish.id} {...dish} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link 
                href="/menu"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-10 px-6 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
                onClick={(e) => handleSafariLink(e, '/menu')}
              >
                Browse Full Menu
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
