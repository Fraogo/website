'use server'

import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { enforceSubmissionLimit, looksLikeBot } from '@/lib/submitGuard'
import { sendRelocationConfirmation } from '@/lib/email'
import { paginationParams, totalPages } from '@/lib/pagination'
import { revalidatePath } from 'next/cache'

const relocationSchema = z.object({
  customerName: z.string().min(2, 'Full name is required').max(200),
  customerEmail: z.string().email('Invalid email address').max(200),
  customerPhone: z.string().min(7, 'Phone number is required').max(40),
  pickupLocation: z.string().min(5, 'Pick-up location is required').max(500),
  destination: z.string().min(5, 'Destination is required').max(500),
  itemsList: z.string().min(3, 'Please list the items to be moved').max(3000),
  itemDescription: z.string().min(10, 'Please provide a description of the items').max(3000),
  transportBy: z.enum(['self', 'fraogo']),
})

export type RelocationFormData = z.infer<typeof relocationSchema>

export async function submitRelocationRequest(data: RelocationFormData) {
  const limitError = await enforceSubmissionLimit('relocation')
  if (limitError) return { success: false, error: limitError }
  if (looksLikeBot(data)) return { success: true }

  const parsed = relocationSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors }
  }

  const d = parsed.data

  try {
    await prisma.relocationRequest.create({
      data: {
        customerName: d.customerName,
        customerEmail: d.customerEmail,
        customerPhone: d.customerPhone,
        pickupLocation: d.pickupLocation,
        destination: d.destination,
        itemsList: d.itemsList,
        itemDescription: d.itemDescription,
        transportBy: d.transportBy,
        status: 'pending',
      },
    })

    sendRelocationConfirmation(d).catch(console.error)
    revalidatePath('/admin/relocations')

    return { success: true }
  } catch (error) {
    console.error('[Relocation] Submit error:', error)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}

export async function getRelocationRequests(status?: string, page?: number) {
  await requireAdmin()
  const where = status ? { status } : undefined
  const { skip, take, page: safePage } = paginationParams(page)
  const [relocations, total] = await Promise.all([
    prisma.relocationRequest.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take }),
    prisma.relocationRequest.count({ where }),
  ])
  return { relocations, total, page: safePage, totalPages: totalPages(total) }
}

export async function updateRelocationStatus(id: string, status: string) {
  await requireAdmin()
  return prisma.relocationRequest.update({ where: { id }, data: { status } })
}

export async function deleteRelocationRequest(id: string) {
  await requireAdmin()
  try {
    await prisma.relocationRequest.delete({ where: { id } })
    revalidatePath('/admin/relocations')
    return { success: true }
  } catch (error) {
    console.error('[Relocation] Delete error:', error)
    return { success: false, error: 'Failed to delete request.' }
  }
}
