'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

export default function DeleteButton({
  id,
  action,
  label = 'Delete',
  confirmText = 'Delete this permanently? This cannot be undone.',
}: {
  id: string
  action: (id: string) => Promise<{ success: boolean; error?: string }>
  label?: string
  confirmText?: string
}) {
  const [pending, start] = useTransition()
  const router = useRouter()

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm(confirmText)) return
        start(async () => {
          const res = await action(id)
          if (res?.success) router.refresh()
          else alert(res?.error ?? 'Failed to delete.')
        })
      }}
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
    >
      <Trash2 className="w-3.5 h-3.5" />
      {pending ? 'Deleting…' : label}
    </button>
  )
}
