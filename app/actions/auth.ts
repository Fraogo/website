'use server'

import { createAdminSession, destroyAdminSession, getAdminCredentials } from '@/lib/auth'
import { tooManyAttempts, registerFailedAttempt, clearAttempts } from '@/lib/rateLimit'
import { compare } from 'bcryptjs'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes

export async function adminLogin(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  // ── Rate limit by client IP ────────────────────────────────────────────────
  const hdrs = await headers()
  const ip = (hdrs.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown'
  const key = `admin-login:${ip}`

  const { blocked, retryAfterMs } = tooManyAttempts(key, MAX_ATTEMPTS)
  if (blocked) {
    const mins = Math.max(1, Math.ceil(retryAfterMs / 60_000))
    return { error: `Too many attempts. Try again in ${mins} minute${mins === 1 ? '' : 's'}.` }
  }

  const { email: adminEmail, passwordHash } = getAdminCredentials()
  const isValid = email === adminEmail && (await compare(password, passwordHash))

  if (!isValid) {
    registerFailedAttempt(key, WINDOW_MS)
    return { error: 'Invalid credentials' }
  }

  clearAttempts(key)
  await createAdminSession(email)
  redirect('/admin')
}

export async function adminLogout() {
  await destroyAdminSession()
  redirect('/admin/login')
}
