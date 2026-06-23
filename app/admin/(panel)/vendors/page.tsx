import { getVendors } from '@/app/actions/vendor'
import { getNinSignedUrl } from '@/lib/storage'
import { formatDateTime, getStatusColor } from '@/lib/utils'
import { Users, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import VendorActionButtons from '@/components/admin/VendorActionButtons'
import ContactButtons from '@/components/admin/ContactButtons'
import Pagination from '@/components/admin/Pagination'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Vendor Management' }
export const dynamic = 'force-dynamic'

export default async function AdminVendorsPage({
  searchParams,
}: { searchParams: Promise<{ status?: string; page?: string }> }) {
  const { status, page } = await searchParams
  const activeStatus = status && status !== 'all' ? status : undefined
  const { vendors, total, page: currentPage, totalPages } = await getVendors(activeStatus, Number(page) || 1)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Vendor Management</h1>
        <p className="text-sm text-gray-500 mt-1">{total} vendor{total !== 1 ? 's' : ''}</p>
      </div>

      <div className="flex gap-2">
        {['all', 'pending_review', 'active', 'rejected'].map((s) => (
          <Link key={s} href={s === 'all' ? '/admin/vendors' : `/admin/vendors?status=${s}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${(s === 'all' && !status) || status === s ? 'text-white' : 'bg-white border border-border text-gray-600 hover:border-gray-400'}`}
            style={(s === 'all' && !status) || status === s ? { background: '#0E2A82' } : {}}
          >{s.replace('_', ' ')}</Link>
        ))}
      </div>

      <div className="space-y-4">
        {vendors.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-soft border border-border">
            <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No vendors found</p>
          </div>
        ) : (
          vendors.map((vendor: any) => {
            const contactSubject = `FRAOGO — ${vendor.businessName}`
            const contactMessage = vendor.status === 'active'
              ? `Hi ${vendor.businessName}, this is FRAOGO regarding your approved vendor listing.`
              : `Hi ${vendor.businessName}, this is FRAOGO regarding your vendor application.`
            return (
            <div key={vendor.id} className="bg-white rounded-2xl shadow-soft border border-border p-5">
              <div className="flex flex-wrap items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-black text-gray-900 text-base">{vendor.businessName}</h3>
                    <span className={`status-badge ${getStatusColor(vendor.status)}`}>{vendor.status.replace('_', ' ')}</span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-gray-600 mt-2">
                    <div><span className="font-semibold text-gray-900">Type:</span> {vendor.businessType}</div>
                    <div><span className="font-semibold text-gray-900">Location:</span> {vendor.location}</div>
                    <div><span className="font-semibold text-gray-900">Email:</span> {vendor.email ?? '—'}</div>
                    <div><span className="font-semibold text-gray-900">Phone:</span> {vendor.phone}</div>
                    <div><span className="font-semibold text-gray-900">Portfolio:</span> {vendor.portfolioImages.length} images</div>
                    <div><span className="font-semibold text-gray-900">Applied:</span> {formatDateTime(vendor.createdAt)}</div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">{vendor.description}</p>
                </div>

                <div className="flex flex-col gap-2 flex-shrink-0">
                  {/* View NIN Document — only sign when a document actually exists */}
                  {vendor.ninDocumentUrl
                    ? <NinDocumentLink ninDocumentUrl={vendor.ninDocumentUrl} />
                    : <span className="text-xs text-gray-400">No document</span>}

                  {/* Approve / Reject — client component */}
                  {vendor.status === 'pending_review' && (
                    <VendorActionButtons vendorId={vendor.id} />
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-50">
                <ContactButtons phone={vendor.phone} email={vendor.email} subject={contactSubject} message={contactMessage} />
              </div>
            </div>
            )
          })
        )}
      </div>

      <Pagination page={currentPage} totalPages={totalPages} basePath="/admin/vendors" query={{ status }} />
    </div>
  )
}

async function NinDocumentLink({ ninDocumentUrl }: { ninDocumentUrl: string }) {
  const signedUrl = await getNinSignedUrl(ninDocumentUrl)
  if (!signedUrl) return <span className="text-xs text-gray-400">NIN unavailable</span>
  return (
    <a
      href={signedUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
    >
      <ExternalLink className="w-3.5 h-3.5" />
      View NIN Document
    </a>
  )
}

