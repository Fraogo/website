'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard, Package, Truck, MoveRight, ShoppingBag, Users,
  UserCheck, FileText, LogOut, Menu, X, ChevronRight, MapPin,
  MessageSquare, BookOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { adminLogout } from '@/app/actions/auth'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  exact?: boolean
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard',   href: '/admin',               icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: 'Requests',
    items: [
      { label: 'Procurement', href: '/admin/orders',         icon: Package },
      { label: 'Logistics',   href: '/admin/deliveries',     icon: Truck },
      { label: 'Relocations', href: '/admin/relocations',    icon: MoveRight },
      { label: 'Supply Orders',href: '/admin/supply-orders', icon: ShoppingBag },
    ],
  },
  {
    label: 'Vendors & Services',
    items: [
      { label: 'Vendors',          href: '/admin/vendors',          icon: Users },
      { label: 'Vendor Requests',  href: '/admin/vendor-requests',  icon: UserCheck },
    ],
  },
  {
    label: 'Operations',
    items: [
      { label: 'Order Tracking',   href: '/admin/tracking',   icon: MapPin },
      { label: 'Contact Messages', href: '/admin/contacts',   icon: MessageSquare },
      { label: 'Blog Posts',       href: '/admin/blog',       icon: BookOpen },
      { label: 'Invoice Generator',href: '/admin/invoice',    icon: FileText },
    ],
  },
]

interface SidebarContentProps {
  pathname: string
  setMobileOpen: (open: boolean) => void
  handleLogout: () => void
}

const SidebarContent = ({ pathname, setMobileOpen, handleLogout }: SidebarContentProps) => {
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)
  const [logoError, setLogoError] = useState(false)

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10 flex-shrink-0">
        <Link href="/" className="flex items-center gap-2.5">
          {logoError ? (
            <span className="flex items-center gap-1.5">
              <span className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-white font-black text-xs">F</span>
              <span className="text-white font-black text-base">FRAOGO</span>
            </span>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/logo/logo-white.png"
              alt="Fraogo"
              width={100}
              height={30}
              className="object-contain"
              onError={() => setLogoError(true)}
            />
          )}
        </Link>
        <p className="text-white/40 text-xs mt-1 pl-0.5">Admin Panel</p>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-4 px-3">
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-2 px-3">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all',
                    isActive(item.href, item.exact)
                      ? 'bg-white text-[#0E2A82] shadow-soft'
                      : 'text-white/65 hover:text-white hover:bg-white/10'
                  )}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {isActive(item.href, item.exact) && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10 flex-shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white/60 hover:text-white hover:bg-white/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  )
}

export default function AdminSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => { await adminLogout() }

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-64 fixed left-0 top-0 h-screen"
        style={{ background: 'linear-gradient(180deg, #0E2A82 0%, #070F2B 100%)' }}
      >
        <SidebarContent pathname={pathname} setMobileOpen={setMobileOpen} handleLogout={handleLogout} />
      </aside>

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-elevated"
        style={{ background: '#1B4AD4' }}
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside
            className="relative w-72 h-full flex flex-col animate-slide-in-right"
            style={{ background: 'linear-gradient(180deg, #0E2A82 0%, #070F2B 100%)' }}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white z-10"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent pathname={pathname} setMobileOpen={setMobileOpen} handleLogout={handleLogout} />
          </aside>
        </div>
      )}
    </>
  )
}
