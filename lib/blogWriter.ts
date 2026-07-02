import { prisma } from '@/lib/db'

// Resolves a writer invite token to its record, or null if missing/revoked.
// Plain server-side helper (not a Server Action) so pages/actions can reuse it.
export async function validateWriterToken(token: string) {
  if (!token) return null
  const rec = await prisma.blogWriterToken.findUnique({ where: { token } })
  if (!rec || !rec.active) return null
  return rec
}
