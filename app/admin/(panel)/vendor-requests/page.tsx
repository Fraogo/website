import { getVendorRequests, deleteVendorRequest } from '@/app/actions/vendorRequest'
import { formatDateTime, getStatusColor } from '@/lib/utils'
import { UserCheck, MapPin } from 'lucide-react'
import type { Metadata } from 'next'
import DeleteButton from '@/components/admin/DeleteButton'
import RefreshButton from '@/components/admin/RefreshButton'
import ContactButtons from '@/components/admin/ContactButtons'
import Field from '@/components/admin/Field'
import Pagination from '@/components/admin/Pagination'

export const metadata: Metadata = { title: 'Vendor Requests' }
export const dynamic = 'force-dynamic'

export default async function AdminVendorRequestsPage({
  searchParams,
}: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams
  const { requests, total, page: currentPage, totalPages } = await getVendorRequests(Number(page) || 1)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Vendor Hire Requests</h1>
          <p className="text-sm text-gray-500 mt-1">{total} request{total !== 1 ? 's' : ''} total</p>
        </div>
        <RefreshButton />
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-soft">
          <UserCheck className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No hire requests found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((r: any) => {
            const message = `Hi ${r.customerName}, regarding your Fraogo request to hire ${r.vendor.businessName}:`
            return (
              <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-black text-gray-900 text-base">{r.customerName}</h2>
                      <span className={`status-badge ${getStatusColor(r.status)}`}>{r.status}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      wants to hire <strong className="text-gray-700">{r.vendor.businessName}</strong>
                      <span className="text-gray-300">·</span>
                      <MapPin className="w-3 h-3" /> {r.vendor.location}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{formatDateTime(r.createdAt)}</p>
                  </div>
                  <DeleteButton id={r.id} action={deleteVendorRequest} confirmText="Delete this request permanently?" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                  <Field label="Email" value={r.customerEmail} />
                  <Field label="Phone" value={r.customerPhone} />
                  <Field label="Event Date" value={r.eventDate ? new Date(r.eventDate).toLocaleDateString('en-NG', { dateStyle: 'full' }) : null} />
                  <Field label="Budget" value={r.budget} />
                  <div className="col-span-2 sm:col-span-3">
                    <Field label="What they need" value={r.description} />
                  </div>
                </div>

                <ContactButtons phone={r.customerPhone} email={r.customerEmail} subject={`Your Fraogo request — ${r.vendor.businessName}`} message={message} />
              </div>
            )
          })}
        </div>
      )}

      <Pagination page={currentPage} totalPages={totalPages} basePath="/admin/vendor-requests" />
    </div>
  )
}
