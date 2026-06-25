/**
 * Tiny in-memory rate limiter.
 *
 * Tracks failed attempts per key (e.g. per IP) within a sliding window.
 * Good enough to blunt brute-force on a single-admin login.
 *
 * Caveat: state lives in process memory, so on serverless it is per-instance
 * and resets on cold start. For production-grade limiting across instances,
 * swap the Map for a durable store (e.g. Upstash Redis). See TASKS.md.
 */

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

/** Is this key currently over the limit? Does not mutate state. */
export function tooManyAttempts(
  key: string,
  max: number
): { blocked: boolean; retryAfterMs: number } {
  const b = buckets.get(key)
  if (!b) return { blocked: false, retryAfterMs: 0 }
  if (Date.now() > b.resetAt) {
    buckets.delete(key)
    return { blocked: false, retryAfterMs: 0 }
  }
  return { blocked: b.count >= max, retryAfterMs: Math.max(0, b.resetAt - Date.now()) }
}

/** Record one failed attempt, opening or extending the window. */
export function registerFailedAttempt(key: string, windowMs: number): void {
  const now = Date.now()
  const b = buckets.get(key)
  if (!b || now > b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
  } else {
    b.count++
  }
}

/** Clear a key's attempts (call on successful auth). */
export function clearAttempts(key: string): void {
  buckets.delete(key)
}

/**
 * Generic sliding-window counter: counts EVERY call against `key` and reports
 * `limited` once the count exceeds `max` within `windowMs`. Used to throttle
 * public form submissions per IP (unlike the failed-attempt helpers above, which
 * only count failures).
 *
 * Caveat: same in-memory, per-instance limitation as the rest of this module —
 * on serverless each instance has its own counter. Good enough to blunt naive
 * floods; swap for Upstash Redis for cross-instance accuracy (see TASKS.md).
 */
export function rateLimit(
  key: string,
  max: number,
  windowMs: number
): { limited: boolean; retryAfterMs: number } {
  const now = Date.now()
  const b = buckets.get(key)
  if (!b || now > b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { limited: false, retryAfterMs: 0 }
  }
  b.count++
  if (b.count > max) {
    return { limited: true, retryAfterMs: Math.max(0, b.resetAt - now) }
  }
  return { limited: false, retryAfterMs: 0 }
}
