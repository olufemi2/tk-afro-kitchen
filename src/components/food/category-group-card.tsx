'use client';

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FoodCard } from "./food-card";
import { MenuItem } from "@/data/sample-menu";

interface CategoryGroupCardProps {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  items: MenuItem[];  // All menu items in this category group
}

export function CategoryGroupCard({
  id,
  name,
  description,
  imageUrl,
  items
}: CategoryGroupCardProps) {
  return (
    <Sheet>
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
                <div className="mt-2 text-xs text-orange-400">
                  {items.length} options available
                </div>
              </div>
              <Button className="button-primary py-2 px-4 text-sm">
                View Options
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </Card>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-full sm:w-[540px] bg-[#1e1e1e] p-0">
        <SheetHeader className="p-6 border-b border-orange-900/20">
          <SheetTitle className="text-gradient text-2xl">{name}</SheetTitle>
        </SheetHeader>
        <div className="p-6 overflow-y-auto max-h-[calc(100vh-100px)]">
          <div className="grid gap-4">
            {items.map((item) => (
              <FoodCard
                key={item.id}
                {...item}
                price={item.sizeOptions[item.defaultSizeIndex].price}
              />
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
} 