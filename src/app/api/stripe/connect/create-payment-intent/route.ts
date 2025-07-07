
import { NextResponse } from 'next/server';
import { createStripeConnectIntegration } from '@/lib/stripe-connect-integration';
import { db } from '@vercel/postgres';

export async function POST(request: Request) {
  try {
    const { amount, currency, customerDetails, productId } = await request.json();

    if (!amount || !currency || !customerDetails || !productId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Get the seller's Stripe account ID from the database
    const sellerResult = await db.sql`
      SELECT s.stripe_account_id
      FROM sellers s
      JOIN products p ON s.id = p.seller_id
      WHERE p.id = ${productId};
    `;

    const sellerAccountId = sellerResult.rows[0]?.stripe_account_id;

    if (!sellerAccountId) {
      return NextResponse.json({ error: 'Seller not found for this product' }, { status: 404 });
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
