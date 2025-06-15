'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, CreditCard, Banknote, CheckCircle } from 'lucide-react';

interface GoCardlessPaymentProps {
  amount: number; // Amount in pence
  onSuccess: (paymentData: any) => void;
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

interface BankDetails {
  account_holder_name: string;
  sort_code: string;
  account_number: string;
}

export function GoCardlessPayment({ 
  amount, 
  onSuccess, 
  onError, 
  customerDetails 
}: GoCardlessPaymentProps) {
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    account_holder_name: customerDetails.name,
    sort_code: '',
    account_number: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'info' | 'bank-details' | 'confirm'>('info');
  const [error, setError] = useState<string | null>(null);

  const formatSortCode = (value: string) => {
    // Remove any non-digits and format as XX-XX-XX
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4, 6)}`;
  };

  const formatAccountNumber = (value: string) => {
    // Remove any non-digits and limit to 8 digits
    return value.replace(/\D/g, '').slice(0, 8);
  };

  const validateBankDetails = () => {
    const errors: string[] = [];

    if (!bankDetails.account_holder_name.trim()) {
      errors.push('Account holder name is required');
    }

    const sortCodeDigits = bankDetails.sort_code.replace(/\D/g, '');
    if (sortCodeDigits.length !== 6) {
      errors.push('Sort code must be 6 digits');
    }

    const accountDigits = bankDetails.account_number.replace(/\D/g, '');
    if (accountDigits.length < 6 || accountDigits.length > 8) {
      errors.push('Account number must be 6-8 digits');
    }

    return errors;
  };

  const handleBankDetailsSubmit = () => {
    const errors = validateBankDetails();
    if (errors.length > 0) {
      setError(errors.join(', '));
      return;
    }
    setError(null);
    setStep('confirm');
  };

  const handlePaymentSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/create-gocardless-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          customer_details: customerDetails,
          bank_details: {
            account_holder_name: bankDetails.account_holder_name,
            sort_code: bankDetails.sort_code.replace(/\D/g, ''),
            account_number: bankDetails.account_number,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment setup failed');
      }

      onSuccess(data);
    } catch (err: any) {
      console.error('GoCardless payment error:', err);
      setError(err.message || 'Payment setup failed');
      onError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const discountAmount = Math.round(amount * 0.03); // 3% discount
  const finalAmount = amount - discountAmount;

  if (step === 'info') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Banknote className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Pay by Bank Transfer
          </h3>
          <p className="text-gray-600">
            Save money with our secure Direct Debit payment option
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-900">Lower Cost</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              3% discount vs card payments
            </p>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">Bank Secure</span>
            </div>
            <p className="text-sm text-blue-700 mt-1">
              Direct from your bank account
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Original Amount:</span>
            <span className="line-through text-gray-500">
              £{(amount / 100).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Bank Transfer Discount (3%):</span>
            <span className="text-green-600">
              -£{(discountAmount / 100).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center text-lg font-semibold border-t pt-2 mt-2">
            <span>Total to Pay:</span>
            <span className="text-green-600">
              £{(finalAmount / 100).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="text-sm text-gray-500 space-y-1">
          <p>• Payment processed by GoCardless (FCA regulated)</p>
          <p>• Secure Direct Debit authorization</p>
          <p>• No card fees or processing charges</p>
          <p>• Payment confirmation within 1-2 business days</p>
        </div>

        <Button
          onClick={() => setStep('bank-details')}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          Continue with Bank Transfer
        </Button>
      </div>
    );
  }

  if (step === 'bank-details') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Building2 className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Enter Bank Details
          </h3>
          <p className="text-gray-600 text-sm">
            Your bank details are encrypted and secure
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="account_holder_name">Account Holder Name</Label>
            <Input
              id="account_holder_name"
              type="text"
              value={bankDetails.account_holder_name}
              onChange={(e) => setBankDetails(prev => ({
                ...prev,
                account_holder_name: e.target.value
              }))}
              placeholder="Full name on bank account"
              required
            />
          </div>

          <div>
            <Label htmlFor="sort_code">Sort Code</Label>
            <Input
              id="sort_code"
              type="text"
              value={bankDetails.sort_code}
              onChange={(e) => setBankDetails(prev => ({
                ...prev,
                sort_code: formatSortCode(e.target.value)
              }))}
              placeholder="XX-XX-XX"
              maxLength={8}
              required
            />
          </div>

          <div>
            <Label htmlFor="account_number">Account Number</Label>
            <Input
              id="account_number"
              type="text"
              value={bankDetails.account_number}
              onChange={(e) => setBankDetails(prev => ({
                ...prev,
                account_number: formatAccountNumber(e.target.value)
              }))}
              placeholder="12345678"
              maxLength={8}
              required
            />
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="flex space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep('info')}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            type="button"
            onClick={handleBankDetailsSubmit}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Review Payment
          </Button>
        </div>
      </div>
    );
  }

  // Confirmation step
  return (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Confirm Payment Details
        </h3>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Account Holder:</span>
          <span className="font-medium">{bankDetails.account_holder_name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Sort Code:</span>
          <span className="font-mono">{bankDetails.sort_code}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Account Number:</span>
          <span className="font-mono">****{bankDetails.account_number.slice(-4)}</span>
        </div>
        <hr className="my-3" />
        <div className="flex justify-between text-lg font-semibold">
          <span>Total Amount:</span>
          <span className="text-green-600">£{(finalAmount / 100).toFixed(2)}</span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="text-sm text-gray-500 space-y-1">
        <p>• A Direct Debit mandate will be set up with your bank</p>
        <p>• Payment will be collected within 1-2 business days</p>
        <p>• You can cancel the Direct Debit anytime through your bank</p>
        <p>• Protected by the Direct Debit Guarantee</p>
      </div>

      <div className="flex space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep('bank-details')}
          disabled={isLoading}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={handlePaymentSubmit}
          disabled={isLoading}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Setting up...
            </div>
          ) : (
            'Confirm Payment'
          )}
        </Button>
      </div>
    </div>
  );
}