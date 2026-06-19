import { getSupplyOrders, deleteSupplyOrder } from '@/app/actions/supply'
import { formatDateTime, formatDate, getStatusColor } from '@/lib/utils'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import type { Metadata } from 'next'
import DeleteButton from '@/components/admin/DeleteButton'
import RefreshButton from '@/components/admin/RefreshButton'
import ContactButtons from '@/components/admin/ContactButtons'
import Field from '@/components/admin/Field'
import Pagination from '@/components/admin/Pagination'

export const metadata: Metadata = { title: 'Supply Orders' }
export const dynamic = 'force-dynamic'

export default async function AdminSupplyOrdersPage({
  searchParams,
}: { searchParams: Promise<{ status?: string; page?: string }> }) {
  const { status, page } = await searchParams
  const { orders, total, page: currentPage, totalPages } = await getSupplyOrders(
    status && status !== 'all' ? status : undefined,
    Number(page) || 1
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Supply Orders</h1>
          <p className="text-sm text-gray-500 mt-1">{total} order{total !== 1 ? 's' : ''}</p>
        </div>
        <RefreshButton />
      </div>

      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((s) => (
          <Link key={s} href={s === 'all' ? '/admin/supply-orders' : `/admin/supply-orders?status=${s}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${(s === 'all' && !status) || status === s ? 'text-white' : 'bg-white border border-border text-gray-600 hover:border-gray-400'}`}
            style={(s === 'all' && !status) || status === s ? { background: '#0E2A82' } : {}}
          >{s}</Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-soft">
          <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No supply orders</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o: any) => {
            const items = Array.isArray(o.items) ? o.items as Array<{ name: string; quantity: number; unit: string }> : []
            const itemSummary = items.map((it) => `${it.quantity} ${it.unit} ${it.name}`).join(', ')
            const message = `Hi ${o.customerName}, regarding your Fraogo supply order${itemSummary ? ` (${itemSummary})` : ''} to ${o.destination}:`
            return (
              <div key={o.id} className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-black text-gray-900 text-base">{o.customerName}</h2>
                      <span className={`status-badge ${getStatusColor(o.status)}`}>{o.status}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{formatDateTime(o.createdAt)}</p>
                  </div>
                  <DeleteButton id={o.id} action={deleteSupplyOrder} confirmText="Delete this order permanently?" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                  <Field label="Email" value={o.customerEmail} />
                  <Field label="Phone" value={o.customerPhone} />
                  <Field label="Preferred Date" value={formatDate(o.preferredDate)} />
                  <div className="col-span-2 sm:col-span-3">
                    <Field label="Delivery Destination" value={o.destination} />
                  </div>
                  <div className="col-span-2 sm:col-span-3">
                    <Field label="Items" value={itemSummary} />
                  </div>
                </div>

                <ContactButtons phone={o.customerPhone} email={o.customerEmail} subject="Your Fraogo supply order" message={message} />
              </div>
            )
          })}
        </div>
      )}

      <Pagination page={currentPage} totalPages={totalPages} basePath="/admin/supply-orders" query={{ status }} />
    </div>
  )
}
