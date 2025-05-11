'use client';

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

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
  sizeOptions: SizeOption[];
  defaultSizeIndex: number;
}

export function FoodCard({
  id,
  name,
  description,
  imageUrl,
  category,
  sizeOptions,
  defaultSizeIndex
}: FoodCardProps) {
  const { addToCart, setIsCartOpen } = useCart();
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(defaultSizeIndex);
  const [isOpen, setIsOpen] = useState(false);

  const handleAddToCart = () => {
    const selectedSize = sizeOptions[selectedSizeIndex];
    
    addToCart({
      id,
      name,
      description,
      imageUrl,
      category,
      price: selectedSize.price,
      quantity: 1,
      portionInfo: selectedSize.portionInfo,
      selectedSize: {
        size: selectedSize.size,
        price: selectedSize.price,
        portionInfo: selectedSize.portionInfo
      }
    });
    
    setIsOpen(false); // Close the sheet
    setIsCartOpen(true); // Open the cart modal
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Card className="group bg-[#1e1e1e] backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-orange-900/20 cursor-pointer">
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
                    From £{sizeOptions[0].price.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-400">
                    {sizeOptions.length} size options
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-full sm:max-w-md bg-[#1e1e1e] border-l border-orange-900/20">
        <SheetHeader>
          <SheetTitle className="text-orange-400">{name}</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover"
            />
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-2">Select Size</h3>
            <div className="space-y-3">
              {sizeOptions.map((option, index) => (
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
                      <p className="font-medium text-slate-200 capitalize">{option.size}</p>
                      <p className="text-sm text-slate-400">{option.portionInfo}</p>
                    </div>
                    <p className="text-lg font-semibold text-orange-400">
                      £{option.price.toFixed(2)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-6">
            <p className="text-sm text-slate-300 mb-4">{description}</p>
            <Button 
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart - £{sizeOptions[selectedSizeIndex].price.toFixed(2)}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}