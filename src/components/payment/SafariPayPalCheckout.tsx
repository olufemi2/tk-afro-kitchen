'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

interface SafariPayPalCheckoutProps {
  amount: number; // Amount in pence
  onSuccess: (orderData: any) => void;
  onError: (error: any) => void;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    address?: {
      line1: string;
      city: string;
      postal_code: string;
      country: string;
    };
  };
}

export function SafariPayPalCheckout({
  amount,
  onSuccess,
  onError,
  customerDetails
}: SafariPayPalCheckoutProps) {
  const paypalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load PayPal SDK for Safari-specific checkout
    const loadPayPalScript = () => {
      if (window.paypal) {
        renderPayPalButtons();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=GBP&intent=capture&components=buttons`;
      script.onload = () => renderPayPalButtons();
      script.onerror = () => onError(new Error('Failed to load PayPal SDK'));
      document.body.appendChild(script);
    };

    const renderPayPalButtons = () => {
      if (!window.paypal || !paypalRef.current) return;

      // Clear any existing buttons
      paypalRef.current.innerHTML = '';

      window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'paypal',
          height: 50,
        },
        
        createOrder: async () => {
          try {
            console.log('🔵 PayPal: Creating order for Safari');
            
            // Create order on your backend
            const response = await fetch('/api/create-paypal-order', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                amount: (amount / 100).toFixed(2), // Convert to pounds
                currency: 'GBP',
                customer_details: customerDetails,
                safari_payment: true,
              }),
            });

            const orderData = await response.json();
            
            if (!response.ok) {
              throw new Error(orderData.error || 'Failed to create PayPal order');
            }

            console.log('✅ PayPal order created:', orderData.id);
            return orderData.id;
            
          } catch (error) {
            console.error('❌ PayPal order creation failed:', error);
            onError(error);
            throw error;
          }
        },

        onApprove: async (data) => {
          try {
            console.log('🔵 PayPal: Payment approved, capturing order');
            
            // Capture payment on your backend
            const response = await fetch('/api/capture-paypal-order', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                orderID: data.orderID,
                safari_payment: true,
              }),
            });

            const captureData = await response.json();
            
            if (!response.ok) {
              throw new Error(captureData.error || 'Failed to capture PayPal payment');
            }

            console.log('✅ PayPal payment captured successfully');
            
            // Store success data for Safari navigation
            const successOrderData = {
              orderId: data.orderID,
              amount: (amount / 100).toFixed(2),
              timestamp: new Date().toISOString(),
              customerInfo: customerDetails,
              paymentMethod: 'paypal',
              status: 'COMPLETED',
              paypalData: captureData
            };

            // Use Safari-compatible success handling
            localStorage.setItem('safariPayPalSuccess', 'true');
            localStorage.setItem('lastOrderDetails', JSON.stringify(successOrderData));
            
            onSuccess(successOrderData);
            
          } catch (error) {
            console.error('❌ PayPal capture failed:', error);
            onError(error);
          }
        },

        onError: (err) => {
          console.error('❌ PayPal payment error:', err);
          onError(err);
        },

        onCancel: (data) => {
          console.log('⚠️ PayPal payment cancelled:', data);
          onError(new Error('Payment was cancelled'));
        }
      }).render(paypalRef.current);
    };

    loadPayPalScript();

    // Cleanup function
    return () => {
      // Remove PayPal script if component unmounts
      const existingScript = document.querySelector('script[src*="paypal.com/sdk"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [amount, customerDetails, onSuccess, onError]);

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-2 mb-2">
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <h3 className="font-semibold text-blue-800">Safari-Optimized Payment</h3>
        </div>
        <p className="text-sm text-blue-700">
          We've detected you're using Safari. PayPal provides the most reliable payment experience for Safari users.
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-600">Total Amount:</span>
          <span className="font-semibold text-lg">£{(amount / 100).toFixed(2)}</span>
        </div>
        
        {/* PayPal Buttons Container */}
        <div ref={paypalRef} id="paypal-button-container" />
        
        <div className="mt-4 text-center text-xs text-gray-500">
          <p>Secured by PayPal • 256-bit SSL encryption</p>
          <p>You can pay with PayPal or any major credit/debit card</p>
        </div>
      </div>
    </div>
  );
}

// Extend window object for PayPal
declare global {
  interface Window {
    paypal?: any;
  }
}