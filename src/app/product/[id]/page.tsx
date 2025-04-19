'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { featuredDishes } from "@/data/sample-menu";
import { ShoppingCart } from "lucide-react";

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = featuredDishes.find(dish => dish.id === params.id);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Header />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
              />
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-2xl font-semibold">£{product.price.toFixed(2)}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground">{product.description}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2">Category</h2>
                <p className="text-muted-foreground">{product.category}</p>
              </div>

              <Button size="lg" className="w-full md:w-auto">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 