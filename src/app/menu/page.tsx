'use client';

import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Search } from "lucide-react";
import Image from "next/image";
import { categories, featuredDishes, MenuItem } from "@/data/sample-menu";
import { useCart } from "@/contexts/CartContext";
import { useRef, useState } from "react";
import Link from "next/link";
import { FoodCard } from "@/components/food/food-card";

// Transform the data for the menu sections
const menuSections = categories.map(category => ({
  id: category.id,
  title: category.name,
  description: category.description,
  imageUrl: category.imageUrl,
  items: featuredDishes
    .filter(dish => dish.category === category.name)
    .map(dish => ({
      id: dish.id,
      name: dish.name,
      description: dish.description,
      imageUrl: dish.imageUrl,
      category: dish.category,
      price: dish.sizeOptions?.[dish.defaultSizeIndex ?? 0]?.price ?? 0,
      sizeOptions: dish.sizeOptions,
      defaultSizeIndex: dish.defaultSizeIndex
    }))
})).filter(section => section.items.length > 0);

export default function MenuPage() {
  const { addToCart } = useCart();
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddToCart = (item: MenuItem) => {
    const originalItem = featuredDishes.find(dish => dish.id === item.id);
    if (originalItem && originalItem.sizeOptions?.length > 0) {
      const defaultSize = originalItem.sizeOptions[originalItem.defaultSizeIndex];
      const normalizedSize = defaultSize.size.toLowerCase();
      
      // Only add to cart if the size is one of the allowed values
      if (normalizedSize === 'small' || normalizedSize === 'regular' || normalizedSize === 'large') {
        addToCart({
          id: item.id,
          name: item.name,
          description: item.description,
          imageUrl: item.imageUrl,
          category: item.category,
          price: defaultSize.price,
          quantity: 1,
          portionInfo: defaultSize.portionInfo,
          size: normalizedSize as 'small' | 'regular' | 'large'
        });
      }
    }
  };
  
  const scrollToSection = (categoryId: string) => {
    const element = sectionRefs.current[categoryId];
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Filter menu sections based on search query
  const filteredMenuSections = menuSections.map(section => ({
    ...section,
    items: section.items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.items.length > 0);
  
  return (
    <>
      <Header />
      <div className="min-h-screen bg-[var(--background)]">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-pattern" />
          <div className="hero-content">
            <h1 className="hero-title">Our Menu</h1>
            <p className="hero-description">
              Discover the Rich Flavors of Nigeria
            </p>
            {/* Search Bar */}
            <div className="w-full max-w-md mx-auto relative">
              <Input
                type="text"
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input w-full pl-10 pr-4 py-3 rounded-full"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            </div>
          </div>
        </section>

        {/* Category Grid */}
        <div className="container-padding">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <div 
                key={category.id} 
                className="card-base group cursor-pointer"
                onClick={() => scrollToSection(category.id)}
              >
                <div className="card-image-container">
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    className="card-image"
                  />
                  <div className="card-image-overlay" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2 text-gradient">{category.name}</h3>
                    <p className="text-sm text-slate-300">{category.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu Sections */}
        <div className="container-padding">
          {searchQuery && filteredMenuSections.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-slate-300">No dishes found matching "{searchQuery}"</p>
            </div>
          ) : (
            filteredMenuSections.map((section) => (
              <section 
                key={section.title} 
                className="section-spacing" 
                id={section.id}
                ref={(element) => {
                  if (element) {
                    sectionRefs.current[section.id] = element;
                  }
                }}
              >
                <h2 className="text-gradient mb-8">{section.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {section.items.map((item) => (
                    <FoodCard
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      description={item.description}
                      imageUrl={item.imageUrl}
                      category={item.category}
                      price={item.price || 0}
                    />
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </div>
    </>
  );
}
