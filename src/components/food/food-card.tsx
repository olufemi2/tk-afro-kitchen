'use client';

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";

interface SizeOption {
  size: string;
  price: number;
  portionInfo: string;
}

interface FoodCardProps {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  price: number;
  sizeOptions: SizeOption[];
  defaultSizeIndex: number;
}

export function FoodCard({
  id,
  name,
  description,
  imageUrl,
  category,
  price,
  sizeOptions,
  defaultSizeIndex
}: FoodCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    const defaultSize = sizeOptions?.length > 0 ? sizeOptions[defaultSizeIndex] : null;
    
    addToCart({
      id,
      name,
      description,
      imageUrl,
      category,
      price,
      quantity: 1,
      portionInfo: defaultSize?.portionInfo || 'Standard portion',
      selectedSize: {
        size: defaultSize?.size || 'regular',
        price: defaultSize?.price || price,
        portionInfo: defaultSize?.portionInfo || 'Standard portion'
      }
    });
  };

  return (
    <Link href={`/product/${id}`}>
      <Card className="group bg-[#1e1e1e] backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-orange-900/20">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-lg">
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h3 className="text-gradient text-lg mb-1">{name}</h3>
              <p className="text-sm text-slate-300 line-clamp-2">{description}</p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="text-right">
                <div className="text-orange-400 font-medium">
                  £{((sizeOptions?.length > 0 ? sizeOptions[defaultSizeIndex]?.price : price) || 0).toFixed(2)}
                </div>
                <div className="text-xs text-slate-400">
                  {(sizeOptions?.length > 0 ? sizeOptions[defaultSizeIndex]?.portionInfo : 'Standard portion')}
                </div>
              </div>
              <Button 
                onClick={handleAddToCart}
                className="button-primary py-2 px-4 text-sm"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
} 