import type { Metadata } from 'next'
import RelocationForm from '@/components/forms/RelocationForm'

export const metadata: Metadata = {
  title: 'Relocation of Items',
  description: 'Move your belongings safely with FRAOGO. We coordinate labor and/or transport for your relocation.',
}

export default function RelocationPage() {
  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>
      <div className="page-header">
        <div className="section-container pt-8">
          <p className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: '#93A9F5' }}>
            Logistics
          </p>
          <h1 className="text-3xl lg:text-4xl font-black mb-3">Relocation of Items</h1>
          <p className="text-white/70 max-w-xl">
            Moving home or office? FRAOGO coordinates the labor and/or transport to move your belongings safely.
          </p>
        </div>
      </div>
      <div className="section-container py-12">
        <div className="max-w-3xl mx-auto">
          <RelocationForm />
        </div>
      </div>
    </div>
  )
}


