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

      {!searchQuery ? (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg">Start typing to search our delicious menu...</p>
        </div>
      ) : totalResults === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg mb-4">No results found for "{searchQuery}"</p>
          <Button asChild variant="outline">
            <Link href="/menu">Browse Our Full Menu</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Menu Items Results */}
          {menuResults.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400">
                Fresh Menu Items ({menuResults.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuResults.map((item) => (
                  <Card key={item.id} className="card-base group">
                    <div className="card-image-container">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="card-image"
                      />
                      <div className="card-image-overlay" />
                    </div>
                    <div className="card-content">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg text-slate-200">{item.name}</h3>
                        <span className="tag-base">{item.category}</span>
                      </div>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-300">
                          <span className="font-semibold text-orange-400">
                            £{item.sizeOptions[item.defaultSizeIndex].price.toFixed(2)}
                          </span>
                          <span className="text-slate-500 ml-2">
                            {item.sizeOptions[item.defaultSizeIndex].portionInfo}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(item)}
                          className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Frozen Items Results */}
          {frozenResults.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400">
                Frozen Items ({frozenResults.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {frozenResults.map((item) => (
                  <Card key={item.id} className="card-base group">
                    <div className="card-image-container">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="card-image"
                      />
                      <div className="card-image-overlay" />
                    </div>
                    <div className="card-content">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg text-slate-200">{item.name}</h3>
                        <span className="tag-base">{item.category}</span>
                      </div>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-300">
                          <span className="font-semibold text-orange-400">
                            £{item.price.toFixed(2)}
                          </span>
                          <span className="text-slate-500 ml-2">
                            {item.servings}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(item)}
                          className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
} 