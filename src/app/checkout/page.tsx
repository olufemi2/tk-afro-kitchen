'use client';

import { Header } from "@/components/layout/header";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

interface DeliveryDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  postcode: string;
  city: string;
}

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

// Add debugging logs
console.log('PayPal Client ID:', PAYPAL_CLIENT_ID);
console.log('Environment:', process.env.NODE_ENV);

if (!PAYPAL_CLIENT_ID) {
  console.error('PayPal client ID is not configured');
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paypalError, setPaypalError] = useState<string | null>(null);
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    postcode: '',
    city: ''
  });
  const [isPayPalLoading, setIsPayPalLoading] = useState(false);
  
  // Add useEffect for debugging
  useEffect(() => {
    console.log('Total Price:', totalPrice);
    console.log('Items:', items);
  }, [totalPrice, items]);

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

  const validateOrder = () => {
    if (!totalPrice || totalPrice <= 0) {
      setPaypalError('Invalid order amount. Please refresh the page and try again.');
      return false;
    }
    
    if (items.length === 0) {
      setPaypalError('Your cart is empty. Please add items before proceeding.');
      return false;
    }
    
    return true;
  };

  return (
    <>
      <Header />
      <div className="min-h-screen pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-black">Checkout</h1>
          
          {/* Add error display */}
          {paypalError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {paypalError}
            </div>
          )}

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
                  {PAYPAL_CLIENT_ID && validateOrder() ? (
                    <PayPalScriptProvider
                      options={{
                        clientId: PAYPAL_CLIENT_ID,
                        currency: "GBP",
                        intent: "capture",
                        components: "buttons"
                      }}
                    >
                      <div className="paypal-button-container">
                        <PayPalButtons
                          style={{
                            layout: "vertical",
                            color: "gold",
                            shape: "rect",
                            label: "pay"
                          }}
                          createOrder={(data, actions) => {
                            setIsPayPalLoading(true);
                            console.log('Creating order with amount:', totalPrice);
                            
                            // Validate amount
                            if (!totalPrice || totalPrice <= 0) {
                              setPaypalError('Invalid order amount. Please refresh the page and try again.');
                              setIsPayPalLoading(false);
                              return Promise.reject('Invalid amount');
                            }

                            return actions.order.create({
                              intent: "CAPTURE",
                              purchase_units: [
                                {
                                  amount: {
                                    value: totalPrice.toFixed(2),
                                    currency_code: "GBP"
                                  },
                                  description: `Order from TK Afro Kitchen - ${items.length} items`
                                }
                              ],
                              application_context: {
                                shipping_preference: 'NO_SHIPPING'
                              }
                            }).catch(error => {
                              console.error('PayPal order creation error:', error);
                              setPaypalError('Failed to create payment. Please try again.');
                              setIsPayPalLoading(false);
                              throw error;
                            });
                          }}
                          onApprove={async (data, actions) => {
                            if (!actions.order) {
                              setPaypalError('Payment processing failed. Please try again.');
                              setIsPayPalLoading(false);
                              return;
                            }

                            try {
                              const order = await actions.order.capture();
                              console.log('Payment successful:', order);
                              setPaymentSuccess(true);
                              setIsPayPalLoading(false);
                            } catch (error) {
                              console.error('Payment capture error:', error);
                              setPaypalError('Payment processing failed. Please try again.');
                              setIsPayPalLoading(false);
                            }
                          }}
                          onError={(err) => {
                            console.error('PayPal error:', {
                              error: err,
                              timestamp: new Date().toISOString(),
                              orderAmount: totalPrice,
                              clientId: PAYPAL_CLIENT_ID ? 'Present' : 'Missing'
                            });
                            setPaypalError('Payment system error. Please try again or use a different payment method.');
                            setIsPayPalLoading(false);
                          }}
                          onCancel={() => {
                            console.log('Payment cancelled by user');
                            setPaypalError('Payment was cancelled. Please try again.');
                            setIsPayPalLoading(false);
                          }}
                          onInit={() => {
                            console.log('PayPal button initialized');
                            setIsPayPalLoading(false);
                          }}
                        />
                      </div>
                    </PayPalScriptProvider>
                  ) : (
                    <div className="text-red-500">
                      {!PAYPAL_CLIENT_ID 
                        ? 'PayPal is not configured. Please contact support.'
                        : 'Please ensure your cart is not empty and try again.'}
                    </div>
                  )}
                </div>

                {/* Add loading indicator */}
                {isPayPalLoading && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Processing payment...</p>
                  </div>
                )}

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