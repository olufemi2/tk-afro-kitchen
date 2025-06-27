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

type FulfillmentType = 'delivery' | 'collection';

export default function OptimizedCheckout() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>('delivery');
  
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    postcode: '',
    city: ''
  });

  // Delivery/Collection time calculation
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  
  // UK delivery fee
  const UK_DELIVERY_FEE = 21.99;
  
  useEffect(() => {
    // Prevent redirect to menu during payment success flow or Safari navigation
    const safariSuccessFlag = localStorage.getItem('safariPaymentSuccess');
    const preventRedirect = localStorage.getItem('preventAutoRedirect');
    
    if (items.length === 0 && !paymentSuccess && !safariSuccessFlag && !preventRedirect) {
      console.log('🔄 Empty cart detected - redirecting to menu');
      router.push('/menu');
    } else if (safariSuccessFlag) {
      console.log('🍎 Safari payment success detected - preventing menu redirect');
      // Keep the success flag for a short time to prevent redirect loops
      setTimeout(() => {
        localStorage.removeItem('safariPaymentSuccess');
      }, 5000);
    }
    
    // Calculate estimated delivery/collection time
    const now = new Date();
    if (fulfillmentType === 'delivery') {
      // Next day delivery for UK-wide
      const deliveryTime = new Date(now.getTime() + (24 * 60 * 60 * 1000)); // Next day
      setEstimatedDelivery(deliveryTime.toLocaleDateString('en-GB', { 
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      }));
    } else {
      // Collection time (45-60 minutes from now)
      const collectionTime = new Date(now.getTime() + (45 * 60 * 1000)); // 45 minutes
      setEstimatedDelivery(collectionTime.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }));
    }
    
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
  }, [items, router, paymentSuccess, fulfillmentType]);

  if (items.length === 0) {
    return null;
  }

  const validateStep1 = () => {
    const errors: {[key: string]: string} = {};
    
    if (!deliveryDetails.fullName.trim()) errors.fullName = 'Full name is required';
    if (!deliveryDetails.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(deliveryDetails.email)) errors.email = 'Email is invalid';
    if (!deliveryDetails.phone.trim()) errors.phone = 'Phone number is required';
    
    // Only validate address fields for delivery
    if (fulfillmentType === 'delivery') {
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

  const handlePaymentSuccess = async (paymentData: any, method: 'card' | 'bank' | 'mobile' | 'paypal') => {
    const paymentId = paymentData?.id || paymentData?.orderId || 'unknown';
    
    console.log('🎉 Payment success callback triggered:', { paymentId, method, paymentData });
    setPaymentSuccess(true);
    setIsSubmitting(true);

    try {
      // Import comprehensive Safari payment handler
      const { SafariPaymentHandler } = await import('@/utils/safariPaymentHandler');
      
      // Initialize Safari handler for this payment
      const safariHandler = new SafariPaymentHandler({
        orderId: paymentId,
        amount: totalPrice.toFixed(2),
        currency: 'GBP',
        description: `TK Afro Kitchen Order ${paymentId}`
      });
      
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

      // Send order to backend and notify kitchen staff
      try {
        console.log('📤 Sending order to backend...');
        
        // Send kitchen notification
        const notificationResponse = await fetch('/api/notify-kitchen', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId: paymentId,
            amount: finalTotal.toFixed(2),
            paymentMethod: method,
            fulfillmentType: fulfillmentType,
            deliveryFee: deliveryFee,
            customerInfo: deliveryDetails,
            items: items.map(item => ({
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              selectedSize: item.selectedSize
            })),
            timestamp: new Date().toISOString(),
            totalAmount: totalPrice,
            finalTotal: finalTotal,
            estimatedDelivery
          }),
        });

        if (notificationResponse.ok) {
          const notificationResult = await notificationResponse.json();
          console.log('✅ Kitchen notification sent:', notificationResult);
        } else {
          console.error('⚠️ Kitchen notification failed, but order will continue');
        }
      } catch (notificationError) {
        console.error('⚠️ Kitchen notification error:', notificationError);
        // Don't fail the order if notification fails
      }
      
      console.log('Order processed successfully:', orderData);
      
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
        status: 'COMPLETED',
        paymentMethod: method
      };
      
      // Detect Safari more aggressively
      const userAgent = navigator.userAgent.toLowerCase();
      const isSafariUA = userAgent.includes('safari') && !userAgent.includes('chrome') && !userAgent.includes('chromium') && !userAgent.includes('edg');
      const isIOSDevice = /ipad|iphone|ipod/.test(userAgent);
      
      // Check if this is Safari and use comprehensive Safari handling
      if (isSafariUA || safariHandler.isIOSSafari() || safariHandler.isSafari()) {
        console.log('🍎 Safari detected - using comprehensive Safari payment handler');
        console.log('🔍 Safari detection details:', {
          isSafariUA,
          isIOSDevice,
          safariHandlerIOS: safariHandler.isIOSSafari(),
          safariHandlerDesktop: safariHandler.isSafari(),
          userAgent: navigator.userAgent
        });
        
        // Set Safari success flags to prevent menu redirects
        localStorage.setItem('safariPaymentSuccess', 'true');
        localStorage.setItem('preventAutoRedirect', 'true');
        localStorage.setItem('safariPaymentTimestamp', Date.now().toString());
        
        // Clear cart immediately for Safari
        clearCart();
        
        // Store data with multiple strategies
        localStorage.setItem('lastOrderDetails', JSON.stringify(successOrderData));
        localStorage.setItem('safariOrderBackup', JSON.stringify(successOrderData));
        
        // Use immediate window.location.href for most reliable Safari navigation
        const successUrl = `/success?orderId=${paymentId}&amount=${totalPrice.toFixed(2)}&method=${method}&safari=true&timestamp=${Date.now()}`;
        
        console.log('🚀 Safari: Using immediate window.location navigation');
        console.log('🔗 Success URL:', successUrl);
        
        // Show immediate success feedback first
        setPaymentSuccess(true);
        setIsSubmitting(false);
        
        // Use href for most reliable Safari navigation
        setTimeout(() => {
          window.location.href = successUrl;
        }, 1000); // Reduced delay
        
        return; // Exit early for Safari
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

  const handlePaymentError = (error: any, method: 'card' | 'bank' | 'mobile' | 'paypal') => {
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
  const deliveryFee = fulfillmentType === 'delivery' ? UK_DELIVERY_FEE : 0;
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
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">Order Details</h2>
                  
                  {/* Fulfillment Type Selection */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">How would you like to receive your order?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Delivery Option */}
                      <div 
                        className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
                          fulfillmentType === 'delivery' 
                            ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setFulfillmentType('delivery')}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 ${
                            fulfillmentType === 'delivery' ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                          }`}>
                            {fulfillmentType === 'delivery' && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                              <h4 className="font-semibold text-gray-900">UK-Wide Delivery</h4>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">Next-day delivery anywhere in the UK mainland</p>
                            <div className="space-y-1">
                              <div className="flex items-center text-sm">
                                <span className="text-gray-500">Delivery fee:</span>
                                <span className="font-semibold text-orange-600 ml-2">£{UK_DELIVERY_FEE}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <span className="text-gray-500">Estimated delivery:</span>
                                <span className="font-medium text-gray-700 ml-2">Next working day</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Collection Option */}
                      <div 
                        className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
                          fulfillmentType === 'collection' 
                            ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setFulfillmentType('collection')}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 ${
                            fulfillmentType === 'collection' ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                          }`}>
                            {fulfillmentType === 'collection' && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              <h4 className="font-semibold text-gray-900">Collection</h4>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">Pick up from our Milton Keynes kitchen</p>
                            <div className="space-y-1">
                              <div className="flex items-center text-sm">
                                <span className="text-gray-500">Collection fee:</span>
                                <span className="font-semibold text-green-600 ml-2">FREE</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <span className="text-gray-500">Ready for pickup:</span>
                                <span className="font-medium text-gray-700 ml-2">45-60 minutes</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    {fulfillmentType === 'delivery' ? 'Delivery Information' : 'Contact Information'}
                  </h3>
                  
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
                    
                    
                    {/* Delivery Address Fields - Only show for delivery */}
                    {fulfillmentType === 'delivery' && (
                      <>
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
                      </>
                    )}
                    
                    {/* Collection Information */}
                    {fulfillmentType === 'collection' && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <svg className="w-6 h-6 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <div>
                            <h4 className="font-semibold text-blue-900 mb-2">Collection Address</h4>
                            <div className="text-sm text-blue-800 space-y-1">
                              <p className="font-medium">TK Afro Kitchen</p>
                              <p>Unit 12, Industrial Estate</p>
                              <p>Milton Keynes, MK1 1AA</p>
                              <p className="mt-2">📞 <span className="font-medium">020 1234 5678</span></p>
                            </div>
                            <div className="mt-3 text-xs text-blue-700 bg-blue-100 rounded px-2 py-1 inline-block">
                              💡 We'll call you when your order is ready for collection
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
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
                
                {/* Estimated Delivery/Collection */}
                <div className={`mb-4 p-3 rounded-lg border ${
                  fulfillmentType === 'delivery' 
                    ? 'bg-orange-50 border-orange-200' 
                    : 'bg-green-50 border-green-200'
                }`}>
                  <div className="flex items-center space-x-2">
                    {fulfillmentType === 'delivery' ? (
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    )}
                    <div>
                      <p className={`text-sm font-medium ${
                        fulfillmentType === 'delivery' ? 'text-orange-800' : 'text-green-800'
                      }`}>
                        {fulfillmentType === 'delivery' ? 'UK-Wide Delivery' : 'Collection Ready'}
                      </p>
                      <p className={`text-sm ${
                        fulfillmentType === 'delivery' ? 'text-orange-700' : 'text-green-700'
                      }`}>
                        {fulfillmentType === 'delivery' 
                          ? `${estimatedDelivery} (Next working day)` 
                          : `${estimatedDelivery} (45-60 min)`
                        }
                      </p>
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
                    <span className="text-gray-600">
                      {fulfillmentType === 'delivery' ? 'UK Delivery Fee' : 'Collection Fee'}
                    </span>
                    <span className={`${deliveryFee === 0 ? 'text-green-600' : 'text-orange-600'}`}>
                      {deliveryFee === 0 ? 'FREE' : `£${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                  {fulfillmentType === 'delivery' && (
                    <p className="text-xs text-orange-600">Next-day delivery anywhere in UK mainland</p>
                  )}
                  {fulfillmentType === 'collection' && (
                    <p className="text-xs text-green-600">Free collection from Milton Keynes kitchen</p>
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