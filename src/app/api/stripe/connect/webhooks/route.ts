
import { NextResponse } from 'next/server';
import { createStripeConnectIntegration } from '@/lib/stripe-connect-integration';
import { db } from '@vercel/postgres';
import Stripe from 'stripe';
import { sendOrderConfirmationEmail } from '../../../../lib/email-service';

export async function POST(request: Request) {
  const stripeConnect = createStripeConnectIntegration();
  const signature = request.headers.get('stripe-signature')!;
  const payload = await request.text();

  try {
    const event = await stripeConnect.handleWebhookEvent(payload, signature);

    if (event.success && event.data) {
      const session = event.data.data.object as Stripe.Account;

      if (event.data.type === 'account.updated') {
        const account = session;
        if (account.charges_enabled) {
          try {
            await db.sql`
              UPDATE sellers
              SET stripe_account_status = 'active'
              WHERE stripe_account_id = ${account.id};
            `;
          } catch (dbError) {
            console.error('Database update failed:', dbError);
            // Continue processing webhook even if DB update fails
          }
        }
      } else if (event.data.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        // TODO: Fetch actual order details from your database using paymentIntent.id or metadata
        // For now, using placeholder values
        const orderId = paymentIntent.id;
        const customerEmail = paymentIntent.receipt_email || 'customer@example.com'; // Use receipt_email or fetch from your DB
        const customerName = 'Valued Customer'; // Fetch from your DB
        const amount = (paymentIntent.amount / 100).toFixed(2); // Convert cents to dollars/pounds
        const status = 'Completed';
        const items = [{ name: 'Product Name', quantity: 1, price: '0.00' }]; // Fetch from your DB

        try {
          await sendOrderConfirmationEmail({
            orderId,
            customerEmail,
            customerName,
            amount,
            status,
            items,
          });
          console.log(`Order confirmation email sent for PaymentIntent: ${orderId}`);
        } catch (emailError) {
          console.error(`Failed to send order confirmation email for PaymentIntent ${orderId}:`, emailError);
        }

        // Send notification email to kitchen staff
        try {
          await sendKitchenNotificationEmail({
            orderId,
            customerName,
            amount,
            items,
            customerEmail: '', // Not needed for kitchen notification
            status: '', // Not needed for kitchen notification
          });
          console.log(`Kitchen notification email sent for PaymentIntent: ${orderId}`);
        } catch (kitchenEmailError) {
          console.error(`Failed to send kitchen notification email for PaymentIntent ${orderId}:`, kitchenEmailError);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('❌ Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
