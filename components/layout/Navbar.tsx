'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, MapPin, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  {
    label: 'Procurement',
    children: [
      { label: 'Nigeria Orders',      href: '/procurement/nigeria',       description: 'Source products within Nigeria' },
      { label: 'International Orders', href: '/procurement/international',  description: 'Import from anywhere in the world' },
    ],
  },
  {
    label: 'Logistics',
    children: [
      { label: 'Send Abroad',     href: '/logistics/delivery',   description: 'Ship items internationally' },
      { label: 'Local Transport', href: '/logistics/relocation', description: 'Trucks & freight within Nigeria' },
    ],
  },
  {
    label: 'Services',
    children: [
      { label: 'Browse & Hire', href: '/general-service/rental', description: 'Find vendors for events & projects' },
      { label: 'Supply Orders', href: '/general-service/supply', description: 'Bulk supplies delivered to you' },
    ],
  },
]

const simpleLinks = [
  { label: 'About',   href: '/about' },
  { label: 'Blog',    href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen]     = useState(false)
  const [scrolled, setScrolled]         = useState(false)
  const pathname = usePathname()
  const navRef   = useRef<HTMLElement>(null)
  const prevPath = useRef(pathname)

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

  const linkClass = cn(
    'px-3 py-2 rounded-lg text-sm font-semibold transition-colors',
    solidBg ? 'text-gray-700 hover:text-[#1B4AD4] hover:bg-blue-50' : 'text-white/90 hover:text-white hover:bg-white/10'
  )

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        solidBg ? 'bg-white/95 backdrop-blur-md shadow-soft border-b border-gray-100' : 'bg-transparent'
      )}
    >
      <nav ref={navRef} className="section-container">
        <div className="flex items-center justify-between h-16 lg:h-[4.25rem]">

          {/* ── Logo: icon mark (SVG) + wordmark in the brand font ── */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={solidBg ? '/logo/icon.svg' : '/logo/icon-white.svg'}
              alt="Fraogo"
              className="h-7 w-auto"
            />
            <span className={cn('text-xl font-black tracking-tight', solidBg ? 'text-[#0E2A82]' : 'text-white')}>
              FRAOGO
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                  aria-haspopup="true"
                  aria-expanded={openDropdown === item.label}
                  className={cn(linkClass, 'flex items-center gap-1')}
                >
                  {item.label}
                  <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', openDropdown === item.label && 'rotate-180')} />
                </button>

                {/* Dropdown — pt-2 makes a hover bridge so it doesn't flicker */}
                {openDropdown === item.label && (
                  <div className="absolute top-full left-0 pt-2 min-w-[16rem] z-50">
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-[0_12px_40px_rgba(7,15,43,0.14)]">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="group/item block px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-blue-50 transition-colors"
                        >
                          <span className="flex items-center justify-between font-semibold text-sm text-gray-800 group-hover/item:text-[#1B4AD4]">
                            {child.label}
                            <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all text-[#1B4AD4]" />
                          </span>
                          <span className="block text-xs text-gray-400 mt-0.5">{child.description}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {simpleLinks.map((l) => (
              <Link key={l.href} href={l.href} className={linkClass}>{l.label}</Link>
            ))}
          </div>

          {/* ── Right side ── */}
          <div className="flex items-center gap-2 lg:gap-3">
            <Link
              href="/track"
              className={cn(
                'hidden lg:flex items-center gap-1.5 text-sm font-semibold transition-colors',
                solidBg ? 'text-gray-600 hover:text-[#1B4AD4]' : 'text-white/80 hover:text-white'
              )}
            >
              <MapPin className="w-4 h-4" />
              Track
            </Link>

            <Link
              href="/procurement/nigeria"
              className={cn(
                'hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all',
                solidBg
                  ? 'bg-[#1B4AD4] text-white hover:bg-[#2A5EE8] shadow-sm'
                  : 'bg-white text-[#1B4AD4] hover:bg-blue-50'
              )}
            >
              Start an Order
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Mobile burger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn(
                'lg:hidden p-2 rounded-lg transition-colors',
                solidBg ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              )}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 pb-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="py-2 space-y-0.5">
              {navItems.map((item) => (
                <div key={item.label}>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                    aria-haspopup="true"
                    aria-expanded={openDropdown === item.label}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-blue-50 hover:text-[#1B4AD4] transition-colors"
                  >
                    {item.label}
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

              {simpleLinks.map((l) => (
                <Link key={l.href} href={l.href} className="flex items-center px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-blue-50 hover:text-[#1B4AD4] transition-colors">
                  {l.label}
                </Link>
              ))}
              <Link href="/track" className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-blue-50 hover:text-[#1B4AD4] transition-colors">
                <MapPin className="w-4 h-4" /> Track Order
              </Link>

              <div className="px-4 pt-3">
                <Link
                  href="/procurement/nigeria"
                  className="btn-primary w-full justify-center py-3 rounded-xl text-sm"
                >
                  Start an Order
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
