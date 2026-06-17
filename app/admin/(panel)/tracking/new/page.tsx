'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createTrackingRecord } from '@/app/actions/tracking'
import { MapPin, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const SERVICE_OPTIONS = [
  { value: 'procurement',      label: 'Procurement Order' },
  { value: 'logistics-local',  label: 'Local Transport' },
  { value: 'logistics-abroad', label: 'International Shipment (Send Abroad)' },
  { value: 'supply',           label: 'Supply Order' },
  { value: 'vendor-service',   label: 'Vendor Service' },
]

export default function NewTrackingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const result = await createTrackingRecord({
        serviceType:   data.get('serviceType') as 'procurement' | 'logistics-local' | 'logistics-abroad' | 'supply' | 'vendor-service',
        customerName:  data.get('customerName') as string,
        customerEmail: (data.get('customerEmail') as string) || undefined,
        description:   data.get('description') as string,
        initialStatus: (data.get('initialStatus') as string) || 'Order Confirmed',
        initialNote:   (data.get('initialNote') as string) || undefined,
      })

      if (result.success && result.trackingNumber) {
        router.push('/admin/tracking')
      } else {
        setError(typeof result.error === 'string' ? result.error : 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Failed to create tracking record.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/tracking" className="text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#EEF2FF' }}>
          <MapPin className="w-5 h-5" style={{ color: '#1B4AD4' }} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900">New Tracking Record</h1>
          <p className="text-sm text-gray-400">A unique tracking number will be generated automatically</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Service Type */}
          <div>
            <label className="form-label">Service Type *</label>
            <select name="serviceType" required className="form-input">
              <option value="">Select service type</option>
              {SERVICE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Customer Name */}
          <div>
            <label className="form-label">Customer Name *</label>
            <input
              name="customerName"
              type="text"
              required
              placeholder="Full name of the customer"
              className="form-input"
            />
          </div>

          {/* Customer Email */}
          <div>
            <label className="form-label">Customer Email <span className="text-gray-400 font-normal">(optional)</span></label>
            <input
              name="customerEmail"
              type="email"
              placeholder="customer@email.com"
              className="form-input"
            />
          </div>

          {/* Description */}
          <div>
            <label className="form-label">Order Description *</label>
            <textarea
              name="description"
              required
              rows={3}
              placeholder="Brief description of what's being tracked (e.g. 10 cartons of tiles from Lagos to Abuja)"
              className="form-input resize-none"
            />
          </div>

          <hr className="border-gray-100" />

          {/* Initial Status */}
          <div>
            <label className="form-label">Initial Status</label>
            <input
              name="initialStatus"
              type="text"
              defaultValue="Order Confirmed"
              placeholder="Order Confirmed"
              className="form-input"
            />
            <p className="text-xs text-gray-400 mt-1">Common values: Order Confirmed, Processing, In Transit, Out for Delivery, Delivered</p>
          </div>

          {/* Initial Note */}
          <div>
            <label className="form-label">Initial Note <span className="text-gray-400 font-normal">(optional)</span></label>
            <input
              name="initialNote"
              type="text"
              placeholder="e.g. Order received and confirmed by our team"
              className="form-input"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-6 py-3 rounded-xl text-sm font-bold flex-1 disabled:opacity-60"
            >
              {loading ? 'Generating…' : 'Create Tracking Record'}
            </button>
            <Link
              href="/admin/tracking"
              className="btn-outline px-6 py-3 rounded-xl text-sm font-bold text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
