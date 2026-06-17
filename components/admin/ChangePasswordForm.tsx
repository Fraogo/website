'use client'

import { useState } from 'react'
import { Lock, Loader2, CheckCircle2, Eye, EyeOff } from 'lucide-react'
import { changeAdminPassword } from '@/app/actions/auth'

export default function ChangePasswordForm() {
  const [current, setCurrent] = useState('')
  const [next, setNext]       = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow]       = useState(false)
  const [status, setStatus]   = useState<'idle' | 'loading' | 'success'>('idle')
  const [error, setError]     = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (next !== confirm) { setError('New passwords do not match.'); return }
    setStatus('loading')
    const res = await changeAdminPassword(current, next)
    if (res.success) {
      setStatus('success')
      setCurrent(''); setNext(''); setConfirm('')
    } else {
      setStatus('idle')
      setError(res.error ?? 'Something went wrong.')
    }
  }

  const inputType = show ? 'text' : 'password'

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
      <div className="flex items-center gap-2 mb-1">
        <Lock className="w-4 h-4 text-[#1B4AD4]" />
        <h2 className="font-bold text-gray-900">Change Password</h2>
      </div>
      <p className="text-sm text-gray-400 mb-6">Update the password you use to sign in to the admin panel.</p>

      {status === 'success' && (
        <div className="flex items-center gap-2 p-3 mb-5 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> Password updated. Use the new one next time you sign in.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="form-label" htmlFor="current-password">Current Password</label>
          <input id="current-password" type={inputType} required autoComplete="current-password"
            className="form-input" value={current} onChange={(e) => setCurrent(e.target.value)} />
        </div>
        <div>
          <label className="form-label" htmlFor="new-password">New Password <span className="text-gray-400 font-normal">(min 8 characters)</span></label>
          <input id="new-password" type={inputType} required autoComplete="new-password"
            className="form-input" value={next} onChange={(e) => setNext(e.target.value)} />
        </div>
        <div>
          <label className="form-label" htmlFor="confirm-password">Confirm New Password</label>
          <input id="confirm-password" type={inputType} required autoComplete="new-password"
            className="form-input" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer select-none">
          <button type="button" onClick={() => setShow((s) => !s)} className="text-gray-400 hover:text-gray-600">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          Show passwords
        </label>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
        )}

        <button type="submit" disabled={status === 'loading'} className="btn-primary w-full py-3 rounded-xl text-sm disabled:opacity-60">
          {status === 'loading'
            ? <span className="flex items-center gap-2 justify-center"><Loader2 className="w-4 h-4 animate-spin" /> Updating…</span>
            : 'Update Password'}
        </button>
      </form>
    </div>
  )
}
