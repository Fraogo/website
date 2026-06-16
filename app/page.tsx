import Link from 'next/link'
import {
  ArrowRight, Package, Truck, Wrench, ShieldCheck, Globe, Clock,
  Star, CheckCircle2, MapPin, ChevronRight,
} from 'lucide-react'
import type { Metadata } from 'next'
import { company } from '@/content'

export const metadata: Metadata = {
  title: `${company.name} — Procurement, Logistics & General Services`,
  description: company.heroSubtext,
}

const services = [
  {
    icon: Package,
    title: 'Procurement',
    tagline: 'Local & International Sourcing',
    description:
      'Tell us what you need — from any market in Nigeria or anywhere in the world. We source it, handle the paperwork, and deliver it to you.',
    links: [
      { label: 'Nigeria Orders',       href: '/procurement/nigeria' },
      { label: 'International Orders', href: '/procurement/international' },
    ],
    accent: '#1B4AD4',
    bg:     'from-[#0E2A82] to-[#1B4AD4]',
  },
  {
    icon: Truck,
    title: 'Logistics',
    tagline: 'Freight & Transport',
    description:
      'Need to ship something internationally or move cargo across Nigeria? We coordinate the right transport solution for your goods.',
    links: [
      { label: 'Send Abroad',     href: '/logistics/delivery' },
      { label: 'Local Transport', href: '/logistics/relocation' },
    ],
    accent: '#0E2A82',
    bg:     'from-[#0a2060] to-[#0E2A82]',
  },
  {
    icon: Wrench,
    title: 'General Services',
    tagline: 'Vendors & Supplies',
    description:
      'Browse verified vendors for events, or order bulk supplies. From event spaces to catering — find trusted professionals here.',
    links: [
      { label: 'Browse & Hire Vendors', href: '/general-service/rental' },
      { label: 'Supply Orders',         href: '/general-service/supply' },
    ],
    accent: '#2A5EE8',
    bg:     'from-[#1B4AD4] to-[#2A5EE8]',
  },
]

const whyFraogo = [
  {
    icon: ShieldCheck,
    title: 'Trusted & Accountable',
    desc: 'Every order is tracked and followed through. We take ownership of every request from placement to delivery.',
  },
  {
    icon: Globe,
    title: 'Local & Global Reach',
    desc: 'Whether ordering within Nigeria or importing from overseas, Fraogo has the connections to make it happen.',
  },
  {
    icon: Clock,
    title: 'Fast Response',
    desc: 'Our team responds to every inquiry within 24–48 hours to confirm details and kick-start your request.',
  },
  {
    icon: Star,
    title: 'Verified Vendors',
    desc: 'Every vendor on our platform is registered and email-verified. You deal with professionals only.',
  },
]

const steps = [
  { step: '01', title: 'Submit Your Request',  desc: 'Fill out the form for your order, shipment, or vendor hire. No upfront payment required.' },
  { step: '02', title: 'We Confirm Details',   desc: 'Our team reviews your request and contacts you within 24–48 hours.' },
  { step: '03', title: 'We Execute',           desc: 'We handle procurement, logistics coordination, or vendor connection on your behalf.' },
  { step: '04', title: 'Delivered to You',     desc: 'Your order arrives. We follow up to make sure you are satisfied.' },
]

