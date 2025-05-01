'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ChefHat } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function CartModal() {
  const { 
    items, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    totalPrice,
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
      <SheetContent className="w-full sm:max-w-lg bg-[#1a1a1a] border-l border-orange-900/20">
        <SheetHeader>
          <SheetTitle className="text-orange-400">Your Cart</SheetTitle>
        </SheetHeader>
        
        <div className="mt-8 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
          {items.length === 0 ? (
            <p className="text-center text-slate-400">Your cart is empty</p>
          ) : (
            <>
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 py-4 border-b border-orange-900/20">
                  <div className="relative w-24 h-24">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-orange-400">{item.name}</h3>
                    {item.selectedSize && (
                      <p className="text-sm text-slate-400">
                        {item.selectedSize.size} - {item.selectedSize.portionInfo}
                      </p>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 border-orange-900/20 bg-[#242424] hover:bg-[#2a2a2a]"
                          onClick={() => updateQuantity(item.id, item.selectedSize.size, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center text-slate-300">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 border-orange-900/20 bg-[#242424] hover:bg-[#2a2a2a]"
                          onClick={() => updateQuantity(item.id, item.selectedSize.size, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-950/20"
                        onClick={() => removeFromCart(item.id, item.selectedSize.size)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-yellow-400">
                      £{((item.selectedSize?.price || item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}

              <div className="pt-4 space-y-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-slate-300">Total</span>
                  <span className="text-yellow-400">£{totalPrice.toFixed(2)}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-300">
                    <ChefHat className="h-4 w-4 text-orange-400" />
                    <span className="text-sm font-medium">Special Instructions</span>
                  </div>
                  <Textarea
                    placeholder="Optional: Add any special requests for your order (e.g., 'Extra spicy please', 'No onions', 'Allergies: nuts')"
                    className="min-h-[100px] bg-[#242424] border-orange-900/20 text-slate-300 placeholder:text-slate-500 resize-none"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                  />
                  <p className="text-xs text-slate-400">
                    * Our chef will do their best to accommodate your requests
                  </p>
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