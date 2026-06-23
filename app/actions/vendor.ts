'use server'

import { z } from 'zod'
import { randomBytes } from 'crypto'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import {
  sendVendorRegistrationConfirmation,
  sendVendorAdminNotification,
  sendVendorApprovalWithMagicLink,
  sendVendorRejectionEmail,
} from '@/lib/email'
import { paginationParams, totalPages } from '@/lib/pagination'
import { revalidatePath } from 'next/cache'

const vendorSchema = z.object({
  businessName: z.string().min(2, 'Business name is required').max(200),
  email: z.string().email('Invalid email address').max(200),
  description: z.string().min(20, 'Please provide a detailed description of your service').max(3000),
  location: z.string().min(3, 'Location is required').max(300),
  phone: z.string().min(7, 'Phone number is required').max(40),
  businessType: z.string().min(1, 'Business type is required').max(120),
  businessTypeOther: z.string().max(120).optional(),
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
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    // Cryptographically random token (256-bit) — not guessable, unlike cuid().
    const token = randomBytes(32).toString('hex')

    const magicLink = await prisma.vendorMagicLink.create({
      data: {
        vendorId,
        token,
        expiresAt,
      },
    })

    const magicLinkUrl = `${process.env.NEXTAUTH_URL}/vendor/dashboard?token=${magicLink.token}`
    const profileUrl = `${process.env.NEXTAUTH_URL}/vendor/${vendorId}`

    sendVendorApprovalWithMagicLink({
      businessName: vendor.businessName,
      email: vendor.email,
      magicLinkUrl,
      profileUrl,
    }).catch(console.error)

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
    const vendor = await prisma.vendor.update({ where: { id: vendorId }, data: { status: 'rejected' } })
    sendVendorRejectionEmail({ businessName: vendor.businessName, email: vendor.email }).catch(console.error)
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

export async function getVendors(status?: string, page?: number) {
  await requireAdmin()

  // Housekeeping: rejected vendors are purged 14 days after rejection.
  const cutoff = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
  await prisma.vendor
    .deleteMany({ where: { status: 'rejected', updatedAt: { lt: cutoff } } })
    .catch((e) => console.error('[Vendor] rejected-cleanup error:', e))

  const where = status ? { status } : undefined
  const { skip, take, page: safePage } = paginationParams(page)
  const [vendors, total] = await Promise.all([
    prisma.vendor.findMany({
      where,
      include: { portfolioImages: true, _count: { select: { requests: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prisma.vendor.count({ where }),
  ])
  return { vendors, total, page: safePage, totalPages: totalPages(total) }
}

// Public — single vendor profile for the shareable /vendor/[id] page. Active
// vendors only, and ONLY public-safe fields (never email/phone/NIN).
export async function getPublicVendor(id: string) {
  return prisma.vendor.findFirst({
    where: { id, status: 'active' },
    select: {
      id: true,
      businessName: true,
      description: true,
      location: true,
      businessType: true,
      portfolioImages: {
        orderBy: { createdAt: 'desc' },
        select: { id: true, url: true },
      },
    },
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
