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
            Logistics
          </p>
          <h1 className="text-3xl lg:text-4xl font-black mb-3">Delivery Services</h1>
          <p className="text-white/70 max-w-xl">
            Send items locally within Nigeria or internationally. Safe, reliable delivery with full coordination.
          </p>
        </div>
      </div>
      <div className="section-container py-12">
        <div className="max-w-3xl mx-auto">
          <DeliveryForm />
        </div>
      </div>
    </div>
  )
}


