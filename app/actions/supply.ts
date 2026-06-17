'use server'

import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { sendSupplyOrderConfirmation } from '@/lib/email'
import { revalidatePath } from 'next/cache'

const supplyItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unit: z.enum(['Packs', 'Cartons']),
})

const supplySchema = z.object({
  customerName: z.string().min(2, 'Full name is required'),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().min(7, 'Phone number is required'),
  destination: z.string().min(5, 'Delivery destination is required'),
  preferredDate: z.string().refine((date) => {
    const d = new Date(date)
    const minDate = new Date()
    minDate.setDate(minDate.getDate() + 2)
    return d >= minDate
  }, { message: 'Preferred date must be at least 2 days from today' }),
  items: z.array(supplyItemSchema).min(1, 'Select at least one item'),
})

export type SupplyFormData = z.infer<typeof supplySchema>

export async function submitSupplyOrder(data: SupplyFormData) {
  const parsed = supplySchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors }
  }

  const d = parsed.data

  try {
    await prisma.supplyOrder.create({
      data: {
        customerName: d.customerName,
        customerEmail: d.customerEmail,
        customerPhone: d.customerPhone,
        destination: d.destination,
        preferredDate: new Date(d.preferredDate),
        items: d.items as any,
        status: 'pending',
      },
    })

    sendSupplyOrderConfirmation({
      customerName: d.customerName,
      customerEmail: d.customerEmail,
      customerPhone: d.customerPhone,
      destination: d.destination,
      preferredDate: new Date(d.preferredDate),
      items: d.items,
    }).catch(console.error)

    revalidatePath('/admin/supply-orders')

    return { success: true }
  } catch (error) {
    console.error('[Supply] Submit error:', error)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}

export async function getSupplyOrders(status?: string) {
  await requireAdmin()
  return prisma.supplyOrder.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: 'desc' },
  })
}

export async function updateSupplyStatus(id: string, status: string) {
  await requireAdmin()
  return prisma.supplyOrder.update({ where: { id }, data: { status } })
}
