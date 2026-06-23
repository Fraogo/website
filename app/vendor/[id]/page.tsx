import { getPublicVendor } from '@/app/actions/vendor'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import VendorProfile from './VendorProfile'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const vendor = await getPublicVendor(id)
  if (!vendor) return { title: 'Vendor Not Found — FRAOGO' }
  return {
    title: `${vendor.businessName} — FRAOGO Vendor`,
    description: vendor.description.slice(0, 155),
  }
}

export default async function VendorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const vendor = await getPublicVendor(id)
  if (!vendor) notFound()
  return <VendorProfile vendor={vendor} />
}
