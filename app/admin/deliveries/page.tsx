import { getDeliveryRequests } from '@/app/actions/delivery'
import { formatDateTime, getStatusColor } from '@/lib/utils'
import Link from 'next/link'
import { Truck } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Delivery Requests' }
export const dynamic = 'force-dynamic'

export default async function AdminDeliveriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const deliveries = await getDeliveryRequests(status && status !== 'all' ? status : undefined)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Delivery Requests</h1>
        <p className="text-sm text-gray-500 mt-1">{deliveries.length} request{deliveries.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="flex gap-2">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((s) => (
          <Link key={s} href={s === 'all' ? '/admin/deliveries' : `/admin/deliveries?status=${s}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${(s === 'all' && !status) || status === s ? 'text-white' : 'bg-white border border-border text-gray-600 hover:border-gray-400'}`}
            style={(s === 'all' && !status) || status === s ? { background: '#0E2A82' } : {}}
          >{s}</Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-border overflow-hidden">
        {deliveries.length === 0 ? (
          <div className="p-12 text-center"><Truck className="w-10 h-10 text-gray-300 mx-auto mb-3" /><p className="text-gray-500 text-sm">No delivery requests found</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Sender</th><th>Email</th><th>Type</th><th>Destination</th><th>Receiver</th><th>Weight</th><th>Status</th><th>Date</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.map((d: any) => (
                  <tr key={d.id}>
                    <td className="font-semibold whitespace-nowrap">{d.senderName}</td>
                    <td className="text-gray-600 text-xs">{d.senderEmail}</td>
                    <td><span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 font-semibold">{d.type}</span></td>
                    <td className="text-gray-600 max-w-32 truncate text-sm">{d.destination}</td>
                    <td className="text-gray-600 text-sm whitespace-nowrap">{d.receiverName}</td>
                    <td className="text-gray-600 text-xs whitespace-nowrap">{d.itemWeight} {d.weightUnit}</td>
                    <td><span className={`status-badge ${getStatusColor(d.status)}`}>{d.status}</span></td>
                    <td className="text-gray-500 text-xs whitespace-nowrap">{formatDateTime(d.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

