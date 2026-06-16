import { prisma } from '@/lib/db'
import { Package, Truck, MoveRight, ShoppingBag, Users, UserCheck, Clock, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { formatDateTime } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin Dashboard' }
export const dynamic = 'force-dynamic'

async function getDashboardStats() {
  const [
    pendingOrders,
    deliveries,
    relocations,
    supplyOrders,
    pendingVendors,
    activeVendors,
    vendorRequests,
  ] = await Promise.all([
    prisma.procurementOrder.count({ where: { status: 'pending' } }),
    prisma.deliveryRequest.count({ where: { status: 'pending' } }),
    prisma.relocationRequest.count({ where: { status: 'pending' } }),
    prisma.supplyOrder.count({ where: { status: 'pending' } }),
    prisma.vendor.count({ where: { status: 'pending_review' } }),
    prisma.vendor.count({ where: { status: 'active' } }),
    prisma.vendorRequest.count({ where: { status: 'pending' } }),
  ])
  return { pendingOrders, deliveries, relocations, supplyOrders, pendingVendors, activeVendors, vendorRequests }
}

async function getRecentActivity() {
  const [orders, deliveries] = await Promise.all([
    prisma.procurementOrder.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, customerName: true, type: true, status: true, createdAt: true } }),
    prisma.deliveryRequest.findMany({ take: 3, orderBy: { createdAt: 'desc' }, select: { id: true, senderName: true, type: true, status: true, createdAt: true } }),
  ])
  return { orders, deliveries }
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats()
  const recent = await getRecentActivity()

  const statCards = [
    { label: 'Pending Orders',      value: stats.pendingOrders,  icon: Package,    href: '/admin/orders',           color: '#0E2A82', bg: '#EEF2FF' },
    { label: 'Pending Deliveries',  value: stats.deliveries,     icon: Truck,      href: '/admin/deliveries',       color: '#1B4AD4', bg: '#EEF2FF' },
    { label: 'Relocations',         value: stats.relocations,    icon: MoveRight,  href: '/admin/relocations',      color: '#2A5EE8', bg: '#EEF2FF' },
    { label: 'Supply Orders',       value: stats.supplyOrders,   icon: ShoppingBag,href: '/admin/supply-orders',    color: '#1B4AD4', bg: '#EEF2FF' },
    { label: 'Vendor Applications', value: stats.pendingVendors, icon: Users,      href: '/admin/vendors',          color: '#dc2626', bg: '#fef2f2' },
    { label: 'Active Vendors',      value: stats.activeVendors,  icon: UserCheck,  href: '/admin/vendors',          color: '#059669', bg: '#f0fdf4' },
    { label: 'Vendor Requests',     value: stats.vendorRequests, icon: TrendingUp, href: '/admin/vendor-requests',  color: '#0891b2', bg: '#ecfeff' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of all FRAOGO operations · Updated just now
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-2xl p-5 shadow-soft border border-border card-hover"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: stat.bg }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <span className="text-xs font-semibold text-gray-400">Pending</span>
            </div>
            <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
            <div className="text-xs font-semibold text-gray-500">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-soft border border-border overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-4 h-4" style={{ color: '#0E2A82' }} />
              Recent Procurement Orders
            </h2>
            <Link href="/admin/orders" className="text-xs font-semibold hover:underline" style={{ color: '#0E2A82' }}>View all</Link>
          </div>
          {recent.orders.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-400">No orders yet</div>
          ) : (
            <div className="divide-y divide-border">
              {recent.orders.map((order: any) => (
                <div key={order.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div>
                    <div className="font-semibold text-sm text-gray-900">{order.customerName}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {formatDateTime(order.createdAt)}
                      <span className="mx-1">·</span>
                      {order.type === 'nigeria' ? '🇳🇬' : '🌍'} {order.type}
                    </div>
                  </div>
                  <span className={`status-badge ${order.status === 'pending' ? 'bg-amber-100 text-amber-800' : order.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-blue-100 text-blue-800'}`}>
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Deliveries */}
        <div className="bg-white rounded-2xl shadow-soft border border-border overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Truck className="w-4 h-4" style={{ color: '#1d4ed8' }} />
              Recent Deliveries
            </h2>
            <Link href="/admin/deliveries" className="text-xs font-semibold text-blue-700 hover:underline">View all</Link>
          </div>
          {recent.deliveries.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-400">No deliveries yet</div>
          ) : (
            <div className="divide-y divide-border">
              {recent.deliveries.map((delivery: any) => (
                <div key={delivery.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <div className="font-semibold text-sm text-gray-900">{delivery.senderName}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {formatDateTime(delivery.createdAt)}
                      <span className="mx-1">·</span>
                      {delivery.type}
                    </div>
                  </div>
                  <span className={`status-badge ${delivery.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                    {delivery.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

