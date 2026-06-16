import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Target, Eye, CheckCircle2 } from 'lucide-react'
import { company, team, about, contact } from '@/content'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description: `Learn about Fraogo — ${company.shortDescription}`,
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Page Header ── */}
      <div className="page-header">
        <div className="section-container pt-10">
          <p className="text-xs font-bold uppercase tracking-widest mb-3 text-blue-300">About Fraogo</p>
          <h1 className="text-4xl lg:text-5xl font-black mb-4 leading-tight">
            Who We Are
          </h1>
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
            <p className="text-xs font-bold uppercase tracking-widest mb-4 text-[#1B4AD4]">Our Story</p>
            {about.story.split('\n\n').map((paragraph, i) => (
              <p key={i} className="text-gray-600 leading-relaxed text-base mb-5 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="section-padding" style={{ background: '#F5F7FF' }}>
        <div className="section-container">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            <div className="bg-white rounded-2xl p-8 shadow-soft border border-gray-100">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: '#EEF2FF' }}>
                <Target className="w-6 h-6" style={{ color: '#1B4AD4' }} />
              </div>
              <h2 className="text-xl font-black text-gray-900 mb-3">Our Mission</h2>
              <p className="text-gray-500 leading-relaxed text-sm">{about.mission}</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-soft border border-gray-100">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: '#EEF2FF' }}>
                <Eye className="w-6 h-6" style={{ color: '#1B4AD4' }} />
              </div>
              <h2 className="text-xl font-black text-gray-900 mb-3">Our Vision</h2>
              <p className="text-gray-500 leading-relaxed text-sm">{about.vision}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-3 text-[#1B4AD4]">What We Stand For</p>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900">Our Core Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {about.values.map((value, i) => (
              <div key={value.title} className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100 card-hover">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-lg mb-4"
                  style={{ background: 'linear-gradient(135deg, #0E2A82, #1B4AD4)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="section-padding" style={{ background: '#F5F7FF' }}>
        <div className="section-container">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-3 text-[#1B4AD4]">The People</p>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900">Meet Our Team</h2>
            <p className="text-gray-500 mt-3 text-sm max-w-lg mx-auto leading-relaxed">
              A dedicated team committed to making your business operations smoother and more efficient.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-2xl overflow-hidden shadow-soft border border-gray-100 card-hover text-center group">
                {/* Photo */}
                <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 text-sm leading-tight">{member.name}</h3>
                  <p className="text-xs font-semibold mt-0.5 mb-2" style={{ color: '#1B4AD4' }}>{member.role}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{member.bio}</p>
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-gray-400 hover:text-[#1B4AD4] transition-colors"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
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

      {/* ── CTA ── */}
      <section className="section-padding bg-white">
        <div className="section-container text-center">
          <CheckCircle2 className="w-10 h-10 mx-auto mb-4" style={{ color: '#1B4AD4' }} />
          <h2 className="text-2xl lg:text-3xl font-black text-gray-900 mb-3">Ready to work with us?</h2>
          <p className="text-gray-500 mb-8 text-sm max-w-md mx-auto">Get in touch and let us handle the details for you.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary px-8 py-3.5 rounded-2xl">
              Contact Us <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/services" className="btn-outline px-8 py-3.5 rounded-2xl">
              View Our Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
