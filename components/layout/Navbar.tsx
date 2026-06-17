'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, Package, Truck, Wrench, MapPin, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  {
    label: 'Procurement',
    icon: Package,
    children: [
      { label: 'Nigeria Orders',       href: '/procurement/nigeria',       description: 'Source products within Nigeria' },
      { label: 'International Orders', href: '/procurement/international', description: 'Import from anywhere in the world' },
    ],
  },
  {
    label: 'Logistics',
    icon: Truck,
    children: [
      { label: 'Send Abroad',      href: '/logistics/delivery',    description: 'Ship items internationally' },
      { label: 'Local Transport',  href: '/logistics/relocation',  description: 'Trucks & freight within Nigeria' },
    ],
  },
  {
    label: 'Services',
    icon: Wrench,
    children: [
      { label: 'Browse & Hire',  href: '/general-service/rental', description: 'Find vendors for events & projects' },
      { label: 'Supply Orders',  href: '/general-service/supply', description: 'Bulk supplies delivered to you' },
    ],
  },
]

function DropdownMenu({ items, isOpen }: { items: typeof navItems[0]['children']; isOpen: boolean }) {
  if (!isOpen) return null
  return (
    <div className="nav-dropdown">
      {items.map((item) => (
        <Link key={item.href} href={item.href} className="nav-dropdown-item">
          <span className="font-semibold text-sm">{item.label}</span>
          <span className="text-xs text-gray-400 mt-0.5">{item.description}</span>
        </Link>
      ))}
    </div>
  )
}

export default function Navbar() {
  const [openDropdown, setOpenDropdown]   = useState<string | null>(null)
  const [mobileOpen, setMobileOpen]       = useState(false)
  const [scrolled, setScrolled]           = useState(false)
  const [logoError, setLogoError]         = useState(false)
  const pathname  = usePathname()
  const navRef    = useRef<HTMLDivElement>(null)
  const prevPath  = useRef(pathname)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (prevPath.current !== pathname) {
      setMobileOpen(false)
      setOpenDropdown(null)
      prevPath.current = pathname
    }
  }, [pathname])

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenDropdown(null)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [])

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const isAdminPage = pathname.startsWith('/admin')
  const solidBg = scrolled || isAdminPage || mobileOpen

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        solidBg
          ? 'bg-white/97 backdrop-blur-md shadow-soft border-b border-gray-100'
          : 'bg-transparent'
      )}
    >
      <nav ref={navRef} className="section-container">
        <div className="flex items-center justify-between h-16 lg:h-[4.25rem]">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            {logoError ? (
              <span className={cn('flex items-center gap-2', solidBg ? 'text-[#0E2A82]' : 'text-white')}>
                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm" style={{ background: 'linear-gradient(135deg, #0E2A82, #1B4AD4)' }}>F</span>
                <span className="text-xl font-black tracking-tight">FRAOGO</span>
              </span>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={solidBg ? '/logo/logo.png' : '/logo/logo-white.png'}
                alt="Fraogo"
                width={120}
                height={36}
                className="object-contain h-9"
                onError={() => setLogoError(true)}
              />
            )}
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => (
              <div key={item.label} className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                  aria-haspopup="true"
                  aria-expanded={openDropdown === item.label}
                  className={cn(
                    'flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150',
                    solidBg
                      ? 'text-gray-700 hover:text-[#1B4AD4] hover:bg-blue-50'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                  <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', openDropdown === item.label && 'rotate-180')} />
                </button>
                <DropdownMenu items={item.children} isOpen={openDropdown === item.label} />
              </div>
            ))}

            <Link
              href="/about"
              className={cn(
                'px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150',
                solidBg ? 'text-gray-700 hover:text-[#1B4AD4] hover:bg-blue-50' : 'text-white/90 hover:text-white hover:bg-white/10'
              )}
            >
              About
            </Link>

            <Link
              href="/contact"
              className={cn(
                'px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150',
                solidBg ? 'text-gray-700 hover:text-[#1B4AD4] hover:bg-blue-50' : 'text-white/90 hover:text-white hover:bg-white/10'
              )}
            >
              Contact
            </Link>
          </div>

          {/* ── Right side ── */}
          <div className="flex items-center gap-2">
            {/* Track Order */}
            <Link
              href="/track"
              className={cn(
                'hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border transition-all',
                solidBg
                  ? 'border-[#1B4AD4] text-[#1B4AD4] hover:bg-[#1B4AD4] hover:text-white'
                  : 'border-white/50 text-white hover:bg-white hover:text-[#1B4AD4]'
              )}
            >
              <MapPin className="w-3.5 h-3.5" />
              Track Order
            </Link>

            {/* Admin (subtle) */}
            <Link
              href="/admin/login"
              className={cn(
                'hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border',
                solidBg
                  ? 'text-gray-400 border-gray-200 hover:text-gray-600'
                  : 'text-white/40 border-white/10 hover:text-white/70'
              )}
            >
              <Settings className="w-3 h-3" />
              Admin
            </Link>

            {/* Mobile burger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn(
                'lg:hidden p-2 rounded-lg transition-colors',
                solidBg ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              )}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 pb-4">
            <div className="py-2 space-y-0.5">
              {navItems.map((item) => (
                <div key={item.label}>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                    aria-haspopup="true"
                    aria-expanded={openDropdown === item.label}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-blue-50 hover:text-[#1B4AD4] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </span>
                    <ChevronDown className={cn('w-4 h-4 transition-transform', openDropdown === item.label && 'rotate-180')} />
                  </button>
                  {openDropdown === item.label && (
                    <div className="bg-blue-50/60 border-l-2 border-[#1B4AD4] ml-4 rounded-r-lg">
                      {item.children.map((child) => (
                        <Link key={child.href} href={child.href} className="block px-4 py-2.5 text-sm text-gray-700 hover:text-[#1B4AD4] font-medium">
                          {child.label}
                          <span className="block text-xs text-gray-400 font-normal">{child.description}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <Link href="/about"   className="flex items-center px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-blue-50 hover:text-[#1B4AD4] transition-colors">About Us</Link>
              <Link href="/contact" className="flex items-center px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-blue-50 hover:text-[#1B4AD4] transition-colors">Contact</Link>
              <Link href="/track"   className="flex items-center px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-blue-50 hover:text-[#1B4AD4] transition-colors">
                <MapPin className="w-4 h-4 mr-2" /> Track Order
              </Link>

              <div className="px-4 pt-3 border-t border-gray-100 mt-1">
                <Link href="/admin/login" className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-2">
                  <Settings className="w-3.5 h-3.5" /> Admin Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
