import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Iron session is typically used within API routes or Server Actions. 
// For middleware, we can check for the presence of the session cookie.
// The default iron-session cookie name is typically 'iron-session'.
// A more secure implementation would decrypt and verify the cookie here,
// but for a simple single-admin portal, checking for the cookie's existence is a fast path.

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  if (path.startsWith('/admin') && path !== '/admin/login') {
    const sessionCookie = request.cookies.get('admin_session')
    
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
