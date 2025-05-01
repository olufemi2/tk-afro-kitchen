'use client';

import { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  price: number;
  quantity: number;
  size?: 'small' | 'regular' | 'large';
  portionInfo: string;
  selectedSize: {
    size: string;
    price: number;
    portionInfo: string;
  };
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string, size: string) => void;
  updateQuantity: (itemId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  specialInstructions: string;
  setSpecialInstructions: (instructions: string) => void;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalPrice: 0,
  isCartOpen: false,
  setIsCartOpen: () => {},
  specialInstructions: '',
  setSpecialInstructions: () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');

  useEffect(() => {
    const total = items.reduce((sum, item) => {
      // Use selectedSize.price if available, otherwise fall back to item.price
      const itemPrice = item.selectedSize?.price ?? item.price;
      return sum + itemPrice * item.quantity;
    }, 0);
    setTotalPrice(total);
  }, [items]);

  const addToCart = (newItem: CartItem) => {
    // Validate the item has all required properties
    if (!isValidCartItem(newItem)) {
      console.error('Invalid cart item:', newItem);
      return;
    }

    setItems(currentItems => {
      const existingItemIndex = currentItems.findIndex(
        item => item.id === newItem.id && item.selectedSize.size === newItem.selectedSize.size
      );

      if (existingItemIndex > -1) {
        return currentItems.map((item, index) => {
          if (index === existingItemIndex) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        });
      }

      return [...currentItems, newItem];
    });
  };

  // Helper function to validate cart items
  function isValidCartItem(item: any): item is CartItem {
    return (
      typeof item === 'object' &&
      typeof item.id === 'string' &&
      typeof item.name === 'string' &&
      typeof item.description === 'string' &&
      typeof item.imageUrl === 'string' &&
      typeof item.category === 'string' &&
      typeof item.price === 'number' &&
      typeof item.quantity === 'number' &&
      typeof item.portionInfo === 'string' &&
      item.selectedSize &&
      typeof item.selectedSize.size === 'string' &&
      typeof item.selectedSize.price === 'number' &&
      typeof item.selectedSize.portionInfo === 'string'
    );
  }

  const removeFromCart = (itemId: string, size: string) => {
    setItems(currentItems => 
      currentItems.filter(item => !(item.id === itemId && item.size === size))
    );
  };

  const updateQuantity = (itemId: string, size: string, quantity: number) => {
    setItems(currentItems =>
      currentItems.map(item => {
        if (item.id === itemId && item.size === size) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalPrice,
      isCartOpen,
      setIsCartOpen,
      specialInstructions,
      setSpecialInstructions,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext); 