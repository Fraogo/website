'use server'

import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import {
  sendVendorRegistrationConfirmation,
  sendVendorAdminNotification,
  sendVendorApprovalWithMagicLink,
} from '@/lib/email'
import { revalidatePath } from 'next/cache'

const vendorSchema = z.object({
  businessName: z.string().min(2, 'Business name is required'),
  email: z.string().email('Invalid email address'),
  description: z.string().min(20, 'Please provide a detailed description of your service'),
  location: z.string().min(3, 'Location is required'),
  phone: z.string().min(7, 'Phone number is required'),
  businessType: z.string().min(1, 'Business type is required'),
  businessTypeOther: z.string().optional(),
  ninDocumentUrl: z.string().min(1, 'NIN document upload is required'),
  consentFee: z.literal(true, { message: 'You must agree to the 10% service fee' }),
  consentNoDirect: z.literal(true, { message: 'You must agree not to negotiate directly with customers' }),
}).refine(
  (data) => data.businessType !== 'Other' || (data.businessTypeOther && data.businessTypeOther.trim().length > 0),
  { message: 'Please specify your service type', path: ['businessTypeOther'] }
)

export type VendorFormData = z.infer<typeof vendorSchema>

export async function registerVendor(data: VendorFormData) {
  const parsed = vendorSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors }
  }

  const d = parsed.data
  const finalBusinessType = d.businessType === 'Other' ? `Other: ${d.businessTypeOther}` : d.businessType

  try {
    const vendor = await prisma.vendor.create({
      data: {
        businessName: d.businessName,
        email: d.email,
        description: d.description,
        location: d.location,
        phone: d.phone,
        businessType: finalBusinessType,
        ninDocumentUrl: d.ninDocumentUrl,
        status: 'pending_review',
      },
    })

    sendVendorRegistrationConfirmation({
      businessName: d.businessName,
      email: d.email,
      businessType: finalBusinessType,
      location: d.location,
    }).catch(console.error)

    sendVendorAdminNotification({
      businessName: d.businessName,
      email: d.email,
      phone: d.phone,
      businessType: finalBusinessType,
      location: d.location,
      ninDocumentUrl: d.ninDocumentUrl,
    }).catch(console.error)

    revalidatePath('/admin/vendors')

    return { success: true, vendorId: vendor.id }
  } catch (error) {
    console.error('[Vendor] Register error:', error)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}

export async function approveVendor(vendorId: string) {
  await requireAdmin()
  try {
    const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } })
    if (!vendor) return { success: false, error: 'Vendor not found' }

    // Update status
    await prisma.vendor.update({ where: { id: vendorId }, data: { status: 'active' } })

    // Create magic link (7 days expiry)
    if (vendor.email) {
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7)

      const magicLink = await prisma.vendorMagicLink.create({
        data: {
          vendorId,
          expiresAt,
        },
      })

      const magicLinkUrl = `${process.env.NEXTAUTH_URL}/vendor/dashboard?token=${magicLink.token}`

      sendVendorApprovalWithMagicLink({
        businessName: vendor.businessName,
        email: vendor.email,
        magicLinkUrl,
      }).catch(console.error)
    }

    revalidatePath('/admin/vendors')
    return { success: true }
  } catch (error) {
    console.error('[Vendor] Approve error:', error)
    return { success: false, error: 'Something went wrong.' }
  }
}

export async function rejectVendor(vendorId: string) {
  await requireAdmin()
  try {
    await prisma.vendor.update({ where: { id: vendorId }, data: { status: 'rejected' } })
    revalidatePath('/admin/vendors')
    return { success: true }
  } catch (error) {
    console.error('[Vendor] Reject error:', error)
    return { success: false, error: 'Something went wrong.' }
  }
}

export async function deleteVendor(id: string) {
  await requireAdmin()
  try {
    // Portfolio images, requests and magic links cascade on delete (see schema)
    await prisma.vendor.delete({ where: { id } })
    revalidatePath('/admin/vendors')
    return { success: true }
  } catch (error) {
    console.error('[Vendor] Delete error:', error)
    return { success: false, error: 'Failed to delete vendor.' }
  }
}

export async function getVendors(status?: string) {
  await requireAdmin()
  return prisma.vendor.findMany({
    where: status ? { status } : undefined,
    include: { portfolioImages: true, _count: { select: { requests: true } } },
    orderBy: { createdAt: 'desc' },
  })
}

// Public — used on the hire-vendor page. Selects ONLY public-safe fields so the
// browser payload never includes vendor email, phone, or NIN document path.
export async function getActiveVendors() {
  return prisma.vendor.findMany({
    where: { status: 'active' },
    select: {
      id: true,
      businessName: true,
      description: true,
      location: true,
      businessType: true,
      portfolioImages: {
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, url: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}
