'use client'

import { useState } from 'react'
import { approveVendor, rejectVendor } from '@/app/actions/vendor'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface VendorActionButtonsProps {
  vendorId: string
}

export default function VendorActionButtons({ vendorId }: VendorActionButtonsProps) {
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null)

  const handleApprove = async () => {
    setLoading('approve')
    try {
      const res = await approveVendor(vendorId)
      if (res.success) {
        toast.success('Vendor approved successfully')
      } else {
        toast.error(res.error || 'Failed to approve vendor')
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(null)
    }
  }

  const handleReject = async () => {
    if (!confirm('Are you sure you want to reject this vendor?')) return

    setLoading('reject')
    try {
      const res = await rejectVendor(vendorId)
      if (res.success) {
        toast.success('Vendor rejected')
      } else {
        toast.error(res.error || 'Failed to reject vendor')
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <button
        onClick={handleApprove}
        disabled={!!loading}
        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-green-50 text-green-700 border border-green-200 text-xs font-bold hover:bg-green-100 transition-colors disabled:opacity-60"
      >
        {loading === 'approve' ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <CheckCircle2 className="w-3.5 h-3.5" />
        )}
        Approve
      </button>
      <button
        onClick={handleReject}
        disabled={!!loading}
        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-bold hover:bg-red-100 transition-colors disabled:opacity-60"
      >
        {loading === 'reject' ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <XCircle className="w-3.5 h-3.5" />
        )}
        Reject
      </button>
    </div>
  )
}
