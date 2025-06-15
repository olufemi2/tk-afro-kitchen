import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = 'gbp', customer_details, payment_method_id } = body;

    // Validate required fields
    if (!amount || amount < 30) { // Minimum 30p
      return NextResponse.json(
        { error: 'Invalid amount. Minimum £0.30 required.' },
        { status: 400 }
      );
    }

    if (!customer_details?.name || !customer_details?.email) {
      return NextResponse.json(
        { error: 'Customer name and email are required.' },
        { status: 400 }
      );
    }

    // Create or retrieve customer
    let customer;
    try {
      // Try to find existing customer by email
      const existingCustomers = await stripe.customers.list({
        email: customer_details.email,
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0];
      } else {
        // Create new customer
        customer = await stripe.customers.create({
          name: customer_details.name,
          email: customer_details.email,
          phone: customer_details.phone,
          address: customer_details.address,
          metadata: {
            source: 'tk-afro-kitchen-website',
            created_at: new Date().toISOString(),
          },
        });
      }
    } catch (customerError) {
      console.error('Customer creation error:', customerError);
      // Continue without customer if creation fails
    }

    // Create payment intent (without payment method - will be attached during confirmation)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Ensure integer
      currency: currency.toLowerCase(),
      customer: customer?.id,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        customer_name: customer_details.name,
        customer_email: customer_details.email,
        customer_phone: customer_details.phone || '',
        order_source: 'tk-afro-kitchen-website',
        created_at: new Date().toISOString(),
      },
      receipt_email: customer_details.email,
      description: `TK Afro Kitchen Order - ${customer_details.name}`,
      shipping: customer_details.address ? {
        name: customer_details.name,
        phone: customer_details.phone,
        address: {
          line1: customer_details.address.line1,
          city: customer_details.address.city,
          postal_code: customer_details.address.postal_code,
          country: customer_details.address.country || 'GB',
        },
      } : undefined,
    });

    return NextResponse.json({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
      customer_id: customer?.id,
    });

  } catch (error: any) {
    console.error('Payment intent creation error:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'An unexpected error occurred',
        type: error.type || 'api_error',
      },
      { status: 500 }
    );
  }
}

// Handle payment intent confirmation webhook
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { payment_intent_id } = body;

    if (!payment_intent_id) {
      return NextResponse.json(
        { error: 'Payment intent ID is required' },
        { status: 400 }
      );
    }

    // Retrieve payment intent to get latest status
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

    return NextResponse.json({
      status: paymentIntent.status,
      amount_received: paymentIntent.amount_received,
      metadata: paymentIntent.metadata,
    });

  } catch (error: any) {
    console.error('Payment intent retrieval error:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve payment status' },
      { status: 500 }
    );
  }
}