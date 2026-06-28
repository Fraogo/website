import { SignJWT, jwtVerify } from 'jose'
import { NextRequest } from 'next/server'

const SESSION_COOKIE = 'fraogo_admin_session'
const EXPIRES_IN = 60 * 60 * 24 * 30 // 30 days

function getSecret() {
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) throw new Error('NEXTAUTH_SECRET is not set')
  return new TextEncoder().encode(secret)
}

// ─── Create session (Server Action) ───────────────────────────────────────────
export async function createAdminSession(email: string) {
  const secret = getSecret()
  const token = await new SignJWT({ email, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${EXPIRES_IN}s`)
    .sign(secret)

  // Dynamic import for server-only environment
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: EXPIRES_IN,
    path: '/',
  })
}

// ─── Verify session (Server Components / Actions) ─────────────────────────────
export async function verifyAdminSession(): Promise<{ email: string } | null> {
  try {
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE)?.value
    if (!token) return null

    const secret = getSecret()
    const { payload } = await jwtVerify(token, secret)
    return { email: payload.email as string }
  } catch {
    return null
  }
}

// ─── Verify session from Request (Middleware) ─────────────────────────────────
export async function verifyAdminSessionFromRequest(
  request: NextRequest
): Promise<boolean> {
  try {
    const token = request.cookies.get(SESSION_COOKIE)?.value
    if (!token) return false

    const secret = getSecret()
    await jwtVerify(token, secret)
    return true
  } catch {
    return false
  }
}

// ─── Destroy session (Server Action) ──────────────────────────────────────────
export async function destroyAdminSession() {
  try {
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    cookieStore.delete(SESSION_COOKIE)
  } catch (err) {
    console.error('Failed to destroy session:', err)
  }
}

// ─── Authorization guard for Server Actions ───────────────────────────────────
// Server Actions are public POST endpoints — the /admin proxy does NOT protect
// them. Every admin-only action must call this first. Throws if not signed in.
export async function requireAdmin(): Promise<{ email: string }> {
  const session = await verifyAdminSession()
  if (!session) throw new Error('Unauthorized')
  return session
}

// ─── Admin credentials validation ─────────────────────────────────────────────
export function getAdminCredentials() {
  return {
    email: process.env.ADMIN_LOGIN_EMAIL ?? '',
    passwordHash: process.env.ADMIN_LOGIN_PASSWORD_HASH ?? '',
  }
}
