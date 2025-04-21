import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";

interface CategoryCardProps {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export function CategoryCard({ id, name, description, imageUrl }: CategoryCardProps) {
  return (
    <Link href={`/menu#${id}`}>
      <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300 border-orange-900/20 rounded-xl py-0">
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform group-hover:translate-y-[-4px]">
            <h3 className="font-semibold text-xl mb-2 bg-clip-text text-transparent bg-gradient-to-r from-orange-100 to-yellow-100">
              {name}
            </h3>
            <p className="text-sm text-white/90 line-clamp-2 group-hover:text-white transition-colors">
              {description}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
