'use server'

import { createAdminSession, destroyAdminSession, getAdminCredentials, requireAdmin } from '@/lib/auth'
import { tooManyAttempts, registerFailedAttempt, clearAttempts } from '@/lib/rateLimit'
import { prisma } from '@/lib/db'
import { sendAdminPasswordResetCode } from '@/lib/email'
import { compare, hash as bcryptHash } from 'bcryptjs'
import { randomInt } from 'crypto'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const PASSWORD_HASH_KEY = 'admin_password_hash'

// Password-reset-by-email-code config
const RESET_CODE_KEY = 'admin_reset_code'
const RESET_CODE_TTL_MS = 15 * 60 * 1000 // 15 minutes
const MAX_RESET_REQUESTS = 3              // code requests per IP per window
const MAX_RESET_VERIFY = 5                // code guesses per IP per window

function clientIp(hdrs: Headers) {
  return (hdrs.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown'
}

// Active admin password hash: from the DB once changed in-app, else the env fallback.
async function getActivePasswordHash(): Promise<string> {
  try {
    const setting = await prisma.setting.findUnique({ where: { key: PASSWORD_HASH_KEY } })
    if (setting?.value) return setting.value
  } catch (err) {
    console.error('[Auth] password-hash lookup failed:', err)
  }
  return getAdminCredentials().passwordHash
}

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

  const { email: adminEmail } = getAdminCredentials()
  const passwordHash = await getActivePasswordHash()

  // Fail closed if no password is configured anywhere (DB setting or env).
  // Without this, an empty hash combined with a weak compare could let any
  // password through. Never allow login when there is nothing to verify against.
  if (!adminEmail || !passwordHash) {
    return { error: 'Admin login is not configured. Set an admin password first.' }
  }

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

export async function changeAdminPassword(currentPassword: string, newPassword: string) {
  await requireAdmin()

  if (!currentPassword || !newPassword) {
    return { success: false, error: 'Both fields are required.' }
  }
  if (newPassword.length < 8) {
    return { success: false, error: 'New password must be at least 8 characters.' }
  }

  const currentHash = await getActivePasswordHash()
  const ok = !!currentHash && (await compare(currentPassword, currentHash))
  if (!ok) {
    return { success: false, error: 'Current password is incorrect.' }
  }

  const newHash = await bcryptHash(newPassword, 10)
  await prisma.setting.upsert({
    where:  { key: PASSWORD_HASH_KEY },
    update: { value: newHash },
    create: { key: PASSWORD_HASH_KEY, value: newHash },
  })
  return { success: true }
}

// ── Forgot password: email a one-time code, then reset with it ─────────────────

/**
 * Step 1 — generate a 6-digit code, store it HASHED with a 15-min expiry, and
 * email it to the admin's own inbox (ADMIN_EMAIL). Always returns a generic
 * success so the endpoint never reveals whether the entered email is the admin's.
 */
export async function requestAdminPasswordReset(email: string) {
  const hdrs = await headers()
  const key = `admin-reset-req:${clientIp(hdrs)}`

  const { blocked, retryAfterMs } = tooManyAttempts(key, MAX_RESET_REQUESTS)
  if (blocked) {
    const mins = Math.max(1, Math.ceil(retryAfterMs / 60_000))
    return { success: false, error: `Too many requests. Try again in ${mins} minute${mins === 1 ? '' : 's'}.` }
  }
  registerFailedAttempt(key, RESET_CODE_TTL_MS)

  const { email: adminEmail } = getAdminCredentials()
  // Only generate + send when the entered email is the admin's. The code goes to
  // ADMIN_EMAIL regardless, so a stranger entering the address can't receive it.
  if (adminEmail && email.trim().toLowerCase() === adminEmail.toLowerCase()) {
    const code = String(randomInt(0, 1_000_000)).padStart(6, '0')
    const codeHash = await bcryptHash(code, 10)
    const value = JSON.stringify({ hash: codeHash, expiresAt: Date.now() + RESET_CODE_TTL_MS })
    await prisma.setting.upsert({
      where:  { key: RESET_CODE_KEY },
      update: { value },
      create: { key: RESET_CODE_KEY, value },
    })
    sendAdminPasswordResetCode({ code }).catch(console.error)
  }

  return { success: true }
}

/**
 * Step 2 — verify the emailed code and set a new password. Rate-limited per IP so
 * the 6-digit code can't be brute-forced. Consumes the code on success.
 */
export async function resetAdminPasswordWithCode(email: string, code: string, newPassword: string) {
  const hdrs = await headers()
  const key = `admin-reset-verify:${clientIp(hdrs)}`

  const { blocked, retryAfterMs } = tooManyAttempts(key, MAX_RESET_VERIFY)
  if (blocked) {
    const mins = Math.max(1, Math.ceil(retryAfterMs / 60_000))
    return { success: false, error: `Too many attempts. Try again in ${mins} minute${mins === 1 ? '' : 's'}.` }
  }

  if (!newPassword || newPassword.length < 8) {
    return { success: false, error: 'New password must be at least 8 characters.' }
  }

  const { email: adminEmail } = getAdminCredentials()
  const setting = await prisma.setting.findUnique({ where: { key: RESET_CODE_KEY } })

  let valid = false
  if (adminEmail && email.trim().toLowerCase() === adminEmail.toLowerCase() && setting?.value) {
    try {
      const { hash, expiresAt } = JSON.parse(setting.value) as { hash: string; expiresAt: number }
      if (Date.now() <= expiresAt) valid = await compare(code.trim(), hash)
    } catch {
      // malformed stored value — treat as invalid
    }
  }

  if (!valid) {
    registerFailedAttempt(key, WINDOW_MS)
    return { success: false, error: 'Invalid or expired code. Request a new one.' }
  }

  const newHash = await bcryptHash(newPassword, 10)
  await prisma.setting.upsert({
    where:  { key: PASSWORD_HASH_KEY },
    update: { value: newHash },
    create: { key: PASSWORD_HASH_KEY, value: newHash },
  })
  // Consume the code so it can't be reused
  await prisma.setting.delete({ where: { key: RESET_CODE_KEY } }).catch(() => {})
  clearAttempts(key)

  return { success: true }
}
