import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

interface CategoryCardProps {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export function CategoryCard({ id, name, description, imageUrl }: CategoryCardProps) {
  return (
    <Link href={`/menu/${id}`}>
      <Card className="overflow-hidden group cursor-pointer">
        <div className="relative aspect-[4/3]">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="font-semibold text-lg mb-1">{name}</h3>
            <p className="text-sm text-white/80 line-clamp-2">{description}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
} 