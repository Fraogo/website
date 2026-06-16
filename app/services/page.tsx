import Link from 'next/link'
import { Package, Truck, Wrench, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Services',
  description: 'Fraogo offers procurement (local & international sourcing), logistics (freight & transport), and general services (vendor marketplace & supplies).',
}

const services = [
  {
    id: 'procurement',
    icon: Package,
    title: 'Procurement',
    subtitle: 'Local & International Sourcing',
    description:
      'Tell us exactly what you need to buy — whether it\'s within Nigeria or from anywhere in the world. Our team sources the item, handles documentation, and gets it to you.',
    whoFor: ['Businesses buying raw materials or finished goods', 'Individuals needing specific products', 'Companies with import requirements'],
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
    bg: 'from-[#0E2A82] to-[#1B4AD4]',
  },
  {
    id: 'logistics',
    icon: Truck,
    title: 'Logistics',
    subtitle: 'Freight & Transportation',
    description:
      'Need to ship something internationally or move cargo within Nigeria? Describe what you need to move and where — we coordinate the right transport solution.',
    whoFor: ['Businesses shipping goods internationally', 'Individuals sending items abroad', 'Companies needing cargo transport within Nigeria'],
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
    bg: 'from-[#0a2060] to-[#0E2A82]',
  },
  {
    id: 'general-services',
    icon: Wrench,
    title: 'General Services',
    subtitle: 'Vendors & Supplies',
    description:
      'Find verified vendors for your events, or order bulk supplies delivered to your location. Vendors register and list their services — you browse and send a hire request.',
    whoFor: ['Event organisers and planners', 'Businesses needing bulk supplies', 'Individuals looking for professional service providers'],
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
    bg: 'from-[#1B4AD4] to-[#2A5EE8]',
  },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Page Header ── */}
      <div className="page-header">
        <div className="section-container pt-10">
          <p className="text-xs font-bold uppercase tracking-widest mb-3 text-blue-300">Services</p>
          <h1 className="text-4xl lg:text-5xl font-black mb-4 leading-tight">What We Offer</h1>
          <p className="text-white/65 max-w-2xl text-base leading-relaxed">
            Three core services built to handle the complex parts of sourcing, shipping, and service access
            — so you can focus on running your business.
          </p>
        </div>
      </div>

      {/* ── Service Detail Sections ── */}
      {services.map((svc, i) => (
        <section
          key={svc.id}
          className="section-padding"
          style={{ background: i % 2 === 0 ? '#FFFFFF' : '#F5F7FF' }}
        >
          <div className="section-container">
            <div className="grid lg:grid-cols-2 gap-14 items-start">
              {/* Left: info */}
              <div className={i % 2 !== 0 ? 'lg:order-2' : ''}>
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${svc.bg} flex items-center justify-center flex-shrink-0`}
                  >
                    <svc.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#1B4AD4]">{svc.subtitle}</p>
                    <h2 className="text-2xl lg:text-3xl font-black text-gray-900">{svc.title}</h2>
                  </div>
                </div>

                <p className="text-gray-500 leading-relaxed mb-6 text-sm">{svc.description}</p>

                <div className="mb-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Who it&apos;s for</p>
                  <ul className="space-y-2">
                    {svc.whoFor.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#1B4AD4]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  {svc.options.map((opt) => (
                    <Link
                      key={opt.href}
                      href={opt.href}
                      className="btn-primary flex-1 justify-center py-3 rounded-xl text-sm"
                    >
                      {opt.label} <ArrowRight className="w-4 h-4" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Right: process */}
              <div className={`bg-white rounded-2xl shadow-soft border border-gray-100 p-7 ${i % 2 !== 0 ? 'lg:order-1' : ''}`}>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5">The Process</p>
                <ol className="space-y-4">
                  {svc.process.map((step, j) => (
                    <li key={j} className="flex items-start gap-4">
                      <span
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0 mt-0.5"
                        style={{ background: 'linear-gradient(135deg, #0E2A82, #1B4AD4)' }}
                      >
                        {j + 1}
                      </span>
                      <p className="text-sm text-gray-600 leading-relaxed pt-0.5">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ── Bottom CTA ── */}
      <section
        className="py-20 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #070F2B 0%, #0E2A82 50%, #1B4AD4 100%)' }}
      >
        <div className="section-container relative z-10 text-center">
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">Not sure which service you need?</h2>
          <p className="text-white/55 mb-8 max-w-md mx-auto text-sm">
            Contact us and describe what you&apos;re trying to do. We&apos;ll point you in the right direction.
          </p>
          <Link href="/contact" className="btn-white px-8 py-4 rounded-2xl text-base font-bold hover-lift inline-flex items-center gap-2">
            Talk to Us <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
