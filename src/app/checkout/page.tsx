'use client';

import { Header } from "@/components/layout/header";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface DeliveryDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  postcode: string;
  city: string;
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    postcode: '',
    city: ''
  });
  
  // Move the cart check to useEffect to avoid navigation during render
  useEffect(() => {
    if (items.length === 0) {
      router.push('/menu');
    }
  }, [items, router]);

  // Return early if cart is empty
  if (items.length === 0) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDeliveryDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate order processing
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically:
      // 1. Process payment
      // 2. Save order to database
      // 3. Send confirmation email
      
      clearCart();
      router.push('/order-confirmation');
    } catch (error) {
      console.error('Error processing order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400">Checkout</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-[#1e1e1e] p-6 rounded-lg border border-orange-900/20">
              <h2 className="text-xl font-semibold mb-4 text-orange-400">Order Summary</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between border-b border-orange-900/20 pb-4">
                    <div>
                      <p className="font-medium text-slate-200">{item.name}</p>
                      <p className="text-sm text-slate-400">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-yellow-400">£{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                <div className="pt-4 border-t border-orange-900/20">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-200">Total</span>
                    <span className="text-yellow-400">£{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Details Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName" className="text-slate-200">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={deliveryDetails.fullName}
                    onChange={handleInputChange}
                    required
                    className="bg-[#242424] border-orange-900/20 text-slate-200 focus:border-orange-500/50 focus:ring-orange-500/50"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-slate-200">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={deliveryDetails.email}
                    onChange={handleInputChange}
                    required
                    className="bg-[#242424] border-orange-900/20 text-slate-200 focus:border-orange-500/50 focus:ring-orange-500/50"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-slate-200">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={deliveryDetails.phone}
                    onChange={handleInputChange}
                    required
                    className="bg-[#242424] border-orange-900/20 text-slate-200 focus:border-orange-500/50 focus:ring-orange-500/50"
                  />
                </div>
                <div>
                  <Label htmlFor="address" className="text-slate-200">Delivery Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={deliveryDetails.address}
                    onChange={handleInputChange}
                    required
                    className="bg-[#242424] border-orange-900/20 text-slate-200 focus:border-orange-500/50 focus:ring-orange-500/50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="postcode" className="text-slate-200">Postcode</Label>
                    <Input
                      id="postcode"
                      name="postcode"
                      value={deliveryDetails.postcode}
                      onChange={handleInputChange}
                      required
                      className="bg-[#242424] border-orange-900/20 text-slate-200 focus:border-orange-500/50 focus:ring-orange-500/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city" className="text-slate-200">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={deliveryDetails.city}
                      onChange={handleInputChange}
                      required
                      className="bg-[#242424] border-orange-900/20 text-slate-200 focus:border-orange-500/50 focus:ring-orange-500/50"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
