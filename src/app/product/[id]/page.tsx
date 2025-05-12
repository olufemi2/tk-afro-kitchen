import { featuredDishes } from "@/data/sample-menu";
import ProductDetailClient from "./ProductDetailClient";

export async function generateStaticParams() {
  return featuredDishes.map(dish => ({ id: dish.id }));
}

type Props = {
  params: Promise<{ id: string }>
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function ProductPage({ params }: Props) {
  const resolvedParams = await params;
  const dish = featuredDishes.find(d => d.id === resolvedParams.id);
  if (!dish) return <div>Not found</div>;
  return <ProductDetailClient dish={dish} />;
}