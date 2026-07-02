import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import { company } from '@/content'
import { getActiveVendors } from '@/app/actions/vendor'
import VendorCard from '@/components/vendor/VendorCard'

export const metadata: Metadata = {
  title: `${company.name} — Procurement, Logistics & General Services`,
  description: company.heroSubtext,
}

const services = [
  {
    number: '01',
    title: 'Procurement',
    tagline: 'Local & International Sourcing',
    description:
      'Tell us what you need — from any market in Nigeria or anywhere in the world. We source it, handle the paperwork, and get it to you.',
    image: '/images/services/procurement.jpg',
    links: [
      { label: 'Nigeria Orders',       href: '/procurement/nigeria' },
      { label: 'International Orders', href: '/procurement/international' },
    ],
    overlayColor: 'rgba(14,42,130,0.70)',
    bgFallback: '#0E2A82',
  },
  {
    number: '02',
    title: 'Logistics',
    tagline: 'Freight & Transport',
    description:
      'Need to ship something internationally or move cargo across Nigeria? We coordinate the right transport solution for your goods.',
    image: '/images/services/logistics.jpg',
    links: [
      { label: 'Send Abroad',     href: '/logistics/delivery' },
      { label: 'Local Transport', href: '/logistics/relocation' },
    ],
    overlayColor: 'rgba(5,14,50,0.72)',
    bgFallback: '#070F2B',
  },
  {
    number: '03',
    title: 'General Services',
    tagline: 'Vendors & Supplies',
    description:
      'Browse verified vendors for events and projects, or order bulk supplies. Find trusted professionals for what your business needs.',
    image: '/images/services/general.jpg',
    links: [
      { label: 'Browse & Hire Vendors', href: '/general-service/rental' },
      { label: 'Supply Orders',         href: '/general-service/supply' },
    ],
    overlayColor: 'rgba(27,74,212,0.65)',
    bgFallback: '#1B4AD4',
  },
]

const VENDOR_CATEGORIES = ['All', 'Event Space', 'Protocol Service', 'Catering & Small Chops', 'Make Up', 'Gadgets', 'Other']

