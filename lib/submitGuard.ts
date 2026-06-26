import { headers } from 'next/headers'
import { rateLimit } from './rateLimit'

// Public form submissions are throttled per client IP to blunt spam floods that
// would otherwise fill the DB and burn the Resend email quota. Generous enough
// that a real person (even several behind one office/NAT IP) won't hit it.
const MAX_SUBMISSIONS = 8
const WINDOW_MS = 10 * 60 * 1000 // 10 minutes

/**
 * Call at the very top of a public submit Server Action. Returns an error
 * message string if the caller is over the limit, or null to proceed.
 *
 *   const limitError = await enforceSubmissionLimit('procurement')
 *   if (limitError) return { success: false, error: limitError }
 */
export async function enforceSubmissionLimit(scope: string): Promise<string | null> {
  const hdrs = await headers()
  const ip = (hdrs.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown'

  const { limited, retryAfterMs } = rateLimit(`submit:${scope}:${ip}`, MAX_SUBMISSIONS, WINDOW_MS)
  if (!limited) return null

  const mins = Math.max(1, Math.ceil(retryAfterMs / 60_000))
  return `Too many submissions from your network. Please try again in ${mins} minute${mins === 1 ? '' : 's'}.`
}

// ─── Honeypot ─────────────────────────────────────────────────────────────────
// A hidden form field real users never see/fill. Bots that auto-fill every field
// give themselves away. The form sends it under this key; actions check it.
export const HONEYPOT_FIELD = 'company_website'

/** True if the hidden honeypot field was filled (i.e. the caller is a bot). */
export function looksLikeBot(data: unknown): boolean {
  const v = (data as Record<string, unknown> | null)?.[HONEYPOT_FIELD]
  return typeof v === 'string' && v.trim().length > 0
}
