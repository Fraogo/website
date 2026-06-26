'use server'

import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { enforceSubmissionLimit, looksLikeBot } from '@/lib/submitGuard'
import {
  sendVendorRequestNotification,
  sendVendorRequestCustomerAck,
} from '@/lib/email'
import { paginationParams, totalPages } from '@/lib/pagination'
import { revalidatePath } from 'next/cache'

const vendorRequestSchema = z.object({
  vendorId: z.string().min(1).max(60),
  customerName: z.string().min(2, 'Full name is required').max(200),
  customerEmail: z.string().email('Invalid email address').max(200),
  customerPhone: z.string().min(7, 'Phone number is required').max(40),
  eventDate: z.string().max(40).optional(),
  description: z.string().min(10, 'Please describe what you need').max(3000),
  budget: z.string().max(120).optional(),
})

export type VendorRequestFormData = z.infer<typeof vendorRequestSchema>

export async function submitVendorRequest(data: VendorRequestFormData) {
  const limitError = await enforceSubmissionLimit('vendor-request')
  if (limitError) return { success: false, error: limitError }
  if (looksLikeBot(data)) return { success: true }

  const parsed = vendorRequestSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors }
  }

  const d = parsed.data

  try {
    const vendor = await prisma.vendor.findUnique({ where: { id: d.vendorId } })
    if (!vendor || vendor.status !== 'active') {
      return { success: false, error: 'Vendor not found or unavailable' }
    }

    await prisma.vendorRequest.create({
      data: {
        vendorId: d.vendorId,
        customerName: d.customerName,
        customerEmail: d.customerEmail,
        customerPhone: d.customerPhone,
        eventDate: d.eventDate ? new Date(d.eventDate) : null,
        description: d.description,
        budget: d.budget || null,
        status: 'pending',
      },
    })

    sendVendorRequestNotification({
      vendorEmail: vendor.email,
      vendorBusinessName: vendor.businessName,
      customerName: d.customerName,
      customerEmail: d.customerEmail,
      customerPhone: d.customerPhone,
      eventDate: d.eventDate ? new Date(d.eventDate) : undefined,
      description: d.description,
      budget: d.budget,
    }).catch(console.error)

    sendVendorRequestCustomerAck({
      customerName: d.customerName,
      customerEmail: d.customerEmail,
      vendorBusinessName: vendor.businessName,
    }).catch(console.error)

    revalidatePath('/admin/vendor-requests')

    return { success: true }
  } catch (error) {
    console.error('[VendorRequest] Submit error:', error)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}

export async function getVendorRequests(page?: number) {
  await requireAdmin()
  const { skip, take, page: safePage } = paginationParams(page)
  const [requests, total] = await Promise.all([
    prisma.vendorRequest.findMany({
      include: { vendor: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prisma.vendorRequest.count(),
  ])
  return { requests, total, page: safePage, totalPages: totalPages(total) }
}

export async function deleteVendorRequest(id: string) {
  await requireAdmin()
  try {
    await prisma.vendorRequest.delete({ where: { id } })
    revalidatePath('/admin/vendor-requests')
    return { success: true }
  } catch (error) {
    console.error('[VendorRequest] Delete error:', error)
    return { success: false, error: 'Failed to delete request.' }
  }
}
