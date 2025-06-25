import { NextRequest, NextResponse } from 'next/server';

const PAYPAL_API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured');
  }

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`PayPal token error: ${data.error_description || data.error}`);
  }

  return data.access_token;
}

export async function POST(request: NextRequest) {
  try {
    console.log('PayPal capture API called');
    const body = await request.json();
    const { orderID, safari_payment } = body;
    
    console.log('PayPal capture request:', { orderID, safari_payment });

    if (!orderID) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();

    console.log('Capturing PayPal order:', orderID);

    // Capture the payment
    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'PayPal-Request-Id': `tkafro_capture_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      },
      body: JSON.stringify({}),
    });

    const captureData = await response.json();
    
    if (!response.ok) {
      console.error('PayPal capture failed:', captureData);
      return NextResponse.json(
        { 
          error: captureData.message || 'Failed to capture PayPal payment',
          details: captureData.details || [],
        },
        { status: response.status }
      );
    }

    console.log('PayPal payment captured successfully:', captureData.id);

    // Extract payment details
    const capture = captureData.purchase_units?.[0]?.payments?.captures?.[0];
    const payer = captureData.payer;

    const responseData = {
      id: captureData.id,
      status: captureData.status,
      payer: {
        name: payer?.name,
        email: payer?.email_address,
        payer_id: payer?.payer_id,
      },
      payment: {
        capture_id: capture?.id,
        amount: capture?.amount,
        status: capture?.status,
        create_time: capture?.create_time,
        update_time: capture?.update_time,
      },
      safari_payment,
    };

    return NextResponse.json(responseData);

  } catch (error: any) {
    console.error('PayPal capture error:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'An unexpected error occurred during capture',
        type: 'paypal_capture_error',
      },
      { status: 500 }
    );
  }
}