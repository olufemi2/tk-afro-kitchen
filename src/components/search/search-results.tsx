'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { featuredDishes, MenuItem } from "@/data/sample-menu";
import { frozenItems, FrozenMenuItem } from "@/data/frozen-menu";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";

export function SearchResults() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  
  const [menuResults, setMenuResults] = useState<MenuItem[]>([]);
  const [frozenResults, setFrozenResults] = useState<FrozenMenuItem[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    if (searchQuery) {
      performSearch(searchQuery);
    }
  }, [searchQuery]);

  const performSearch = (query: string) => {
    const lowercaseQuery = query.toLowerCase().trim();

    const matchedMenuItems = featuredDishes.filter(item => 
      item.name.toLowerCase().includes(lowercaseQuery) ||
      item.description.toLowerCase().includes(lowercaseQuery) ||
      item.category.toLowerCase().includes(lowercaseQuery)
    );

    const matchedFrozenItems = frozenItems.filter(item => 
      item.name.toLowerCase().includes(lowercaseQuery) ||
      item.description.toLowerCase().includes(lowercaseQuery) ||
      item.category.toLowerCase().includes(lowercaseQuery)
    );

    setMenuResults(matchedMenuItems);
    setFrozenResults(matchedFrozenItems);
  };

  const handleAddToCart = (item: MenuItem | FrozenMenuItem) => {
    if ('sizeOptions' in item) {
      // Handle MenuItem type
      const defaultSize = item.sizeOptions[item.defaultSizeIndex];
      addToCart({
        id: item.id,
        name: item.name,
        description: item.description,
        price: defaultSize.price,
        imageUrl: item.imageUrl,
        category: item.category,
        quantity: 1,
        portionInfo: defaultSize.portionInfo,
        selectedSize: {
          size: defaultSize.size,
          price: defaultSize.price,
          portionInfo: defaultSize.portionInfo
        }
      });
    } else {
      // Handle FrozenMenuItem type
      addToCart({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        imageUrl: item.imageUrl,
        category: item.category,
        quantity: 1,
        portionInfo: item.servings,
        selectedSize: {
          size: 'regular',
          price: item.price,
          portionInfo: item.servings
        }
      });
    }
  };

  const totalResults = menuResults.length + frozenResults.length;

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Search Our Menu'}
        </h1>
        {searchQuery && (
          <p className="text-gray-600">
            Found {totalResults} {totalResults === 1 ? 'result' : 'results'}
          </p>
        )}
      </div>

      {/* Rest of your existing JSX for search results */}
      {/* ... existing results rendering code ... */}
    </div>
  );
} 