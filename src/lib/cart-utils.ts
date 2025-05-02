import { CartItem } from '@/contexts/CartContext';
import { MenuItem, SizeOption } from '@/data/sample-menu';
import { featuredDishes } from "@/data/sample-menu";
import { notFound } from "next/navigation";

// Helper function to create a cart item with all required properties
export function createCartItem(
  item: MenuItem,
  quantity: number = 1,
  selectedSize?: SizeOption
): CartItem {
  // If no size is selected but item has size options, use the default
  const defaultSize = selectedSize || (
    item.sizeOptions?.length > 0 
      ? item.sizeOptions[item.defaultSizeIndex] 
      : null
  );

  // Get the price from the size option or use the first available price as fallback
  const itemPrice = defaultSize?.price ?? item.sizeOptions[0].price;

  // Create the cart item with all required properties
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    imageUrl: item.imageUrl,
    category: item.category,
    quantity: quantity,
    price: itemPrice,
    portionInfo: defaultSize?.portionInfo ?? "Single portion",
    selectedSize: {
      size: defaultSize?.size ?? "Regular",
      price: itemPrice,
      portionInfo: defaultSize?.portionInfo ?? "Single portion"
    }
  };
}

export async function generateStaticParams() {
  return featuredDishes.map(dish => ({
    id: dish.id
  }));
}

// If using the app directory (Next.js 13+ with /app), use this type:
type ProductPageProps = {
  params: {
    id: string;
  };
};

export function getProductById(id: string) {
  return featuredDishes.find(dish => dish.id === id) || null;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = params;
  const product = getProductById(id);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      <h1>{product?.name}</h1>
      {/* Render the rest of your product details here */}
    </div>
  );
}