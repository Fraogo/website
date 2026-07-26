import type { Metadata } from 'next'
import DeliveryForm from '@/components/forms/DeliveryForm'

export const metadata: Metadata = {
  title: 'Delivery Services',
  description: 'Book local or international delivery with FRAOGO. Fast, reliable, and tracked.',
}

export default function DeliveryPage() {
  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>
      <div className="page-header">
        <div className="section-container pt-8">
          <p className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: '#93A9F5' }}>
            Freight &amp; Cargo Shipping
          </p>
          <h1 className="text-3xl lg:text-4xl font-black mb-3">Freight &amp; Delivery Shipping</h1>
          <p className="text-white/70 max-w-xl">
            Send packages or commercial cargo locally within Nigeria or internationally. Fast, tracked shipping with zero hassle.
          </p>
        </div>
      </div>
      <div className="section-container py-12">
        <div className="max-w-3xl mx-auto">
          {/* 3 Step Guidance */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-xs">
              <span className="font-bold text-[#0E2A82] block mb-1">Step 1</span>
              Enter pickup &amp; destination details.
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-xs">
              <span className="font-bold text-[#0E2A82] block mb-1">Step 2</span>
              We calculate weight &amp; confirm route quote.
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-xs">
              <span className="font-bold text-[#0E2A82] block mb-1">Step 3</span>
              Cargo picked up &amp; real-time tracked.
            </div>
          </div>

          <DeliveryForm />
        </div>
      </div>
    </div>
  )
}


