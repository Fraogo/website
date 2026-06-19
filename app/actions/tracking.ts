'use server'

import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

function generateTrackingNumber(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return `FRG-${code}`
}

const createSchema = z.object({
  serviceType:   z.enum(['procurement', 'logistics-local', 'logistics-abroad', 'supply', 'vendor-service']),
  customerName:  z.string().min(2).max(200),
  customerEmail: z.string().email().max(200).optional().or(z.literal('')),
  description:   z.string().min(3).max(2000),
  initialStatus: z.string().max(120).default('Order Confirmed'),
  initialNote:   z.string().max(1000).optional(),
})

const updateSchema = z.object({
  trackingId: z.string().max(60),
  status:     z.string().min(2).max(120),
  note:       z.string().max(1000).optional(),
  location:   z.string().max(300).optional(),
})

export type CreateTrackingData = z.infer<typeof createSchema>
export type TrackingUpdateData = z.infer<typeof updateSchema>

export async function createTrackingRecord(data: CreateTrackingData) {
  await requireAdmin()
  const parsed = createSchema.safeParse(data)
  if (!parsed.success) return { success: false, error: parsed.error.flatten().fieldErrors }

  const d = parsed.data
  const trackingNumber = generateTrackingNumber()

  try {
    const record = await prisma.trackingRecord.create({
      data: {
        trackingNumber,
        serviceType:   d.serviceType,
        customerName:  d.customerName,
        customerEmail: d.customerEmail || null,
        description:   d.description,
        currentStatus: d.initialStatus,
        updates: {
          create: {
            status: d.initialStatus,
            note:   d.initialNote ?? 'Your order has been received and confirmed.',
          },
        },
      },
    })

    revalidatePath('/admin/tracking')
    return { success: true, trackingNumber: record.trackingNumber, id: record.id }
  } catch (error) {
    console.error('[Tracking] Create error:', error)
    return { success: false, error: 'Failed to create tracking record.' }
  }
}

export async function addTrackingUpdate(data: TrackingUpdateData) {
  await requireAdmin()
  const parsed = updateSchema.safeParse(data)
  if (!parsed.success) return { success: false, error: parsed.error.flatten().fieldErrors }

  const d = parsed.data
  try {
    await prisma.$transaction([
      prisma.trackingUpdate.create({
        data: {
          trackingRecordId: d.trackingId,
          status:   d.status,
          note:     d.note || null,
          location: d.location || null,
        },
      }),
      prisma.trackingRecord.update({
        where: { id: d.trackingId },
        data:  { currentStatus: d.status, updatedAt: new Date() },
      }),
    ])

    revalidatePath('/admin/tracking')
    return { success: true }
  } catch (error) {
    console.error('[Tracking] Update error:', error)
    return { success: false, error: 'Failed to add update.' }
  }
}

// Public lookup — used on the customer-facing /track page. Selects ONLY
// non-sensitive fields. Customer name and email are never returned here, so
// knowing a tracking number does not expose who placed the order.
export async function lookupTracking(trackingNumber: string) {
  const normalized = trackingNumber.trim().toUpperCase()
  return prisma.trackingRecord.findUnique({
    where: { trackingNumber: normalized },
    select: {
      trackingNumber: true,
      serviceType:    true,
      description:    true,
      currentStatus:  true,
      updates: {
        orderBy: { createdAt: 'asc' },
        select: { id: true, status: true, note: true, location: true, createdAt: true },
      },
    },
  })
}

export async function getAllTrackingRecords() {
  await requireAdmin()
  return prisma.trackingRecord.findMany({
    include: { updates: { orderBy: { createdAt: 'desc' }, take: 1 } },
    orderBy: { createdAt: 'desc' },
  })
}

export async function deleteTrackingRecord(id: string) {
  await requireAdmin()
  try {
    await prisma.trackingRecord.delete({ where: { id } })
    revalidatePath('/admin/tracking')
    return { success: true }
  } catch (error) {
    console.error('[Tracking] Delete error:', error)
    return { success: false, error: 'Failed to delete record.' }
  }
}
