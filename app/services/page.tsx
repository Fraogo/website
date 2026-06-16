import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Services',
  description: 'Fraogo offers procurement (local & international sourcing), logistics (freight & transport), and general services (vendor marketplace & supplies).',
}

const services = [
  {
    number: '01',
    id: 'procurement',
    title: 'Procurement',
    subtitle: 'Local & International Sourcing',
    description:
      "Tell us exactly what you need to buy — whether it's within Nigeria or from anywhere in the world. Our team sources the item, handles documentation, and gets it to you.",
    whoFor: [
      'Businesses buying raw materials or finished goods',
      'Individuals needing specific products',
      'Companies with import requirements',
    ],
    process: [
      'Fill out the procurement form with what you need',
      'We review your request and contact you within 24–48 hours',
      'We source, negotiate, and handle all paperwork',
      'You receive your goods at the agreed delivery point',
    ],
    options: [
      { label: 'Nigeria Orders',       href: '/procurement/nigeria',       desc: 'Source products from within Nigeria' },
      { label: 'International Orders', href: '/procurement/international', desc: 'Import from anywhere in the world' },
    ],
    image: '/images/services/procurement.jpg',
    bgFallback: '#0E2A82',
    overlayColor: 'rgba(14,42,130,0.72)',
  },
  {
    number: '02',
    id: 'logistics',
    title: 'Logistics',
    subtitle: 'Freight & Transportation',
    description:
      'Need to ship something internationally or move cargo within Nigeria? Describe what you need to move and where — we coordinate the right transport solution.',
    whoFor: [
      'Businesses shipping goods internationally',
      'Individuals sending items abroad',
      'Companies needing cargo transport within Nigeria',
    ],
    process: [
      'Submit your logistics request with item details and destination',
      'Our team contacts you to confirm route, timeline, and pricing',
      'We coordinate the appropriate transport and freight solution',
      'Your goods are delivered and you receive a tracking number',
    ],
    options: [
      { label: 'Send Abroad',     href: '/logistics/delivery',   desc: 'International shipping and freight' },
      { label: 'Local Transport', href: '/logistics/relocation', desc: 'Cargo transport within Nigeria' },
    ],
    image: '/images/services/logistics.jpg',
    bgFallback: '#070F2B',
    overlayColor: 'rgba(7,15,43,0.72)',
  },
  {
    number: '03',
    id: 'general-services',
    title: 'General Services',
    subtitle: 'Vendors & Supplies',
    description:
      'Find verified vendors for your events, or order bulk supplies delivered to your location. Vendors register and list their services — you browse and send a hire request.',
    whoFor: [
      'Event organisers and planners',
      'Businesses needing bulk supplies',
      'Individuals looking for professional service providers',
    ],
    process: [
      'Browse our catalogue of verified vendors',
      'Submit a hire request with your event details',
      'We coordinate with the vendor and confirm with you',
      'Service is rendered; supplies are delivered',
    ],
    options: [
      { label: 'Browse & Hire Vendors', href: '/general-service/rental', desc: 'Event spaces, catering, makeup & more' },
      { label: 'Supply Orders',         href: '/general-service/supply', desc: 'Drinks, water, event supplies & more' },
    ],
    image: '/images/services/general.jpg',
    bgFallback: '#1B4AD4',
    overlayColor: 'rgba(27,74,212,0.65)',
  },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Page Header ── */}
      <div
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #070F2B 0%, #0E2A82 60%, #1B4AD4 100%)', color: 'white', paddingTop: '5rem', paddingBottom: '3.5rem' }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/services-hero-bg.jpg')" }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(7,15,43,0.92) 0%, rgba(14,42,130,0.80) 60%, rgba(27,74,212,0.70) 100%)' }} />

        <div className="section-container pt-10 relative z-10">
          <p className="text-xs font-bold uppercase tracking-widest mb-3 text-blue-300">What We Do</p>
          <h1 className="text-4xl lg:text-5xl font-black mb-4 leading-tight">Our Services</h1>
          <p className="text-white/65 max-w-2xl text-base leading-relaxed">
            Three core services built to handle the complex parts of sourcing, shipping, and service access
            — so you can focus on running your business.
          </p>
        </div>
      </div>

      {/* ── Service Detail Sections — alternating full-width strips ── */}
      {services.map((svc, i) => (
        <div
          key={svc.id}
          className={`flex flex-col lg:flex-row ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
          style={{ minHeight: '480px' }}
        >
          {/* Photo side */}
          <div className="relative h-64 sm:h-80 lg:h-auto lg:w-[42%] overflow-hidden flex-shrink-0">
            <div className="absolute inset-0" style={{ background: svc.bgFallback }} />
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${svc.image}')` }}
            />
            <div className="absolute inset-0" style={{ background: svc.overlayColor }} />
            <div className="absolute bottom-5 left-6 text-white/15 text-7xl font-black leading-none select-none">
              {svc.number}
            </div>
          </div>

          {/* Text side */}
          <div
            className={`flex-1 px-7 py-12 lg:px-14 lg:py-16 flex items-start ${i % 2 === 1 ? 'bg-[#F5F7FF]' : 'bg-white'}`}
          >
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-widest mb-3 text-[#1B4AD4]">{svc.subtitle}</p>
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-5">{svc.title}</h2>
              <p className="text-gray-500 leading-relaxed mb-8 text-[15px]">{svc.description}</p>

              {/* Who it's for */}
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Who it&apos;s for</p>
                <ul className="space-y-2">
                  {svc.whoFor.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1B4AD4] flex-shrink-0 mt-[6px]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Process */}
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">The Process</p>
                <ol className="space-y-3">
                  {svc.process.map((step, j) => (
                    <li key={j} className="flex items-start gap-4">
                      <span
                        className="text-sm font-black flex-shrink-0 leading-none pt-0.5"
                        style={{ color: '#1B4AD4', minWidth: '1.5rem' }}
                      >
                        {String(j + 1).padStart(2, '0')}
                      </span>
                      <p className="text-sm text-gray-600 leading-relaxed">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                {svc.options.map((opt) => (
                  <Link
                    key={opt.href}
                    href={opt.href}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all hover:shadow-md"
                    style={{ background: '#EEF2FF', color: '#1B4AD4' }}
                  >
                    {opt.label}
                    <ArrowRight className="w-4 h-4 flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* ── Bottom CTA ── */}
      <section
        className="relative py-20 lg:py-28 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #070F2B 0%, #0E2A82 50%, #1B4AD4 100%)' }}
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
          <div className="max-w-xl">
            <h2 className="text-3xl lg:text-4xl font-black text-white mb-4 leading-tight">
              Not sure which service you need?
            </h2>
            <p className="text-white/55 mb-8 text-[15px] leading-relaxed">
              Contact us and describe what you&apos;re trying to do. We&apos;ll point you in the right direction.
            </p>
            <Link
              href="/contact"
              className="btn-white px-8 py-4 rounded-xl text-base font-bold hover-lift inline-flex items-center gap-2"
            >
              Talk to Us
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
