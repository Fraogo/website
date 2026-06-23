'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { adminLogin } from '@/app/actions/auth'
import { Eye, EyeOff, Loader2, Lock, Mail, AlertTriangle } from 'lucide-react'

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(formRef.current!)
    try {
      const result = await adminLogin(formData)
      if (result?.error) setError(result.error)
    } catch {
      // redirect() throws, so success means we got here via catch
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #0E2A82 0%, #070F2B 100%)' }}
    >
      <div className="w-full max-w-sm px-4">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-elevated overflow-hidden">
          {/* Header */}
          <div className="p-8 pb-6 text-center" style={{ background: 'linear-gradient(135deg, #0E2A82, #1B4AD4)' }}>
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white">Admin Login</h1>
            <p className="text-white/60 text-sm mt-1">FRAOGO Internal Panel</p>
          </div>

          {/* Form */}
          <form ref={formRef} onSubmit={handleSubmit} className="p-8 space-y-5">
            <div>
              <label className="form-label" htmlFor="admin-email">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="form-input pl-10"
                  placeholder="admin@fraogo.com"
                />
              </div>
            </div>

            <div>
              <label className="form-label" htmlFor="admin-password">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  className="form-input pl-10 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 rounded-xl text-base disabled:opacity-60"
              id="admin-login-btn"
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>

            <Link href="/admin/forgot-password" className="block text-center text-sm font-semibold text-[#1B4AD4] hover:underline">
              Forgot password?
            </Link>
          </form>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          This panel is for FRAOGO staff only
        </p>
      </div>
    </div>
  )
}
