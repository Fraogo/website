import type { Metadata } from 'next'
import { getActiveVendors } from '@/app/actions/vendor'
import VendorCard from '@/components/vendor/VendorCard'
import { Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Hire a Vendor',
  description: 'Browse and hire verified vendors for your events through FRAOGO.',
}
export const dynamic = 'force-dynamic'

const BUSINESS_TYPES = ['All', 'Event Space', 'Protocol Service', 'Catering & Small Chops', 'Make Up', 'Other']

export default async function HireVendorPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const { type } = await searchParams
  const vendors = await getActiveVendors()

  const filtered = type && type !== 'All'
    ? vendors.filter((v: any) => v.businessType.startsWith(type))
    : vendors

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>
      <div className="page-header">
        <div className="section-container pt-8">
          <p className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: '#93A9F5' }}>
            General Service → Rental
          </p>
          <h1 className="text-3xl lg:text-4xl font-black mb-3 flex items-center gap-3">
            <Users className="w-8 h-8" />
            Hire a Vendor
          </h1>
          <p className="text-white/70 max-w-xl">
            Browse our verified vendor catalogue. Click on any vendor to view their portfolio and send a request.
          </p>
        </div>
      </div>

      <div className="section-container py-12">
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {BUSINESS_TYPES.map((t) => (
            <a
              key={t}
              href={t === 'All' ? '/general-service/rental/hire-vendor' : `/general-service/rental/hire-vendor?type=${encodeURIComponent(t)}`}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                (t === 'All' && !type) || type === t
                  ? 'text-white shadow-soft'
                  : 'bg-white border border-border text-muted-foreground hover:border-[#0E2A82] hover:text-[#0E2A82]'
              }`}
              style={(t === 'All' && !type) || type === t ? { background: '#0E2A82' } : {}}
            >
              {t}
            </a>
          ))}
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
              {filtered.map((vendor: any) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

