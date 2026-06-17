import { getAllTrackingRecords, deleteTrackingRecord } from '@/app/actions/tracking'
import { formatDateTime } from '@/lib/utils'
import { MapPin, Plus } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import DeleteButton from '@/components/admin/DeleteButton'
import RefreshButton from '@/components/admin/RefreshButton'

export const metadata: Metadata = { title: 'Order Tracking — Admin' }
export const dynamic = 'force-dynamic'

const SERVICE_LABELS: Record<string, string> = {
  'procurement':      'Procurement',
  'logistics-local':  'Local Transport',
  'logistics-abroad': 'Send Abroad',
  'supply':           'Supply Order',
  'vendor-service':   'Vendor Service',
}

const STATUS_COLORS: Record<string, string> = {
  'Order Confirmed': 'bg-blue-100 text-blue-700',
  'In Transit':      'bg-yellow-100 text-yellow-700',
  'Out for Delivery':'bg-orange-100 text-orange-700',
  'Delivered':       'bg-green-100 text-green-700',
}

export default async function AdminTrackingPage() {
  const records = await getAllTrackingRecords()

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#EEF2FF' }}>
            <MapPin className="w-5 h-5" style={{ color: '#1B4AD4' }} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Order Tracking</h1>
            <p className="text-sm text-gray-400">{records.length} total records</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <RefreshButton />
          <Link
            href="/admin/tracking/new"
            className="btn-primary px-4 py-2.5 rounded-xl text-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Tracking Record
          </Link>
        </div>
      </div>

      {records.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-soft">
          <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-200" />
          <p className="text-gray-400 font-semibold mb-4">No tracking records yet</p>
          <Link href="/admin/tracking/new" className="btn-primary px-5 py-2.5 rounded-xl text-sm inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create First Record
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Tracking #</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Service</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Created</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {records.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="font-mono font-bold text-gray-900 text-xs tracking-wider">{record.trackingNumber}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-gray-800">{record.customerName}</p>
                    {record.customerEmail && (
                      <p className="text-xs text-gray-400">{record.customerEmail}</p>
                    )}
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell text-gray-500">
                    {SERVICE_LABELS[record.serviceType] ?? record.serviceType}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`status-badge text-xs px-2.5 py-1 ${STATUS_COLORS[record.currentStatus] ?? 'bg-gray-100 text-gray-600'}`}>
                      {record.currentStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell text-gray-400 text-xs">
                    {formatDateTime(record.createdAt)}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/tracking/${record.id}`}
                        className="text-xs font-semibold text-[#1B4AD4] hover:underline"
                      >
                        Update →
                      </Link>
                      <DeleteButton id={record.id} action={deleteTrackingRecord} confirmText="Delete this tracking record permanently?" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
