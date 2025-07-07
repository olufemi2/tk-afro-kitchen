
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function StripeConnectAdminPage() {
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [onboardingUrl, setOnboardingUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOnboard = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/stripe/connect/onboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, businessName }),
      });

      const data = await response.json();

      if (response.ok) {
        setOnboardingUrl(data.url);
      } else {
        setError(data.error || 'Failed to start onboarding');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Stripe Connect Onboarding Test</h1>
      <div className="space-y-4 max-w-md">
        <div>
          <Label htmlFor="email">Seller Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seller@example.com"
          />
        </div>
        <div>
          <Label htmlFor="businessName">Business Name</Label>
          <Input
            id="businessName"
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Awesome Wears"
          />
        </div>
        <Button onClick={handleOnboard} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Onboard with Stripe'}
        </Button>
        {onboardingUrl && (
          <div className="p-4 bg-green-100 border border-green-300 rounded">
            <p className="font-semibold">Onboarding URL:</p>
            <a href={onboardingUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 break-all">
              {onboardingUrl}
            </a>
          </div>
        )}
        {error && (
          <div className="p-4 bg-red-100 border border-red-300 rounded">
            <p className="font-semibold text-red-700">Error:</p>
            <p className="text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
