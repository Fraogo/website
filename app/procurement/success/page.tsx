import Link from 'next/link'
import { CheckCircle2, Package, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Order Submitted — FRAOGO',
  description: 'Your procurement order has been received by FRAOGO.',
}

export default function ProcurementSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#f8fafc' }}>
      <div className="section-container py-20">
        <div className="max-w-lg mx-auto text-center">
          {/* Success Icon */}
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-glow"
            style={{ background: 'linear-gradient(135deg, #0E2A82, #1B4AD4)' }}
          >
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-3xl lg:text-4xl font-black text-foreground mb-4">
            Order Received! 🎉
          </h1>

          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            Thank you for your order. We&apos;ve sent a confirmation to your email address.
            Our team will review your request and contact you within{' '}
            <strong className="text-foreground">24–48 hours</strong>.
          </p>

          <div className="bg-white rounded-2xl p-6 shadow-soft border border-border mb-8 text-left">
            <h2 className="font-bold text-foreground mb-3 flex items-center gap-2 text-sm">
              <Package className="w-4 h-4" style={{ color: '#1B4AD4' }} />
              What happens next?
            </h2>
            <ol className="space-y-2">
              {[
                'FRAOGO reviews your order details',
                'We contact you via phone or email to confirm',
                'Payment arrangement is discussed',
                'We source and deliver your items',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
                    style={{ background: '#0E2A82' }}
                  >
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-primary px-8 py-3 rounded-2xl" id="back-to-home">
              Back to Home
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/procurement/nigeria" className="btn-outline-green px-8 py-3 rounded-2xl" id="place-new-order">
              Place Another Order
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

