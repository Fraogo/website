import { verifyAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { default: 'Admin Panel', template: '%s | FRAOGO Admin' },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await verifyAdminSession()
  if (!session) redirect('/admin/login')

  return (
    <div className="min-h-screen flex" style={{ background: '#f1f5f9' }}>
      <AdminSidebar />
      <div className="flex-1 ml-0 lg:ml-64 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
          {children}
        </div>
      </div>
    </div>
  )
}
