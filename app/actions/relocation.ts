'use server'

import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { sendRelocationConfirmation } from '@/lib/email'
import { revalidatePath } from 'next/cache'

const relocationSchema = z.object({
  customerName: z.string().min(2, 'Full name is required'),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().min(7, 'Phone number is required'),
  pickupLocation: z.string().min(5, 'Pick-up location is required'),
  destination: z.string().min(5, 'Destination is required'),
  itemsList: z.string().min(3, 'Please list the items to be moved'),
  itemDescription: z.string().min(10, 'Please provide a description of the items'),
  transportBy: z.enum(['self', 'fraogo']),
})

export type RelocationFormData = z.infer<typeof relocationSchema>

export async function submitRelocationRequest(data: RelocationFormData) {
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

export async function getRelocationRequests(status?: string) {
  await requireAdmin()
  return prisma.relocationRequest.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: 'desc' },
  })
}

export async function updateRelocationStatus(id: string, status: string) {
  await requireAdmin()
  return prisma.relocationRequest.update({ where: { id }, data: { status } })
}
