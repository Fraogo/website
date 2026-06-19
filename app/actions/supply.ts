'use server'

import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { sendSupplyOrderConfirmation } from '@/lib/email'
import { paginationParams, totalPages } from '@/lib/pagination'
import { revalidatePath } from 'next/cache'

const supplyItemSchema = z.object({
  name: z.string().min(1).max(300),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unit: z.enum(['Packs', 'Cartons']),
})

const supplySchema = z.object({
  customerName: z.string().min(2, 'Full name is required').max(200),
  customerEmail: z.string().email('Invalid email address').max(200),
  customerPhone: z.string().min(7, 'Phone number is required').max(40),
  destination: z.string().min(5, 'Delivery destination is required').max(500),
  preferredDate: z.string().refine((date) => {
    const d = new Date(date)
    const minDate = new Date()
    minDate.setDate(minDate.getDate() + 2)
    return d >= minDate
  }, { message: 'Preferred date must be at least 2 days from today' }),
  items: z.array(supplyItemSchema).min(1, 'Select at least one item').max(50),
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
        items: d.items as Prisma.InputJsonValue,
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

export async function getSupplyOrders(status?: string, page?: number) {
  await requireAdmin()
  const where = status ? { status } : undefined
  const { skip, take, page: safePage } = paginationParams(page)
  const [orders, total] = await Promise.all([
    prisma.supplyOrder.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take }),
    prisma.supplyOrder.count({ where }),
  ])
  return { orders, total, page: safePage, totalPages: totalPages(total) }
}

export async function updateSupplyStatus(id: string, status: string) {
  await requireAdmin()
  return prisma.supplyOrder.update({ where: { id }, data: { status } })
}

export async function deleteSupplyOrder(id: string) {
  await requireAdmin()
  try {
    await prisma.supplyOrder.delete({ where: { id } })
    revalidatePath('/admin/supply-orders')
    return { success: true }
  } catch (error) {
    console.error('[Supply] Delete error:', error)
    return { success: false, error: 'Failed to delete order.' }
  }
}
