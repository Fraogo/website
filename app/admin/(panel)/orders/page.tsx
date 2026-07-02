import { getProcurementOrders, deleteProcurementOrder } from '@/app/actions/procurement'
import { formatDateTime, getStatusColor } from '@/lib/utils'
import Link from 'next/link'
import { Package } from 'lucide-react'
import type { Metadata } from 'next'
import DeleteButton from '@/components/admin/DeleteButton'
import RefreshButton from '@/components/admin/RefreshButton'
import ContactButtons from '@/components/admin/ContactButtons'
import Pagination from '@/components/admin/Pagination'

export const metadata: Metadata = { title: 'Procurement Orders' }
export const dynamic = 'force-dynamic'

const STATUSES = ['all', 'pending', 'confirmed', 'completed', 'cancelled']

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  const { status, page } = await searchParams
  const activeStatus = status && status !== 'all' ? status : undefined
  const { orders, total, page: currentPage, totalPages } = await getProcurementOrders(activeStatus, Number(page) || 1)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Procurement Orders</h1>
          <p className="text-sm text-gray-500 mt-1">{total} order{total !== 1 ? 's' : ''} found</p>
        </div>
        <RefreshButton />
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

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-soft">
          <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => {
            const items = Array.isArray(order.items) ? order.items : []
            const itemSummary = items.map((it: any) => `${it.quantity}x ${it.name}`).join(', ')
            const message = `Hi ${order.customerName}, regarding your Fraogo procurement order (${order.type === 'nigeria' ? 'Nigeria' : 'International'})${itemSummary ? ` — ${itemSummary}` : ''}:`
            return (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-black text-gray-900 text-base">{order.customerName}</h2>
                      <span className={`status-badge ${getStatusColor(order.status)}`}>{order.status}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        {order.type === 'nigeria' ? '🇳🇬 Nigeria' : '🌍 International'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{formatDateTime(order.createdAt)}</p>
                  </div>
                  <DeleteButton id={order.id} action={deleteProcurementOrder} confirmText="Delete this order permanently?" />
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs mb-4">
                  <span className="text-gray-500"><strong className="text-gray-700">Email:</strong> {order.customerEmail}</span>
                  <span className="text-gray-500"><strong className="text-gray-700">Phone:</strong> {order.customerPhone}</span>
                </div>

                {items.length > 0 && (
                  <div className="rounded-xl border border-gray-100 overflow-x-auto mb-4">
                    <table className="w-full text-xs min-w-[28rem]">
                      <thead className="bg-gray-50 text-gray-500">
                        <tr>
                          <th className="text-left px-3 py-2 font-semibold">Item</th>
                          <th className="text-left px-3 py-2 font-semibold">Specification</th>
                          <th className="text-center px-3 py-2 font-semibold">Qty</th>
                          <th className="text-left px-3 py-2 font-semibold">Delivery</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {items.map((it: any, i: number) => (
                          <tr key={i}>
                            <td className="px-3 py-2 text-gray-800 font-medium">{it.name}</td>
                            <td className="px-3 py-2 text-gray-500">{it.specification}</td>
                            <td className="px-3 py-2 text-center text-gray-700">{it.quantity}</td>
                            <td className="px-3 py-2 text-gray-500">{it.deliveryMode}{it.deliveryAddress ? ` — ${it.deliveryAddress}` : ''}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <ContactButtons phone={order.customerPhone} email={order.customerEmail} subject="Your Fraogo procurement order" message={message} />
              </div>
            )
          })}
        </div>
      )}

      <Pagination page={currentPage} totalPages={totalPages} basePath="/admin/orders" query={{ status }} />
    </div>
  )
}
