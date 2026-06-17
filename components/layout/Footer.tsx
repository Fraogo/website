import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'
import { contact, company } from '@/content'
import { InstagramIcon, FacebookIcon, TwitterIcon, LinkedInIcon } from '@/components/ui/social-icons'

export default function Footer() {
  return (
    <footer style={{ background: '#070F2B' }} className="text-white">
      <div className="section-container pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* ── Brand ── */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-5">
              <span className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-black text-base border border-white/20" style={{ background: 'rgba(255,255,255,0.1)' }}>F</span>
              <span className="text-2xl font-black tracking-tight">FRAOGO</span>
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
