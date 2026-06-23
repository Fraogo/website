'use client'

import { useState } from 'react'
import Link from 'next/link'
import { requestAdminPasswordReset, resetAdminPasswordWithCode } from '@/app/actions/auth'
import { Eye, EyeOff, Loader2, Lock, Mail, KeyRound, AlertTriangle, CheckCircle2, ArrowLeft } from 'lucide-react'

export default function AdminForgotPasswordPage() {
  const [phase, setPhase] = useState<'request' | 'reset' | 'done'>('request')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleRequest(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const res = await requestAdminPasswordReset(email)
    setLoading(false)
    if (res.success) setPhase('reset')
    else setError(res.error ?? 'Something went wrong.')
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    const res = await resetAdminPasswordWithCode(email, code, password)
    setLoading(false)
    if (res.success) setPhase('done')
    else setError(res.error ?? 'Something went wrong.')
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #0E2A82 0%, #070F2B 100%)' }}
    >
      <div className="w-full max-w-sm px-4">
        <div className="bg-white rounded-2xl shadow-elevated overflow-hidden">
          {/* Header */}
          <div className="p-8 pb-6 text-center" style={{ background: 'linear-gradient(135deg, #0E2A82, #1B4AD4)' }}>
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3">
              <KeyRound className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white">Reset Password</h1>
            <p className="text-white/60 text-sm mt-1">FRAOGO Admin Recovery</p>
          </div>

          <div className="p-8">
            {phase === 'request' && (
              <form onSubmit={handleRequest} className="space-y-5">
                <p className="text-sm text-gray-500">
                  Enter your admin email. We&apos;ll send a 6-digit reset code to the FRAOGO admin inbox.
                </p>
                <div>
                  <label className="form-label" htmlFor="reset-email">Admin Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      id="reset-email"
                      type="email"
                      required
                      autoComplete="email"
                      className="form-input pl-10"
                      placeholder="admin@fraogo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {error && <ErrorBox msg={error} />}

                <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 rounded-xl text-base disabled:opacity-60">
                  {loading
                    ? <span className="flex items-center gap-2 justify-center"><Loader2 className="w-4 h-4 animate-spin" /> Sending…</span>
                    : 'Send Reset Code'}
                </button>
              </form>
            )}

            {phase === 'reset' && (
              <form onSubmit={handleReset} className="space-y-5">
                <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl text-sm text-[#0E2A82]">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  If that email is the admin&apos;s, a 6-digit code is on its way to the FRAOGO inbox. Enter it below.
                </div>

                <div>
                  <label className="form-label" htmlFor="reset-code">6-Digit Code</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      id="reset-code"
                      inputMode="numeric"
                      required
                      maxLength={6}
                      className="form-input pl-10 tracking-[0.4em] font-bold"
                      placeholder="000000"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label" htmlFor="reset-password">New Password <span className="text-gray-400 font-normal">(min 8)</span></label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      id="reset-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      className="form-input pl-10 pr-10"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="form-label" htmlFor="reset-confirm">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      id="reset-confirm"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      className="form-input pl-10"
                      placeholder="••••••••"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                    />
                  </div>
                </div>

                {error && <ErrorBox msg={error} />}

                <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 rounded-xl text-base disabled:opacity-60">
                  {loading
                    ? <span className="flex items-center gap-2 justify-center"><Loader2 className="w-4 h-4 animate-spin" /> Resetting…</span>
                    : 'Reset Password'}
                </button>

                <button type="button" onClick={() => { setPhase('request'); setError(null) }}
                  className="text-xs text-gray-400 hover:text-gray-600 w-full text-center">
                  Didn&apos;t get a code? Start over
                </button>
              </form>
            )}

            {phase === 'done' && (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-7 h-7 text-green-600" />
                </div>
                <h2 className="font-black text-gray-900 mb-1">Password updated</h2>
                <p className="text-sm text-gray-500 mb-6">You can now sign in with your new password.</p>
                <Link href="/admin/login" className="btn-primary w-full py-3 rounded-xl text-sm">Go to Login</Link>
              </div>
            )}
          </div>
        </div>

        <Link href="/admin/login" className="flex items-center justify-center gap-1.5 text-white/40 hover:text-white/70 text-xs mt-6 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to login
        </Link>
      </div>
    </div>
  )
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
      {msg}
    </div>
  )
}
