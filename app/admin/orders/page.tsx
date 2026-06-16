import { getProcurementOrders } from '@/app/actions/procurement'
import { formatDateTime, getStatusColor } from '@/lib/utils'
import Link from 'next/link'
import { Package } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Procurement Orders' }
export const dynamic = 'force-dynamic'

const STATUSES = ['all', 'pending', 'confirmed', 'completed', 'cancelled']

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const activeStatus = status && status !== 'all' ? status : undefined
  const orders = await getProcurementOrders(activeStatus)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Procurement Orders</h1>
        <p className="text-sm text-gray-500 mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''} found</p>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={s === 'all' ? '/admin/orders' : `/admin/orders?status=${s}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
              (s === 'all' && !status) || status === s
                ? 'text-white shadow-sm'
                : 'bg-white border border-border text-gray-600 hover:border-gray-400'
            }`}
            style={(s === 'all' && !status) || status === s ? { background: '#0E2A82' } : {}}
          >
            {s}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-soft border border-border overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Type</th>
                  <th>Items</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any) => {
                  const items = Array.isArray(order.items) ? order.items : []
                  return (
                    <tr key={order.id}>
                      <td className="font-semibold text-gray-900 whitespace-nowrap">{order.customerName}</td>
                      <td className="text-gray-600">{order.customerEmail}</td>
                      <td className="text-gray-600 whitespace-nowrap">{order.customerPhone}</td>
                      <td>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                          {order.type === 'nigeria' ? '🇳🇬 Nigeria' : '🌍 Intl'}
                        </span>
                      </td>
                      <td className="text-gray-600 text-xs">{items.length} item{items.length !== 1 ? 's' : ''}</td>
                      <td>
                        <span className={`status-badge ${getStatusColor(order.status)}`}>{order.status}</span>
                      </td>
                      <td className="text-gray-500 text-xs whitespace-nowrap">{formatDateTime(order.createdAt)}</td>
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

