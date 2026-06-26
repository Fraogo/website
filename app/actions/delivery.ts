'use server'

import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { enforceSubmissionLimit, looksLikeBot } from '@/lib/submitGuard'
import { sendDeliveryConfirmation } from '@/lib/email'
import { paginationParams, totalPages } from '@/lib/pagination'
import { revalidatePath } from 'next/cache'

const deliverySchema = z.object({
  type: z.enum(['local', 'international']),
  senderName: z.string().min(2, 'Sender name is required').max(200),
  senderEmail: z.string().email('Invalid email address').max(200),
  senderPhone: z.string().min(7, 'Phone number is required').max(40),
  itemDescription: z.string().min(5, 'Please describe the item(s)').max(2000),
  itemWeight: z.number().min(0.01, 'Weight must be greater than 0').max(1_000_000),
  weightUnit: z.enum(['kg', 'lbs']),
  destination: z.string().min(3, 'Destination is required').max(500),
  receiverName: z.string().min(2, 'Receiver name is required').max(200),
  receiverContact: z.string().min(7, 'Receiver contact is required').max(200),
  consentGiven: z.literal(true, { message: 'You must agree to the inspection consent' }),
})

export type DeliveryFormData = z.infer<typeof deliverySchema>

export async function submitDeliveryRequest(data: DeliveryFormData) {
  const limitError = await enforceSubmissionLimit('delivery')
  if (limitError) return { success: false, error: limitError }
  if (looksLikeBot(data)) return { success: true }

  const parsed = deliverySchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors }
  }

  const d = parsed.data

  try {
    await prisma.deliveryRequest.create({
      data: {
        type: d.type,
        senderName: d.senderName,
        senderEmail: d.senderEmail,
        senderPhone: d.senderPhone,
        itemDescription: d.itemDescription,
        itemWeight: d.itemWeight,
        weightUnit: d.weightUnit,
        destination: d.destination,
        receiverName: d.receiverName,
        receiverContact: d.receiverContact,
        consentGiven: d.consentGiven,
        status: 'pending',
      },
    })

    sendDeliveryConfirmation(d).catch(console.error)
    revalidatePath('/admin/deliveries')

    return { success: true }
  } catch (error) {
    console.error('[Delivery] Submit error:', error)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}

export async function getDeliveryRequests(status?: string, page?: number) {
  await requireAdmin()
  const where = status ? { status } : undefined
  const { skip, take, page: safePage } = paginationParams(page)
  const [deliveries, total] = await Promise.all([
    prisma.deliveryRequest.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take }),
    prisma.deliveryRequest.count({ where }),
  ])
  return { deliveries, total, page: safePage, totalPages: totalPages(total) }
}

export async function updateDeliveryStatus(id: string, status: string) {
  await requireAdmin()
  return prisma.deliveryRequest.update({ where: { id }, data: { status } })
}

export async function deleteDeliveryRequest(id: string) {
  await requireAdmin()
  try {
    await prisma.deliveryRequest.delete({ where: { id } })
    revalidatePath('/admin/deliveries')
    return { success: true }
  } catch (error) {
    console.error('[Delivery] Delete error:', error)
    return { success: false, error: 'Failed to delete request.' }
  }
}
