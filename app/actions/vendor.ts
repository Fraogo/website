'use server'

import { z } from 'zod'
import { randomBytes } from 'crypto'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import type { Prisma } from '@prisma/client'
import { enforceSubmissionLimit, looksLikeBot } from '@/lib/submitGuard'
import {
  sendVendorRegistrationConfirmation,
  sendVendorAdminNotification,
  sendVendorApprovalWithMagicLink,
  sendVendorRejectionEmail,
} from '@/lib/email'
import { paginationParams, totalPages } from '@/lib/pagination'
import { revalidatePath } from 'next/cache'
import { after } from 'next/server'
import { deletePortfolioImage, uploadPortfolioImage } from '@/lib/storage'

type VendorVariant = {
  name: string
  price: string | null
  description: string | null
}

function parseVariants(value: Prisma.JsonValue | null | undefined): VendorVariant[] | null {
  if (!value || typeof value === 'string') return null
  if (!Array.isArray(value)) return null

  const parsed = value
    .map((item) => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) return null
      const variant = item as Record<string, unknown>
      const name = typeof variant.name === 'string' ? variant.name.trim() : ''
      if (!name) return null

      return {
        name,
        price: typeof variant.price === 'string' ? variant.price : null,
        description: typeof variant.description === 'string' ? variant.description : null,
      }
    })
    .filter((item): item is VendorVariant => item !== null)

  return parsed.length > 0 ? parsed : null
}

const vendorSchema = z.object({
  businessName: z.string().min(2, 'Business name is required').max(200),
  email: z.string().email('Invalid email address').max(200),
  description: z.string().min(20, 'Please provide a detailed description of your service').max(3000),
  location: z.string().min(3, 'Location is required').max(300),
  phone: z.string().min(7, 'Phone number is required').max(40),
  businessType: z.string().min(1, 'Business type is required').max(120),
  businessTypeOther: z.string().max(120).optional(),
  listingType: z.enum(['product', 'service']),
  price: z.string().max(100).optional().or(z.literal('')), 
  priceRange: z.string().max(100).optional().or(z.literal('')),
  consentFee: z.literal(true, { message: 'You must agree to the 10% service fee' }),
  consentNoDirect: z.literal(true, { message: 'You must agree not to negotiate directly with customers' }),
}).refine(
  (data) => data.businessType !== 'Other' || (data.businessTypeOther && data.businessTypeOther.trim().length > 0),
  { message: 'Please specify your service type', path: ['businessTypeOther'] }
)

export type VendorFormData = z.infer<typeof vendorSchema>

export async function registerVendor(data: VendorFormData) {
  const limitError = await enforceSubmissionLimit('vendor-register')
  if (limitError) return { success: false, error: limitError }
  if (looksLikeBot(data)) return { success: true }

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
        listingType: d.listingType,
        price: d.price?.trim() || null,
        priceRange: d.priceRange?.trim() || null,
        status: 'pending_review',
      },
    })

    after(() => {
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
    })

    revalidatePath('/admin/vendors')

    return { success: true, vendorId: vendor.id }
  } catch (error) {
    console.error('[Vendor] Register error:', error)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}

const adminCreateVendorSchema = z.object({
  businessName: z.string().min(2, 'Business or Product title is required').max(200),
  email: z.string().email('Invalid email address').max(200).optional().or(z.literal('')),
  phone: z.string().max(40).optional().or(z.literal('')),
  location: z.string().min(3, 'Location is required').max(300),
  businessType: z.string().min(1, 'Category is required').max(120),
  listingType: z.enum(['product', 'service']),
  price: z.string().max(100).optional().or(z.literal('')),
  priceRange: z.string().max(100).optional().or(z.literal('')),
  description: z.string().min(10, 'Description & pricing details are required').max(3000),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
  variants: z
    .array(
      z.object({
        name: z.string().min(1, 'Variant name is required').max(150),
        price: z.string().max(100).optional().or(z.literal('')),
        description: z.string().max(300).optional().or(z.literal('')),
      }),
    )
    .optional(),
})

