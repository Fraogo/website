import type { Metadata } from 'next'
import ProcurementForm from '@/components/forms/ProcurementForm'

export const metadata: Metadata = {
  title: 'Nigeria Procurement Order',
  description: 'Place a procurement order for items within Nigeria. FRAOGO handles the sourcing and delivery.',
}

export default function NigeriaProcurementPage() {
  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>
      {/* Header */}
      <div className="page-header">
        <div className="section-container pt-8">
          <p className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: '#93A9F5' }}>
            Procurement
          </p>
          <h1 className="text-3xl lg:text-4xl font-black mb-3">Nigeria Order</h1>
          <p className="text-white/70 max-w-xl">
            Need something sourced within Nigeria? Fill in the form below and our team will get back to you within 24–48 hours.
          </p>
        </div>
      </div>

      <div className="section-container py-12">
        <div className="max-w-3xl mx-auto">
          <ProcurementForm type="nigeria" />
        </div>
      </div>
    </div>
  )
}


