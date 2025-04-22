'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  price: number;
  quantity: number;
  size?: 'small' | 'regular' | 'large';
  portionInfo: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string, size: string) => void;
  updateQuantity: (itemId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalPrice: 0,
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(total);
  }, [items]);

  const addToCart = (newItem: CartItem) => {
    setItems(currentItems => {
      const existingItemIndex = currentItems.findIndex(
        item => item.id === newItem.id && item.size === newItem.size
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
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext); 