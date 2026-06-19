'use server'

import { createAdminSession, destroyAdminSession, getAdminCredentials, requireAdmin } from '@/lib/auth'
import { tooManyAttempts, registerFailedAttempt, clearAttempts } from '@/lib/rateLimit'
import { prisma } from '@/lib/db'
import { compare, hash as bcryptHash } from 'bcryptjs'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const PASSWORD_HASH_KEY = 'admin_password_hash'

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
