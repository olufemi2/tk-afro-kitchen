import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Only apply to staging environment
  if (process.env.NODE_ENV === 'staging' || process.env.NEXT_PUBLIC_ENVIRONMENT === 'staging') {
    // Add aggressive cache-busting headers for staging
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('X-Staging-Deploy', Date.now().toString());
    
    // Add timestamp to force browser cache refresh
    const url = request.nextUrl.clone();
    if (!url.searchParams.has('_t') && !url.pathname.startsWith('/_next/')) {
      url.searchParams.set('_t', Date.now().toString());
      return NextResponse.redirect(url);
    }
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};