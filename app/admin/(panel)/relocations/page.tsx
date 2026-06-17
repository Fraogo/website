import { getRelocationRequests, deleteRelocationRequest } from '@/app/actions/relocation'
import { formatDateTime, getStatusColor } from '@/lib/utils'
import Link from 'next/link'
import { MoveRight } from 'lucide-react'
import type { Metadata } from 'next'
import DeleteButton from '@/components/admin/DeleteButton'
import RefreshButton from '@/components/admin/RefreshButton'

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

      <div className="flex gap-2">
        {['all', 'pending', 'confirmed', 'completed'].map((s) => (
          <Link key={s} href={s === 'all' ? '/admin/relocations' : `/admin/relocations?status=${s}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${(s === 'all' && !status) || status === s ? 'text-white' : 'bg-white border border-border text-gray-600 hover:border-gray-400'}`}
            style={(s === 'all' && !status) || status === s ? { background: '#0E2A82' } : {}}
          >{s}</Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-border overflow-hidden">
        {relocations.length === 0 ? (
          <div className="p-12 text-center"><MoveRight className="w-10 h-10 text-gray-300 mx-auto mb-3" /><p className="text-gray-500 text-sm">No relocation requests</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr><th>Customer</th><th>Email</th><th>Pick-up</th><th>Destination</th><th>Transport</th><th>Status</th><th>Date</th><th></th></tr>
              </thead>
              <tbody>
                {relocations.map((r: any) => (
                  <tr key={r.id}>
                    <td className="font-semibold whitespace-nowrap">{r.customerName}</td>
                    <td className="text-gray-600 text-xs">{r.customerEmail}</td>
                    <td className="text-gray-600 text-xs max-w-32 truncate">{r.pickupLocation}</td>
                    <td className="text-gray-600 text-xs max-w-32 truncate">{r.destination}</td>
                    <td><span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${r.transportBy === 'fraogo' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'}`}>{r.transportBy}</span></td>
                    <td><span className={`status-badge ${getStatusColor(r.status)}`}>{r.status}</span></td>
                    <td className="text-gray-500 text-xs whitespace-nowrap">{formatDateTime(r.createdAt)}</td>
                    <td><DeleteButton id={r.id} action={deleteRelocationRequest} confirmText="Delete this request permanently?" /></td>
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

