import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { company, team, about } from '@/content'
import TeamCard from '@/components/about/TeamCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description: `Learn about Fraogo — ${company.shortDescription}`,
}

const visibleTeam = team.filter((m) => !m.name.startsWith('['))

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Page Header ── */}
      <div
        className="relative overflow-hidden"
        style={{ color: 'white', paddingTop: '5rem', paddingBottom: '3.5rem' }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #070F2B 0%, #0E2A82 60%, #1B4AD4 100%)' }}
        />
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/about-hero-bg.jpg')" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(7,15,43,0.90) 0%, rgba(14,42,130,0.80) 60%, rgba(27,74,212,0.70) 100%)' }}
        />
        <div className="section-container pt-10 relative z-10">
          <p className="text-xs font-bold uppercase tracking-widest mb-3 text-blue-300">About Fraogo</p>
          <h1 className="text-4xl lg:text-5xl font-black mb-4 leading-tight">Who We Are</h1>
          <p className="text-white/65 max-w-2xl text-base leading-relaxed">
            A Nigerian company built to make procurement, logistics, and service access simpler,
            faster, and more reliable for businesses of every size.
          </p>
        </div>
      </div>

      {/* ── Brand Story ── */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-widest mb-6 text-[#1B4AD4]">Our Story</p>
            {about.story.split('\n\n').map((paragraph, i) => (
              <p key={i} className="text-gray-600 leading-relaxed text-base mb-5 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission & Vision — editorial text, no cards ── */}
      <section className="section-padding border-t border-gray-100" style={{ background: '#F5F7FF' }}>
        <div className="section-container">
          <div className="grid md:grid-cols-2 gap-16 max-w-4xl">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-4 text-[#1B4AD4]">Our Mission</p>
              <p className="text-gray-700 leading-relaxed text-base">{about.mission}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-4 text-[#1B4AD4]">Our Vision</p>
              <p className="text-gray-700 leading-relaxed text-base">{about.vision}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values — numbered text list, no cards ── */}
      <section className="section-padding bg-white border-t border-gray-100">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            {/* Left: heading */}
            <div className="lg:sticky lg:top-28">
              <p className="text-xs font-bold uppercase tracking-widest mb-4 text-[#1B4AD4]">What We Stand For</p>
              <h2 className="text-3xl lg:text-5xl font-black text-gray-900 leading-tight">
                Our Core<br />Values
              </h2>
            </div>

            {/* Right: numbered list */}
            <div className="space-y-10">
              {about.values.map((value, i) => (
                <div key={value.title} className="flex gap-6 items-start">
                  <span
                    className="text-5xl font-black flex-shrink-0 leading-none select-none"
                    style={{ color: '#E8EEFF' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="pt-2">
                    <h3 className="font-bold text-gray-900 text-base mb-1.5">{value.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Team — only rendered when real members exist ── */}
      {visibleTeam.length > 0 && (
        <section className="section-padding border-t border-gray-100" style={{ background: '#F5F7FF' }}>
          <div className="section-container">
            <p className="text-xs font-bold uppercase tracking-widest mb-3 text-[#1B4AD4]">The People</p>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-10">Meet Our Team</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
              {visibleTeam.map((member) => (
                <TeamCard key={member.name} member={member} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Stats — only rendered when real stats exist ── */}
      {company.stats.length > 0 && (
        <section className="section-padding" style={{ background: 'linear-gradient(135deg, #0E2A82 0%, #1B4AD4 100%)' }}>
          <div className="section-container">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 max-w-2xl mx-auto text-center">
              {company.stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-4xl font-black text-white mb-2">{stat.value}</div>
                  <div className="text-sm text-blue-200 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="section-padding bg-white border-t border-gray-100">
        <div className="section-container">
          <div className="max-w-xl">
            <h2 className="text-2xl lg:text-3xl font-black text-gray-900 mb-3">Ready to work with us?</h2>
            <p className="text-gray-500 mb-8 text-sm leading-relaxed">Get in touch and let us handle the details for you.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="btn-primary px-8 py-3.5 rounded-xl inline-flex items-center gap-2">
                Contact Us <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/services" className="btn-outline px-8 py-3.5 rounded-xl">
                View Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
