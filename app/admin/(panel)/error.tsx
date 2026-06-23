'use client'

import { useEffect } from 'react'
import { AlertTriangle, RotateCw } from 'lucide-react'

// Admin-panel error boundary. Renders inside the sidebar layout, so a data
// failure on any admin page shows this card instead of "server could not load".
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-md mx-auto mt-10 bg-white rounded-2xl border border-gray-100 shadow-soft p-8 text-center">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: '#FEF2F2' }}>
          <AlertTriangle className="w-7 h-7 text-red-500" />
        </div>
        <h1 className="text-lg font-black text-gray-900 mb-2">This page couldn&apos;t load</h1>
        <p className="text-sm text-gray-500 mb-6">
          Something went wrong fetching this data. Try again — if it keeps happening, refresh the page or check your connection.
        </p>
        <button onClick={reset} className="btn-primary px-5 py-2.5 rounded-xl text-sm mx-auto">
          <RotateCw className="w-4 h-4" /> Try again
        </button>
      </div>
    </div>
  )
}
