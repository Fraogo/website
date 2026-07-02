'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Plus, Copy, Trash2, Loader2, Link2 } from 'lucide-react'
import { createWriterToken, revokeWriterToken } from '@/app/actions/blogWriter'
import { formatDate } from '@/lib/utils'

interface Token {
  id: string
  token: string
  name: string
  active: boolean
  createdAt: Date
  lastUsedAt: Date | null
}

export default function WriterLinksManager({ initialTokens }: { initialTokens: Token[] }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [creating, setCreating] = useState(false)

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (name.trim().length < 2) return
    setCreating(true)
    const res = await createWriterToken(name.trim())
    setCreating(false)
    if (res.success) {
      setName('')
      toast.success('Writer link created')
      router.refresh()
    } else {
      toast.error(typeof res.error === 'string' ? res.error : 'Failed to create link')
    }
  }

  function copyLink(token: string) {
    const url = `${window.location.origin}/write?token=${token}`
    navigator.clipboard.writeText(url).then(
      () => toast.success('Link copied — share it with the writer'),
      () => toast.error('Could not copy'),
    )
  }

  async function handleRevoke(id: string) {
    if (!confirm('Revoke this link? The writer will no longer be able to post with it.')) return
    const res = await revokeWriterToken(id)
    if (res.success) {
      toast.success('Link revoked')
      router.refresh()
    } else {
      toast.error(typeof res.error === 'string' ? res.error : 'Failed to revoke')
    }
  }

  return (
    <div className="space-y-6">
      {/* Create */}
      <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5">
        <label className="form-label">Create a writing link for someone</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Writer's name (e.g. Amara Okonkwo)"
            maxLength={120}
            className="form-input flex-1"
          />
          <button type="submit" disabled={creating || name.trim().length < 2}
            className="btn-primary px-5 py-2.5 rounded-xl text-sm justify-center disabled:opacity-60 whitespace-nowrap">
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Create link
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          After creating, tap <strong>Copy link</strong> and send it to the writer. Anyone with the link can publish posts until you revoke it.
        </p>
      </form>

      {/* List */}
      {initialTokens.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center shadow-soft">
          <Link2 className="w-10 h-10 mx-auto mb-3 text-gray-200" />
          <p className="text-gray-400 text-sm">No writer links yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {initialTokens.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-black text-gray-900 text-base">{t.name}</h3>
                  <span className={`status-badge text-xs px-2 py-0.5 ${t.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {t.active ? 'Active' : 'Revoked'}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Created {formatDate(t.createdAt)}
                  {t.lastUsedAt ? ` · Last posted ${formatDate(t.lastUsedAt)}` : ' · Not used yet'}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {t.active && (
                  <button onClick={() => copyLink(t.token)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-[#1B4AD4] hover:bg-blue-100 transition-colors">
                    <Copy className="w-3.5 h-3.5" /> Copy link
                  </button>
                )}
                {t.active && (
                  <button onClick={() => handleRevoke(t.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors" aria-label="Revoke link">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
