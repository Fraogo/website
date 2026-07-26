import Link from 'next/link'
import { ArrowRight, ShoppingBag, Truck, Store, ShieldCheck, CheckCircle2, FileText } from 'lucide-react'
import type { Metadata } from 'next'
import { company } from '@/content'
import { getActiveVendors } from '@/app/actions/vendor'
import VendorCard from '@/components/vendor/VendorCard'

export const metadata: Metadata = {
  title: `${company.name} — Source Products, Ship Freight & Hire Verified Sellers`,
  description: company.heroSubtext,
}

const services = [
  {
    number: '01',
    title: 'Product Sourcing & Procurement',
    tagline: 'Local & Global Sourcing',
    description:
      'Tell us what product or equipment you need — from any market in Nigeria or anywhere worldwide. We source it, verify quality, handle paperwork, and deliver directly to you.',
    image: '/images/services/procurement.jpg',
    links: [
      { label: 'Sourcing in Nigeria',       href: '/procurement/nigeria' },
      { label: 'Global Sourcing (Import)', href: '/procurement/international' },
    ],
    overlayColor: 'rgba(14,42,130,0.70)',
    bgFallback: '#0E2A82',
  },
  {
    number: '02',
    title: 'Freight & Shipping Logistics',
    tagline: 'Cargo, Freight & Transport',
    description:
      'Ship items internationally or transport heavy cargo across Nigeria. We coordinate reliable air freight, sea freight, and local vehicle transport with end-to-end tracking.',
    image: '/images/services/logistics.jpg',
    links: [
      { label: 'Ship Abroad',          href: '/logistics/delivery' },
      { label: 'Local Transport & Move', href: '/logistics/relocation' },
    ],
    overlayColor: 'rgba(5,14,50,0.72)',
    bgFallback: '#070F2B',
  },
  {
    number: '03',
    title: 'Verified Sellers & Marketplace',
    tagline: 'Products & Vetted Professionals',
    description:
      'Browse verified sellers for solar kits, tech gadgets, event spaces, catering, and business supplies. Book with confidence under Fraogo 100% payment protection.',
    image: '/images/services/general.jpg',
    links: [
      { label: 'Browse Marketplace', href: '/general-service/rental/hire-vendor' },
      { label: 'Order Bulk Supply',  href: '/general-service/supply' },
    ],
    overlayColor: 'rgba(27,74,212,0.65)',
    bgFallback: '#1B4AD4',
  },
]

const VENDOR_CATEGORIES = ['All', 'Solar & Energy', 'Event Space', 'Protocol Service', 'Catering & Small Chops', 'Make Up', 'Gadgets']

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Select or Request',
    description: 'Pick a verified product or seller from our marketplace, or fill out a 1-minute sourcing/shipping request.',
    icon: FileText,
  },
  {
    step: '02',
    title: 'Get Transparent Quote',
    description: 'We confirm total costs, specs, and delivery dates upfront with zero hidden fees and no upfront payment obligation.',
    icon: CheckCircle2,
  },
  {
    step: '03',
    title: '100% Protected Delivery',
    description: 'Fraogo manages the supplier, handles shipping, or holds vendor payments in escrow until delivery is complete.',
    icon: ShieldCheck,
  },
]

