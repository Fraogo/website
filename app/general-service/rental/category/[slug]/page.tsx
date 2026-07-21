import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getActiveVendors } from '@/app/actions/vendor'
import { seedSolarVendors } from '@/app/actions/seedSolar'
import VendorCard from '@/components/vendor/VendorCard'
import { getCategoryFromSlug, KNOWN_CATEGORIES } from '@/lib/categories'
import { ChevronRight, ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const cat = getCategoryFromSlug(slug)
  return {
    title: `${cat.name} Vendors & Marketplace`,
    description: cat.description,
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params
  const cat = getCategoryFromSlug(slug)
  
  if (slug === 'solar-products') {
    await seedSolarVendors()
  }
  
  const allVendors = await getActiveVendors()

  // Filter vendors matching this category name or slug pattern
  const vendors = allVendors.filter((v: any) => {
    const rawType = v.businessType ? v.businessType.split(':')[0].trim() : ''
    if (rawType.toLowerCase() === cat.name.toLowerCase()) return true
    if (slug === 'solar-products' && (rawType.toLowerCase().includes('solar') || rawType.toLowerCase().includes('energy'))) return true
    return false
  })

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero / Header Header */}
      <div className="page-header relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #070F2B 0%, #0E2A82 100%)' }}>
        <div className="section-container pt-8 pb-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-white/70 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/general-service/rental/hire-vendor" className="hover:text-white transition-colors">Vendors Marketplace</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white font-bold">{cat.name}</span>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{cat.icon}</span>
            <h1 className="text-3xl lg:text-5xl font-black text-white">{cat.name}</h1>
          </div>
          <p className="text-white/80 text-base max-w-2xl mt-2">
            {cat.description}
          </p>
        </div>
      </div>

      <div className="section-container py-10">
        {/* Navigation back and Category Quick Links */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <Link
            href="/general-service/rental/hire-vendor"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0E2A82] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> All Categories
          </Link>

          <div className="flex flex-wrap gap-2">
            {KNOWN_CATEGORIES.map((c) => {
              const isActive = c.slug === slug
              return (
                <Link
                  key={c.slug}
                  href={`/general-service/rental/category/${c.slug}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#0E2A82] text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-[#0E2A82]'
                  }`}
                >
                  {c.icon} {c.name}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Vendors Grid */}
        {vendors.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm max-w-xl mx-auto">
            <div className="text-5xl mb-4">{cat.icon}</div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">No verified vendors in {cat.name} yet</h2>
            <p className="text-slate-600 text-sm mb-6">
              Are you a provider of {cat.name.toLowerCase()}? Register as a vendor on FRAOGO to get listed here.
            </p>
            <Link
              href="/general-service/rental/register-vendor"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#1B4AD4] text-white font-semibold text-sm hover:bg-[#0E2A82] transition-colors"
            >
              Become a Vendor
            </Link>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-slate-600 font-medium">
                Showing <span className="font-bold text-slate-900">{vendors.length}</span> verified vendor{vendors.length !== 1 ? 's' : ''} in {cat.name}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendors.map((vendor: any) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
