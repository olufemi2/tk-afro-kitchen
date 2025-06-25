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
    console.log('PayPal order creation API called');
    const body = await request.json();
    const { amount, currency = 'GBP', customer_details, safari_payment } = body;
    
    console.log('PayPal order request:', { amount, currency, safari_payment });

    // Validate required fields
    if (!amount || parseFloat(amount) < 0.30) {
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

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();

    // Create PayPal order
    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount,
          },
          description: `TK Afro Kitchen Order - ${customer_details.name}`,
          custom_id: `tkafro_${Date.now()}`,
          soft_descriptor: 'TKAFRO',
        },
      ],
      payer: {
        name: {
          given_name: customer_details.name.split(' ')[0] || customer_details.name,
          surname: customer_details.name.split(' ').slice(1).join(' ') || 'Customer',
        },
        email_address: customer_details.email,
        phone: customer_details.phone ? {
          phone_type: 'MOBILE',
          phone_number: {
            national_number: customer_details.phone.replace(/\D/g, ''),
          },
        } : undefined,
        address: customer_details.address ? {
          address_line_1: customer_details.address.line1,
          admin_area_2: customer_details.address.city,
          postal_code: customer_details.address.postal_code,
          country_code: customer_details.address.country || 'GB',
        } : undefined,
      },
      application_context: {
        brand_name: 'TK Afro Kitchen',
        locale: 'en-GB',
        landing_page: safari_payment ? 'LOGIN' : 'NO_PREFERENCE',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW',
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success?paypal=true&safari=${safari_payment}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout?paypal_cancelled=true`,
      },
    };

    console.log('Creating PayPal order with data:', JSON.stringify(orderData, null, 2));

    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'PayPal-Request-Id': `tkafro_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      },
      body: JSON.stringify(orderData),
    });

    const orderResponse = await response.json();
    
    if (!response.ok) {
      console.error('PayPal order creation failed:', orderResponse);
      return NextResponse.json(
        { 
          error: orderResponse.message || 'Failed to create PayPal order',
          details: orderResponse.details || [],
        },
        { status: response.status }
      );
    }

    console.log('PayPal order created successfully:', orderResponse.id);

    return NextResponse.json({
      id: orderResponse.id,
      status: orderResponse.status,
      links: orderResponse.links,
    });

  } catch (error: any) {
    console.error('PayPal order creation error:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'An unexpected error occurred',
        type: 'paypal_error',
      },
      { status: 500 }
    );
  }
}