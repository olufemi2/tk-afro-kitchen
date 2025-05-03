import { featuredDishes } from "@/data/sample-menu";
import ProductDetailClient from "./ProductDetailClient";

export async function generateStaticParams() {
  return featuredDishes.map(dish => ({ id: dish.id }));
}

export default function ProductPage({ params }) {
  const dish = featuredDishes.find(d => d.id === params.id);
  if (!dish) return <div>Not found</div>;
  return <ProductDetailClient dish={dish} />;
} 