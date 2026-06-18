import { getDeliveryRequests, deleteDeliveryRequest } from '@/app/actions/delivery'
import { formatDateTime, getStatusColor } from '@/lib/utils'
import Link from 'next/link'
import { Truck } from 'lucide-react'
import type { Metadata } from 'next'
import DeleteButton from '@/components/admin/DeleteButton'
import RefreshButton from '@/components/admin/RefreshButton'
import ContactButtons from '@/components/admin/ContactButtons'
import Field from '@/components/admin/Field'

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
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Delivery Requests</h1>
          <p className="text-sm text-gray-500 mt-1">{deliveries.length} request{deliveries.length !== 1 ? 's' : ''}</p>
        </div>
        <RefreshButton />
      </div>

      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((s) => (
          <Link key={s} href={s === 'all' ? '/admin/deliveries' : `/admin/deliveries?status=${s}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${(s === 'all' && !status) || status === s ? 'text-white' : 'bg-white border border-border text-gray-600 hover:border-gray-400'}`}
            style={(s === 'all' && !status) || status === s ? { background: '#0E2A82' } : {}}
          >{s}</Link>
        ))}
      </div>

      {deliveries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-soft">
          <Truck className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No delivery requests found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {deliveries.map((d: any) => {
            const message = `Hi ${d.senderName}, regarding your Fraogo ${d.type} delivery of "${d.itemDescription}" to ${d.destination} (receiver: ${d.receiverName}):`
            return (
              <div key={d.id} className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-black text-gray-900 text-base">{d.senderName}</h2>
                      <span className={`status-badge ${getStatusColor(d.status)}`}>{d.status}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 capitalize">{d.type}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{formatDateTime(d.createdAt)}</p>
                  </div>
                  <DeleteButton id={d.id} action={deleteDeliveryRequest} confirmText="Delete this request permanently?" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                  <Field label="Sender Email" value={d.senderEmail} />
                  <Field label="Sender Phone" value={d.senderPhone} />
                  <Field label="Weight" value={`${d.itemWeight} ${d.weightUnit}`} />
                  <Field label="Destination" value={d.destination} />
                  <Field label="Receiver" value={d.receiverName} />
                  <Field label="Receiver Contact" value={d.receiverContact} />
                  <div className="col-span-2 sm:col-span-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Item Description</p>
                    <p className="text-sm text-gray-800">{d.itemDescription}</p>
                  </div>
                  <Field label="Inspection Consent" value={d.consentGiven ? 'Yes' : 'No'} />
                </div>

                <ContactButtons phone={d.senderPhone} email={d.senderEmail} subject="Your Fraogo delivery request" message={message} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
