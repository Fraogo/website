import Link from 'next/link'
import { Users, UserPlus, ArrowRight, Star } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hire or Buy from Vendors',
  description: 'Hire verified vendors or buy gadgets and products from trusted sellers — all safely through FRAOGO. Or join as a vendor to grow your business.',
}

export default function RentalPage() {
  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>
      <div className="page-header">
        <div className="section-container pt-8">
          <p className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: '#93A9F5' }}>
            General Service
          </p>
          <h1 className="text-3xl lg:text-4xl font-black mb-3">Hire or Buy Through FRAOGO</h1>
          <p className="text-white/70 max-w-xl">
            Hire verified vendors for your events or buy gadgets and products from trusted sellers — every deal is handled safely through FRAOGO.
          </p>
        </div>
      </div>

      <div className="section-container py-16">
        <div className="max-w-4xl mx-auto">
          {/* ── Primary action: Hire / Buy ── */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-card border border-border mb-8">
            <div className="grid lg:grid-cols-2">
              <div className="p-8 lg:p-10" style={{ background: 'linear-gradient(135deg, #0E2A82, #1B4AD4)' }}>
                <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mb-5">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl lg:text-3xl font-black text-white mb-2">Hire or Buy from Vendors</h2>
                <p className="text-white/75 text-sm lg:text-base">
                  Browse verified vendors and sellers — book a service or buy a product, all mediated safely by FRAOGO.
                </p>
              </div>
              <div className="p-8 lg:p-10">
                <ul className="space-y-3 mb-7">
                  {[
                    'Hire vendors or buy gadgets & products',
                    'Browse verified profiles with photos',
                    'Send your request directly through FRAOGO',
                    'Every transaction is safely mediated',
                  ].map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#1B4AD4' }} />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/general-service/rental/hire-vendor"
                  className="btn-primary w-full justify-center py-3.5 rounded-xl text-base"
                  id="hire-vendor-btn"
                >
                  Browse Vendors &amp; Sellers
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* ── Vendor categories ── */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-black text-foreground mb-2">What You&apos;ll Find</h2>
            <p className="text-muted-foreground text-sm">Verified vendors and sellers across these categories</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-14">
            {[
              { emoji: '🏛️', label: 'Event Spaces' },
              { emoji: '🎖️', label: 'Protocol Service' },
              { emoji: '🍽️', label: 'Catering & Chops' },
              { emoji: '💄', label: 'Make Up' },
              { emoji: '📱', label: 'Gadgets' },
              { emoji: '✨', label: 'Other' },
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

          {/* ── Secondary action: Become a Vendor ── */}
          <div className="bg-white rounded-2xl border border-border shadow-soft p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#EEF2FF' }}>
              <UserPlus className="w-6 h-6" style={{ color: '#1B4AD4' }} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-black text-foreground mb-1">Are you a vendor or seller?</h3>
              <p className="text-sm text-muted-foreground">
                Join FRAOGO to get discovered by customers across Nigeria. We handle the connections — simple 10% fee on successful deals.
              </p>
            </div>
            <Link
              href="/general-service/rental/register-vendor"
              className="btn-outline justify-center py-3 px-6 rounded-xl text-sm flex-shrink-0 whitespace-nowrap"
              id="become-vendor-btn"
            >
              Become a Vendor
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
