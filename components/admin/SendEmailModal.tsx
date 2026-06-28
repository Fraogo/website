'use client'

import { useState } from 'react'
import { Send, Loader2, X, Image as ImageIcon, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { sendAdminComposedEmail } from '@/app/actions/adminEmail'

const MAX_FILES = 3
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

interface Attachment { filename: string; content: string; previewUrl: string }

export default function SendEmailModal({
  to,
  defaultSubject,
  defaultMessage,
  onClose,
}: {
  to: string
  defaultSubject: string
  defaultMessage: string
  onClose: () => void
}) {
  const [subject, setSubject] = useState(defaultSubject)
  const [message, setMessage] = useState(defaultMessage)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    setError(null)

    if (attachments.length + files.length > MAX_FILES) {
      setError(`You can attach up to ${MAX_FILES} images.`)
      e.target.value = ''
      return
    }

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed.')
        continue
      }
      if (file.size > MAX_SIZE) {
        setError(`"${file.name}" is over 5MB.`)
        continue
      }
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      const base64 = dataUrl.split(',')[1] ?? ''
      setAttachments((prev) => [...prev, { filename: file.name, content: base64, previewUrl: dataUrl }])
    }
    e.target.value = ''
  }

  function removeAttachment(i: number) {
    setAttachments((prev) => prev.filter((_, idx) => idx !== i))
  }

  async function handleSend() {
    if (!subject.trim() || !message.trim()) {
      setError('Subject and message are required.')
      return
    }
    setSending(true)
    setError(null)
    const result = await sendAdminComposedEmail({
      to,
      subject,
      message,
      attachments: attachments.map(({ filename, content }) => ({ filename, content })),
    })
    setSending(false)
    if (result.success) {
      toast.success('Email sent')
      onClose()
    } else {
      setError(typeof result.error === 'string' ? result.error : 'Failed to send email.')
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4"
      onClick={(e) => { if (e.target === e.currentTarget && !sending) onClose() }}
    >
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-elevated">
        <div className="p-5 border-b border-border flex items-start justify-between gap-3">
          <div>
            <h2 className="font-black text-foreground text-lg">Send Email</h2>
            <p className="text-xs text-muted-foreground mt-0.5 break-all">To: {to}</p>
          </div>
          <button onClick={onClose} disabled={sending} className="text-gray-400 hover:text-gray-600 disabled:opacity-50 flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="form-label" htmlFor="compose-subject">Subject</label>
            <input
              id="compose-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="form-input"
              maxLength={200}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="compose-message">Message</label>
            <textarea
              id="compose-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="form-input resize-none"
              maxLength={5000}
            />
          </div>

          <div>
            <label className="form-label">Images (optional, up to {MAX_FILES})</label>
            {attachments.length > 0 && (
              <div className="flex gap-2 mb-2 flex-wrap">
                {attachments.map((a, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-border flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={a.previewUrl} alt={a.filename} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeAttachment(i)}
                      className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center"
                      aria-label="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {attachments.length < MAX_FILES && (
              <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1B4AD4] cursor-pointer hover:underline">
                <ImageIcon className="w-3.5 h-3.5" /> Attach image
                <input type="file" accept="image/*" multiple onChange={handleFiles} className="sr-only" />
              </label>
            )}
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              {error}
            </div>
          )}
        </div>

        <div className="p-5 border-t border-border flex gap-3">
          <button onClick={onClose} disabled={sending} className="btn-outline flex-1 justify-center py-2.5 rounded-xl text-sm disabled:opacity-60">
            Cancel
          </button>
          <button onClick={handleSend} disabled={sending} className="btn-primary flex-1 justify-center py-2.5 rounded-xl text-sm disabled:opacity-60">
            {sending ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
            ) : (
              <><Send className="w-4 h-4" /> Send</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
