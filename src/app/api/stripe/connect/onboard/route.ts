
import { NextResponse } from 'next/server';
import { createStripeConnectIntegration } from '@/lib/stripe-connect-integration';

export async function POST(request: Request) {
  try {
    const { email, businessName } = await request.json();

    if (!email || !businessName) {
      return NextResponse.json({ error: 'Email and business name are required' }, { status: 400 });
    }

    const stripeConnect = createStripeConnectIntegration();
    const result = await stripeConnect.createConnectAccountLink({ email, businessName });

    if (result.success) {
      return NextResponse.json({ url: result.url });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error: any) {
    console.error('❌ API Error - /api/stripe/connect/onboard:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
