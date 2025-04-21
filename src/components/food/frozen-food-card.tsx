'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Info } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

interface FrozenFoodCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  servings: string;
  storageInfo: string;
}

export function FrozenFoodCard({
  id,
  name,
  description,
  price,
  imageUrl,
  category,
  servings,
  storageInfo,
}: FrozenFoodCardProps) {
  const { addToCart } = useCart();
  const [showDetails, setShowDetails] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id,
      name,
      description,
      price,
      imageUrl,
      category
    });
  };

  return (
    <Card className="group bg-[#1e1e1e] hover:shadow-xl transition-all duration-300 border-orange-900/20">
      <div className="relative aspect-[16/9]">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        <Button
          size="icon"
          className="absolute top-4 right-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-[#1e1e1e]/80 hover:bg-[#1e1e1e] text-orange-400"
          onClick={(e) => {
            e.stopPropagation();
            setShowDetails(!showDetails);
          }}
        >
          <Info className="h-4 w-4" />
          <span className="sr-only">View details</span>
        </Button>
      </div>
      <CardContent>
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1 text-orange-400">{name}</h3>
            <p className="text-sm text-slate-300">{description}</p>
            
            <div className={`mt-3 space-y-2 overflow-hidden transition-all duration-300 ${
              showDetails ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-2 bg-orange-400/10 px-3 py-1.5 rounded-full">
                  <span>🍽️</span>
                  <span>{servings}</span>
                </div>
                <div className="flex items-center gap-2 bg-orange-400/10 px-3 py-1.5 rounded-full">
                  <span>❄️</span>
                  <span>{storageInfo}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="font-medium text-yellow-400">£{price.toFixed(2)}</span>
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
