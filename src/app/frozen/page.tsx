'use client';

import { useState } from 'react';
import { Header } from "@/components/layout/header";
import { FrozenFoodCard } from "@/components/food/frozen-food-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { frozenCategories, frozenItems } from "@/data/frozen-menu";

export default function FrozenPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = frozenItems.filter(item => {
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-warm pb-16">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-pattern" />
          <div className="hero-content text-center">
            <h1 className="hero-title">
              Frozen Nigerian Delicacies
            </h1>
            <p className="hero-description">
              Enjoy authentic Nigerian dishes at your convenience. Our frozen meals are carefully 
              prepared, portioned, and frozen to preserve their authentic flavors.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4">
          {/* Search and Filter Section */}
          <div className="card-base p-6 mb-8">
            <div className="max-w-xl mx-auto space-y-4">
              <Input
                type="search"
                placeholder="Search frozen items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  onClick={() => setSelectedCategory(null)}
                  className="rounded-full"
                >
                  All
                </Button>
                {frozenCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.name ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.name)}
                    className="rounded-full"
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              {selectedCategory || "All Items"}
              {searchQuery && ` - Search results for "${searchQuery}"`}
            </h2>
            {filteredItems.length === 0 ? (
              <div className="card-base p-8 text-center">
                <p className="text-muted-foreground">No items found matching your criteria.</p>
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