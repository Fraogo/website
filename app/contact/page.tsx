'use client'

import { useState } from 'react'
import { Send, Loader2, CheckCircle2 } from 'lucide-react'
import { contact, company } from '@/content'
import { submitContactForm, type ContactFormData } from '@/app/actions/contact'

function InstagramIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
}
function FacebookIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
}
function TwitterIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
}
function LinkedInIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
}

const socials = [
  { href: contact.social.instagram, Icon: InstagramIcon, label: 'Instagram' },
  { href: contact.social.facebook,  Icon: FacebookIcon,  label: 'Facebook' },
  { href: contact.social.twitter,   Icon: TwitterIcon,   label: 'Twitter / X' },
  { href: contact.social.linkedin,  Icon: LinkedInIcon,  label: 'LinkedIn' },
].filter((s) => s.href)

const subjects = [
  'Procurement Inquiry',
  'Logistics / Freight',
  'Vendor / Services',
  'General Inquiry',
  'Partnership',
  'Other',
]

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormData>({ name: '', email: '', phone: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg(null)

    const result = await submitContactForm(form)
    if (result.success) {
      setStatus('success')
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    } else {
      setStatus('error')
      setErrorMsg(typeof result.error === 'string' ? result.error : 'Something went wrong. Please try again.')
    }
  }

  const whatsappUrl = contact.whatsapp && contact.whatsapp !== '[WHATSAPP_NUMBER_DIGITS_ONLY]'
    ? `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent("Hi Fraogo, I'd like to enquire about your services.")}`
    : null

  return (
    <div className="min-h-screen bg-white">

      {/* ── Page Header ── */}
      <div className="page-header">
        <div className="section-container pt-10">
          <p className="text-xs font-bold uppercase tracking-widest mb-3 text-blue-300">Get In Touch</p>
          <h1 className="text-4xl lg:text-5xl font-black mb-4 leading-tight">Contact Us</h1>
          <p className="text-white/65 max-w-2xl text-base leading-relaxed">
            Have a question or ready to place a request? Reach us directly or fill out the form below.
          </p>
        </div>
      </div>

      {/* ── Prominent Contact Details ── */}
      <section className="py-14 lg:py-20 border-b border-gray-100" style={{ background: '#F5F7FF' }}>
        <div className="section-container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">

            {contact.phone && contact.phone !== '[YOUR PHONE NUMBER]' && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-3 text-[#1B4AD4]">Phone</p>
                <a
                  href={`tel:${contact.phone.replace(/\s/g, '')}`}
                  className="text-2xl lg:text-3xl font-black text-gray-900 hover:text-[#1B4AD4] transition-colors leading-tight block"
                >
                  {contact.phone}
                </a>
                {contact.phone2 && (
                  <a
                    href={`tel:${contact.phone2.replace(/\s/g, '')}`}
                    className="text-lg text-gray-500 hover:text-[#1B4AD4] transition-colors mt-1 block"
                  >
                    {contact.phone2}
                  </a>
                )}
              </div>
            )}

            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3 text-[#1B4AD4]">Email</p>
              <a
                href={`mailto:${contact.email}`}
                className="text-2xl lg:text-3xl font-black text-gray-900 hover:text-[#1B4AD4] transition-colors leading-tight block break-all"
              >
                {contact.email}
              </a>
            </div>

            {contact.address && contact.address !== '[YOUR BUSINESS ADDRESS HERE]' && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-3 text-[#1B4AD4]">Address</p>
                <p className="text-lg lg:text-xl font-bold text-gray-900 leading-snug">
                  {contact.address}
                </p>
              </div>
            )}
          </div>

          {/* WhatsApp + Social in same row below */}
          <div className="mt-10 pt-10 border-t border-gray-200 flex flex-wrap items-center gap-8">
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-bold text-green-700 hover:text-green-800 transition-colors"
              >
                <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-600">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </span>
                WhatsApp
              </a>
            )}

            {socials.length > 0 && (
              <div className="flex items-center gap-5">
                {socials.map(({ href, Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-gray-400 hover:text-[#1B4AD4] transition-colors"
                  >
                    <Icon />
                    <span className="sr-only">{label}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Contact Form ── */}
      <section className="section-padding">
        <div className="section-container">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest mb-4 text-[#1B4AD4]">Send a Message</p>
            <h2 className="text-2xl lg:text-3xl font-black text-gray-900 mb-8">
              Prefer to write? We&apos;ll reply within 24–48 hours.
            </h2>

            {status === 'success' ? (
              <div className="py-16 text-center max-w-sm">
                <CheckCircle2 className="w-10 h-10 mx-auto mb-5" style={{ color: '#1B4AD4' }} />
                <h3 className="text-xl font-black text-gray-900 mb-3">Message Sent</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                  Thank you for reaching out. Our team will get back to you within 24–48 hours.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="btn-primary px-6 py-3 rounded-xl text-sm"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="form-label">Full Name *</label>
                    <input id="name" name="name" type="text" required value={form.name} onChange={handleChange}
                      className="form-input" placeholder="Your full name" />
                  </div>
                  <div>
                    <label htmlFor="email" className="form-label">Email Address *</label>
                    <input id="email" name="email" type="email" required value={form.email} onChange={handleChange}
                      className="form-input" placeholder="you@example.com" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="phone" className="form-label">
                      Phone Number <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange}
                      className="form-input" placeholder="+234 800 000 0000" />
                  </div>
                  <div>
                    <label htmlFor="subject" className="form-label">Subject *</label>
                    <select id="subject" name="subject" required value={form.subject} onChange={handleChange} className="form-input">
                      <option value="">Select a subject</option>
                      {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="form-label">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={form.message}
                    onChange={handleChange}
                    className="form-input resize-none"
                    placeholder="Tell us what you need help with, or describe your request..."
                  />
                </div>

                {status === 'error' && errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-primary py-3.5 px-8 rounded-xl text-base disabled:opacity-60"
                >
                  {status === 'loading' ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Sending…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-4 h-4" /> Send Message
                    </span>
                  )}
                </button>

                <p className="text-xs text-gray-400">
                  We respond within 24–48 business hours. No upfront payment required.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── Google Maps ── */}
      {contact.googleMapsEmbedUrl && (
        <div className="w-full h-80 lg:h-96 border-t border-gray-100">
          <iframe
            src={contact.googleMapsEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`${company.name} location on Google Maps`}
          />
        </div>
      )}
    </div>
  )
}
