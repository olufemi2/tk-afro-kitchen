import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Detect Safari for payment-related routes
  const userAgent = request.headers.get('user-agent') || '';
  const isSafari = /Safari/.test(userAgent) && !/Chrome|CriOS|FxiOS/.test(userAgent);
  const isPaymentRoute = request.nextUrl.pathname.includes('checkout') || 
                        request.nextUrl.pathname.includes('success') ||
                        request.nextUrl.pathname.includes('api/create-payment-intent');

  if (isSafari && isPaymentRoute) {
    console.log('🍎 Safari middleware: Setting payment-compatible headers');
    
    // Set Safari-specific headers for payment routes
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    // CORS headers for Safari payment compatibility
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    response.headers.set('Cross-Origin-Embedder-Policy', 'unsafe-none');
    
    // Set Safari-compatible cookie headers
    if (request.nextUrl.pathname.includes('api/create-payment-intent')) {
      response.headers.set('Set-Cookie', 'SameSite=None; Secure; HttpOnly');
    }
  }

  // Handle preflight requests for payment API
  if (request.method === 'OPTIONS' && request.nextUrl.pathname.includes('api/create-payment-intent')) {
    const preflightResponse = new NextResponse(null, { status: 200 });
    preflightResponse.headers.set('Access-Control-Allow-Origin', request.headers.get('origin') || '*');
    preflightResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    preflightResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    preflightResponse.headers.set('Access-Control-Allow-Credentials', 'true');
    return preflightResponse;
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * But include specific API routes for payment
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/api/create-payment-intent/:path*',
  ],
};