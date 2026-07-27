import type { Metadata } from 'next'
import ProcurementForm from '@/components/forms/ProcurementForm'

export const metadata: Metadata = {
  title: 'International Procurement Order',
  description: 'Import products from global markets. Fraogo handles overseas supplier sourcing, customs clearance, and freight delivery to Nigeria.',
  alternates: {
    canonical: '/procurement/international',
  },
  openGraph: {
    title: 'International Product Sourcing | Fraogo',
    description: 'Import products from global markets. Fraogo handles overseas supplier sourcing, customs clearance, and freight delivery to Nigeria.',
    url: 'https://fraogo.com/procurement/international',
  },
}

export default function InternationalProcurementPage() {
  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>
      {/* Header */}
      <div className="page-header">
        <div className="section-container pt-8">
          <p className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: '#93A9F5' }}>
            Global Sourcing &amp; Imports
          </p>
          <h1 className="text-3xl lg:text-4xl font-black mb-3">International Sourcing Order</h1>
          <p className="text-white/70 max-w-xl">
            Importing products or machinery from abroad? Fraogo sources directly from overseas suppliers, manages customs clearance, and handles freight delivery to Nigeria.
          </p>
        </div>
      </div>

      <div className="section-container py-12">
        <div className="max-w-3xl mx-auto">
          {/* 3 Step Guidance */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-xs">
              <span className="font-bold text-[#0E2A82] block mb-1">Step 1</span>
              Submit your import specs &amp; product links.
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-xs">
              <span className="font-bold text-[#0E2A82] block mb-1">Step 2</span>
              We confirm overseas supplier &amp; landed quote.
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-xs">
              <span className="font-bold text-[#0E2A82] block mb-1">Step 3</span>
              Customs cleared &amp; delivered to your door.
            </div>
          </div>

          <ProcurementForm type="international" />
        </div>
      </div>
    </div>
  )
}


