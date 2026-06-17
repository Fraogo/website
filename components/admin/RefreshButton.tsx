'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { RotateCw } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function RefreshButton() {
  const [pending, start] = useTransition()
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => start(() => router.refresh())}
      disabled={pending}
      className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
    >
      <RotateCw className={cn('w-4 h-4', pending && 'animate-spin')} />
      Refresh
    </button>
  )
}
