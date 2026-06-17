import { getVendorRequests } from '@/app/actions/vendorRequest'
import { formatDateTime, getStatusColor } from '@/lib/utils'
import { UserCheck, Clock, MapPin } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Vendor Requests' }
export const dynamic = 'force-dynamic'

export default async function AdminVendorRequestsPage() {
  const requests = await getVendorRequests()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Vendor Hire Requests</h1>
        <p className="text-sm text-gray-500 mt-1">{requests.length} request{requests.length !== 1 ? 's' : ''} total</p>
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-border overflow-hidden">
        {requests.length === 0 ? (
          <div className="p-12 text-center">
            <UserCheck className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No hire requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Vendor</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r: any) => (
                  <tr key={r.id}>
                    <td>
                      <div className="font-semibold text-sm">{r.customerName}</div>
                      <div className="text-xs text-gray-500">{r.customerEmail}</div>
                      <div className="text-xs text-gray-500">{r.customerPhone}</div>
                    </td>
                    <td>
                      <div className="font-semibold text-sm">{r.vendor.businessName}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {r.vendor.location}
                      </div>
                    </td>
                    <td className="max-w-md">
                      <p className="text-xs text-gray-600 line-clamp-2">{r.description}</p>
                      {r.eventDate && (
                        <div className="text-[10px] font-bold text-[#0E2A82] mt-1 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          Event: {new Date(r.eventDate).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusColor(r.status)}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="text-xs text-gray-500 whitespace-nowrap">
                      {formatDateTime(r.createdAt)}
                    </td>
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

