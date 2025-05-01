'use client';

import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Image from "next/image";
import { categories, featuredDishes } from "@/data/sample-menu";
import { useRef, useState } from "react";
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
      sizeOptions: dish.sizeOptions,
      defaultSizeIndex: dish.defaultSizeIndex
    }))
})).filter(section => section.items.length > 0);

export default function MenuPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
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

        {/* Menu Sections */}
        <div className="container mx-auto px-4 py-8">
          {filteredMenuSections.map((section) => (
            <div key={section.id} className="mb-12">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                <p className="text-gray-400">{section.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.items.map((item) => (
                  <FoodCard
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    description={item.description}
                    imageUrl={item.imageUrl}
                    category={item.category}
                    sizeOptions={item.sizeOptions}
                    defaultSizeIndex={item.defaultSizeIndex}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
