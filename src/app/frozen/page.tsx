'use client';

import { useState } from 'react';
import { Header } from "@/components/layout/header";
import { FrozenFoodCard } from "@/components/food/frozen-food-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { frozenCategories, frozenItems } from "@/data/frozen-menu";

export default function FrozenPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredItems = frozenItems.filter(item => {
    return !selectedCategory || item.category === selectedCategory;
  });

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#1e1e1e] pb-16 pt-24">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20">
          <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent opacity-20" />
          <div className="relative z-10 container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent 
                           bg-gradient-to-r from-orange-400 to-yellow-400 
                           leading-tight md:leading-tight">
                Frozen Nigerian Delicacies
              </h1>
              <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto 
                          leading-relaxed">
                Enjoy authentic Nigerian dishes at your convenience. Our frozen meals are carefully 
                prepared, portioned, and frozen to preserve their authentic flavors.
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4">
          {/* Category Filter Section */}
          <div className="card-base p-4 md:p-6 mb-8">
            <div className="flex flex-wrap gap-3">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                className="rounded-full text-sm"
                size="sm"
              >
                All Categories
              </Button>
              {frozenCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.name ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.name)}
                  className="rounded-full text-sm"
                  size="sm"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Results Section */}
          <div>
            <h2 className="text-2xl font-bold mb-8 text-gradient">
              {selectedCategory || "All Frozen Items"}
            </h2>
            {filteredItems.length === 0 ? (
              <div className="card-base p-8 text-center">
                <p className="text-slate-400">No items found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
                {filteredItems.map((item) => (
                  <FrozenFoodCard key={item.id} {...item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 