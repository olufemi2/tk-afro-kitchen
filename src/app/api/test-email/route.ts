import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmationEmail } from '@/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    console.log('🧪 Testing email functionality with:', email);

    // Send test email
    const result = await sendOrderConfirmationEmail({
      orderId: 'TEST-' + Date.now(),
      customerEmail: email,
      customerName: 'Test Customer',
      amount: '25.99',
      status: 'Test Order',
      items: [
        { name: 'Jollof Rice (Large)', quantity: 1, price: '15.99' },
        { name: 'Chicken Curry (Medium)', quantity: 1, price: '10.00' }
      ]
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Test email sent successfully',
      messageId: result.messageId
    });

  } catch (error: any) {
    console.error('❌ Test email failed:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      details: error.stack
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Email test endpoint. Use POST with { "email": "test@example.com" }' 
  });
}