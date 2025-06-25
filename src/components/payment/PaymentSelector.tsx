'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Banknote, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StripeCheckout } from './StripeCheckout';
import { GoCardlessPayment } from './GoCardlessPayment';
import { SafariPayPalCheckout } from './SafariPayPalCheckout';

type PaymentMethod = 'card' | 'bank' | 'mobile' | 'paypal';

interface PaymentSelectorProps {
  amount: number; // Amount in pence
  onSuccess: (paymentData: any, method: PaymentMethod) => void;
  onError: (error: any, method: PaymentMethod) => void;
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

export function PaymentSelector({
  amount,
  onSuccess,
  onError,
  customerDetails
}: PaymentSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    // Auto-select card payment as default for all browsers
    if (selectedMethod === null) {
      console.log('💳 Auto-selecting card payment as default');
      setSelectedMethod('card');
    }
  }, []); // Auto-select card payment on load

  const bankTransferDiscount = Math.round(amount * 0.03); // 3% discount
  const bankTransferAmount = amount - bankTransferDiscount;

  // PayPal method for Safari users
  const paypalMethod = {
    id: 'paypal' as const,
    title: 'PayPal',
    subtitle: isSafari ? 'Recommended for Safari' : 'Secure Payment',
    icon: CreditCard, // Using CreditCard icon for now
    amount: amount,
    fees: 'Standard rate',
    benefits: isSafari 
      ? ['Safari Compatible ✓', 'No Redirect Issues', 'PayPal Protection', 'Credit/Debit Cards']
      : ['PayPal Protection', 'Credit/Debit Cards', 'Secure Payment'],
    color: 'indigo',
    safariOptimized: isSafari,
    comingSoon: false,
    safariIssue: false,
    popular: isSafari, // Make PayPal popular for Safari users
  };

  const paymentMethods = [
    {
      id: 'card' as PaymentMethod,
      title: 'Card Payment',
      subtitle: 'Credit or Debit Card',
      icon: CreditCard,
      amount: amount,
      fees: 'Standard rate',
      benefits: ['Instant payment', 'Apple Pay & Google Pay', 'Most popular'],
      color: 'blue',
      popular: true,
      safariIssue: false,
      comingSoon: false,
      safariOptimized: false,
    },
    {
      id: 'bank' as PaymentMethod,
      title: 'Bank Transfer',
      subtitle: 'Direct from your bank',
      icon: Banknote,
      amount: bankTransferAmount,
      fees: '3% discount',
      benefits: ['Lowest cost', 'Secure Direct Debit', 'No card fees'],
      color: 'green',
      savings: bankTransferDiscount,
      comingSoon: false,
      safariOptimized: false,
      safariIssue: false,
      popular: false,
    },
    {
      id: 'mobile' as PaymentMethod,
      title: 'Mobile Wallet',
      subtitle: 'Apple Pay / Google Pay',
      icon: Smartphone,
      amount: amount,
      fees: 'Standard rate',
      benefits: ['One-touch payment', 'Biometric security', 'Super fast'],
      color: 'purple',
      comingSoon: true,
      safariOptimized: false,
      safariIssue: false,
      popular: false,
    },
  ];

  if (selectedMethod === 'card') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Card Payment</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedMethod(null)}
          >
            Change Method
          </Button>
        </div>
        <StripeCheckout
          amount={amount}
          onSuccess={(data) => onSuccess(data, 'card')}
          onError={(error) => onError(error, 'card')}
          customerDetails={customerDetails}
        />
      </div>
    );
  }

  if (selectedMethod === 'bank') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Bank Transfer</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedMethod(null)}
          >
            Change Method
          </Button>
        </div>
        <GoCardlessPayment
          amount={bankTransferAmount}
          onSuccess={(data) => onSuccess(data, 'bank')}
          onError={(error) => onError(error, 'bank')}
          customerDetails={customerDetails}
        />
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Choose Payment Method
        </h3>
        <p className="text-gray-600">
          Select your preferred way to pay
        </p>
      </div>

      <div className="grid gap-4">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const isDisabled = method.comingSoon;
          const isPayPal = method.id === 'paypal';
          const hasIssues = method.safariIssue;
          
          return (
            <button
              key={method.id}
              onClick={() => !isDisabled && setSelectedMethod(method.id)}
              disabled={isDisabled}
              className={`
                relative p-6 rounded-xl border-2 text-left transition-all duration-200
                ${isDisabled 
                  ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60' 
                  : hasIssues
                  ? 'border-yellow-200 bg-yellow-50 hover:border-yellow-300 cursor-pointer'
                  : isPayPal && isSafari
                  ? 'border-green-300 bg-green-50 hover:border-green-400 cursor-pointer ring-2 ring-green-200'
                  : `border-gray-200 hover:border-${method.color}-300 hover:bg-${method.color}-50 cursor-pointer`
                }
              `}
            >
              {method.popular && (
                <div className="absolute -top-2 left-4 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              
              {method.safariOptimized && isSafari && (
                <div className="absolute -top-2 left-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Safari Optimized
                </div>
              )}

              {hasIssues && (
                <div className="absolute -top-2 left-4 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                  ⚠️ Safari Issues
                </div>
              )}
              
              {method.savings && (
                <div className="absolute -top-2 right-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Save £{(method.savings / 100).toFixed(2)}
                </div>
              )}

              {method.comingSoon && (
                <div className="absolute -top-2 right-4 bg-gray-400 text-white text-xs px-2 py-1 rounded-full">
                  Coming Soon
                </div>
              )}

              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg bg-${method.color}-100`}>
                  <Icon className={`w-6 h-6 text-${method.color}-600`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{method.title}</h4>
                      <p className="text-sm text-gray-600">{method.subtitle}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-lg">
                        £{(method.amount / 100).toFixed(2)}
                      </div>
                      <div className={`text-sm ${method.savings ? 'text-green-600' : 'text-gray-500'}`}>
                        {method.fees}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {method.benefits.map((benefit, index) => (
                      <span
                        key={index}
                        className={`text-xs px-2 py-1 rounded-full bg-${method.color}-100 text-${method.color}-700`}
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>All payments are secured with 256-bit SSL encryption</p>
        <p>PCI DSS compliant • FCA regulated payment processors</p>
      </div>
    </div>
  );
}