'use server'

import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import {
  sendVendorRequestNotification,
  sendVendorRequestCustomerAck,
} from '@/lib/email'
import { revalidatePath } from 'next/cache'

const vendorRequestSchema = z.object({
  vendorId: z.string().min(1),
  customerName: z.string().min(2, 'Full name is required'),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().min(7, 'Phone number is required'),
  eventDate: z.string().optional(),
  description: z.string().min(10, 'Please describe what you need'),
  budget: z.string().optional(),
})

export type VendorRequestFormData = z.infer<typeof vendorRequestSchema>

export async function submitVendorRequest(data: VendorRequestFormData) {
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

    if (vendor.email) {
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
    }

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

export async function getVendorRequests() {
  await requireAdmin()
  return prisma.vendorRequest.findMany({
    include: { vendor: true },
    orderBy: { createdAt: 'desc' },
  })
}
