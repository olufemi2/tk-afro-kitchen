'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Info } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

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
  const { addToCart, setIsCartOpen } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      id,
      name,
      description,
      price,
      imageUrl,
      category,
      quantity: 1,
      portionInfo: servings,
      selectedSize: {
        size: 'regular',
        price: price,
        portionInfo: servings
      }
    });
    
    setIsOpen(false); // Close the sheet
    setIsCartOpen(true); // Open the cart modal
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Card className="group bg-[#1e1e1e] hover:shadow-xl transition-all duration-300 border-orange-900/20 cursor-pointer">
          <div className="relative aspect-[16/9]">
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
          </div>
          <CardContent>
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1 text-orange-400">{name}</h3>
                <p className="text-sm text-slate-300 line-clamp-2">{description}</p>
              </div>
              <div className="text-right">
                <div className="text-yellow-400 font-medium">
                  £{price.toFixed(2)}
                </div>
              </div>
            </div>
          </CardContent>
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
            <h3 className="text-lg font-semibold text-slate-200 mb-2">Product Details</h3>
            <div className="space-y-4">
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
              
              <div className="bg-[#242424] rounded-lg p-4">
                <p className="text-sm text-slate-300">{description}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-slate-200">Price</span>
              <span className="text-xl font-bold text-yellow-400">£{price.toFixed(2)}</span>
            </div>
            
            <Button 
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
