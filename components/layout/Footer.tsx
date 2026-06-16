import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin } from 'lucide-react'
import { contact, company } from '@/content'

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer style={{ background: '#070F2B' }} className="text-white">
      <div className="section-container pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* ── Brand ── */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-5">
              <Image
                src="/logo/logo-white.png"
                alt="Fraogo"
                width={110}
                height={34}
                className="object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  const fb = e.currentTarget.nextElementSibling as HTMLElement
                  if (fb) fb.style.display = 'flex'
                }}
              />
              <span className="hidden items-center gap-2">
                <span className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-black text-base border border-white/20" style={{ background: 'rgba(255,255,255,0.1)' }}>F</span>
                <span className="text-2xl font-black tracking-tight">FRAOGO</span>
              </span>
            </Link>
            <p className="text-sm text-white/55 leading-relaxed mb-5">
              {company.shortDescription}
            </p>
            {company.rc !== 'RC 0000000' && (
              <p className="text-xs text-white/30 font-medium">{company.rc}</p>
            )}

            {/* Social Icons */}
            <div className="flex items-center gap-2 mt-5">
              {contact.social.instagram && (
                <a href={contact.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                  <InstagramIcon />
                </a>
              )}
              {contact.social.facebook && (
                <a href={contact.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                  <FacebookIcon />
                </a>
              )}
              {contact.social.twitter && (
                <a href={contact.social.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter / X"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                  <TwitterIcon />
                </a>
              )}
              {contact.social.linkedin && (
                <a href={contact.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                  <LinkedInIcon />
                </a>
              )}
            </div>
          </div>

          {/* ── Services ── */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-5 text-white/40">Services</h4>
            <ul className="space-y-3">
              {[
                { label: 'Nigeria Procurement',        href: '/procurement/nigeria' },
                { label: 'International Procurement',  href: '/procurement/international' },
                { label: 'Send Abroad',                href: '/logistics/delivery' },
                { label: 'Local Transport',            href: '/logistics/relocation' },
                { label: 'Browse & Hire Vendors',      href: '/general-service/rental' },
                { label: 'Supply Orders',              href: '/general-service/supply' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/55 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Company ── */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-5 text-white/40">Company</h4>
            <ul className="space-y-3">
              {[
                { label: 'About Us',         href: '/about' },
                { label: 'Our Services',     href: '/services' },
                { label: 'Blog',             href: '/blog' },
                { label: 'Track My Order',   href: '/track' },
                { label: 'Become a Vendor',  href: '/general-service/rental/register-vendor' },
                { label: 'Contact Us',       href: '/contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/55 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-5 text-white/40">Contact Us</h4>
            <ul className="space-y-4">
              {contact.phone && contact.phone !== '[YOUR PHONE NUMBER]' && (
                <li className="flex items-start gap-3">
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#1B4AD4]" />
                  <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="text-sm text-white/60 hover:text-white transition-colors">
                    {contact.phone}
                  </a>
                </li>
              )}
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#1B4AD4]" />
                <a href={`mailto:${contact.email}`} className="text-sm text-white/60 hover:text-white transition-colors">
                  {contact.email}
                </a>
              </li>
              {contact.address && contact.address !== '[YOUR BUSINESS ADDRESS HERE]' && (
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#1B4AD4]" />
                  <span className="text-sm text-white/60">{contact.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-14 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} {company.legalName}. All rights reserved.
          </p>
          <p className="text-xs text-white/20">
            Procurement · Logistics · General Services
          </p>
        </div>
      </div>
    </footer>
  )
}
