import type { Metadata } from 'next'
import { getActiveVendors } from '@/app/actions/vendor'
import VendorCard from '@/components/vendor/VendorCard'
import { KNOWN_CATEGORIES } from '@/lib/categories'

export const metadata: Metadata = {
  title: 'Hire a Vendor',
  description: 'Browse and hire verified vendors for your events through FRAOGO.',
}
export const dynamic = 'force-dynamic'

export default async function HireVendorPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const { type } = await searchParams
  const vendors = await getActiveVendors()

  const filtered = type && type !== 'All'
    ? vendors.filter((v) => v.businessType.startsWith(type))
    : vendors

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>
      <div className="page-header">
        <div className="section-container pt-8">
          <h1 className="text-3xl lg:text-4xl font-black mb-3">Vendors &amp; Sellers</h1>
          <p className="text-white/70 max-w-xl">
            Browse verified vendors and sellers. Open any profile to see their photos, then send a request to hire them or buy through FRAOGO.
          </p>
        </div>
      </div>

      <div className="section-container py-12">
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <a
            href="/general-service/rental/hire-vendor"
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
                href={`/general-service/rental/category/${c.slug}`}
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

