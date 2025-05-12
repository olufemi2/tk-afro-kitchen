'use client';

import { Header } from "@/components/layout/header";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

interface DeliveryDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  postcode: string;
  city: string;
}

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

if (!PAYPAL_CLIENT_ID) {
  console.error('PayPal client ID is not configured');
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    postcode: '',
    city: ''
  });
  
  useEffect(() => {
    if (items.length === 0) {
      router.push('/menu');
    }
  }, [items, router]);

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
    if (!paymentSuccess) {
      alert('Please complete the PayPal payment first');
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Here you would typically send the order details to your backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      clearCart();
      router.push('/order-confirmation');
    } catch (error) {
      console.error('Error processing order:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-black">Checkout</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-black">Order Summary</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between border-b border-gray-200 pb-4">
                    <div>
                      <p className="font-medium text-black">{item.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-black">£{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between font-semibold">
                    <span className="text-black">Total</span>
                    <span className="text-black">£{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Details Form and PayPal */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName" className="text-black">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={deliveryDetails.fullName}
                      onChange={handleInputChange}
                      required
                      className="mt-1 bg-white border-gray-300 text-black placeholder-gray-400 focus:border-gray-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-black">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={deliveryDetails.email}
                      onChange={handleInputChange}
                      required
                      className="mt-1 bg-white border-gray-300 text-black placeholder-gray-400 focus:border-gray-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-black">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={deliveryDetails.phone}
                      onChange={handleInputChange}
                      required
                      className="mt-1 bg-white border-gray-300 text-black placeholder-gray-400 focus:border-gray-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address" className="text-black">Delivery Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={deliveryDetails.address}
                      onChange={handleInputChange}
                      required
                      className="mt-1 bg-white border-gray-300 text-black placeholder-gray-400 focus:border-gray-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="postcode" className="text-black">Postcode</Label>
                      <Input
                        id="postcode"
                        name="postcode"
                        value={deliveryDetails.postcode}
                        onChange={handleInputChange}
                        required
                        className="mt-1 bg-white border-gray-300 text-black placeholder-gray-400 focus:border-gray-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city" className="text-black">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={deliveryDetails.city}
                        onChange={handleInputChange}
                        required
                        className="mt-1 bg-white border-gray-300 text-black placeholder-gray-400 focus:border-gray-500"
                      />
                    </div>
                  </div>
                </div>

                {/* PayPal Payment Section */}
                <div className="mt-8">
                  <PayPalScriptProvider 
                    options={{ 
                      clientId: PAYPAL_CLIENT_ID || '',
                      currency: "GBP",
                      intent: "capture",
                      components: "buttons"
                    }}
                  >
                    <PayPalButtons
                      style={{ layout: "vertical" }}
                      createOrder={(data, actions) => {
                        if (!actions.order) {
                          throw new Error('PayPal order actions not available');
                        }
                        return actions.order.create({
                          intent: "CAPTURE",
                          purchase_units: [{
                            amount: {
                              currency_code: "GBP",
                              value: totalPrice.toFixed(2),
                            },
                            description: `Order from TK Afro Kitchen - ${items.length} items`
                          }],
                        });
                      }}
                      onApprove={async (data, actions) => {
                        if (!actions.order) {
                          throw new Error('PayPal order actions not available');
                        }
                        try {
                          const details = await actions.order.capture();
                          console.log('Payment successful:', details);
                          setPaymentSuccess(true);
                          alert("Payment successful! Please complete the delivery details and submit the order.");
                        } catch (error) {
                          console.error('Payment error:', error);
                          alert("There was an error processing your payment. Please try again.");
                        }
                      }}
                      onError={(err) => {
                        console.error('PayPal error:', err);
                        alert("There was an error with PayPal. Please try again.");
                      }}
                      onCancel={() => {
                        setPaymentSuccess(false);
                        alert("Payment cancelled. Please try again.");
                      }}
                    />
                  </PayPalScriptProvider>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded"
                  disabled={isSubmitting || !paymentSuccess}
                >
                  {isSubmitting ? 'Processing...' : 'Complete Order'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}