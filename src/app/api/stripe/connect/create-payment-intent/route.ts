
import { NextResponse } from 'next/server';
import { createStripeConnectIntegration } from '@/lib/stripe-connect-integration';

export async function POST(request: Request) {
  try {
    const { amount, currency, customerDetails, sellerAccountId } = await request.json();

    if (!amount || !currency || !customerDetails || !sellerAccountId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const stripeConnect = createStripeConnectIntegration();
    const result = await stripeConnect.createPaymentIntentForOrder(
      {
        amount,
        customerEmail: customerDetails.email,
      },
      sellerAccountId
    );

    if (result.success) {
      return NextResponse.json({ client_secret: result.clientSecret });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error: any) {
    console.error('❌ API Error - /api/stripe/connect/create-payment-intent:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
