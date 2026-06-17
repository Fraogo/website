'use server'

import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { sendProcurementConfirmation } from '@/lib/email'
import { revalidatePath } from 'next/cache'

const itemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  specification: z.string().min(1, 'Specification is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  deliveryMode: z.enum(['pickup', 'dispatch']),
  deliveryAddress: z.string().optional(),
}).refine(
  (data) => data.deliveryMode !== 'dispatch' || (data.deliveryAddress && data.deliveryAddress.trim().length > 0),
  { message: 'Delivery address is required for dispatch orders', path: ['deliveryAddress'] }
)

const procurementSchema = z.object({
  type: z.enum(['nigeria', 'international']),
  customerName: z.string().min(2, 'Full name is required'),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().min(7, 'Phone number is required'),
  items: z.array(itemSchema).min(1, 'At least one item is required').max(20, 'Maximum 20 items'),
})

export type ProcurementFormData = z.infer<typeof procurementSchema>

export async function submitProcurementOrder(data: ProcurementFormData) {
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
        items: items as any,
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

export async function getProcurementOrders(status?: string) {
  await requireAdmin()
  return prisma.procurementOrder.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: 'desc' },
  })
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
