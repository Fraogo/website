import type { Metadata } from 'next'
import ProcurementForm from '@/components/forms/ProcurementForm'

export const metadata: Metadata = {
  title: 'International Procurement Order',
  description: 'Import products from global markets. FRAOGO handles international sourcing and logistics.',
}

export default function InternationalProcurementPage() {
  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>
      {/* Header */}
      <div className="page-header">
        <div className="section-container pt-8">
          <p className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: '#93A9F5' }}>
            Procurement
          </p>
          <h1 className="text-3xl lg:text-4xl font-black mb-3">International Order</h1>
          <p className="text-white/70 max-w-xl">
            Looking to import from overseas? We connect you to global markets. Fill out the form and we&apos;ll handle the rest.
          </p>
        </div>
      </div>

      <div className="section-container py-12">
        <div className="max-w-3xl mx-auto">
          <ProcurementForm type="international" />
        </div>
      </div>
    </div>
  )
}


