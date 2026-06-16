import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { formatDateTime } from '@/lib/utils'
import { MapPin, ArrowLeft, Clock } from 'lucide-react'
import Link from 'next/link'
import TrackingUpdateForm from './TrackingUpdateForm'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const record = await prisma.trackingRecord.findUnique({ where: { id } })
  if (!record) return { title: 'Not Found' }
  return { title: `${record.trackingNumber} — Tracking Admin` }
}

const STATUS_COLORS: Record<string, string> = {
  'Order Confirmed': 'bg-blue-100 text-blue-700',
  'In Transit':      'bg-yellow-100 text-yellow-700',
  'Out for Delivery':'bg-orange-100 text-orange-700',
  'Delivered':       'bg-green-100 text-green-700',
}

export default async function TrackingDetailPage({ params }: Props) {
  const { id } = await params

  const record = await prisma.trackingRecord.findUnique({
    where: { id },
    include: {
      updates: { orderBy: { createdAt: 'desc' } },
    },
  })

  if (!record) notFound()

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/tracking" className="text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#EEF2FF' }}>
          <MapPin className="w-5 h-5" style={{ color: '#1B4AD4' }} />
        </div>
        <div>
          <h1 className="text-xl font-black text-gray-900 font-mono tracking-wider">{record.trackingNumber}</h1>
          <p className="text-sm text-gray-400">{record.customerName}</p>
        </div>
        <span className={`ml-auto status-badge text-xs px-2.5 py-1 ${STATUS_COLORS[record.currentStatus] ?? 'bg-gray-100 text-gray-600'}`}>
          {record.currentStatus}
        </span>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5 mb-5 text-sm grid sm:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-0.5">Customer</p>
          <p className="font-semibold text-gray-800">{record.customerName}</p>
          {record.customerEmail && <p className="text-gray-400">{record.customerEmail}</p>}
        </div>
        <div>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-0.5">Description</p>
          <p className="font-semibold text-gray-800">{record.description}</p>
        </div>
      </div>

      {/* Add Update Form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6 mb-6">
        <h2 className="font-black text-gray-900 mb-5 text-base">Add Status Update</h2>
        <TrackingUpdateForm recordId={record.id} trackingNumber={record.trackingNumber} />
      </div>

      {/* History */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
        <h2 className="font-black text-gray-900 mb-5 text-base flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#1B4AD4]" /> Update History
        </h2>
        {record.updates.length === 0 ? (
          <p className="text-sm text-gray-400">No updates yet.</p>
        ) : (
          <ol className="space-y-4">
            {record.updates.map((update, i) => (
              <li key={update.id} className="flex gap-3">
                <div className={`w-2.5 h-2.5 mt-1.5 rounded-full flex-shrink-0 ${i === 0 ? 'bg-[#1B4AD4]' : 'bg-gray-200'}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className={`text-sm font-black ${i === 0 ? 'text-[#1B4AD4]' : 'text-gray-600'}`}>{update.status}</p>
                    <p className="text-xs text-gray-300">{formatDateTime(update.createdAt)}</p>
                  </div>
                  {update.note && <p className="text-sm text-gray-500 mt-0.5">{update.note}</p>}
                  {update.location && <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><MapPin className="w-3 h-3" />{update.location}</p>}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}
