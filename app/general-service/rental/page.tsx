import Link from 'next/link'
import { Users, UserPlus, ArrowRight, Star } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rental & Vendors',
  description: 'Become a verified vendor or hire talented vendors for your events through FRAOGO.',
}

export default function RentalPage() {
  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>
      <div className="page-header">
        <div className="section-container pt-8">
          <p className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: '#93A9F5' }}>
            General Service
          </p>
          <h1 className="text-3xl lg:text-4xl font-black mb-3">Rental & Vendor Services</h1>
          <p className="text-white/70 max-w-xl">
            Connect with verified vendors for your events, or join our vendor network to grow your business.
          </p>
        </div>
      </div>

      <div className="section-container py-16">
        <div className="max-w-4xl mx-auto">
          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {/* Become a Vendor */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-card border border-border card-hover">
              <div className="p-8" style={{ background: 'linear-gradient(135deg, #0E2A82, #1B4AD4)' }}>
                <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mb-5">
                  <UserPlus className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2">Become a Vendor</h2>
                <p className="text-white/70 text-sm">Join our growing network of verified service providers</p>
              </div>
              <div className="p-6">
                <ul className="space-y-2.5 mb-6">
                  {[
                    'Get discovered by customers across Nigeria',
                    'FRAOGO handles client connections',
                    'Upload your portfolio to showcase your work',
                    'Simple 10% service fee on successful jobs',
                  ].map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#93A9F5' }} />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/general-service/rental/register-vendor"
                  className="btn-primary w-full justify-center py-3 rounded-xl"
                  id="become-vendor-btn"
                >
                  Register as a Vendor
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Hire a Vendor */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-card border border-border card-hover">
              <div className="p-8" style={{ background: 'linear-gradient(135deg, #0E2A82, #1B4AD4)' }}>
                <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mb-5">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2">Hire a Vendor</h2>
                <p className="text-white/70 text-sm">Browse and hire from our verified vendor catalogue</p>
              </div>
              <div className="p-6">
                <ul className="space-y-2.5 mb-6">
                  {[
                    'Browse verified vendors with portfolios',
                    'Event spaces, catering, makeup & more',
                    'Send requests directly through FRAOGO',
                    'All transactions are safely mediated',
                  ].map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#93A9F5' }} />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/general-service/rental/hire-vendor"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all"
                  style={{ background: '#1B4AD4', color: 'white' }}
                  id="hire-vendor-btn"
                >
                  Browse Vendors
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Vendor categories */}
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-foreground mb-3">Vendor Categories</h2>
            <p className="text-muted-foreground text-sm">We have verified vendors across these service types</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { emoji: '🏛️', label: 'Event Spaces' },
              { emoji: '🎖️', label: 'Protocol Service' },
              { emoji: '🍽️', label: 'Catering & Chops' },
              { emoji: '💄', label: 'Make Up' },
              { emoji: '✨', label: 'Other Services' },
            ].map((cat) => (
              <Link
                key={cat.label}
                href="/general-service/rental/hire-vendor"
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-border hover:border-[#0E2A82] hover:bg-blue-50 transition-all text-center group"
              >
                <span className="text-2xl">{cat.emoji}</span>
                <span className="text-xs font-semibold text-muted-foreground group-hover:text-[#0E2A82] transition-colors">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

