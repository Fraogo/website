import { getSupplyOrders, deleteSupplyOrder } from '@/app/actions/supply'
import { formatDateTime, formatDate, getStatusColor } from '@/lib/utils'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import type { Metadata } from 'next'
import DeleteButton from '@/components/admin/DeleteButton'
import RefreshButton from '@/components/admin/RefreshButton'

export const metadata: Metadata = { title: 'Supply Orders' }
export const dynamic = 'force-dynamic'

export default async function AdminSupplyOrdersPage({
  searchParams,
}: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams
  const orders = await getSupplyOrders(status && status !== 'all' ? status : undefined)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Supply Orders</h1>
          <p className="text-sm text-gray-500 mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
        </div>
        <RefreshButton />
      </div>

      <div className="flex gap-2">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((s) => (
          <Link key={s} href={s === 'all' ? '/admin/supply-orders' : `/admin/supply-orders?status=${s}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${(s === 'all' && !status) || status === s ? 'text-white' : 'bg-white border border-border text-gray-600 hover:border-gray-400'}`}
            style={(s === 'all' && !status) || status === s ? { background: '#0E2A82' } : {}}
          >{s}</Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-border overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-12 text-center"><ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-3" /><p className="text-gray-500 text-sm">No supply orders</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr><th>Customer</th><th>Items</th><th>Destination</th><th>Preferred Date</th><th>Status</th><th>Submitted</th><th></th></tr>
              </thead>
              <tbody>
                {orders.map((o: any) => {
                  const items = Array.isArray(o.items) ? o.items as Array<{name: string; quantity: number; unit: string}> : []
                  return (
                    <tr key={o.id}>
                      <td>
                        <div className="font-semibold text-sm">{o.customerName}</div>
                        <div className="text-xs text-gray-500">{o.customerEmail}</div>
                      </td>
                      <td className="text-xs text-gray-600">
                        {items.map((item) => `${item.quantity} ${item.unit} ${item.name}`).join(', ')}
                      </td>
                      <td className="text-xs text-gray-600 max-w-32 truncate">{o.destination}</td>
                      <td className="text-xs whitespace-nowrap">{formatDate(o.preferredDate)}</td>
                      <td><span className={`status-badge ${getStatusColor(o.status)}`}>{o.status}</span></td>
                      <td className="text-xs text-gray-500 whitespace-nowrap">{formatDateTime(o.createdAt)}</td>
                      <td><DeleteButton id={o.id} action={deleteSupplyOrder} confirmText="Delete this order permanently?" /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

