'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Plus, Users, Snowflake } from "lucide-react";

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
  return (
    <Card className="group card-base card-hover overflow-hidden">
      <Link href={`/frozen/${id}`}>
        <div className="relative aspect-[4/3] cursor-pointer overflow-hidden">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Button
            size="icon"
            className="absolute top-4 right-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white hover:bg-orange-50 text-orange-600"
            onClick={(e) => {
              e.preventDefault();
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
        <Link href={`/frozen/${id}`} className="block">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
              {name}
            </h3>
            <span className="font-medium text-orange-600">£{price.toFixed(2)}</span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{description}</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Users className="h-4 w-4 text-orange-500" />
              <span>{servings}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Snowflake className="h-4 w-4 text-orange-500" />
              <span>{storageInfo}</span>
            </div>
          </div>
        </Link>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <span className="text-xs font-medium text-orange-600/90 bg-orange-50 px-2.5 py-1 rounded-full">
          {category}
        </span>
      </CardFooter>
    </Card>
  );
} 