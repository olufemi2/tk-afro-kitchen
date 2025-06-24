'use client';

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useState } from "react";

interface EnhancedPayPalButtonsProps {
  amount: number;
  onSuccess: (orderId: string) => void;
  onError: (error: any) => void;
  deliveryDetails: any;
}

export default function EnhancedPayPalButtons({ 
  amount, 
  onSuccess, 
  onError, 
  deliveryDetails 
}: EnhancedPayPalButtonsProps) {
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'card' | 'googlepay'>('paypal');

  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  // Enhanced iOS Safari detection
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const isIOSSafari = /iPad|iPhone|iPod/.test(userAgent) && /Safari/.test(userAgent) && !/Chrome|CriOS|FxiOS/.test(userAgent);
  const isIOSWebView = /iPad|iPhone|iPod/.test(userAgent) && !/Safari/.test(userAgent);
  const isIOS = isIOSSafari || isIOSWebView;

  const createOrderData = {
    intent: "CAPTURE" as const,
    purchase_units: [
      {
        amount: {
          value: amount.toFixed(2),
          currency_code: "GBP",
          breakdown: {
            item_total: {
              currency_code: "GBP",
              value: amount.toFixed(2)
            }
          }
        },
        description: "TK Afro Kitchen Order",
        custom_id: `order_${Date.now()}`,
        shipping: {
          name: {
            full_name: deliveryDetails?.fullName || "Customer"
          },
          address: {
            address_line_1: deliveryDetails?.address || "",
            admin_area_2: deliveryDetails?.city || "",
            postal_code: deliveryDetails?.postcode || "",
            country_code: "GB"
          }
        }
      }
    ],
    application_context: {
      brand_name: "TK Afro Kitchen",
      landing_page: isIOS ? "LOGIN" : "NO_PREFERENCE" as const,
      user_action: "PAY_NOW" as const,
      return_url: `${typeof window !== 'undefined' ? window.location.origin : ''}/success`,
      cancel_url: `${typeof window !== 'undefined' ? window.location.origin : ''}/checkout`,
      // iOS Safari specific settings
      ...(isIOS && {
        shipping_preference: "NO_SHIPPING",
        payment_method: {
          payer_selected: "PAYPAL",
          payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED"
        }
      })
    }
  };

  return (
    <div className="space-y-4">
      {/* Payment Method Selection */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Choose Payment Method</h3>
        <div className="grid grid-cols-1 gap-3">
          
          {/* Card Payment - Most Prominent */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                paymentMethod === 'card' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <div className="w-8 h-5 bg-gradient-to-r from-blue-600 to-blue-700 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>
                    <div className="w-8 h-5 bg-gradient-to-r from-red-500 to-red-600 rounded text-white text-xs flex items-center justify-center font-bold">MC</div>
                    <div className="w-8 h-5 bg-gradient-to-r from-blue-500 to-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">AMEX</div>
                  </div>
                  <span className="font-medium text-gray-900">Debit & Credit Cards</span>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  paymentMethod === 'card' ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                }`}>
                  {paymentMethod === 'card' && (
                    <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-1">Secure payment processed by PayPal</p>
            </button>
          </div>

          {/* PayPal */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setPaymentMethod('paypal')}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                paymentMethod === 'paypal' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded text-white text-sm flex items-center justify-center font-bold">PayPal</div>
                  <span className="font-medium text-gray-900">PayPal Account</span>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  paymentMethod === 'paypal' ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                }`}>
                  {paymentMethod === 'paypal' && (
                    <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-1">Pay with your PayPal balance or linked accounts</p>
            </button>
          </div>

          {/* Google Pay (Coming Soon) */}
          <div className="relative opacity-60">
            <div className="w-full p-4 border-2 border-gray-200 rounded-lg text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-6 bg-gradient-to-r from-blue-500 to-green-500 rounded text-white text-sm flex items-center justify-center font-bold">GPay</div>
                  <span className="font-medium text-gray-500">Google Pay</span>
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">Coming Soon</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">Quick checkout with Google Pay (launching soon)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced PayPal Integration */}
      <div className="mt-6">
        <PayPalScriptProvider
          options={{
            clientId: PAYPAL_CLIENT_ID || '',
            currency: "GBP",
            intent: "capture",
            components: "buttons",
            "enable-funding": paymentMethod === 'card' ? "card" : "paylater,venmo",
            "disable-funding": paymentMethod === 'card' ? "paylater,venmo" : "",
            "data-sdk-integration-source": "button-factory",
            "data-namespace": "PayPalSDK",
            "data-page-type": "checkout",
            // iOS Safari specific configuration
            ...(isIOS && {
              "data-client-token": undefined,
              "data-merchant-id": undefined,
              "data-order-id": undefined,
              "data-client-metadata-id": `${Date.now()}-ios-safari`,
              "debug": process.env.NODE_ENV === 'development' ? 'true' : 'false'
            })
          }}
        >
          <div className="paypal-button-container">
            <PayPalButtons
              style={{
                layout: "vertical",
                color: paymentMethod === 'card' ? "black" : "gold",
                shape: "rect",
                label: paymentMethod === 'card' ? "pay" : "paypal",
                height: 55,
                tagline: false
              }}
              fundingSource={paymentMethod === 'card' ? 'card' : undefined}
              createOrder={(data, actions) => {
                console.log('🏗️ Creating PayPal order...', { data, isIOS, userAgent });
                console.log('🏗️ Order data:', JSON.stringify(createOrderData, null, 2));
                
                try {
                  return actions.order.create(createOrderData).then(orderId => {
                    console.log('✅ PayPal order created successfully:', orderId);
                    return orderId;
                  }).catch(error => {
                    console.error('❌ PayPal order creation failed:', error);
                    
                    // Store creation error for debugging
                    if (isIOS) {
                      localStorage.setItem('paypalCreateOrderError', JSON.stringify({
                        error,
                        userAgent,
                        timestamp: new Date().toISOString(),
                        createOrderData
                      }));
                    }
                    
                    throw error;
                  });
                } catch (error) {
                  console.error('❌ PayPal createOrder caught error:', error);
                  throw error;
                }
              }}
              onApprove={async (data, actions) => {
                console.log('💳 PayPal onApprove triggered:', data);
                if (actions.order) {
                  try {
                    console.log('🔄 Capturing PayPal order...');
                    const order = await actions.order.capture();
                    console.log("✅ PayPal order completed:", order);
                    
                    // Enhanced order tracking
                    if (order.purchase_units && order.purchase_units[0]?.amount?.value) {
                      const orderDetails = {
                        orderId: order.id,
                        status: order.status,
                        amount: order.purchase_units[0].amount.value,
                        currency: order.purchase_units[0].amount.currency_code,
                        timestamp: new Date().toISOString(),
                        paymentMethod: paymentMethod,
                        customerInfo: deliveryDetails,
                        payerId: order.payer?.payer_id,
                        payerEmail: order.payer?.email_address
                      };
                      
                      localStorage.setItem('lastOrderDetails', JSON.stringify(orderDetails));
                      console.log('💾 Order details saved to localStorage');
                      
                      // Send to analytics/tracking
                      if (typeof window !== 'undefined' && (window as any).gtag) {
                        (window as any).gtag('event', 'purchase', {
                          transaction_id: order.id,
                          value: orderDetails.amount,
                          currency: orderDetails.currency,
                          payment_method: paymentMethod
                        });
                      }
                    }
                    
                    // Enhanced iOS compatibility - detect iOS Safari and WebView
                    const userAgent = navigator.userAgent;
                    const isIOSSafari = /iPad|iPhone|iPod/.test(userAgent) && /Safari/.test(userAgent) && !/Chrome|CriOS|FxiOS/.test(userAgent);
                    const isIOSWebView = /iPad|iPhone|iPod/.test(userAgent) && !/Safari/.test(userAgent);
                    
                    console.log('🔍 PayPal device detection:', { userAgent, isIOSSafari, isIOSWebView });
                    
                    if (isIOSSafari || isIOSWebView) {
                      console.log('📱 iOS detected in PayPal - using delayed callback');
                      setTimeout(() => {
                        console.log('⏰ Executing delayed PayPal success callback');
                        onSuccess(order.id || 'unknown');
                      }, 2000);
                    } else {
                      console.log('🖥️ Non-iOS device in PayPal - immediate callback');
                      onSuccess(order.id || 'unknown');
                    }
                  } catch (error) {
                    console.error("❌ Payment processing error:", error);
                    onError(error);
                  }
                }
              }}
              onError={(err) => {
                console.error("❌ PayPal error:", err);
                console.error("❌ PayPal error details:", JSON.stringify(err, null, 2));
                
                // Enhanced error tracking for iOS Safari
                const userAgent = navigator.userAgent;
                const isIOSSafari = /iPad|iPhone|iPod/.test(userAgent) && /Safari/.test(userAgent) && !/Chrome|CriOS|FxiOS/.test(userAgent);
                
                if (isIOSSafari) {
                  console.error("❌ PayPal error on iOS Safari - this might cause redirect to homepage");
                  
                  // Store error details for debugging
                  localStorage.setItem('paypalError', JSON.stringify({
                    error: err,
                    userAgent,
                    timestamp: new Date().toISOString(),
                    paymentMethod
                  }));
                }
                
                onError(err);
              }}
              onCancel={(data) => {
                console.log("🚫 Payment cancelled:", data);
                console.log("🚫 Cancel data:", JSON.stringify(data, null, 2));
                
                const userAgent = navigator.userAgent;
                const isIOSSafari = /iPad|iPhone|iPod/.test(userAgent) && /Safari/.test(userAgent) && !/Chrome|CriOS|FxiOS/.test(userAgent);
                
                if (isIOSSafari) {
                  console.log("🚫 Payment cancelled on iOS Safari - this might redirect to homepage");
                  
                  // Store cancellation details for debugging
                  localStorage.setItem('paypalCancel', JSON.stringify({
                    data,
                    userAgent,
                    timestamp: new Date().toISOString(),
                    paymentMethod
                  }));
                }
                
                // Track cancellation for analytics
                if (typeof window !== 'undefined' && (window as any).gtag) {
                  (window as any).gtag('event', 'payment_cancelled', {
                    payment_method: paymentMethod
                  });
                }
              }}
            />
          </div>
        </PayPalScriptProvider>
      </div>

      {/* Payment Security Badge */}
      <div className="flex items-center justify-center space-x-4 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span>256-bit SSL secured</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>PayPal Buyer Protection</span>
        </div>
      </div>
    </div>
  );
}