export default async function HomePage() {
  const allVendors = await getActiveVendors()
  const previewVendors = allVendors.slice(0, 6)

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════
          HERO — High Impact & Action Launcher
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-28"
        style={{ background: 'linear-gradient(160deg, #070F2B 0%, #0E2A82 55%, #1B4AD4 100%)' }}
      >
        {/* Background photo & overlays */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25"
          style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(7,15,43,0.85) 0%, rgba(7,15,43,0.95) 100%)' }}
        />

        <div className="section-container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-black text-white leading-[1.05] tracking-tight mb-6"
              style={{ fontSize: 'clamp(2.4rem, 6vw, 4.5rem)' }}
            >
              {company.heroHeadlineLines.join(' ')}{' '}
              <span className="block mt-1 text-[#93B4F8]">{company.heroHeadlineAccent}</span>
            </h1>

            <p className="text-white/80 leading-relaxed max-w-2xl mx-auto mb-10 text-base sm:text-lg font-medium">
              {company.heroSubtext}
            </p>

            {/* 3 Quick-Action Launcher Cards */}
            <div className="grid sm:grid-cols-3 gap-4 text-left max-w-3xl mx-auto">
              <Link
                href="/procurement/nigeria"
                className="group p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/20 transition-all hover:-translate-y-1 shadow-lg"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base mb-1 flex items-center justify-between">
                  Source Products
                  <ArrowRight className="w-4 h-4 text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-white/70">Buy items in Nigeria or import globally with ease.</p>
              </Link>

              <Link
                href="/logistics/delivery"
                className="group p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/20 transition-all hover:-translate-y-1 shadow-lg"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Truck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base mb-1 flex items-center justify-between">
                  Ship Cargo
                  <ArrowRight className="w-4 h-4 text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-white/70">Send packages abroad or relocate items locally.</p>
              </Link>

              <Link
                href="/general-service/rental/hire-vendor"
                className="group p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/20 transition-all hover:-translate-y-1 shadow-lg"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Store className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base mb-1 flex items-center justify-between">
                  Browse Sellers
                  <ArrowRight className="w-4 h-4 text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-white/70">Shop solar, tech, or hire vetted event vendors.</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          HOW IT WORKS — 3 Simple Steps
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 lg:py-24 bg-slate-50 border-b border-gray-100">
        <div className="section-container">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-[#1B4AD4] mb-2">Simple & Transparent</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900">
              How Fraogo Works in 3 Steps
            </h2>
            <p className="text-gray-500 text-sm mt-3">
              We eliminated delays, fake vendors, and hidden fees. Here is how getting things done works on Fraogo.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((hw) => {
              const Icon = hw.icon
              return (
                <div key={hw.step} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-soft relative flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] text-[#1B4AD4] flex items-center justify-center font-bold">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-4xl font-black text-gray-200">{hw.step}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{hw.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{hw.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CORE SERVICES — Procurement, Logistics & Verified Sellers
          ═══════════════════════════════════════════════════════════════ */}
      <div id="services">
        <div className="bg-white py-12 border-b border-gray-100">
          <div className="section-container text-center max-w-2xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest mb-2 text-[#1B4AD4]">Our 3 Pillars</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900">
              Everything Your Business & Household Needs
            </h2>
          </div>
        </div>

        {services.map((svc, i) => (
          <div
            key={svc.title}
            className={`flex flex-col lg:flex-row ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
            style={{ minHeight: '420px' }}
          >
            {/* Photo */}
            <div className="relative h-60 sm:h-72 lg:h-auto lg:w-[45%] overflow-hidden flex-shrink-0">
              <div className="absolute inset-0" style={{ background: svc.bgFallback }} />
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${svc.image}')` }}
              />
              <div className="absolute inset-0" style={{ background: svc.overlayColor }} />
              <div className="absolute bottom-6 left-6 text-white/20 text-7xl sm:text-8xl font-black leading-none select-none">
                {svc.number}
              </div>
            </div>

            {/* Content */}
            <div className={`flex-1 flex items-center px-6 py-12 sm:px-10 lg:px-16 lg:py-16 ${i % 2 === 1 ? 'bg-[#F8FAFC]' : 'bg-white'}`}>
              <div className="max-w-xl w-full">
                <p className="text-xs font-bold uppercase tracking-widest mb-3 text-[#1B4AD4]">
                  {svc.tagline}
                </p>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-4 sm:mb-5">
                  {svc.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-8 text-sm sm:text-base">
                  {svc.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  {svc.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-all hover:shadow-md"
                      style={{ background: '#0E2A82', color: '#ffffff' }}
                    >
                      {link.label}
                      <ArrowRight className="w-4 h-4 flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          VERIFIED MARKETPLACE SHOWCASE
          ═══════════════════════════════════════════════════════════════ */}
      {allVendors.length > 0 && (
        <section className="py-16 sm:py-24 bg-white border-t border-gray-100">
          <div className="section-container">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2 text-[#1B4AD4]">Verified Marketplace</p>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900">
                  Featured Products & Sellers
                </h2>
              </div>
              <Link
                href="/general-service/rental/hire-vendor"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#1B4AD4] hover:underline flex-shrink-0"
              >
                Explore Full Marketplace <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Category filter pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-8 no-scrollbar">
              {VENDOR_CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href={cat === 'All'
                    ? '/general-service/rental/hire-vendor'
                    : `/general-service/rental/hire-vendor?type=${encodeURIComponent(cat)}`}
                  className="px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border border-gray-200 text-gray-600 hover:border-[#0E2A82] hover:text-[#0E2A82] bg-white transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>

            {/* Vendor cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {previewVendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/general-service/rental/hire-vendor"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#0E2A82] text-white font-bold text-sm shadow-md hover:bg-[#1B4AD4] transition-all"
              >
                Browse All Marketplace Listings & Sellers <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TRUST & SAFETY GUARANTEE
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24" style={{ background: '#070F2B' }}>
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <ShieldCheck className="w-14 h-14 text-emerald-400 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-6">
              100% Protected Transactions
            </h2>
            <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-10">
              When you order sourcing, logistics, or hire a vendor through Fraogo, your money and request are protected. We hold vendor funds in escrow and verify quality before final settlement.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 text-left border-t border-white/10 pt-10">
              <div>
                <h4 className="font-bold text-white text-base mb-1">CAC Registered</h4>
                <p className="text-xs text-white/60">Fully registered in Nigeria under RC8967311 for peace of mind.</p>
              </div>
              <div>
                <h4 className="font-bold text-white text-base mb-1">Escrow Protection</h4>
                <p className="text-xs text-white/60">Payments are safely managed through Fraogo until service delivery.</p>
              </div>
              <div>
                <h4 className="font-bold text-white text-base mb-1">24/7 Dedicated Support</h4>
                <p className="text-xs text-white/60">Direct contact via WhatsApp, phone, and email for every order.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
