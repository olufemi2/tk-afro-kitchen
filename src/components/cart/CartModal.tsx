'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

export function CartModal() {
  const { 
    items, 
    totalPrice, 
    isCartOpen, 
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    specialInstructions,
    setSpecialInstructions
  } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.push('/checkout');
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md bg-[#1e1e1e] border-l border-orange-900/20">
        <SheetHeader>
          <SheetTitle className="text-orange-400">Your Cart</SheetTitle>
        </SheetHeader>

        <div className="mt-8 flex flex-col h-[calc(100vh-8rem)]">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-slate-400">Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-4">
                {items.map((item) => (
                  <div key={`${item.id}-${item.selectedSize.size}`} className="flex gap-4 p-4 bg-[#242424] rounded-lg">
                    <div className="relative w-20 h-20">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-200">{item.name}</h3>
                      <p className="text-sm text-slate-400">
                        {item.selectedSize.size} - {item.selectedSize.portionInfo}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.selectedSize.size, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-slate-200 min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.selectedSize.size, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 ml-2"
                          onClick={() => removeFromCart(item.id, item.selectedSize.size)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-orange-400">
                        £{(item.selectedSize.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-orange-900/20 pt-4 mt-4">
                <Textarea
                  placeholder="Add any special instructions..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="mb-4 bg-[#242424] border-orange-900/20 text-slate-200 placeholder:text-slate-400"
                />
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-medium text-slate-200">Total</span>
                  <span className="text-lg font-medium text-orange-400">
                    £{totalPrice.toFixed(2)}
                  </span>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
} 