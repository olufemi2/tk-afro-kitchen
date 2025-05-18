import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Verify PayPal webhook signature
async function verifyWebhookSignature(
  body: string,
  headers: Headers
): Promise<boolean> {
  try {
    const response = await fetch('https://api-m.paypal.com/v1/notifications/verify-webhook-signature', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PAYPAL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        auth_algo: headers.get('paypal-auth-algo'),
        cert_url: headers.get('paypal-cert-url'),
        transmission_id: headers.get('paypal-transmission-id'),
        transmission_sig: headers.get('paypal-transmission-sig'),
        transmission_time: headers.get('paypal-transmission-time'),
        webhook_id: process.env.PAYPAL_WEBHOOK_ID,
        webhook_event: JSON.parse(body)
      })
    });

    const verification = await response.json();
    return verification.verification_status === 'SUCCESS';
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const headersList = headers();
    const body = await request.text();

    // Verify webhook signature
    const isValid = await verifyWebhookSignature(body, headersList);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    const event = JSON.parse(body);
    console.log('Received PayPal webhook event:', event.event_type);

    // Handle different event types
    switch (event.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        // Payment was successfully captured
        await handlePaymentCompleted(event);
        break;

      case 'PAYMENT.CAPTURE.DENIED':
        // Payment was denied
        await handlePaymentDenied(event);
        break;

      case 'PAYMENT.CAPTURE.REFUNDED':
        // Payment was refunded
        await handlePaymentRefunded(event);
        break;

      case 'PAYMENT.CAPTURE.PENDING':
        // Payment is pending
        await handlePaymentPending(event);
        break;

      default:
        console.log('Unhandled event type:', event.event_type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// Event handlers
async function handlePaymentCompleted(event: any) {
  const { id, status, amount, custom_id } = event.resource;
  
  // Update order status in your database
  // Send confirmation email to customer
  // Update inventory
  // Notify kitchen staff
  console.log('Payment completed:', { id, status, amount, custom_id });
}

async function handlePaymentDenied(event: any) {
  const { id, status, amount, custom_id } = event.resource;
  
  // Update order status
  // Notify customer of failed payment
  // Release reserved inventory
  console.log('Payment denied:', { id, status, amount, custom_id });
}

async function handlePaymentRefunded(event: any) {
  const { id, status, amount, custom_id } = event.resource;
  
  // Update order status
  // Process refund in your system
  // Notify customer of refund
  console.log('Payment refunded:', { id, status, amount, custom_id });
}

async function handlePaymentPending(event: any) {
  const { id, status, amount, custom_id } = event.resource;
  
  // Update order status
  // Notify customer of pending payment
  console.log('Payment pending:', { id, status, amount, custom_id });
} 