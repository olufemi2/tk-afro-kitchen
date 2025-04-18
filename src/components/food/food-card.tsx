import Image from "next/image";
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
    <Card className="overflow-hidden group">
      <div className="relative aspect-square">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
        <Button
          size="icon"
          className="absolute top-4 right-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => {
            // TODO: Implement add to cart functionality
            console.log(`Add ${id} to cart`);
          }}
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add to cart</span>
        </Button>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold">{name}</h3>
          <span className="font-medium">£{price.toFixed(2)}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <span className="text-xs text-muted-foreground">{category}</span>
      </CardFooter>
    </Card>
  );
} 