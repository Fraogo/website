import type { Metadata } from 'next'
import SupplyOrderForm from '@/components/forms/SupplyOrderForm'

export const metadata: Metadata = {
  title: 'Supply Orders',
  description: 'Order event supplies, bottled water, soft drinks, and more through FRAOGO.',
}

export default function SupplyPage() {
  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>
      <div className="page-header">
        <div className="section-container pt-8">
          <p className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: '#93A9F5' }}>
            General Service
          </p>
          <h1 className="text-3xl lg:text-4xl font-black mb-3">Supply Orders</h1>
          <p className="text-white/70 max-w-xl">
            Order event supplies, bottled water, soft drinks, fruit wine, and more. We deliver to your destination.
          </p>
        </div>
      </div>
      <div className="section-container py-12">
        <div className="max-w-3xl mx-auto">
          <SupplyOrderForm />
        </div>
      </div>
    </div>
  )
}


