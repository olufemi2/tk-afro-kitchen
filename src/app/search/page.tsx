'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { featuredDishes, MenuItem } from "@/data/sample-menu";
import { frozenItems, FrozenMenuItem } from "@/data/frozen-menu";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import { useSearch } from "@/contexts/SearchContext";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const { performSearch, searchResults } = useSearch();
  const { addToCart } = useCart();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (searchQuery) {
        performSearch(searchQuery);
      }
    } catch (error) {
      console.error('Search page error:', error);
      setError('An error occurred while searching. Please try again.');
    }
  }, [searchQuery, performSearch]);

  const handleSearch = (query: string) => {
    try {
      performSearch(query);
      setError(null);
    } catch (error) {
      console.error('Error handling search:', error);
      setError('An error occurred while searching. Please try again.');
    }
  };

  const handleAddToCart = (item: MenuItem | FrozenMenuItem) => {
    try {
      addToCart({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        imageUrl: item.imageUrl,
        category: item.category
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const totalResults = searchResults.menuItems.length + searchResults.frozenItems.length;

  return (
    <>
      <Header />
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto mb-8">
            <SearchBar 
              placeholder="Search for dishes, frozen items..." 
              onSearch={handleSearch} 
              className="mb-4" 
            />
          </div>

          {error && (
            <div className="text-center py-4 text-red-500 mb-8">
              {error}
            </div>
          )}

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
          {searchResults.menuItems.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400">
                Menu Items
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {searchResults.menuItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300 bg-[#1e1e1e] border-orange-900/20">
                    <div className="relative aspect-[16/9]">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    </div>
                    <div className="p-6 bg-[#1e1e1e]/90 backdrop-blur-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1 text-orange-400">{item.name}</h3>
                          <p className="text-sm text-slate-300">{item.description}</p>
                          <div className="mt-2">
                            <span className="text-xs bg-orange-900/20 text-orange-300 px-2 py-1 rounded-full">
                              {item.category}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="font-medium text-yellow-400">£{item.price.toFixed(2)}</span>
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
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
          {searchResults.frozenItems.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400">
                Frozen Items
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {searchResults.frozenItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300 bg-white border-orange-100">
                    <div className="relative aspect-[16/9]">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1 text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                          <div className="flex gap-4 mt-2 text-sm text-gray-500">
                            <div>{item.servings}</div>
                            <div>{item.storageInfo}</div>
                          </div>
                          <div className="mt-2">
                            <span className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded-full">
                              {item.category}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="font-medium text-orange-600">£{item.price.toFixed(2)}</span>
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
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
