'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart, Plus, Users, Snowflake, Info } from "lucide-react";
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

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <Card className="group card-base card-hover overflow-hidden">
      <div className="relative aspect-[4/3] cursor-pointer overflow-hidden" onClick={toggleDetails}>
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button
            size="icon"
            className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white hover:bg-orange-50 text-orange-600"
            onClick={handleAddToCart}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add to cart</span>
          </Button>
          <Button
            size="icon"
            className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white hover:bg-orange-50 text-orange-600"
            onClick={(e) => {
              e.stopPropagation();
              toggleDetails();
            }}
          >
            <Info className="h-4 w-4" />
            <span className="sr-only">View details</span>
          </Button>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div onClick={toggleDetails} className="cursor-pointer">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
              {name}
            </h3>
            <span className="font-medium text-orange-600">£{price.toFixed(2)}</span>
          </div>
          
          {showDetails ? (
            <div>
              <p className="text-sm text-gray-600 mb-4">{description}</p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Users className="h-4 w-4 text-orange-500" />
                  <span>{servings}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Snowflake className="h-4 w-4 text-orange-500" />
                  <span>{storageInfo}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-600 line-clamp-3 mb-2">{description}</p>
          )}
        </div>
        
        {showDetails && (
          <Button 
            className="w-full mt-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <div className="flex justify-between items-center w-full">
          <span className="text-xs font-medium text-orange-600/90 bg-orange-50 px-2.5 py-1 rounded-full">
            {category}
          </span>
          {!showDetails && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-orange-600 hover:text-orange-700"
              onClick={toggleDetails}
            >
              View Details
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
