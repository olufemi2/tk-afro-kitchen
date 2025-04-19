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
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <section className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Frozen Nigerian Delicacies</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enjoy authentic Nigerian dishes at your convenience. Our frozen meals are carefully 
              prepared, portioned, and frozen to preserve their authentic flavors.
            </p>
          </section>

          {/* Search and Filter Section */}
          <div className="mb-8 space-y-4">
            <Input
              type="search"
              placeholder="Search frozen items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {frozenCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.name ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Results Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6">
              {selectedCategory || "All Items"}
              {searchQuery && ` - Search results for "${searchQuery}"`}
            </h2>
            {filteredItems.length === 0 ? (
              <p className="text-muted-foreground">No items found matching your criteria.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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