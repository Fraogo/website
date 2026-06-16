'use client'

import { useState } from 'react'
import { addTrackingUpdate } from '@/app/actions/tracking'
import { Plus } from 'lucide-react'

interface Props {
  recordId: string
  trackingNumber: string
}

export default function TrackingUpdateForm({ recordId, trackingNumber }: Props) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setSuccess('')
    setError('')

    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const result = await addTrackingUpdate({
        trackingId: recordId,
        status:   data.get('status') as string,
        note:     (data.get('note') as string) || undefined,
        location: (data.get('location') as string) || undefined,
      })

      if (result.success) {
        setSuccess('Status update added! The customer can now see this.')
        form.reset()
      } else {
        setError(typeof result.error === 'string' ? result.error : 'Something went wrong.')
      }
    } catch {
      setError('Failed to add update.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="form-label">New Status *</label>
        <input
          name="status"
          type="text"
          required
          placeholder="e.g. In Transit, Out for Delivery, Delivered"
          className="form-input"
        />
        <p className="text-xs text-gray-400 mt-1">Common: Order Confirmed · Processing · In Transit · Out for Delivery · Delivered</p>
      </div>
      <div>
        <label className="form-label">Note <span className="text-gray-400 font-normal">(optional)</span></label>
        <input
          name="note"
          type="text"
          placeholder="e.g. Package loaded onto truck, estimated 2 days"
          className="form-input"
        />
      </div>
      <div>
        <label className="form-label">Location <span className="text-gray-400 font-normal">(optional)</span></label>
        <input
          name="location"
          type="text"
          placeholder="e.g. Lagos Warehouse, Abuja Hub"
          className="form-input"
        />
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">{success}</div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-60"
      >
        <Plus className="w-4 h-4" />
        {loading ? 'Saving…' : 'Add Status Update'}
      </button>

      <p className="text-xs text-gray-400 pt-1">
        Customer can track live at{' '}
        <a
          href={`/track?ref=${trackingNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#1B4AD4] underline font-medium"
        >
          /track?ref={trackingNumber}
        </a>
      </p>
    </form>
  )
}
