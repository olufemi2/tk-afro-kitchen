'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaymentSelector } from "@/components/payment/PaymentSelector";

interface DeliveryDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  postcode: string;
  city: string;
}

export default function OptimizedCheckout() {
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
    city: ''
  });

  // Delivery time calculation
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  
  useEffect(() => {
    // Prevent redirect to menu during payment success flow
    if (items.length === 0 && !paymentSuccess) {
      router.push('/menu');
    }
    
    // Calculate estimated delivery time (45-60 minutes from now)
    const now = new Date();
    const deliveryTime = new Date(now.getTime() + (45 * 60 * 1000)); // 45 minutes
    setEstimatedDelivery(deliveryTime.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }));
    
    // Debug: Check for stored error information on component mount
    const storedErrors = [
      'paypalError',
      'paypalCancel', 
      'paypalCreateOrderError',
      'checkoutPaymentError',
      'stripePaymentIntentError',
      'stripeConfirmError',
      'stripePaymentStatusError',
      'stripeGeneralError',
      'lastStripePayment'
    ];
    
    storedErrors.forEach(errorKey => {
      const stored = localStorage.getItem(errorKey);
      if (stored) {
        console.log(`🔍 Found stored ${errorKey}:`, JSON.parse(stored));
      }
    });
    
    // Clear old error flags
    localStorage.removeItem('preventAutoRedirect');
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
    if (!deliveryDetails.address.trim()) errors.address = 'Delivery address is required';
    if (!deliveryDetails.postcode.trim()) errors.postcode = 'Postcode is required';
    if (!deliveryDetails.city.trim()) errors.city = 'City is required';
    
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

  const handlePaymentSuccess = async (paymentData: any, method: 'card' | 'bank' | 'mobile') => {
    const paymentId = paymentData?.id || paymentData?.orderId || 'unknown';
    
    console.log('🎉 Payment success callback triggered:', { paymentId, method, paymentData });
    setPaymentSuccess(true);
    setIsSubmitting(true);

    try {
      // Immediately import Safari navigation utility
      const { SafariNavigation } = await import('@/utils/safariNavigation');
      
      // Send order details to backend
      const orderData = {
        paymentId,
        paymentMethod: method,
        paymentData,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          selectedSize: item.selectedSize
        })),
        deliveryDetails,
        totalAmount: totalPrice,
        estimatedDelivery,
        timestamp: new Date().toISOString()
      };

      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Order submitted:', orderData);
      
      // Prepare order details for success page
      const successOrderData = {
        orderId: paymentId,
        amount: totalPrice.toFixed(2),
        timestamp: new Date().toISOString(),
        customerInfo: deliveryDetails,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          selectedSize: item.selectedSize
        })),
        status: 'COMPLETED'
      };
      
      // Check if we should use Safari navigation
      if (SafariNavigation.shouldUseSafariNavigation()) {
        console.log('🍎 Safari detected - using Safari-first navigation approach');
        
        // Clear cart immediately for Safari (no race condition with navigation)
        clearCart();
        
        // Use Safari-specific navigation that bypasses Next.js router entirely
        SafariNavigation.navigateToSuccess(successOrderData);
        
        return; // Exit early - Safari navigation takes over
      }
      
      // Standard navigation for non-Safari browsers
      console.log('🖥️ Non-Safari browser - using standard Next.js navigation');
      
      // Store order details for Next.js navigation
      localStorage.setItem('lastOrderDetails', JSON.stringify(successOrderData));
      
      // Clear cart and navigate
      clearCart();
      router.push('/success');
      
    } catch (error) {
      console.error('Error processing order:', error);
      alert('There was an error processing your order. Please contact support.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentError = (error: any, method: 'card' | 'bank' | 'mobile') => {
    console.error('❌ Payment error in checkout:', { error, method });
    console.error('❌ Payment error details:', JSON.stringify(error, null, 2));
    
    // Enhanced error tracking for iOS Safari
    const userAgent = navigator.userAgent;
    const isIOSSafari = /iPad|iPhone|iPod/.test(userAgent) && /Safari/.test(userAgent) && !/Chrome|CriOS|FxiOS/.test(userAgent);
    const isIOSWebView = /iPad|iPhone|iPod/.test(userAgent) && !/Safari/.test(userAgent);
    
    if (isIOSSafari || isIOSWebView) {
      console.error('❌ Payment error on iOS device - this might cause homepage redirect');
      
      // Store comprehensive error details for debugging
      localStorage.setItem('checkoutPaymentError', JSON.stringify({
        error: {
          message: error?.message,
          name: error?.name,
          stack: error?.stack,
          details: error
        },
        paymentMethod: method,
        userAgent,
        timestamp: new Date().toISOString(),
        currentStep,
        deliveryDetails,
        totalAmount: totalPrice,
        isIOSSafari,
        isIOSWebView
      }));
      
      // Try to prevent automatic redirect by setting a flag
      localStorage.setItem('preventAutoRedirect', 'true');
      
      // Show iOS-specific error message
      alert(`${method.toUpperCase()} payment failed on iOS Safari. Error: ${error?.message || 'Unknown error'}. Please try again or contact support. Check console for debug info.`);
    } else {
      alert(`${method.toUpperCase()} payment failed. Please try again or contact support.`);
    }
  };

  // Calculate delivery fee and total
  const deliveryFee = totalPrice > 30 ? 0 : 3.99;
  const finalTotal = totalPrice + deliveryFee;

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Progress Indicator */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className={`flex items-center ${currentStep >= 1 ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep >= 1 ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <span className="ml-2 font-medium">Delivery Details</span>
            </div>
            <div className={`w-16 h-1 rounded ${currentStep >= 2 ? 'bg-orange-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center ${currentStep >= 2 ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep >= 2 ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <span className="ml-2 font-medium">Payment</span>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-2">
              {currentStep === 1 && (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">Delivery Information</h2>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName" className="text-gray-700 font-medium">Full Name *</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={deliveryDetails.fullName}
                          onChange={handleInputChange}
                          className={`mt-1 ${validationErrors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="John Smith"
                        />
                        {validationErrors.fullName && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors.fullName}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={deliveryDetails.phone}
                          onChange={handleInputChange}
                          className={`mt-1 ${validationErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="07123 456789"
                        />
                        {validationErrors.phone && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email" className="text-gray-700 font-medium">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={deliveryDetails.email}
                        onChange={handleInputChange}
                        className={`mt-1 ${validationErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="john@example.com"
                      />
                      {validationErrors.email && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="address" className="text-gray-700 font-medium">Delivery Address *</Label>
                      <Input
                        id="address"
                        name="address"
                        value={deliveryDetails.address}
                        onChange={handleInputChange}
                        className={`mt-1 ${validationErrors.address ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="123 High Street, Apartment 4B"
                      />
                      {validationErrors.address && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.address}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city" className="text-gray-700 font-medium">City *</Label>
                        <Input
                          id="city"
                          name="city"
                          value={deliveryDetails.city}
                          onChange={handleInputChange}
                          className={`mt-1 ${validationErrors.city ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="London"
                        />
                        {validationErrors.city && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors.city}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="postcode" className="text-gray-700 font-medium">Postcode *</Label>
                        <Input
                          id="postcode"
                          name="postcode"
                          value={deliveryDetails.postcode}
                          onChange={handleInputChange}
                          className={`mt-1 ${validationErrors.postcode ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="SW1A 1AA"
                        />
                        {validationErrors.postcode && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors.postcode}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-end">
                    <Button
                      onClick={handleNextStep}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3"
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Payment</h2>
                    <div className="flex gap-4">
                      <button
                        onClick={() => router.push('/menu')}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        ← Continue Shopping
                      </button>
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="text-orange-600 hover:text-orange-700 font-medium"
                      >
                        ← Edit Details
                      </button>
                    </div>
                  </div>
                  
                  <PaymentSelector
                    amount={Math.round(finalTotal * 100)} // Convert to pence
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    customerDetails={{
                      name: deliveryDetails.fullName,
                      email: deliveryDetails.email,
                      phone: deliveryDetails.phone,
                      address: {
                        line1: deliveryDetails.address,
                        city: deliveryDetails.city,
                        postal_code: deliveryDetails.postcode,
                        country: 'GB'
                      }
                    }}
                  />
                  
                  {isSubmitting && (
                    <div className="mt-6 text-center">
                      <div className="inline-flex items-center space-x-2 text-gray-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                        <span>Processing your order...</span>
                      </div>
                    </div>
                  )}

                  {/* Safari Success Display */}
                  {paymentSuccess && (
                    <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg">
                      <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-green-800 mb-2">Payment Successful!</h3>
                        <p className="text-green-700 mb-4">
                          Your order has been confirmed. You'll receive a confirmation email shortly.
                        </p>
                        <div className="text-sm text-green-600 mb-4">
                          <p>Order Total: £{totalPrice.toFixed(2)}</p>
                          <p>Estimated Delivery: {estimatedDelivery}</p>
                        </div>
                        <button
                          onClick={() => {
                            const paymentData = JSON.parse(localStorage.getItem('lastOrderDetails') || '{}');
                            const successUrl = `/success?orderId=${paymentData.orderId}&amount=${paymentData.amount}&safari=true&timestamp=${Date.now()}`;
                            window.open(successUrl, '_self');
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
                        >
                          View Order Details
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm sticky top-8">
                <h3 className="text-xl font-bold mb-4 text-gray-900">Order Summary</h3>
                
                {/* Estimated Delivery */}
                <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-green-800">Estimated Delivery</p>
                      <p className="text-sm text-green-700">{estimatedDelivery} (45-60 min)</p>
                    </div>
                  </div>
                </div>
                
                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.selectedSize.size}`} className="flex justify-between border-b border-gray-100 pb-3">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                        <p className="text-xs text-gray-600">
                          {item.selectedSize.size} • Qty: {item.quantity}
                        </p>
                        <p className="text-xs text-gray-600">{item.selectedSize.portionInfo}</p>
                      </div>
                      <p className="font-medium text-gray-900 text-sm">
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
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className={`${deliveryFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                      {deliveryFee === 0 ? 'FREE' : `£${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                  {deliveryFee === 0 && (
                    <p className="text-xs text-green-600">Free delivery on orders over £30!</p>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2">
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
  );
}