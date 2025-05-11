'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { LucideIcon } from "lucide-react";

interface ServiceFeature {
  text: string;
}

interface ServiceCardProps {
  title: string;
  description: string;
  features: ServiceFeature[];
  actionLabel: string;
  actionHref: string;
  image: string;
  icon: LucideIcon;
}

export function ServiceCard({ title, description, features, actionLabel, actionHref, image, icon: Icon }: ServiceCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden group hover:shadow-lg transition-all duration-300 border-orange-100">
      <div className="relative aspect-[16/9]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full">
          <Icon className="w-6 h-6 text-orange-600" />
        </div>
      </div>
      <CardContent className="pt-6 flex-grow bg-white/80 backdrop-blur-sm">
        <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-yellow-500">
          {title}
        </h3>
        <p className="text-muted-foreground mb-6">{description}</p>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-orange-600"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-sm">{feature.text}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="bg-white/80 backdrop-blur-sm">
        <Button asChild className="w-full bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-orange-700 hover:to-yellow-600 text-white">
          <a href={actionHref}>{actionLabel}</a>
        </Button>
      </CardFooter>
    </Card>
  );
} 