import { featuredDishes } from "@/data/sample-menu";
import ProductDetailClient from "./ProductDetailClient";

export async function generateStaticParams() {
  return featuredDishes.map(dish => ({ id: dish.id }));
}

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function ProductPage({ params }: Props) {
  const dish = featuredDishes.find(d => d.id === params.id);
  if (!dish) return <div>Not found</div>;
  return <ProductDetailClient dish={dish} />;
} 