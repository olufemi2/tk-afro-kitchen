
import { NextResponse } from 'next/server';
import { createStripeConnectIntegration } from '@/lib/stripe-connect-integration';
import { db } from '@vercel/postgres';
import Stripe from 'stripe';

export async function POST(request: Request) {
  const stripeConnect = createStripeConnectIntegration();
  const signature = request.headers.get('stripe-signature')!;
  const payload = await request.text();

  try {
    const event = stripeConnect.handleWebhookEvent(payload, signature);

    if (event.success && event.data) {
      const session = event.data.data.object as Stripe.Account;

      if (event.data.type === 'account.updated') {
        const account = session;
        if (account.charges_enabled) {
          await db.sql`
            UPDATE sellers
            SET stripe_account_status = 'active'
            WHERE stripe_account_id = ${account.id};
          `;
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('❌ Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
