'use client';

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MenuItemVariant } from "@/data/sample-menu";

interface VariantFoodCardProps {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  variants: MenuItemVariant[];
  defaultVariantIndex: number;
}

export function VariantFoodCard({
  id,
  name,
  description,
  imageUrl,
  category,
  variants,
  defaultVariantIndex
}: VariantFoodCardProps) {
  const defaultVariant = variants[defaultVariantIndex];
  const defaultSize = defaultVariant.sizeOptions[defaultVariant.defaultSizeIndex];

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
              <div className="mt-2 text-xs text-orange-400">
                {variants.length} variations available
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="text-right">
                <div className="text-orange-400 font-medium">
                  From £{defaultSize.price.toFixed(2)}
                </div>
                <div className="text-xs text-slate-400">
                  Select variant to order
                </div>
              </div>
              <Button 
                className="button-primary py-2 px-4 text-sm"
              >
                View Options
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
} 