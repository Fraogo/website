import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import { company } from '@/content'

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

const steps = [
  { step: '01', title: 'Submit your request', desc: 'Fill out the form for your order, shipment, or vendor hire. No upfront payment required.' },
  { step: '02', title: 'We confirm the details', desc: 'Our team reviews your request and contacts you within 24–48 hours to agree on terms.' },
  { step: '03', title: 'We execute', desc: 'We handle procurement, logistics coordination, or vendor connection on your behalf.' },
  { step: '04', title: 'Delivered to you', desc: 'Your order arrives. We follow up to make sure everything is as expected.' },
]

export default function HomePage() {
  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════
          HERO — Full-bleed, text bottom-left
          Gradient is always visible. Photo shows on top when file exists.
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative h-screen min-h-[640px] max-h-[960px] flex items-end overflow-hidden">
        {/* Gradient fallback — always on */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(160deg, #070F2B 0%, #0E2A82 50%, #1B4AD4 100%)' }}
        />

        {/* Photo layer — CSS silently ignores missing files */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
        />

        {/* Cinematic bottom-up gradient — ensures text is always readable */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(7,15,43,0.97) 0%, rgba(7,15,43,0.75) 30%, rgba(7,15,43,0.30) 60%, rgba(7,15,43,0.10) 100%)',
          }}
        />

        {/* Content */}
        <div className="section-container relative z-10 w-full pb-16 lg:pb-24">
          <div className="max-w-3xl">
            <p className="text-blue-300 text-xs font-semibold uppercase tracking-widest mb-6">
              Ikeja, Lagos · Registered RC8967311
            </p>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[1.0] tracking-tight mb-7">
              Procurement.<br />
              Logistics.<br />
              General Services —<br />
              <span style={{ color: '#93B4F8' }}>Done in Nigeria.</span>
            </h1>

            <p className="text-white/55 text-base sm:text-lg leading-relaxed mb-10 max-w-2xl">
              From sourcing products globally to transporting goods across Nigeria and beyond —
              Fraogo handles the complexity so you can focus on your business.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link
                href="/procurement/nigeria"
                className="btn-white text-base px-8 py-4 rounded-xl font-bold inline-flex items-center gap-2"
              >
                Start an Order
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#services"
                className="inline-flex items-center gap-2 text-white/65 font-semibold text-base hover:text-white transition-colors py-4"
              >
                Our Services
                <span className="rotate-90 inline-block leading-none">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SERVICES — 3 full-width alternating strips (Maersk style)
          Mobile: photo top, text bottom (always)
          Desktop: alternates photo-left / photo-right
          ═══════════════════════════════════════════════════════════════════ */}
      <div id="services">
        {/* Section label above the strips */}
        <div className="bg-white py-12 lg:py-16 border-b border-gray-100">
          <div className="section-container">
            <p className="text-xs font-bold uppercase tracking-widest mb-2 text-[#1B4AD4]">What We Do</p>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900">
              Three services. One partner.
            </h2>
          </div>
        </div>

        {services.map((svc, i) => (
          <div
            key={svc.title}
            className={`flex flex-col lg:flex-row ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
            style={{ minHeight: '420px' }}
          >
            {/* ── Photo side ── */}
            <div className="relative h-64 sm:h-80 lg:h-auto lg:w-[42%] overflow-hidden flex-shrink-0">
              {/* Colour fallback */}
              <div className="absolute inset-0" style={{ background: svc.bgFallback }} />
              {/* Photo */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                style={{ backgroundImage: `url('${svc.image}')` }}
              />
              {/* Brand tint */}
              <div className="absolute inset-0" style={{ background: svc.overlayColor }} />

              {/* Number badge — bottom corner */}
              <div className="absolute bottom-5 left-5 text-white/20 text-7xl font-black leading-none select-none">
                {svc.number}
              </div>
            </div>

            {/* ── Text side ── */}
            <div
              className={`flex-1 flex items-center px-7 py-10 lg:px-16 lg:py-14 ${i % 2 === 1 ? 'bg-[#F5F7FF]' : 'bg-white'}`}
            >
              <div className="max-w-xl">
                <p className="text-xs font-bold uppercase tracking-widest mb-4 text-[#1B4AD4]">
                  {svc.tagline}
                </p>
                <h3 className="text-3xl lg:text-4xl font-black text-gray-900 mb-5">
                  {svc.title}
                </h3>
                <p className="text-gray-500 leading-relaxed mb-8 text-[15px]">
                  {svc.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  {svc.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all hover:shadow-md"
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

      {/* ═══════════════════════════════════════════════════════════════════
          HOW WE WORK — Editorial 2-column numbered list
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="section-padding bg-white border-t border-gray-100">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            {/* Left */}
            <div className="lg:sticky lg:top-28">
              <p className="text-xs font-bold uppercase tracking-widest mb-4 text-[#1B4AD4]">Our Process</p>
              <h2 className="text-3xl lg:text-5xl font-black text-gray-900 leading-tight mb-6">
                How We<br />Work
              </h2>
              <p className="text-gray-500 leading-relaxed text-[15px] max-w-sm">
                From your first message to final delivery, we manage every step so you don&apos;t have to.
              </p>
            </div>

            {/* Right — numbered steps */}
            <div className="space-y-10">
              {steps.map((step) => (
                <div key={step.step} className="flex gap-6 items-start">
                  <span
                    className="text-5xl font-black flex-shrink-0 leading-none select-none"
                    style={{ color: '#E8EEFF' }}
                  >
                    {step.step}
                  </span>
                  <div className="pt-2">
                    <h3 className="font-bold text-gray-900 text-base mb-1.5">{step.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          BRAND STATEMENT — Dark editorial section
          Replaces "Why Choose Us". Honest, direct, no claims.
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-32" style={{ background: '#070F2B' }}>
        <div className="section-container">
          <div className="max-w-3xl">
            <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-8">
              About Fraogo
            </p>
            <p className="text-white text-xl sm:text-2xl lg:text-3xl font-bold leading-[1.5]">
              Fraogo is a registered Nigerian business{' '}
              <span style={{ color: 'rgba(255,255,255,0.30)' }}>(RC8967311)</span>{' '}
              offering procurement, logistics, and general services to businesses and individuals
              across Nigeria. We take on complex sourcing, shipping, and vendor coordination
              so you can focus on your goals. Every request is handled personally —
              we contact you before anything moves.
            </p>
            <div className="mt-10 pt-10 border-t border-white/10">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-blue-300 font-semibold text-sm hover:text-white transition-colors"
              >
                Learn more about us
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          TRACK ORDER
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="section-padding bg-white border-t border-gray-100">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-4 text-[#1B4AD4]">Order Tracking</p>
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
                Track your order
              </h2>
              <p className="text-gray-500 leading-relaxed text-[15px]">
                Have a reference number? Enter it to see the current status of your
                shipment or procurement order.
              </p>
            </div>
            <div>
              <form action="/track" method="get" className="flex flex-col sm:flex-row gap-3">
                <input
                  name="ref"
                  type="text"
                  placeholder="e.g. FRG-AB2X7K9M"
                  className="form-input flex-1 text-sm"
                  aria-label="Enter your tracking number"
                />
                <button
                  type="submit"
                  className="btn-primary px-7 py-3 rounded-xl text-sm whitespace-nowrap inline-flex items-center gap-2"
                >
                  Track Order
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
              <p className="text-xs text-gray-400 mt-3">
                Don&apos;t have a number?{' '}
                <Link href="/contact" className="text-[#1B4AD4] underline">
                  Contact us directly
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CTA BANNER — Full-bleed photo, simple
          ═══════════════════════════════════════════════════════════════════ */}
      <section
        className="relative py-24 lg:py-36 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #070F2B 0%, #0E2A82 60%, #1B4AD4 100%)' }}
      >
        {/* Photo layer */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/cta-bg.jpg')" }}
        />
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(7,15,43,0.92) 0%, rgba(14,42,130,0.82) 60%, rgba(27,74,212,0.78) 100%)' }}
        />

        <div className="section-container relative z-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl lg:text-5xl font-black text-white mb-5 leading-tight">
              Ready to get<br />started?
            </h2>
            <p className="text-white/55 mb-10 text-[15px] leading-relaxed max-w-lg">
              Whether you&apos;re a business or an individual — submit your request and
              we&apos;ll be in touch within 24–48 hours. No upfront payment required.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link
                href="/procurement/nigeria"
                className="btn-white text-base px-8 py-4 rounded-xl font-bold hover-lift inline-flex items-center gap-2"
              >
                Start an Order
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 font-bold text-white/75 hover:text-white transition-colors text-base"
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
