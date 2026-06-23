import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSessionFromRequest } from '@/lib/auth'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ─── Protect /admin/* routes ──────────────────────────────────────────────
  // /admin/login and /admin/forgot-password must stay reachable while logged out.
  const PUBLIC_ADMIN_PATHS = ['/admin/login', '/admin/forgot-password']
  if (pathname.startsWith('/admin') && !PUBLIC_ADMIN_PATHS.includes(pathname)) {
    const isAuthenticated = await verifyAdminSessionFromRequest(request)
    if (!isAuthenticated) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // ─── Redirect authenticated admin away from login ─────────────────────────
  if (pathname === '/admin/login') {
    const isAuthenticated = await verifyAdminSessionFromRequest(request)
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  // ─── Protect /vendor/dashboard (requires valid magic link token) ──────────
  // Token validation happens in the page component itself (server-side)
  // The proxy just ensures the route is accessible only with a token param
  if (pathname === '/vendor/dashboard') {
    const token = request.nextUrl.searchParams.get('token')
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin(.*)',
    '/vendor/dashboard',
  ],
}
