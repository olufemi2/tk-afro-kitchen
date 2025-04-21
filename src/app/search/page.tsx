'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { featuredDishes, MenuItem } from "@/data/sample-menu";
import { frozenItems, FrozenMenuItem } from "@/data/frozen-menu";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";

export default function SearchPage() {
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

    // Search in menu items
    const matchedMenuItems = featuredDishes.filter(item => 
      item.name.toLowerCase().includes(lowercaseQuery) ||
      item.description.toLowerCase().includes(lowercaseQuery) ||
      item.category.toLowerCase().includes(lowercaseQuery)
    );

    // Search in frozen items
    const matchedFrozenItems = frozenItems.filter(item => 
      item.name.toLowerCase().includes(lowercaseQuery) ||
      item.description.toLowerCase().includes(lowercaseQuery) ||
      item.category.toLowerCase().includes(lowercaseQuery)
    );

    setMenuResults(matchedMenuItems);
    setFrozenResults(matchedFrozenItems);
  };

  const handleAddToCart = (item: MenuItem | FrozenMenuItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      imageUrl: item.imageUrl,
      category: item.category
    });
  };

  const totalResults = menuResults.length + frozenResults.length;

  return (
    <>
      <Header />
      <div className="min-h-screen pt-24 pb-16">
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

          {totalResults === 0 && searchQuery && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-medium mb-4">No results found</h2>
              <p className="text-gray-600 mb-6">
                We couldn't find any items matching "{searchQuery}". Please try a different search term or browse our categories.
              </p>
              <div className="flex justify-center gap-4">
                <Button asChild>
                  <Link href="/menu">Browse Menu</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/frozen">Browse Frozen Items</Link>
                </Button>
              </div>
            </div>
          )}

          {/* Menu Results */}
          {menuResults.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Menu Items</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {menuResults.map((item) => (
                  <Card key={item.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
                    <div className="relative aspect-[16/9]">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="font-medium text-orange-600">£{item.price.toFixed(2)}</span>
                          <Button 
                            size="sm" 
                            onClick={() => handleAddToCart(item)}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Frozen Results */}
          {frozenResults.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Frozen Items</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {frozenResults.map((item) => (
                  <Card key={item.id} className="group card-base card-hover overflow-hidden">
                    <div className="relative aspect-[16/9]">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="font-medium text-orange-600">£{item.price.toFixed(2)}</span>
                          <Button 
                            size="sm" 
                            onClick={() => handleAddToCart(item)}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
