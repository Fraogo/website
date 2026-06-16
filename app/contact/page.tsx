'use client'

import { useState } from 'react'
import { Phone, Mail, MapPin, MessageSquare, Send, CheckCircle2, Loader2 } from 'lucide-react'
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
            Have a question or ready to place a request? Fill out the form and our team will get back to you within 24–48 hours.
          </p>
        </div>
      </div>

      <section className="section-padding">
        <div className="section-container">
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 max-w-5xl mx-auto">

            {/* ── Contact Info ── */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl font-black text-gray-900 mb-5">Reach Us Directly</h2>

                {contact.phone && contact.phone !== '[YOUR PHONE NUMBER]' && (
                  <a href={`tel:${contact.phone.replace(/\s/g, '')}`}
                    className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-[#1B4AD4] hover:bg-blue-50/40 transition-all group mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#EEF2FF' }}>
                      <Phone className="w-5 h-5" style={{ color: '#1B4AD4' }} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">Phone</p>
                      <p className="text-sm font-semibold text-gray-800 group-hover:text-[#1B4AD4] transition-colors">{contact.phone}</p>
                      {contact.phone2 && <p className="text-sm text-gray-500">{contact.phone2}</p>}
                    </div>
                  </a>
                )}

                <a href={`mailto:${contact.email}`}
                  className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-[#1B4AD4] hover:bg-blue-50/40 transition-all group mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#EEF2FF' }}>
                    <Mail className="w-5 h-5" style={{ color: '#1B4AD4' }} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">Email</p>
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-[#1B4AD4] transition-colors">{contact.email}</p>
                  </div>
                </a>

                {contact.address && contact.address !== '[YOUR BUSINESS ADDRESS HERE]' && (
                  <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#EEF2FF' }}>
                      <MapPin className="w-5 h-5" style={{ color: '#1B4AD4' }} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">Address</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{contact.address}</p>
                    </div>
                  </div>
                )}

                {whatsappUrl && (
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-start gap-4 p-4 rounded-xl border border-green-200 bg-green-50 hover:bg-green-100 transition-all group">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#dcfce7' }}>
                      <MessageSquare className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-green-700 uppercase tracking-wide mb-0.5">WhatsApp</p>
                      <p className="text-sm font-semibold text-green-800 group-hover:text-green-900 transition-colors">Chat with us</p>
                      <p className="text-xs text-green-600 mt-0.5">Quick response during business hours</p>
                    </div>
                  </a>
                )}
              </div>

              {/* Social links */}
              {socials.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Follow Us</p>
                  <div className="flex items-center gap-3">
                    {socials.map(({ href, Icon, label }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="w-9 h-9 rounded-xl flex items-center justify-center border border-gray-200 text-gray-500 hover:text-[#1B4AD4] hover:border-[#1B4AD4] hover:bg-blue-50 transition-all"
                      >
                        <Icon />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Form ── */}
            <div className="lg:col-span-3">
              {status === 'success' ? (
                <div className="bg-white rounded-2xl p-10 shadow-soft border border-gray-100 text-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: '#EEF2FF' }}>
                    <CheckCircle2 className="w-8 h-8" style={{ color: '#1B4AD4' }} />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 mb-3">Message Sent!</h2>
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
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-soft border border-gray-100 p-7 space-y-5">
                  <h2 className="text-lg font-black text-gray-900 mb-2">Send a Message</h2>

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
                      <label htmlFor="phone" className="form-label">Phone Number <span className="text-gray-400 font-normal">(optional)</span></label>
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
                      rows={5}
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
                    className="btn-primary w-full py-3.5 rounded-xl text-base disabled:opacity-60"
                  >
                    {status === 'loading' ? (
                      <span className="flex items-center gap-2 justify-center">
                        <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 justify-center">
                        <Send className="w-4 h-4" /> Send Message
                      </span>
                    )}
                  </button>

                  <p className="text-xs text-gray-400 text-center">
                    We respond within 24–48 business hours. No upfront payment required.
                  </p>
                </form>
              )}
            </div>
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
