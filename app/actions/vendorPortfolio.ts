'use server'

import { prisma } from '@/lib/db'
import { deletePortfolioImage, VENDOR_PORTFOLIO_BUCKET } from '@/lib/storage'
import { revalidatePath } from 'next/cache'

export async function validateMagicLink(token: string) {
  const magicLink = await prisma.vendorMagicLink.findUnique({
    where: { token },
    include: { vendor: { include: { portfolioImages: { orderBy: { createdAt: 'desc' } } } } },
  })

  if (!magicLink) return { valid: false, error: 'Invalid link' }
  if (magicLink.expiresAt < new Date()) return { valid: false, error: 'This link has expired. Please contact FRAOGO for a new one.' }
  if (magicLink.vendor.status !== 'active') return { valid: false, error: 'Your vendor account is not active.' }

  return { valid: true, vendor: magicLink.vendor }
}

/** Resolve the vendor a magic-link token belongs to, or null if invalid/expired/inactive. */
async function vendorIdFromToken(token: string): Promise<string | null> {
  if (!token) return null
  const magicLink = await prisma.vendorMagicLink.findUnique({
    where: { token },
    include: { vendor: { select: { id: true, status: true } } },
  })
  if (!magicLink || magicLink.expiresAt < new Date() || magicLink.vendor.status !== 'active') {
    return null
  }
  return magicLink.vendor.id
}

export async function addVendorImage(token: string, url: string, fileName?: string) {
  // Authorize via magic-link token — vendorId is derived, never trusted from input
  const vendorId = await vendorIdFromToken(token)
  if (!vendorId) return { success: false, error: 'Unauthorized' }

  // Only accept URLs from our own public storage (blocks arbitrary/hotlinked URLs)
  const allowedPrefix = process.env.SUPABASE_URL
    ? `${process.env.SUPABASE_URL}/storage/v1/object/public/${VENDOR_PORTFOLIO_BUCKET}/`
    : null
  if (!allowedPrefix || !url.startsWith(allowedPrefix)) {
    return { success: false, error: 'Invalid image URL' }
  }

  const count = await prisma.vendorImage.count({ where: { vendorId } })
  if (count >= 50) {
    return { success: false, error: 'Maximum 50 images allowed per vendor' }
  }

  try {
    const image = await prisma.vendorImage.create({
      data: { vendorId, url, fileName: fileName ?? null },
    })
    revalidatePath('/vendor/dashboard')
    return { success: true, image }
  } catch (error) {
    console.error('[VendorPortfolio] Add image error:', error)
    return { success: false, error: 'Failed to save image' }
  }
}

export async function deleteVendorImageAction(token: string, imageId: string) {
  const vendorId = await vendorIdFromToken(token)
  if (!vendorId) return { success: false, error: 'Unauthorized' }

  try {
    // Ownership check — the image must belong to this token's vendor
    const image = await prisma.vendorImage.findFirst({ where: { id: imageId, vendorId } })
    if (!image) return { success: false, error: 'Image not found' }

    // Derive the storage path from the owned record — never trust a caller-supplied path
    const marker = `/${VENDOR_PORTFOLIO_BUCKET}/`
    const idx = image.url.indexOf(marker)
    if (idx !== -1) {
      const storagePath = image.url.slice(idx + marker.length)
      await deletePortfolioImage(storagePath).catch((e) => console.error('[VendorPortfolio] Storage delete:', e))
    }

    await prisma.vendorImage.delete({ where: { id: imageId } })

    revalidatePath('/vendor/dashboard')
    return { success: true }
  } catch (error) {
    console.error('[VendorPortfolio] Delete error:', error)
    return { success: false, error: 'Failed to delete image' }
  }
}
