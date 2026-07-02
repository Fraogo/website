import type { Metadata } from 'next'
import { Settings as SettingsIcon } from 'lucide-react'
import ChangePasswordForm from '@/components/admin/ChangePasswordForm'

export const metadata: Metadata = { title: 'Settings — Admin' }
export const dynamic = 'force-dynamic'

export default function AdminSettingsPage() {
  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#EEF2FF' }}>
          <SettingsIcon className="w-5 h-5" style={{ color: '#1B4AD4' }} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Settings</h1>
          <p className="text-sm text-gray-400">Manage your admin account</p>
        </div>
      </div>

      <ChangePasswordForm />
    </div>
  )
}
