import type { Metadata } from 'next'
import VendorRegistrationForm from '@/components/forms/VendorRegistrationForm'

export const metadata: Metadata = {
  title: 'Become a Vendor',
  description: 'Join the FRAOGO vendor network. Register your business and connect with customers across Nigeria.',
}

export default function RegisterVendorPage() {
  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>
      <div className="page-header">
        <div className="section-container pt-8">
          <p className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: '#93A9F5' }}>
            General Service → Rental
          </p>
          <h1 className="text-3xl lg:text-4xl font-black mb-3">Become a Vendor</h1>
          <p className="text-white/70 max-w-xl">
            Join our growing network of verified service providers. Once approved, you&apos;ll get access to your own portfolio dashboard.
          </p>
        </div>
      </div>
      <div className="section-container py-12">
        <div className="max-w-3xl mx-auto">
          <VendorRegistrationForm />
        </div>
      </div>
    </div>
  )
}

