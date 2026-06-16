'use server'

import { z } from 'zod'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

function generateTrackingNumber(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return `FRG-${code}`
}

const createSchema = z.object({
  serviceType:   z.enum(['procurement', 'logistics-local', 'logistics-abroad', 'supply', 'vendor-service']),
  customerName:  z.string().min(2),
  customerEmail: z.string().email().optional().or(z.literal('')),
  description:   z.string().min(3),
  initialStatus: z.string().default('Order Confirmed'),
  initialNote:   z.string().optional(),
})

const updateSchema = z.object({
  trackingId: z.string(),
  status:     z.string().min(2),
  note:       z.string().optional(),
  location:   z.string().optional(),
})

export type CreateTrackingData = z.infer<typeof createSchema>
export type TrackingUpdateData = z.infer<typeof updateSchema>

export async function createTrackingRecord(data: CreateTrackingData) {
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

export async function lookupTracking(trackingNumber: string) {
  const normalized = trackingNumber.trim().toUpperCase()
  return prisma.trackingRecord.findUnique({
    where:   { trackingNumber: normalized },
    include: { updates: { orderBy: { createdAt: 'asc' } } },
  })
}

export async function getAllTrackingRecords() {
  return prisma.trackingRecord.findMany({
    include: { updates: { orderBy: { createdAt: 'desc' }, take: 1 } },
    orderBy: { createdAt: 'desc' },
  })
}
