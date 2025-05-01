'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { featuredDishes, MenuItemVariant } from '@/data/sample-menu';
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import Image from "next/image";

export default function ProductPage() {
  const params = useParams();
  const product = featuredDishes.find(dish => dish.id === params.id);
  
  const [selectedVariant, setSelectedVariant] = useState<MenuItemVariant | null>(
    product?.variants ? product.variants[product.defaultVariantIndex || 0] : null
  );
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);

  const { addToCart } = useCart();

  if (!product) return <div>Product not found</div>;

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    
    const selectedSize = selectedVariant.sizeOptions[selectedSizeIndex];
    const cartItem = {
      id: product.id,
      name: product.name,
      price: selectedSize.price,
      size: selectedSize.size,
      quantity: 1,
      imageUrl: product.imageUrl,
      description: product.description,
      portionInfo: selectedSize.portionInfo
    };
    addToCart(cartItem);
  };

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
            <p className="text-2xl font-semibold">£{selectedVariant?.price.toFixed(2)}</p>
            {selectedVariant?.portionInfo && (
              <p className="text-sm text-gray-400">
                {selectedVariant.portionInfo}
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
                    onClick={() => setSelectedSizeIndex(index)}
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
            onClick={handleAddToCart}
            className="w-full button-primary py-6 text-lg"
          >
            Add to Cart - £{selectedVariant?.price.toFixed(2)}
          </Button>
        </div>
      </div>
    </div>
  );
} 