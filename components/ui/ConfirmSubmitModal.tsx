'use client'

import { Loader2, Pencil, AlertTriangle } from 'lucide-react'

export interface ReviewRow {
  label: string
  value?: string | null
}

/**
 * E-commerce-style "review before you submit" popup. The form validates first,
 * then opens this with a summary of what's about to be sent. Confirm runs the
 * real submission; cancel returns to the (still-filled) form to edit.
 */
export default function ConfirmSubmitModal({
  open,
  rows,
  onConfirm,
  onCancel,
  submitting,
  error,
  title = 'Please confirm your details',
  subtitle = 'Check everything is correct before we send it.',
  confirmLabel = 'Confirm & Send',
}: {
  open: boolean
  rows: ReviewRow[]
  onConfirm: () => void
  onCancel: () => void
  submitting: boolean
  error?: string | null
  title?: string
  subtitle?: string
  confirmLabel?: string
}) {
  if (!open) return null

  const shown = rows.filter((r) => r.value != null && String(r.value).trim() !== '')

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
      onClick={(e) => { if (e.target === e.currentTarget && !submitting) onCancel() }}
    >
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-elevated">
        <div className="p-5 border-b border-border">
          <h2 className="font-black text-foreground text-lg">{title}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        </div>

        <dl className="p-5 space-y-3">
          {shown.map((r) => (
            <div key={r.label} className="flex flex-col gap-0.5">
              <dt className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{r.label}</dt>
              <dd className="text-sm text-foreground break-words whitespace-pre-wrap">{r.value}</dd>
            </div>
          ))}
        </dl>

        {error && (
          <div className="mx-5 mb-2 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="p-5 border-t border-border flex flex-col-reverse sm:flex-row gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="btn-outline flex-1 justify-center py-3 rounded-xl text-sm disabled:opacity-60"
          >
            <Pencil className="w-4 h-4" /> Go back &amp; edit
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={submitting}
            className="btn-primary flex-1 justify-center py-3 rounded-xl text-sm disabled:opacity-60"
          >
            {submitting
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
              : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
