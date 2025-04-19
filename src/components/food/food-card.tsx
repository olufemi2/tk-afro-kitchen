'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface FoodCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

export function FoodCard({ id, name, description, price, imageUrl, category }: FoodCardProps) {
  return (
    <Card className="overflow-hidden group bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-orange-100">
      <Link href={`/product/${id}`}>
        <div className="relative aspect-square cursor-pointer">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Button
            size="icon"
            className="absolute top-4 right-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-orange-700 hover:to-yellow-600 text-white border-none"
            onClick={(e) => {
              e.preventDefault(); // Prevent navigation when clicking the button
              // TODO: Implement add to cart functionality
              console.log(`Add ${id} to cart`);
            }}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add to cart</span>
          </Button>
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/product/${id}`} className="block">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold hover:text-orange-600 transition-colors">{name}</h3>
            <span className="font-medium text-orange-600">£{price.toFixed(2)}</span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </Link>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <span className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-orange-100 to-yellow-50 text-orange-700">{category}</span>
      </CardFooter>
    </Card>
  );
} 