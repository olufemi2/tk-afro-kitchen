'use client';

import { Header } from "@/components/layout/header";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { StripeCheckout } from "@/components/payment/StripeCheckout";

interface DeliveryDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  postcode: string;
  city: string;
  deliveryMode: 'pickup' | 'nationwide';
}

// Stripe configuration is handled in the StripeCheckout component

// This component now uses Stripe instead of PayPal

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    postcode: '',
    city: '',
    deliveryMode: 'pickup'
  });

  useEffect(() => {
    if (items.length === 0) {
      router.push('/menu');
    }
  }, [items, router]);

  if (items.length === 0) {
    return null;
  }

  const validateStep1 = () => {
    const errors: {[key: string]: string} = {};
    
    if (!deliveryDetails.fullName.trim()) errors.fullName = 'Full name is required';
    if (!deliveryDetails.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(deliveryDetails.email)) errors.email = 'Email is invalid';
    if (!deliveryDetails.phone.trim()) errors.phone = 'Phone number is required';
    if (deliveryDetails.deliveryMode === 'nationwide') {
      if (!deliveryDetails.address.trim()) errors.address = 'Delivery address is required';
      if (!deliveryDetails.postcode.trim()) errors.postcode = 'Postcode is required';
      if (!deliveryDetails.city.trim()) errors.city = 'City is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDeliveryDetails(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePaymentSuccess = async (paymentIntent: any) => {
    setPaymentSuccess(true);
    setIsSubmitting(true);

    try {
      console.log('Processing payment success for Stripe payment intent:', paymentIntent.id);
      
      // Store order details in localStorage for confirmation page
      const orderDetails = {
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
        amount: finalTotal.toFixed(2),
        timestamp: new Date().toISOString(),
        customerInfo: deliveryDetails,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          selectedSize: item.selectedSize
        }))
      };
      
      console.log('Storing order details in localStorage:', orderDetails);
      localStorage.setItem('lastOrderDetails', JSON.stringify(orderDetails));
      
      // Clear cart and redirect
      clearCart();
      console.log('Cart cleared, redirecting to success page...');
      
      // Redirect to success page
      window.location.href = '/success';
      
    } catch (error) {
      console.error('Error processing order:', error);
      alert('There was an error processing your order. Please contact support.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
    alert('Payment failed. Please try again or contact support.');
  };

  // Calculate delivery fee and total
  const deliveryFee = deliveryDetails.deliveryMode === 'pickup' ? 0 : 27.99;
  const finalTotal = totalPrice + deliveryFee;

  return (
    <>
      <Header />
      {/* Fixed viewport and responsive container */}
      <div className="min-h-screen w-full overflow-x-hidden pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Progress Indicator */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-center space-x-4 sm:space-x-8">
              <div className={`flex items-center ${currentStep >= 1 ? 'text-orange-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep >= 1 ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  1
                </div>
                <span className="ml-2 font-medium text-sm sm:text-base">Delivery Details</span>
              </div>
              <div className={`w-8 sm:w-16 h-1 rounded ${currentStep >= 2 ? 'bg-orange-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center ${currentStep >= 2 ? 'text-orange-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep >= 2 ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  2
                </div>
                <span className="ml-2 font-medium text-sm sm:text-base">Payment</span>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              
              {/* Main Content */}
              <div className="lg:col-span-2 order-2 lg:order-1">
                {currentStep === 1 && (
                  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-900">Order Information</h2>
                    
                    {/* Delivery Mode Selection */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <Label className="text-gray-700 font-medium text-sm mb-3 block">Order Type *</Label>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            id="pickup"
                            name="deliveryMode"
                            value="pickup"
                            checked={deliveryDetails.deliveryMode === 'pickup'}
                            onChange={(e) => setDeliveryDetails(prev => ({ ...prev, deliveryMode: e.target.value as 'pickup' | 'nationwide' }))}
                            className="text-orange-500 focus:ring-orange-500"
                          />
                          <label htmlFor="pickup" className="flex-1">
                            <div className="font-medium text-gray-900">Collection / Pickup</div>
                            <div className="text-sm text-gray-600">Free - Collect from our kitchen</div>
                          </label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            id="nationwide"
                            name="deliveryMode"
                            value="nationwide"
                            checked={deliveryDetails.deliveryMode === 'nationwide'}
                            onChange={(e) => setDeliveryDetails(prev => ({ ...prev, deliveryMode: e.target.value as 'pickup' | 'nationwide' }))}
                            className="text-orange-500 focus:ring-orange-500"
                          />
                          <label htmlFor="nationwide" className="flex-1">
                            <div className="font-medium text-gray-900">Nationwide Delivery</div>
                            <div className="text-sm text-gray-600">£27.99 - Delivery to any UK postcode</div>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="fullName" className="text-gray-700 font-medium text-sm">Full Name *</Label>
                          <Input
                            id="fullName"
                            name="fullName"
                            value={deliveryDetails.fullName}
                            onChange={handleInputChange}
                            className={`mt-1 text-sm ${validationErrors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="John Smith"
                          />
                          {validationErrors.fullName && (
                            <p className="text-red-500 text-xs mt-1">{validationErrors.fullName}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="phone" className="text-gray-700 font-medium text-sm">Phone Number *</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={deliveryDetails.phone}
                            onChange={handleInputChange}
                            className={`mt-1 text-sm ${validationErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="07123 456789"
                          />
                          {validationErrors.phone && (
                            <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="email" className="text-gray-700 font-medium text-sm">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={deliveryDetails.email}
                          onChange={handleInputChange}
                          className={`mt-1 text-sm ${validationErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="john@example.com"
                        />
                        {validationErrors.email && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
                        )}
                      </div>
                      
                      {deliveryDetails.deliveryMode === 'nationwide' && (
                        <>
                          <div>
                            <Label htmlFor="address" className="text-gray-700 font-medium text-sm">Delivery Address *</Label>
                            <Input
                              id="address"
                              name="address"
                              value={deliveryDetails.address}
                              onChange={handleInputChange}
                              className={`mt-1 text-sm ${validationErrors.address ? 'border-red-500' : 'border-gray-300'}`}
                              placeholder="123 High Street, Apartment 4B"
                            />
                            {validationErrors.address && (
                              <p className="text-red-500 text-xs mt-1">{validationErrors.address}</p>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="city" className="text-gray-700 font-medium text-sm">City *</Label>
                              <Input
                                id="city"
                                name="city"
                                value={deliveryDetails.city}
                                onChange={handleInputChange}
                                className={`mt-1 text-sm ${validationErrors.city ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="London"
                              />
                              {validationErrors.city && (
                                <p className="text-red-500 text-xs mt-1">{validationErrors.city}</p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor="postcode" className="text-gray-700 font-medium text-sm">Postcode *</Label>
                              <Input
                                id="postcode"
                                name="postcode"
                                value={deliveryDetails.postcode}
                                onChange={handleInputChange}
                                className={`mt-1 text-sm ${validationErrors.postcode ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="SW1A 1AA"
                              />
                              {validationErrors.postcode && (
                                <p className="text-red-500 text-xs mt-1">{validationErrors.postcode}</p>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="mt-8 flex justify-end">
                      <Button
                        onClick={handleNextStep}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 py-3 text-sm sm:text-base"
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Payment</h2>
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                      >
                        ← Edit Details
                      </button>
                    </div>
                    
                    {/* Payment Method Selection */}
                    <div className="space-y-4 mb-6">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">Payment Method</h3>
                      <div className="space-y-3">
                        <div className="p-3 sm:p-4 border-2 border-orange-500 bg-orange-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="flex space-x-1">
                                <div className="w-6 h-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>
                                <div className="w-6 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded text-white text-xs flex items-center justify-center font-bold">MC</div>
                                <div className="w-6 h-4 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded text-white text-xs flex items-center justify-center font-bold">AMEX</div>
                              </div>
                              <span className="font-medium text-gray-900 text-sm sm:text-base">Debit & Credit Cards</span>
                            </div>
                            <div className="w-4 h-4 rounded-full bg-orange-500 border-orange-500">
                              <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">Secure payment processed by Stripe</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Stripe Integration */}
                    <div className="mb-6">
                      <StripeCheckout
                        amount={Math.round(finalTotal * 100)} // Convert to pence
                        currency="gbp"
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                        customerDetails={{
                          name: deliveryDetails.fullName,
                          email: deliveryDetails.email,
                          phone: deliveryDetails.phone,
                          address: deliveryDetails.deliveryMode === 'nationwide' ? {
                            line1: deliveryDetails.address,
                            city: deliveryDetails.city,
                            postal_code: deliveryDetails.postcode,
                            country: 'GB'
                          } : undefined
                        }}
                      />
                    </div>
                    
                    {/* Security Badge */}
                    <div className="flex items-center justify-center space-x-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        <span>256-bit SSL secured</span>
                      </div>
                    </div>
                    
                    {isSubmitting && (
                      <div className="mt-6 text-center">
                        <div className="inline-flex items-center space-x-2 text-gray-600">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                          <span className="text-sm">Processing your order...</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1 order-1 lg:order-2">
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm sticky top-8">
                  <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-900">Order Summary</h3>
                  
                  {/* Order Type Info */}
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-7-9A7 7 0 1117 9a7 7 0 01-14 0z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-blue-800">
                          {deliveryDetails.deliveryMode === 'pickup' ? 'Collection' : 'Nationwide Delivery'}
                        </p>
                        <p className="text-xs sm:text-sm text-blue-700">
                          {deliveryDetails.deliveryMode === 'pickup' 
                            ? 'Free collection from our kitchen' 
                            : '£27.99 delivery to any UK postcode'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Order Items */}
                  <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                    {items.map((item) => (
                      <div key={`${item.id}-${item.selectedSize.size}`} className="flex justify-between border-b border-gray-100 pb-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-xs sm:text-sm truncate">{item.name}</p>
                          <p className="text-xs text-gray-600">
                            {item.selectedSize.size} • Qty: {item.quantity}
                          </p>
                          <p className="text-xs text-gray-600 truncate">{item.selectedSize.portionInfo}</p>
                        </div>
                        <p className="font-medium text-gray-900 text-xs sm:text-sm flex-shrink-0 ml-2">
                          £{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Pricing Breakdown */}
                  <div className="space-y-2 border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">£{totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {deliveryDetails.deliveryMode === 'pickup' ? 'Collection Fee' : 'Delivery Fee'}
                      </span>
                      <span className={`${deliveryFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                        {deliveryFee === 0 ? 'FREE' : `£${deliveryFee.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-base sm:text-lg border-t border-gray-200 pt-2">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">£{finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}