'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RotateCw, Home } from 'lucide-react'

// Route-segment error boundary. Replaces the raw Next/Vercel error screen with
// a branded card the customer can recover from.
export default function Error({
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
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #0E2A82 0%, #070F2B 100%)' }}
    >
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mx-auto mb-6 animate-pulse">
          <AlertTriangle className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-black text-white mb-2">Something went wrong</h1>
        <p className="text-white/60 text-sm mb-7 max-w-sm mx-auto">
          We hit an unexpected error on our end. You can try again, or head back home — your data is safe.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-white text-[#1B4AD4] font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-blue-50 transition-colors"
          >
            <RotateCw className="w-4 h-4" /> Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-white/10 transition-colors"
          >
            <Home className="w-4 h-4" /> Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
