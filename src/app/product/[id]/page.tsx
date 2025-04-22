'use client';

import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { featuredDishes } from "@/data/sample-menu";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";

type SizeType = 'small' | 'regular' | 'large';

export default function ProductPage({ params }: { params: { id: string } }) {
  const [selectedSize, setSelectedSize] = useState<SizeType>('regular');
  const { addToCart } = useCart();

  const product = featuredDishes.find(dish => dish.id === params.id);

  if (!product) {
    return notFound();
  }

  const currentSizeOption = product.sizeOptions?.[product.defaultSizeIndex ?? 0];
  const currentPrice = currentSizeOption?.price ?? product.price ?? product.sizeOptions?.[0]?.price ?? 0;

  return (
    <div className="container mx-auto px-4 py-8">
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
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-2xl font-semibold">£{currentPrice.toFixed(2)}</p>
            {currentSizeOption?.portionInfo && (
              <p className="text-sm text-gray-400">
                {currentSizeOption.portionInfo}
              </p>
            )}
          </div>

          {product.sizeOptions?.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Select Size</h2>
              <div className="grid gap-3">
                {product.sizeOptions.map((option, index) => (
                  <button
                    key={option.size}
                    onClick={() => setSelectedSize(option.size as SizeType)}
                    className={`w-full p-4 rounded-lg border transition-all ${
                      index === product.defaultSizeIndex 
                        ? 'border-orange-500 bg-orange-500/10' 
                        : 'border-gray-700 hover:border-orange-500/50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="text-left">
                        <p className="font-medium capitalize">{option.size}</p>
                        <p className="text-sm text-gray-400">{option.portionInfo}</p>
                      </div>
                      <p className="text-lg font-semibold">
                        £{option.price.toFixed(2)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-600">{product.description}</p>
          </div>

          <Button 
            onClick={() => {
              addToCart({
                ...product,
                quantity: 1,
                price: currentPrice,
                size: currentSizeOption?.size
              });
            }}
            className="w-full button-primary py-6 text-lg"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add to Cart - £{currentPrice.toFixed(2)}
          </Button>
        </div>
      </div>
    </div>
  );
} 