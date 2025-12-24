import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for admin routes, API routes, static files, and maintenance page
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname === '/maintenance' ||
    pathname === '/login'
  ) {
    return NextResponse.next();
  }

  try {
    // Fetch settings from API
    const baseUrl = request.nextUrl.origin;
    const response = await fetch(`${baseUrl}/api/settings`, {
      cache: 'no-store',
    });

    if (response.ok) {
      const settings = await response.json();
      
      // If maintenance mode is enabled, redirect to maintenance page
      if (settings.maintenanceMode) {
        return NextResponse.redirect(new URL('/maintenance', request.url));
      }
    }
  } catch (error) {
    // If there's an error fetching settings, allow the request to continue
    console.error('Middleware error:', error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
};
