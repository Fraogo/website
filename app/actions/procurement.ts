'use server'

import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { enforceSubmissionLimit } from '@/lib/submitGuard'
import { sendProcurementConfirmation } from '@/lib/email'
import { paginationParams, totalPages } from '@/lib/pagination'
import { revalidatePath } from 'next/cache'

const itemSchema = z.object({
  name: z.string().min(1, 'Item name is required').max(300),
  specification: z.string().min(1, 'Specification is required').max(1000),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  deliveryMode: z.enum(['pickup', 'dispatch']),
  deliveryAddress: z.string().max(500).optional(),
}).refine(
  (data) => data.deliveryMode !== 'dispatch' || (data.deliveryAddress && data.deliveryAddress.trim().length > 0),
  { message: 'Delivery address is required for dispatch orders', path: ['deliveryAddress'] }
)

const procurementSchema = z.object({
  type: z.enum(['nigeria', 'international']),
  customerName: z.string().min(2, 'Full name is required').max(200),
  customerEmail: z.string().email('Invalid email address').max(200),
  customerPhone: z.string().min(7, 'Phone number is required').max(40),
  items: z.array(itemSchema).min(1, 'At least one item is required').max(20, 'Maximum 20 items'),
})

export type ProcurementFormData = z.infer<typeof procurementSchema>

export async function submitProcurementOrder(data: ProcurementFormData) {
  const limitError = await enforceSubmissionLimit('procurement')
  if (limitError) return { success: false, error: limitError }

  // Validate
  const parsed = procurementSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors }
  }

  const { type, customerName, customerEmail, customerPhone, items } = parsed.data

  try {
    // Save to database
    const order = await prisma.procurementOrder.create({
      data: {
        type,
        customerName,
        customerEmail,
        customerPhone,
        items: items as Prisma.InputJsonValue,
        status: 'pending',
      },
    })

    // Send emails (non-blocking)
    sendProcurementConfirmation({
      customerName,
      customerEmail,
      customerPhone,
      type,
      items,
    }).catch(console.error)

    revalidatePath('/admin/orders')

    return { success: true, orderId: order.id }
  } catch (error) {
    console.error('[Procurement] Submit error:', error)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}

export async function getProcurementOrders(status?: string, page?: number) {
  await requireAdmin()
  const where = status ? { status } : undefined
  const { skip, take, page: safePage } = paginationParams(page)
  const [orders, total] = await Promise.all([
    prisma.procurementOrder.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take }),
    prisma.procurementOrder.count({ where }),
  ])
  return { orders, total, page: safePage, totalPages: totalPages(total) }
}

export async function updateProcurementStatus(id: string, status: string) {
  await requireAdmin()
  return prisma.procurementOrder.update({
    where: { id },
    data: { status },
  })
}

export async function deleteProcurementOrder(id: string) {
  await requireAdmin()
  try {
    await prisma.procurementOrder.delete({ where: { id } })
    revalidatePath('/admin/orders')
    return { success: true }
  } catch (error) {
    console.error('[Procurement] Delete error:', error)
    return { success: false, error: 'Failed to delete order.' }
  }
}
