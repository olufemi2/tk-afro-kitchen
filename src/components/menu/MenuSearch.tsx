'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { FoodCard } from "@/components/food/food-card";

interface MenuSection {
  id: string;
  title: string;
  description: string;
  items: any[];
}

interface MenuSearchProps {
  menuSections: MenuSection[];
}

export function MenuSearch({ menuSections }: MenuSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMenuSections = menuSections.map(section => ({
    ...section,
    items: section.items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(section => section.items.length > 0);

  return (
    <>
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
                <FoodCard key={item.id} {...item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}