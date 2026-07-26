import type { Metadata } from 'next'
import { getActiveVendors } from '@/app/actions/vendor'
import VendorCard from '@/components/vendor/VendorCard'
import { KNOWN_CATEGORIES } from '@/lib/categories'

export const metadata: Metadata = {
  title: 'Verified Marketplace — Shop Products & Hire Sellers',
  description: 'Browse and hire verified sellers for products, solar equipment, gadgets, and events through FRAOGO with 100% payment protection.',
}
export const dynamic = 'force-dynamic'

export default async function HireVendorPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; listing?: string }>
}) {
  const { type, listing } = await searchParams
  const vendors = await getActiveVendors()

  const filteredByCategory = type && type !== 'All'
    ? vendors.filter((v) => v.businessType.startsWith(type))
    : vendors

  const filtered = listing && listing !== 'all'
    ? filteredByCategory.filter((v) => v.listingType === listing)
    : filteredByCategory

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>
      <div className="page-header">
        <div className="section-container pt-8">
          <h1 className="text-3xl lg:text-4xl font-black mb-3">Shop &amp; Hire</h1>
          <p className="text-white/70 max-w-xl">
            Browse verified products and services. Open any profile to see photos, then send a request to hire or buy securely through FRAOGO.
          </p>
        </div>
      </div>

      <div className="section-container py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Category Filter tabs */}
          <div className="flex flex-wrap gap-2">
            <a
              href={`/general-service/rental/hire-vendor${listing ? `?listing=${listing}` : ''}`}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                !type || type === 'All'
                  ? 'text-white shadow-soft'
                  : 'bg-white border border-border text-muted-foreground hover:border-[#0E2A82] hover:text-[#0E2A82]'
              }`}
              style={!type || type === 'All' ? { background: '#0E2A82' } : {}}
            >
              All Categories
            </a>
            {KNOWN_CATEGORIES.map((c) => {
              const isSelected = type === c.name || type === c.slug
              return (
                <a
                  key={c.slug}
                  href={`/general-service/rental/category/${c.slug}${listing ? `?listing=${listing}` : ''}`}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'text-white shadow-soft'
                      : 'bg-white border border-border text-muted-foreground hover:border-[#0E2A82] hover:text-[#0E2A82]'
                  }`}
                  style={isSelected ? { background: '#0E2A82' } : {}}
                >
                  <span>{c.icon}</span> {c.name}
                </a>
              )
            })}
          </div>

          {/* Listing Type Filter (Products vs Services) */}
          <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm shrink-0">
            <a href={`?${new URLSearchParams({ ...(type ? { type } : {}), listing: 'all' }).toString()}`}
               className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${!listing || listing === 'all' ? 'bg-[#0E2A82] text-white' : 'text-gray-500 hover:text-gray-900'}`}>
              All
            </a>
            <a href={`?${new URLSearchParams({ ...(type ? { type } : {}), listing: 'product' }).toString()}`}
               className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${listing === 'product' ? 'bg-[#0E2A82] text-white' : 'text-gray-500 hover:text-gray-900'}`}>
              Products
            </a>
            <a href={`?${new URLSearchParams({ ...(type ? { type } : {}), listing: 'service' }).toString()}`}
               className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${listing === 'service' ? 'bg-[#0E2A82] text-white' : 'text-gray-500 hover:text-gray-900'}`}>
              Services
            </a>
          </div>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-xl font-bold text-foreground mb-2">No vendors found</h2>
            <p className="text-muted-foreground text-sm">
              {type ? `No active ${type} vendors at the moment. Try a different category.` : 'No active vendors at the moment. Check back soon!'}
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              Showing {filtered.length} vendor{filtered.length !== 1 ? 's' : ''}
              {type && type !== 'All' ? ` in "${type}"` : ''}
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

