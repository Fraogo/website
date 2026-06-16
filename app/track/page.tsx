import { MapPin, CheckCircle2, Clock, Package, Truck, AlertCircle } from 'lucide-react'
import { lookupTracking } from '@/app/actions/tracking'
import { formatDateTime } from '@/lib/utils'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Track Your Order',
  description: 'Enter your Fraogo tracking number to see the real-time status of your delivery or shipment.',
}

const SERVICE_LABELS: Record<string, string> = {
  'procurement':       'Procurement Order',
  'logistics-local':   'Local Transport',
  'logistics-abroad':  'International Shipment',
  'supply':            'Supply Order',
  'vendor-service':    'Service Request',
}

const STATUS_ICONS: Record<string, typeof CheckCircle2> = {
  'Order Confirmed': CheckCircle2,
  'In Transit':      Truck,
  'Out for Delivery': Package,
  'Delivered':       CheckCircle2,
}

interface Props { searchParams: Promise<{ ref?: string }> }

export default async function TrackPage({ searchParams }: Props) {
  const { ref } = await searchParams
  const trackingNumber = ref?.trim().toUpperCase()

  let record: Awaited<ReturnType<typeof lookupTracking>> = null
  let notFound = false

  if (trackingNumber) {
    record = await lookupTracking(trackingNumber)
    if (!record) notFound = true
  }

  const isDelivered = record?.currentStatus?.toLowerCase().includes('delivered')

  return (
    <div className="min-h-screen" style={{ background: '#F5F7FF' }}>

      {/* ── Header ── */}
      <div className="page-header">
        <div className="section-container pt-10">
          <p className="text-xs font-bold uppercase tracking-widest mb-3 text-blue-300">Real-Time Tracking</p>
          <h1 className="text-4xl lg:text-5xl font-black mb-4 leading-tight">
            Track Your Order
          </h1>
          <p className="text-white/65 max-w-xl text-base leading-relaxed">
            Enter the tracking number we sent you to see the current status of your delivery or shipment.
          </p>
        </div>
      </div>

      <div className="section-container py-12">
        <div className="max-w-2xl mx-auto">

          {/* ── Search Box ── */}
          <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6 mb-8">
            <form method="get" action="/track" className="flex flex-col sm:flex-row gap-3">
              <input
                name="ref"
                type="text"
                defaultValue={ref ?? ''}
                placeholder="Enter tracking number — e.g. FRG-AB2X7K9M"
                className="form-input flex-1"
                autoFocus={!ref}
              />
              <button type="submit" className="btn-primary px-6 py-3 rounded-xl text-sm whitespace-nowrap">
                Track Order
              </button>
            </form>
            <p className="text-xs text-gray-400 mt-3">
              Your tracking number was included in the confirmation email we sent after your order was confirmed.
            </p>
          </div>

          {/* ── Results ── */}
          {notFound && (
            <div className="bg-white rounded-2xl shadow-soft border border-red-100 p-8 text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
              <h2 className="text-xl font-black text-gray-900 mb-2">Tracking Number Not Found</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                We couldn&apos;t find a record for <strong>{trackingNumber}</strong>. Please check the number and try again.
                If the issue persists, contact us with your order details.
              </p>
              <Link href="/contact" className="btn-primary px-6 py-3 rounded-xl text-sm inline-flex items-center gap-2">
                Contact Support
              </Link>
            </div>
          )}

          {record && (
            <>
              {/* ── Summary Card ── */}
              <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6 mb-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Tracking Number</p>
                    <p className="text-2xl font-black text-gray-900 tracking-wider font-mono">{record.trackingNumber}</p>
                  </div>
                  <span
                    className={`status-badge text-sm px-4 py-1.5 ${isDelivered ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}
                  >
                    {record.currentStatus}
                  </span>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 pt-5 border-t border-gray-100 text-sm">
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-1">Service Type</p>
                    <p className="font-semibold text-gray-800">{SERVICE_LABELS[record.serviceType] ?? record.serviceType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-1">Customer</p>
                    <p className="font-semibold text-gray-800">{record.customerName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-1">Description</p>
                    <p className="font-semibold text-gray-800 line-clamp-2">{record.description}</p>
                  </div>
                </div>
              </div>

              {/* ── Timeline ── */}
              <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
                <h2 className="font-black text-gray-900 mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#1B4AD4]" />
                  Status Timeline
                </h2>

                {record.updates.length === 0 ? (
                  <p className="text-sm text-gray-400">No updates yet. Check back soon.</p>
                ) : (
                  <ol className="space-y-0">
                    {record.updates.slice().reverse().map((update, i) => {
                      const Icon = STATUS_ICONS[update.status] ?? CheckCircle2
                      const isLatest = i === 0
                      return (
                        <li key={update.id} className={`timeline-step pb-6 last:pb-0 ${isLatest ? 'done' : ''}`}>
                          {/* Icon */}
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border-2 z-10 ${
                              isLatest
                                ? 'bg-[#1B4AD4] border-[#1B4AD4] text-white'
                                : 'bg-white border-gray-200 text-gray-300'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>

                          {/* Content */}
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <p className={`text-sm font-black ${isLatest ? 'text-[#1B4AD4]' : 'text-gray-500'}`}>
                                {update.status}
                              </p>
                              {isLatest && (
                                <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Latest</span>
                              )}
                            </div>
                            {update.note && (
                              <p className="text-sm text-gray-500 mb-1 leading-relaxed">{update.note}</p>
                            )}
                            {update.location && (
                              <p className="text-xs text-gray-400 flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {update.location}
                              </p>
                            )}
                            <p className="text-xs text-gray-300 mt-1">{formatDateTime(update.createdAt)}</p>
                          </div>
                        </li>
                      )
                    })}
                  </ol>
                )}
              </div>

              {/* Help */}
              <p className="text-center text-sm text-gray-400 mt-6">
                Questions about your order?{' '}
                <Link href="/contact" className="text-[#1B4AD4] underline font-semibold">Contact us</Link>
              </p>
            </>
          )}

          {/* ── No search yet ── */}
          {!ref && (
            <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-10 text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: '#EEF2FF' }}>
                <MapPin className="w-8 h-8" style={{ color: '#1B4AD4' }} />
              </div>
              <h2 className="text-xl font-black text-gray-900 mb-2">Enter Your Tracking Number</h2>
              <p className="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto">
                Your tracking number was provided to you after your order was confirmed by our team.
                It looks like: <span className="font-mono font-bold text-[#1B4AD4]">FRG-AB2X7K9M</span>
              </p>
              <p className="text-sm text-gray-400 mt-6">
                Don&apos;t have one?{' '}
                <Link href="/contact" className="text-[#1B4AD4] underline font-semibold">Contact us</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
