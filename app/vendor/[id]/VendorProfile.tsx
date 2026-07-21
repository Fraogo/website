'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react'
import VendorDetailModal from '@/components/vendor/VendorDetailModal'

interface VendorImage { id: string; url: string }
interface Variant {
  name: string
  price?: string | null
  description?: string | null
}

interface Vendor {
  id: string
  businessName: string
  description: string
  location: string
  businessType: string
  listingType: string
  price?: string | null
  priceRange?: string | null
  variants?: Variant[] | null
  portfolioImages: VendorImage[]
}

export default function VendorProfile({ vendor }: { vendor: Vendor }) {
  const [open, setOpen] = useState(false)
  const [idx, setIdx] = useState(0)
  const images = vendor.portfolioImages
  const hasImages = images.length > 0

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>
      <div className="page-header">
        <div className="section-container pt-8">
          <p className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: '#93A9F5' }}>
            FRAOGO Vendor
          </p>
          <h1 className="text-3xl lg:text-4xl font-black mb-2">{vendor.businessName}</h1>
          <div className="flex flex-wrap items-center gap-2 text-white/70 text-sm">
            <span className="px-2 py-0.5 rounded-full bg-white/15">{vendor.businessType}</span>
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {vendor.location}</span>
            <span className="px-2 py-0.5 rounded-full bg-white/15 text-xs">
              {vendor.listingType === 'product' ? 'Product' : 'Service'}
            </span>
            {(vendor.price || vendor.priceRange) && (
              <span className="px-2 py-0.5 rounded-full bg-white/15 text-xs">
                {vendor.price ? vendor.price : vendor.priceRange}
              </span>
            )}
          </div>
          {vendor.variants && vendor.variants.length > 0 && (
            <div className="mt-4 grid gap-3 text-sm text-gray-200">
              <div className="rounded-2xl bg-white/10 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-2">Variants available</p>
                <div className="grid gap-2">
                  {vendor.variants.map((variant) => (
                    <div key={variant.name} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-white text-sm">{variant.name}</p>
                        {variant.price ? <p className="text-xs text-gray-100">{variant.price}</p> : null}
                      </div>
                      {variant.description ? <p className="text-xs text-gray-100/80 mt-1">{variant.description}</p> : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="section-container py-10 max-w-3xl">
        {hasImages ? (
          <div className="relative aspect-video bg-gray-100 rounded-2xl overflow-hidden mb-6 shadow-soft">
            <Image src={images[idx].url} alt={vendor.businessName} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" />
            {images.length > 1 && (
              <>
                <button onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors" aria-label="Previous image">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => setIdx((i) => (i + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors" aria-label="Next image">
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <span key={i} className={`h-1.5 rounded-full transition-all ${i === idx ? 'bg-white w-4' : 'bg-white/50 w-1.5'}`} />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="aspect-video bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 text-sm mb-6">
            No images yet
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6 mb-6">
          <h2 className="font-bold text-gray-900 mb-2">About</h2>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{vendor.description}</p>
        </div>

        <button onClick={() => setOpen(true)} className="btn-primary w-full py-4 rounded-2xl text-base">
          Request to Hire {vendor.businessName}
        </button>
        <p className="text-center text-xs text-gray-400 mt-3">
          All bookings and payments are handled securely through FRAOGO.
        </p>
      </div>

      {open && <VendorDetailModal vendor={vendor} onClose={() => setOpen(false)} />}
    </div>
  )
}
