'use client';

import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface OrderDetails {
  orderId: string;
  status: string;
  amount: string;
  timestamp: string;
  customerInfo: any;
}

export default function SuccessPage() {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSafari, setIsSafari] = useState(false);

  // Safari debugging effect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userAgent = navigator.userAgent;
      const isSafariBrowser = /Safari/.test(userAgent) && !/Chrome|CriOS|FxiOS/.test(userAgent);
      
      if (isSafariBrowser) {
        console.log('🍎 SUCCESS PAGE: Safari detected');
        console.log('📍 Current URL:', window.location.href);
        console.log('📦 localStorage keys:', Object.keys(localStorage));
        
        // Check for RSC navigation issues
        const urlParams = new URLSearchParams(window.location.search);
        console.log('🔍 URL Parameters:', Object.fromEntries(urlParams.entries()));
        
        // Store that we reached success page
        localStorage.setItem('safariSuccessPageReached', Date.now().toString());
      }
    }
  }, []);

  useEffect(() => {
    // Enhanced order details retrieval with Safari static navigation support
    const getOrderDetails = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('orderId');
        const isSafariStatic = urlParams.get('static') === 'true';
        const isSafariUrl = urlParams.get('safari') === 'true';
        
        console.log('🔍 Success page params:', { orderId, isSafariStatic, isSafariUrl });
        
        // Safari static navigation handling
        if (isSafariStatic || isSafariUrl) {
          console.log('🍎 Safari static navigation detected');
          setIsSafari(true);
          
          // Prevent any router navigation that could trigger RSC issues
          window.history.replaceState({}, '', window.location.href);
        }
        
        // Try multiple localStorage sources
        let storedOrderDetails = localStorage.getItem('lastOrderDetails');
        
        if (!storedOrderDetails && (isSafariStatic || isSafariUrl)) {
          // Try Safari backup
          storedOrderDetails = localStorage.getItem('safariOrderBackup');
          console.log('🔄 Trying Safari backup storage');
        }
        
        if (!storedOrderDetails) {
          // Try Stripe payment data
          storedOrderDetails = localStorage.getItem('lastStripePayment');
          console.log('🔄 Trying Stripe payment storage');
        }
        
        if (storedOrderDetails) {
          const details = JSON.parse(storedOrderDetails);
          
          // Normalize data format
          if (details.paymentIntentId && !details.orderId) {
            details.orderId = details.paymentIntentId;
          }
          if (details.amount && typeof details.amount === 'number') {
            details.amount = (details.amount / 100).toFixed(2);
          }
          
          setOrderDetails(details);
          console.log('✅ Order details loaded from storage:', details.orderId);
          
          // Clear all storage keys after successful load
          localStorage.removeItem('lastOrderDetails');
          localStorage.removeItem('safariOrderBackup');
          localStorage.removeItem('lastStripePayment');
          
        } else if (orderId) {
          // Fallback: Create basic order details from URL params
          const basicDetails = {
            orderId: orderId,
            status: 'COMPLETED',
            amount: urlParams.get('amount') || '0.00',
            timestamp: new Date().toISOString(),
            customerInfo: null,
            safariMode: isSafariUrl,
            staticNavigation: isSafariStatic
          };
          setOrderDetails(basicDetails);
          console.log('✅ Order details created from URL params for Safari');
        } else {
          console.log('⚠️ No order details found - showing generic success message');
        }
      } catch (error) {
        console.error('❌ Error parsing order details:', error);
        
        // Safari error recovery - try to show basic success
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('orderId');
        if (orderId) {
          const fallbackDetails = {
            orderId: orderId,
            status: 'COMPLETED',
            amount: urlParams.get('amount') || '0.00',
            timestamp: new Date().toISOString(),
            customerInfo: null,
            errorRecovery: true
          };
          setOrderDetails(fallbackDetails);
          console.log('🔧 Error recovery: Basic details from URL');
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Safari-specific: Add a small delay to ensure localStorage is accessible
    const userAgent = navigator.userAgent;
    const safariDetected = /Safari/.test(userAgent) && !/Chrome|CriOS|FxiOS/.test(userAgent);
    setIsSafari(safariDetected);
    
    if (safariDetected) {
      console.log('📱 Safari detected - applying Safari-specific success page handling');
      
      // For Safari, show immediate success confirmation
      document.title = '✅ Payment Successful - TK Afro Kitchen';
      
      setTimeout(getOrderDetails, 300);
    } else {
      getOrderDetails();
    }

    // Clear cart data after payment
    try {
      localStorage.removeItem('cart');
      console.log('✅ Cart data cleared');
    } catch (error) {
      console.error('❌ Error clearing cart:', error);
    }
  }, []);

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen pt-24 pb-16 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your order confirmation...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Safari-specific meta tags */}
      {isSafari && (
        <>
          <meta name="format-detection" content="telephone=no" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        </>
      )}
      <Header />
      <div className="min-h-screen pt-24 pb-16 bg-gray-50">
        {/* Safari Success Banner */}
        {isSafari && (
          <div className="bg-green-600 text-white py-3 text-center font-semibold">
            🎉 Payment Successful! Your order has been confirmed.
          </div>
        )}
        
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <div className="mb-6">
                <svg
                  className="mx-auto h-20 w-20 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-4xl font-bold mb-4 text-gray-900">Payment Successful!</h1>
              <p className="text-lg text-gray-600 mb-8">
                Thank you for your order. We'll start preparing your delicious Nigerian cuisine right away.
              </p>
            </div>

            {/* Order Details Card */}
            {orderDetails && (
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Order Confirmation</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Payment Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order ID:</span>
                        <span className="font-medium text-gray-900">{orderDetails.orderId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount Paid:</span>
                        <span className="font-medium text-green-600">£{orderDetails.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Status:</span>
                        <span className="font-medium text-green-600 capitalize">{orderDetails.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date & Time:</span>
                        <span className="font-medium text-gray-900">
                          {new Date(orderDetails.timestamp).toLocaleString('en-GB')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {orderDetails.customerInfo && (
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Delivery Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium text-gray-900">{orderDetails.customerInfo.fullName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phone:</span>
                          <span className="font-medium text-gray-900">{orderDetails.customerInfo.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Address:</span>
                          <span className="font-medium text-gray-900 text-right max-w-xs">
                            {orderDetails.customerInfo.address}, {orderDetails.customerInfo.city}, {orderDetails.customerInfo.postcode}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Type Information */}
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-medium text-green-800">Order Confirmed</p>
                      <p className="text-sm text-green-700">We'll contact you with preparation and collection/delivery details</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-orange-50 rounded-lg border border-orange-200 p-6 mb-8">
              <h3 className="font-semibold text-orange-800 mb-3">What happens next?</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-orange-700">
                <li>We've received your payment and order details</li>
                <li>Our kitchen team will start preparing your fresh cuisine</li>
                <li>You'll receive a call to confirm collection/delivery arrangements</li>
                <li>Enjoy your authentic, freshly prepared meal!</li>
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button
                onClick={() => {
                  if (isSafari) {
                    // Use static navigation for Safari to avoid RSC issues
                    window.location.href = `${window.location.origin}/menu`;
                  } else {
                    router.push('/menu');
                  }
                }}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg"
              >
                Order Again
              </Button>
              <Button
                onClick={() => {
                  if (isSafari) {
                    // Use static navigation for Safari to avoid RSC issues
                    window.location.href = window.location.origin;
                  } else {
                    router.push('/');
                  }
                }}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg"
              >
                Return to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 