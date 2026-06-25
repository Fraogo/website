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