export default function HomePage() {
  return (
    <>
      {/* ─── HERO ────────────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #070F2B 0%, #0E2A82 50%, #1B4AD4 100%)' }}
      >
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Glow orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: '#3B6EF0' }} />
        <div className="absolute bottom-1/3 left-1/4 w-72 h-72 rounded-full opacity-10 blur-3xl"  style={{ background: '#1B4AD4' }} />

        <div className="section-container relative z-10 text-center pt-24 pb-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 border border-white/15 text-white/75 bg-white/8 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse-slow" />
            Nigeria&apos;s Trusted Business Services Partner
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.08] tracking-tight">
            {company.heroHeadline.split('\n').map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {i === 0 ? line : <span style={{ color: '#93B4F8' }}>{line}</span>}
              </span>
            ))}
          </h1>

          <p className="text-lg sm:text-xl text-white/65 max-w-2xl mx-auto mb-10 leading-relaxed">
            {company.heroSubtext}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/procurement/nigeria" className="btn-white text-base px-8 py-4 rounded-2xl font-bold hover-lift">
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white/80 border border-white/20 hover:bg-white/10 transition-all text-base"
            >
              Explore Services
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 flex items-center justify-center gap-8 sm:gap-14 flex-wrap">
            {company.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-white">{stat.value}</div>
                <div className="text-xs text-white/45 mt-1 font-medium uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 72" fill="white" xmlns="http://www.w3.org/2000/svg" className="w-full block">
            <path d="M0,40 C480,80 960,0 1440,40 L1440,72 L0,72 Z" />
          </svg>
        </div>
      </section>

      {/* ─── SERVICES ────────────────────────────────────────────────────────── */}
      <section id="services" className="section-padding bg-white">
        <div className="section-container">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3 text-[#1B4AD4]">What We Do</p>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900">
              Everything you need,{' '}
              <span className="text-gradient">one place</span>
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
              Fraogo simplifies procurement, freight, and service coordination for Nigerian businesses and individuals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {services.map((svc, i) => (
              <div
                key={svc.title}
                className="group rounded-2xl overflow-hidden shadow-card card-hover border border-gray-100"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className={`bg-gradient-to-br ${svc.bg} p-8`}>
                  <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mb-5">
                    <svc.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-1">{svc.title}</h3>
                  <p className="text-sm font-semibold text-white/55">{svc.tagline}</p>
                </div>
                <div className="p-6 bg-white">
                  <p className="text-sm text-gray-500 leading-relaxed mb-5">{svc.description}</p>
                  <div className="flex flex-col gap-2">
                    {svc.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:pl-5"
                        style={{ color: svc.accent, background: `${svc.accent}12` }}
                      >
                        {link.label}
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ────────────────────────────────────────────────────── */}
      <section className="section-padding" style={{ background: '#F5F7FF' }}>
        <div className="section-container">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3 text-[#1B4AD4]">Simple Process</p>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900">How It Works</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((item, i) => (
              <div key={item.step} className="relative text-center bg-white rounded-2xl p-6 shadow-soft border border-gray-100 card-hover">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white mx-auto mb-4"
                  style={{ background: 'linear-gradient(135deg, #0E2A82, #1B4AD4)' }}
                >
                  {item.step}
                </div>
                {i < steps.length - 1 && (
                  <div className="absolute top-[3.25rem] left-[calc(50%+2rem)] right-0 hidden lg:block">
                    <div className="border-t-2 border-dashed border-blue-100 mx-4" />
                  </div>
                )}
                <h3 className="font-bold text-gray-900 mb-2 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY FRAOGO ──────────────────────────────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3 text-[#1B4AD4]">Why Choose Us</p>
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-5">
                Built on trust,{' '}
                <span className="text-gradient">driven by results</span>
              </h2>
              <p className="text-gray-500 leading-relaxed mb-8 text-sm">
                Fraogo is not just another logistics company. We take full ownership of every request — from
                placement to delivery — so you never have to chase updates or deal with middlemen.
              </p>
              <Link href="/about" className="btn-primary inline-flex">
                Learn More About Us
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {whyFraogo.map((item) => (
                <div
                  key={item.title}
                  className="bg-white rounded-2xl p-5 shadow-soft border border-gray-100 card-hover"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: '#EEF2FF' }}>
                    <item.icon className="w-5 h-5" style={{ color: '#1B4AD4' }} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1.5">{item.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRACK ORDER QUICK-ACCESS ────────────────────────────────────────── */}
      <section className="section-padding" style={{ background: '#F5F7FF' }}>
        <div className="section-container">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: '#EEF2FF' }}>
              <MapPin className="w-7 h-7" style={{ color: '#1B4AD4' }} />
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-gray-900 mb-3">Track Your Order</h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Have a tracking number? Enter it below to see the status of your delivery or shipment.
            </p>
            <form action="/track" method="get" className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                name="ref"
                type="text"
                placeholder="e.g. FRG-AB2X7K9M"
                className="form-input flex-1 text-sm"
                aria-label="Enter your tracking number"
              />
              <button
                type="submit"
                className="btn-primary px-6 py-3 rounded-xl text-sm whitespace-nowrap"
              >
                Track <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            <p className="text-xs text-gray-400 mt-4">
              Don&apos;t have a number yet?{' '}
              <Link href="/track" className="underline text-[#1B4AD4]">Go to the tracking page</Link>
            </p>
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ──────────────────────────────────────────────────────── */}
      <section
        className="py-20 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #070F2B 0%, #0E2A82 50%, #1B4AD4 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="section-container relative z-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-blue-300" />
            <span className="text-sm font-semibold text-white/60">No upfront payment — we contact you first</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-black text-white mb-4 leading-tight">
            Ready to get started?
          </h2>
          <p className="text-white/55 max-w-lg mx-auto mb-10 text-sm leading-relaxed">
            Join hundreds of Nigerians who trust Fraogo for their procurement, logistics, and service needs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/procurement/nigeria" className="btn-white text-base px-8 py-4 rounded-2xl font-bold hover-lift">
              Start an Order
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white border border-white/20 hover:bg-white/10 transition-all text-base"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
