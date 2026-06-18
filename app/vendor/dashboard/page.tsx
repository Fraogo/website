import { validateMagicLink } from '@/app/actions/vendorPortfolio'
import VendorDashboard from './VendorDashboard'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Vendor Dashboard' }
export const dynamic = 'force-dynamic'

export default async function VendorDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams
  const result = token
    ? await validateMagicLink(token)
    : { valid: false as const, error: 'No access token provided.' }

  if (!result.valid || !('vendor' in result) || !result.vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md text-center bg-white rounded-2xl shadow-soft border border-gray-100 p-10">
          <h1 className="text-xl font-black text-gray-900 mb-2">Access Link Invalid</h1>
          <p className="text-sm text-gray-500">
            {('error' in result && result.error) || 'This link is invalid or has expired. Please contact Fraogo for a new one.'}
          </p>
        </div>
      </div>
    )
  }

  return <VendorDashboard token={token!} vendor={result.vendor} />
}
