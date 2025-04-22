import { CartItem } from '@/contexts/CartContext';
import { MenuItem, SizeOption } from '@/data/sample-menu';

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

  // Create the cart item with all required properties
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    imageUrl: item.imageUrl,
    category: item.category,
    quantity: quantity,
    price: defaultSize?.price ?? item.price,
    portionInfo: defaultSize?.portionInfo ?? "Single portion",
    // Convert size to lowercase and ensure it matches allowed types
    size: (defaultSize?.size.toLowerCase() as 'small' | 'regular' | 'large') || 'regular',
    // Always include selectedSize object
    selectedSize: {
      size: defaultSize?.size ?? "Regular",
      price: defaultSize?.price ?? item.price,
      portionInfo: defaultSize?.portionInfo ?? "Single portion"
    }
  };
} 