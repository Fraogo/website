import type { Metadata } from 'next'
import ProcurementForm from '@/components/forms/ProcurementForm'

export const metadata: Metadata = {
  title: 'Nigeria Procurement Order',
  description: 'Place a procurement order for items within Nigeria. Fraogo handles verified supplier sourcing, inspection, and local delivery.',
  alternates: {
    canonical: '/procurement/nigeria',
  },
  openGraph: {
    title: 'Nigeria Product Procurement | Fraogo',
    description: 'Place a procurement order for items within Nigeria. Fraogo handles verified supplier sourcing, inspection, and local delivery.',
    url: 'https://fraogo.com/procurement/nigeria',
  },
}

export default function NigeriaProcurementPage() {
  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>
      {/* Header */}
      <div className="page-header">
        <div className="section-container pt-8">
          <p className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: '#93A9F5' }}>
            Local Product Sourcing
          </p>
          <h1 className="text-3xl lg:text-4xl font-black mb-3">Nigeria Product Procurement</h1>
          <p className="text-white/70 max-w-xl">
            Need products, materials, or equipment sourced within Nigeria? Fill in your request below and Fraogo will find verified suppliers and handle delivery.
          </p>
        </div>
      </div>

      <div className="section-container py-12">
        <div className="max-w-3xl mx-auto">
          {/* 3 Step Guidance */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-xs">
              <span className="font-bold text-[#0E2A82] block mb-1">Step 1</span>
              Describe the items &amp; quantity you need.
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-xs">
              <span className="font-bold text-[#0E2A82] block mb-1">Step 2</span>
              We verify pricing &amp; send a clear quote.
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-xs">
              <span className="font-bold text-[#0E2A82] block mb-1">Step 3</span>
              We inspect, purchase &amp; deliver to you.
            </div>
          </div>

          <ProcurementForm type="nigeria" />
        </div>
      </div>
    </div>
  )
}


