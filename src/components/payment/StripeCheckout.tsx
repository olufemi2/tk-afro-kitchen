'use client';

import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripeCheckoutProps {
  amount: number; // Amount in pence (e.g., 5000 for £50.00)
  currency?: string;
  onSuccess: (paymentIntent: any) => void;
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

const CardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
      backgroundColor: '#ffffff',
      padding: '12px',
    },
    invalid: {
      color: '#9e2146',
    },
  },
  hidePostalCode: true, // We collect this separately
};

function CheckoutForm({ 
  amount, 
  currency = 'gbp', 
  onSuccess, 
  onError, 
  customerDetails 
}: StripeCheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.error('❌ Stripe not loaded or elements not available');
      return;
    }

    setIsLoading(true);
    setPaymentError(null);

    // Enhanced iOS Safari detection and logging
    const userAgent = navigator.userAgent;
    const isIOSSafari = /iPad|iPhone|iPod/.test(userAgent) && /Safari/.test(userAgent) && !/Chrome|CriOS|FxiOS/.test(userAgent);
    const isIOSWebView = /iPad|iPhone|iPod/.test(userAgent) && !/Safari/.test(userAgent);
    const isIOS = isIOSSafari || isIOSWebView;

    console.log('🏗️ Starting Stripe payment submission');
    console.log('🔍 Device detection:', { userAgent, isIOSSafari, isIOSWebView, isIOS });

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      console.error('❌ Card element not found');
      setPaymentError('Card element not found');
      setIsLoading(false);
      return;
    }

    try {
      console.log('💳 Creating payment intent with amount:', amount, 'currency:', currency);
      
      // Create payment intent on your backend
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          customer_details: customerDetails,
          ios_safari: isIOS // Flag for backend iOS handling
        }),
      });

      const paymentIntentData = await response.json();
      console.log('✅ Payment intent response:', paymentIntentData);

      if (!response.ok) {
        console.error('❌ Payment intent creation failed:', paymentIntentData);
        
        // Store error for iOS debugging
        if (isIOS) {
          localStorage.setItem('stripePaymentIntentError', JSON.stringify({
            error: paymentIntentData,
            userAgent,
            timestamp: new Date().toISOString(),
            amount,
            currency
          }));
        }
        
        throw new Error(paymentIntentData.error || 'Failed to create payment intent');
      }

      if (!paymentIntentData.client_secret) {
        console.error('❌ No client secret received');
        throw new Error('No client secret received from payment intent');
      }

      console.log('🔄 Confirming payment with Stripe...');
      
      // Confirm payment with card element
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        paymentIntentData.client_secret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: customerDetails.name,
              email: customerDetails.email,
              phone: customerDetails.phone,
              address: customerDetails.address,
            },
          }
        }
      );

      console.log('💳 Payment confirmation result:', { confirmError, paymentIntent });

      if (confirmError) {
        console.error('❌ Payment confirmation error:', confirmError);
        
        // Enhanced error storage for iOS debugging
        if (isIOS) {
          localStorage.setItem('stripeConfirmError', JSON.stringify({
            error: {
              code: confirmError.code,
              message: confirmError.message,
              type: confirmError.type,
              charge: confirmError.charge,
              decline_code: confirmError.decline_code,
              doc_url: confirmError.doc_url
            },
            userAgent,
            timestamp: new Date().toISOString(),
            paymentIntentId: paymentIntentData.client_secret
          }));
        }
        
        throw confirmError;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('🎉 Payment succeeded:', paymentIntent.id);
        
        // Store successful payment details
        const paymentDetails = {
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
          timestamp: new Date().toISOString(),
          customerDetails,
          isIOS
        };
        
        localStorage.setItem('lastStripePayment', JSON.stringify(paymentDetails));
        console.log('💾 Payment details saved to localStorage');
        
        // Enhanced iOS Safari compatibility - delay callback to prevent redirect issues
        if (isIOS) {
          console.log('📱 iOS detected - using delayed callback');
          setTimeout(() => {
            console.log('⏰ Executing delayed Stripe success callback');
            onSuccess(paymentIntent);
          }, 2000);
        } else {
          console.log('🖥️ Non-iOS device - immediate callback');
          onSuccess(paymentIntent);
        }
      } else {
        console.error('❌ Payment failed with status:', paymentIntent?.status);
        
        if (isIOS) {
          localStorage.setItem('stripePaymentStatusError', JSON.stringify({
            status: paymentIntent?.status,
            paymentIntentId: paymentIntent?.id,
            userAgent,
            timestamp: new Date().toISOString()
          }));
        }
        
        throw new Error(`Payment ${paymentIntent?.status || 'failed'}`);
      }

    } catch (error: any) {
      console.error('❌ Stripe payment error:', error);
      console.error('❌ Stripe error details:', JSON.stringify(error, null, 2));
      
      // Comprehensive error storage for iOS debugging
      if (isIOS) {
        localStorage.setItem('stripeGeneralError', JSON.stringify({
          error: {
            message: error?.message,
            name: error?.name,
            stack: error?.stack,
            code: error?.code,
            type: error?.type
          },
          userAgent,
          timestamp: new Date().toISOString(),
          amount,
          currency,
          customerDetails: customerDetails.name
        }));
        
        console.error('❌ Stripe error on iOS - stored in localStorage for debugging');
      }
      
      const errorMessage = error.message || 'An unexpected error occurred';
      setPaymentError(errorMessage);
      onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border border-gray-200 rounded-lg bg-white">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        <CardElement options={CardElementOptions} />
      </div>

      {paymentError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{paymentError}</p>
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Amount:</span>
          <span className="font-semibold text-lg">
            £{(amount / 100).toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-500 mt-1">
          <span>Processing fee:</span>
          <span>Included</span>
        </div>
      </div>

      <Button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold py-3 px-6 rounded-lg"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing...
          </div>
        ) : (
          `Pay £${(amount / 100).toFixed(2)}`
        )}
      </Button>

      <div className="text-center text-xs text-gray-500">
        <p>Your payment is secured by Stripe</p>
        <p>256-bit SSL encryption • PCI DSS compliant</p>
      </div>
    </form>
  );
}

export function StripeCheckout(props: StripeCheckoutProps) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
}

// Alternative: Stripe Payment Element (newer, more features)
export function StripePaymentElement(props: StripeCheckoutProps) {
  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#f97316',
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      colorDanger: '#dc2626',
      fontFamily: '"Inter", sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
  };

  const options = {
    appearance,
    currency: props.currency || 'gbp',
    amount: props.amount,
    automatic_payment_methods: {
      enabled: true,
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm {...props} />
    </Elements>
  );
}