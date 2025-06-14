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

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          if (Array.isArray(parsedCart)) {
            setItems(parsedCart);
          }
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(items));
      }
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [items]);

  useEffect(() => {
    const total = items.reduce((sum, item) => {
      return sum + item.selectedSize.price * item.quantity;
    }, 0);
    setTotalPrice(total);
  }, [items]);

  const addToCart = (newItem: CartItem) => {
    try {
      if (!newItem.id || !newItem.selectedSize) {
        console.error('Invalid cart item:', newItem);
        return;
      }

      console.log('Adding to cart:', newItem);

      setItems(currentItems => {
        const existingItemIndex = currentItems.findIndex(
          item => item.id === newItem.id && item.selectedSize.size === newItem.selectedSize.size
        );

        if (existingItemIndex > -1) {
          // Update quantity of existing item
          const updatedItems = currentItems.map((item, index) => {
            if (index === existingItemIndex) {
              return { ...item, quantity: item.quantity + 1 };
            }
            return item;
          });
          console.log('Updated existing item, new cart:', updatedItems);
          return updatedItems;
        }

        // Add new item
        const newItems = [...currentItems, { ...newItem, quantity: 1 }];
        console.log('Added new item, new cart:', newItems);
        return newItems;
      });

      // Open the cart modal when an item is added
      console.log('Opening cart modal');
      setIsCartOpen(true);
    } catch (error) {
      console.error('Error in addToCart:', error);
    }
  };

  const removeFromCart = (itemId: string, size: string) => {
    setItems(currentItems => 
      currentItems.filter(item => !(item.id === itemId && item.selectedSize.size === size))
    );
  };

  const updateQuantity = (itemId: string, size: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(itemId, size);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item => {
        if (item.id === itemId && item.selectedSize.size === size) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
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