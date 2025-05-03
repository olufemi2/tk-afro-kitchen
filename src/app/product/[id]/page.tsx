'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { featuredDishes } from '@/data/sample-menu';
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import Image from "next/image";

export default function ProductPage() {
  const params = useParams();
  const product = featuredDishes.find(dish => dish.id === params.id);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(product?.defaultSizeIndex || 0);

  const { addToCart } = useCart();

  if (!product) return <div>Product not found</div>;

  const handleAddToCart = () => {
    const selectedSize = product.sizeOptions[selectedSizeIndex];
    
    addToCart({
      id: product.id,
      name: product.name,
      description: product.description,
      imageUrl: product.imageUrl,
      category: product.category,
      price: selectedSize.price,
      quantity: 1,
      portionInfo: selectedSize.portionInfo,
      selectedSize: {
        size: selectedSize.size,
        price: selectedSize.price,
        portionInfo: selectedSize.portionInfo
      }
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative aspect-square">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className="object-cover rounded-lg"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-orange-400">{product.name}</h1>
              <p className="text-2xl font-semibold text-yellow-400">
                £{product.sizeOptions[selectedSizeIndex].price.toFixed(2)}
              </p>
              <p className="text-sm text-slate-400">
                {product.sizeOptions[selectedSizeIndex].portionInfo}
              </p>
            </div>

            {product.sizeOptions?.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-200">Select Size</h2>
                <div className="grid gap-3">
                  {product.sizeOptions.map((option, index) => (
                    <button
                      key={option.size}
                      onClick={() => setSelectedSizeIndex(index)}
                      className={`w-full p-4 rounded-lg border transition-all ${
                        index === selectedSizeIndex 
                          ? 'border-orange-500 bg-orange-500/10' 
                          : 'border-gray-700 hover:border-orange-500/50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="text-left">
                          <p className="font-medium capitalize text-slate-200">{option.size}</p>
                          <p className="text-sm text-slate-400">{option.portionInfo}</p>
                        </div>
                        <p className="text-lg font-semibold text-yellow-400">
                          £{option.price.toFixed(2)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="text-xl font-semibold mb-2 text-slate-200">Description</h2>
              <p className="text-slate-300">{product.description}</p>
            </div>

            <Button 
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white py-6 text-lg"
            >
              Add to Cart - £{product.sizeOptions[selectedSizeIndex].price.toFixed(2)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 