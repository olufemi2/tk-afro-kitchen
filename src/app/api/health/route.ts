import { NextResponse } from 'next/server';

export async function GET() {
  const checks = {
    environment: process.env.NODE_ENV,
    vercel: !!process.env.VERCEL,
    hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
    hasPayPalClientId: !!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    hasPostgresUrl: !!process.env.POSTGRES_URL,
    hasSiteUrl: !!process.env.NEXT_PUBLIC_SITE_URL,
  };

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    checks,
  });
}