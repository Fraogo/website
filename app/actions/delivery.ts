'use server'

import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { sendDeliveryConfirmation } from '@/lib/email'
import { revalidatePath } from 'next/cache'

const deliverySchema = z.object({
  type: z.enum(['local', 'international']),
  senderName: z.string().min(2, 'Sender name is required'),
  senderEmail: z.string().email('Invalid email address'),
  senderPhone: z.string().min(7, 'Phone number is required'),
  itemDescription: z.string().min(5, 'Please describe the item(s)'),
  itemWeight: z.number().min(0.01, 'Weight must be greater than 0'),
  weightUnit: z.enum(['kg', 'lbs']),
  destination: z.string().min(3, 'Destination is required'),
  receiverName: z.string().min(2, 'Receiver name is required'),
  receiverContact: z.string().min(7, 'Receiver contact is required'),
  consentGiven: z.literal(true, { message: 'You must agree to the inspection consent' }),
})

export type DeliveryFormData = z.infer<typeof deliverySchema>

export async function submitDeliveryRequest(data: DeliveryFormData) {
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

export async function getDeliveryRequests(status?: string) {
  await requireAdmin()
  return prisma.deliveryRequest.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: 'desc' },
  })
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