export default async function HomePage() {
  const allVendors = await getActiveVendors()
  const previewVendors = allVendors.slice(0, 6)

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════
          HERO — Full-bleed, text bottom-left
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative flex items-end overflow-hidden"
        style={{ height: '100svh', minHeight: '580px', maxHeight: '960px' }}
      >
        {/* Gradient fallback */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(160deg, #070F2B 0%, #0E2A82 50%, #1B4AD4 100%)' }}
        />
        {/* Photo layer */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
        />
        {/* Bottom-up dark gradient for text readability */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(7,15,43,0.97) 0%, rgba(7,15,43,0.75) 30%, rgba(7,15,43,0.30) 60%, rgba(7,15,43,0.05) 100%)' }}
        />

        <div className="section-container relative z-10 w-full pb-14 sm:pb-18 lg:pb-24">
          <div className="max-w-3xl">
            <p className="text-blue-300 text-xs font-semibold uppercase tracking-widest mb-5 sm:mb-6">
              {company.heroEyebrow}
            </p>

            <h1 className="font-black text-white leading-[1.0] tracking-tight mb-6 sm:mb-7"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)' }}
            >
              {company.heroHeadlineLines.map((line) => (
                <span key={line}>{line}<br /></span>
              ))}
              <span style={{ color: '#93B4F8' }}>{company.heroHeadlineAccent}</span>
            </h1>

            <p className="text-white/55 leading-relaxed mb-8 sm:mb-10 max-w-xl"
              style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.125rem)' }}
            >
              {company.heroSubtext}
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
              <Link
                href="/procurement/nigeria"
                className="btn-white text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold inline-flex items-center gap-2"
              >
                Start an Order
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link
                href="#services"
                className="inline-flex items-center gap-2 text-white/65 font-semibold text-sm sm:text-base hover:text-white transition-colors py-3.5 sm:py-4"
              >
                Our Services
                <span className="rotate-90 inline-block leading-none">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SERVICES — Alternating full-width strips
          ═══════════════════════════════════════════════════════════════ */}
      <div id="services">
        <div className="bg-white py-10 lg:py-14 border-b border-gray-100">
          <div className="section-container">
            <p className="text-xs font-bold uppercase tracking-widest mb-2 text-[#1B4AD4]">What We Do</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900">
              Three services. One partner.
            </h2>
          </div>
        </div>

        {services.map((svc, i) => (
          <div
            key={svc.title}
            className={`flex flex-col lg:flex-row ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
            style={{ minHeight: '400px' }}
          >
            {/* Photo */}
            <div className="relative h-56 sm:h-72 lg:h-auto lg:w-[42%] overflow-hidden flex-shrink-0">
              <div className="absolute inset-0" style={{ background: svc.bgFallback }} />
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${svc.image}')` }}
              />
              <div className="absolute inset-0" style={{ background: svc.overlayColor }} />
              <div className="absolute bottom-4 left-5 text-white/15 text-6xl sm:text-7xl font-black leading-none select-none">
                {svc.number}
              </div>
            </div>

            {/* Text */}
            <div className={`flex-1 flex items-center px-6 py-10 sm:px-8 lg:px-14 lg:py-14 ${i % 2 === 1 ? 'bg-[#F5F7FF]' : 'bg-white'}`}>
              <div className="max-w-xl w-full">
                <p className="text-xs font-bold uppercase tracking-widest mb-3 text-[#1B4AD4]">
                  {svc.tagline}
                </p>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-4 sm:mb-5">
                  {svc.title}
                </h3>
                <p className="text-gray-500 leading-relaxed mb-7 sm:mb-8 text-sm sm:text-[15px]">
                  {svc.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  {svc.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-xl text-sm font-bold transition-all hover:shadow-md"
                      style={{ background: '#EEF2FF', color: '#1B4AD4' }}
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
          VENDORS — Preview strip
          ═══════════════════════════════════════════════════════════════ */}
      {allVendors.length > 0 && (
        <section className="py-16 sm:py-24 bg-white border-t border-gray-100">
          <div className="section-container">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2 text-[#1B4AD4]">Vendors & Sellers</p>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900">
                  Browse what's available
                </h2>
              </div>
              <Link
                href="/general-service/rental/hire-vendor"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#1B4AD4] hover:underline flex-shrink-0"
              >
                See all vendors <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Category filter — links, no JS state needed */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-8 no-scrollbar">
              {VENDOR_CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href={cat === 'All'
                    ? '/general-service/rental/hire-vendor'
                    : `/general-service/rental/hire-vendor?type=${encodeURIComponent(cat)}`}
                  className="px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap border border-gray-200 text-gray-600 hover:border-[#0E2A82] hover:text-[#0E2A82] bg-white transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>

            {/* Vendor cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {previewVendors.map((vendor: any) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>

            {/* Footer row */}
            <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <Link
                href="/general-service/rental/hire-vendor"
                className="btn-primary px-6 py-3 rounded-xl text-sm inline-flex items-center gap-2"
              >
                Browse all vendors & sellers <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/general-service/rental/register-vendor"
                className="text-sm text-gray-400 hover:text-[#1B4AD4] font-semibold transition-colors"
              >
                Are you a vendor? Register here →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          ABOUT — Dark editorial section, no RC number
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 lg:py-32" style={{ background: '#070F2B' }}>
        <div className="section-container">
          <div className="max-w-3xl">
            <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-6 sm:mb-8">
              Who We Are
            </p>
            <p className="text-white font-bold leading-[1.6]"
              style={{ fontSize: 'clamp(1.1rem, 3vw, 1.75rem)' }}
            >
              Fraogo is a Nigerian company dedicated to making procurement, logistics,
              and service access simple and reliable. We source products, coordinate
              shipments, and connect you with trusted vendors — handling the hard parts
              so your business keeps moving.
            </p>
            <div className="mt-8 sm:mt-10 pt-8 sm:pt-10 border-t border-white/10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-blue-300 font-semibold text-sm hover:text-white transition-colors"
              >
                About Fraogo
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-white/40 font-semibold text-sm hover:text-white/70 transition-colors"
              >
                Get in touch
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CTA BANNER
          ═══════════════════════════════════════════════════════════════ */}
      <section
        className="relative py-20 sm:py-28 lg:py-36 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #070F2B 0%, #0E2A82 60%, #1B4AD4 100%)' }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/cta-bg.jpg')" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(7,15,43,0.92) 0%, rgba(14,42,130,0.82) 60%, rgba(27,74,212,0.78) 100%)' }}
        />

        <div className="section-container relative z-10">
          <div className="max-w-2xl">
            <h2
              className="font-black text-white mb-4 sm:mb-5 leading-tight"
              style={{ fontSize: 'clamp(1.75rem, 5vw, 3rem)' }}
            >
              Ready to get started?
            </h2>
            <p className="text-white/55 mb-8 sm:mb-10 leading-relaxed max-w-lg"
              style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
            >
              Whether you&apos;re a business or an individual — submit your request and
              we&apos;ll be in touch within 24–48 hours. No upfront payment required.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link
                href="/procurement/nigeria"
                className="btn-white text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold hover-lift inline-flex items-center gap-2"
              >
                Start an Order
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 font-bold text-white/75 hover:text-white transition-colors text-sm sm:text-base"
              >
                Contact Us
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
