import { getRelocationRequests, deleteRelocationRequest } from '@/app/actions/relocation'
import { formatDateTime, getStatusColor } from '@/lib/utils'
import Link from 'next/link'
import { MoveRight } from 'lucide-react'
import type { Metadata } from 'next'
import DeleteButton from '@/components/admin/DeleteButton'
import RefreshButton from '@/components/admin/RefreshButton'
import ContactButtons from '@/components/admin/ContactButtons'
import Field from '@/components/admin/Field'

export const metadata: Metadata = { title: 'Relocation Requests' }
export const dynamic = 'force-dynamic'

export default async function AdminRelocationsPage({
  searchParams,
}: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams
  const relocations = await getRelocationRequests(status && status !== 'all' ? status : undefined)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Relocation Requests</h1>
          <p className="text-sm text-gray-500 mt-1">{relocations.length} request{relocations.length !== 1 ? 's' : ''}</p>
        </div>
        <RefreshButton />
      </div>

      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'confirmed', 'completed'].map((s) => (
          <Link key={s} href={s === 'all' ? '/admin/relocations' : `/admin/relocations?status=${s}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${(s === 'all' && !status) || status === s ? 'text-white' : 'bg-white border border-border text-gray-600 hover:border-gray-400'}`}
            style={(s === 'all' && !status) || status === s ? { background: '#0E2A82' } : {}}
          >{s}</Link>
        ))}
      </div>

      {relocations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-soft">
          <MoveRight className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No relocation requests</p>
        </div>
      ) : (
        <div className="space-y-4">
          {relocations.map((r: any) => {
            const message = `Hi ${r.customerName}, regarding your Fraogo relocation from ${r.pickupLocation} to ${r.destination}:`
            return (
              <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-black text-gray-900 text-base">{r.customerName}</h2>
                      <span className={`status-badge ${getStatusColor(r.status)}`}>{r.status}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${r.transportBy === 'fraogo' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'}`}>
                        {r.transportBy === 'fraogo' ? 'Fraogo transport' : 'Self transport'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{formatDateTime(r.createdAt)}</p>
                  </div>
                  <DeleteButton id={r.id} action={deleteRelocationRequest} confirmText="Delete this request permanently?" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                  <Field label="Email" value={r.customerEmail} />
                  <Field label="Phone" value={r.customerPhone} />
                  <Field label="Pick-up" value={r.pickupLocation} />
                  <Field label="Destination" value={r.destination} />
                  <div className="col-span-2 sm:col-span-3">
                    <Field label="Items to Move" value={r.itemsList} />
                  </div>
                  <div className="col-span-2 sm:col-span-3">
                    <Field label="Description" value={r.itemDescription} />
                  </div>
                </div>

                <ContactButtons phone={r.customerPhone} email={r.customerEmail} subject="Your Fraogo relocation request" message={message} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