export async function createAdminVendor(data: z.infer<typeof adminCreateVendorSchema>, imageFiles?: File[]) {
  await requireAdmin()
  const parsed = adminCreateVendorSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: 'Please check your inputs and try again.' }
  }

  const d = parsed.data
  try {
    const vendorData: Prisma.VendorCreateInput = {
      businessName: d.businessName,
      email: d.email && d.email.trim() !== '' ? d.email.trim() : 'contact@fraogo.com',
      phone: d.phone && d.phone.trim() !== '' ? d.phone.trim() : '+234 802 822 9002',
      location: d.location,
      businessType: d.businessType,
      listingType: d.listingType,
      price: d.price?.trim() || null,
      priceRange: d.priceRange?.trim() || null,
      description: d.description,
      status: 'active',
    }

    // variants will be persisted into the VendorVariant table after vendor creation

    const files = Array.from(imageFiles ?? [])
    if (files.length > 4) {
      return { success: false, error: 'You can upload up to 4 images.' }
    }

    for (const file of files) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        return { success: false, error: 'Only JPG, PNG, or WebP images are allowed.' }
      }
      if (file.size > 5 * 1024 * 1024) {
        return { success: false, error: 'Each image must be under 5MB.' }
      }
    }

    const vendor = await prisma.vendor.create({
      data: vendorData,
    })

    const uploadedPaths: string[] = []
    try {
      if (d.variants && d.variants.length > 0) {
        const createData = d.variants.map((v) => ({
          vendorId: vendor.id,
          name: v.name.trim(),
          price: v.price ? v.price.trim() : null,
          description: v.description ? v.description.trim() : null,
        }))
        await prisma.vendorVariant.createMany({ data: createData })
      }

      if (files.length > 0) {
        for (const [index, file] of files.entries()) {
          const imageUrl = await uploadPortfolioImage(file, vendor.id)
          const marker = `${vendor.id}/`
          const path = imageUrl.split(marker).pop()
          if (path) uploadedPaths.push(path)

          await prisma.vendorImage.create({
            data: {
              vendorId: vendor.id,
              url: imageUrl,
              fileName: file.name,
              order: index,
            },
          })
        }
      } else if (d.imageUrl && d.imageUrl.trim() !== '') {
        await prisma.vendor.update({
          where: { id: vendor.id },
          data: {
            portfolioImages: {
              create: [{ url: d.imageUrl.trim(), fileName: 'product-cover.jpg', order: 0 }],
            },
          },
        })
      }
    } catch (error) {
      for (const path of uploadedPaths) {
        await deletePortfolioImage(path).catch((e) => console.error('[Vendor] cleanup failed:', e))
      }
      await prisma.vendor.delete({ where: { id: vendor.id } }).catch(() => undefined)
      throw error
    }

    revalidatePath('/admin/vendors')
    revalidatePath('/general-service/rental/hire-vendor')

    return { success: true, vendorId: vendor.id }
  } catch (error) {
    console.error('[Vendor] Create Admin Vendor error:', error)
    return { success: false, error: 'Failed to create vendor listing. Please try again.' }
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

    after(() => {
      sendVendorApprovalWithMagicLink({
        businessName: vendor.businessName,
        email: vendor.email,
        magicLinkUrl,
        profileUrl,
      }).catch(console.error)
    })

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
    after(() => {
      sendVendorRejectionEmail({ businessName: vendor.businessName, email: vendor.email }).catch(console.error)
    })
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
  const vendor = await prisma.vendor.findFirst({
    where: { id, status: 'active' },
    select: {
      id: true,
      businessName: true,
      description: true,
      location: true,
      businessType: true,
      listingType: true,
      price: true,
      priceRange: true,
      variants: true,
      vendorVariants: { orderBy: { createdAt: 'asc' }, select: { name: true, price: true, description: true } },
      portfolioImages: {
        orderBy: { order: 'asc' },
        select: { id: true, url: true },
      },
    },
  })

  if (!vendor) return null

  type RawVariant = { name: string; price?: string | null; description?: string | null }

  // Map relational VendorVariant rows to the public `variants` shape.
  const relational = vendor.vendorVariants as RawVariant[]
  const mapped = relational.length > 0
    ? relational.map((v) => ({ name: v.name, price: v.price ?? null, description: v.description ?? null }))
    : parseVariants(vendor.variants)

  // Return public-safe shape: never expose email/phone/NIN
  return {
    id:              vendor.id,
    businessName:    vendor.businessName,
    description:     vendor.description,
    location:        vendor.location,
    businessType:    vendor.businessType,
    listingType:     vendor.listingType,
    price:           vendor.price,
    priceRange:      vendor.priceRange,
    portfolioImages: vendor.portfolioImages,
    variants:        mapped,
  }
}

// Public — used on the hire-vendor page. Selects ONLY public-safe fields so the
// browser payload never includes vendor email, phone, or NIN document path.
export async function getActiveVendors() {
  const vendors = await prisma.vendor.findMany({
    where: { status: 'active' },
    select: {
      id: true,
      businessName: true,
      description: true,
      location: true,
      businessType: true,
      listingType: true,
      price: true,
      priceRange: true,
      variants: true,
      vendorVariants: { orderBy: { createdAt: 'asc' }, select: { name: true, price: true, description: true } },
      portfolioImages: {
        take: 5,
        orderBy: { order: 'asc' },
        select: { id: true, url: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  type RawVariant = { name: string; price?: string | null; description?: string | null }

  return vendors.map((vendor) => {
    const relational = vendor.vendorVariants as RawVariant[]
    const mapped = relational.length > 0
      ? relational.map((v) => ({ name: v.name, price: v.price ?? null, description: v.description ?? null }))
      : parseVariants(vendor.variants)

    return {
      id:              vendor.id,
      businessName:    vendor.businessName,
      description:     vendor.description,
      location:        vendor.location,
      businessType:    vendor.businessType,
      listingType:     vendor.listingType as 'product' | 'service',
      price:           vendor.price,
      priceRange:      vendor.priceRange,
      portfolioImages: vendor.portfolioImages,
      variants:        mapped,
    }
  })
}
