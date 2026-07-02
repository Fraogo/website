'use server'

import { randomBytes } from 'crypto'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

// Admin: create a private writer invite link.
export async function createWriterToken(name: string) {
  await requireAdmin()
  const clean = (name ?? '').trim()
  if (clean.length < 2) return { success: false, error: 'Enter a name for the writer.' }

  const token = randomBytes(24).toString('hex')
  await prisma.blogWriterToken.create({ data: { token, name: clean.slice(0, 120) } })
  revalidatePath('/admin/blog/writers')
  return { success: true, token }
}

export async function getWriterTokens() {
  await requireAdmin()
  return prisma.blogWriterToken.findMany({ orderBy: { createdAt: 'desc' } })
}

export async function revokeWriterToken(id: string) {
  await requireAdmin()
  try {
    await prisma.blogWriterToken.update({ where: { id }, data: { active: false } })
    revalidatePath('/admin/blog/writers')
    return { success: true }
  } catch (error) {
    console.error('[BlogWriter] Revoke error:', error)
    return { success: false, error: 'Failed to revoke link.' }
  }
}
