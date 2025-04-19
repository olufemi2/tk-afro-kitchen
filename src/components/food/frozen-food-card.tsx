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
    <Card className="overflow-hidden group bg-[#1e1e1e] border-orange-900/20 hover:border-orange-500/50 transition-all duration-300">
      <Link href={`/frozen/${id}`}>
        <div className="relative aspect-[4/3] cursor-pointer overflow-hidden">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Button
            size="icon"
            className="absolute top-4 right-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-orange-500 hover:bg-orange-600 text-white"
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
      <CardContent className="p-4 bg-[#1e1e1e]">
        <Link href={`/frozen/${id}`} className="block">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-slate-200 hover:text-orange-400 transition-colors">{name}</h3>
            <span className="font-medium text-orange-400">£{price.toFixed(2)}</span>
          </div>
          <p className="text-sm text-slate-400 line-clamp-2 mb-2">{description}</p>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Users className="h-4 w-4" />
            <span>{servings}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
            <Snowflake className="h-4 w-4" />
            <span>{storageInfo}</span>
          </div>
        </Link>
      </CardContent>
      <CardFooter className="p-4 pt-0 bg-[#1e1e1e]">
        <span className="text-xs text-orange-400/70">{category}</span>
      </CardFooter>
    </Card>
  );
} 