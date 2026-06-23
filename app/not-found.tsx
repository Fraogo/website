import Link from 'next/link'
import { Home, Layers, MapPin } from 'lucide-react'

// Branded 404. Renders inside the root layout (navbar/footer wrap it).
export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #0E2A82 0%, #070F2B 100%)' }}
    >
      <div className="max-w-md w-full text-center">
        <p className="text-7xl font-black text-white/90 leading-none">404</p>
        <h1 className="text-2xl font-black text-white mt-3 mb-2">Page not found</h1>
        <p className="text-white/60 text-sm mb-8 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white text-[#1B4AD4] font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-blue-50 transition-colors"
          >
            <Home className="w-4 h-4" /> Home
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-white/10 transition-colors"
          >
            <Layers className="w-4 h-4" /> Services
          </Link>
          <Link
            href="/track"
            className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-white/10 transition-colors"
          >
            <MapPin className="w-4 h-4" /> Track Order
          </Link>
        </div>
      </div>
    </div>
  )
}
