'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn, truncate } from '@/lib/utils'

interface VendorImage {
  id: string
  url: string
}

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
  listingType: 'product' | 'service'
  price?: string | null
  priceRange?: string | null
  variants?: Variant[] | null
  portfolioImages: VendorImage[]
}

interface VendorCardProps {
  vendor: Vendor
}

export default function VendorCard({ vendor }: VendorCardProps) {
  const [imageIndex, setImageIndex] = useState(0)
  const images = vendor.portfolioImages.slice(0, 5)
  const hasImages = images.length > 0

  const typeColors: Record<string, string> = {
    'Solar & Energy': 'bg-amber-100 text-amber-800',
    'Event Space': 'bg-purple-100 text-purple-800',
    'Protocol Service': 'bg-blue-100 text-blue-800',
    'Catering & Small Chops': 'bg-orange-100 text-orange-800',
    'Make Up': 'bg-pink-100 text-pink-800',
    'Gadgets': 'bg-emerald-100 text-emerald-800',
  }
  const badgeClass = Object.keys(typeColors).find((k) => vendor.businessType.startsWith(k))
    ? typeColors[Object.keys(typeColors).find((k) => vendor.businessType.startsWith(k))!]
    : 'bg-blue-100 text-blue-800'

  return (
    <div className="relative bg-white rounded-2xl overflow-hidden shadow-soft border border-border card-hover transition-colors hover:shadow-lg">
      <div className="relative aspect-video bg-gray-100">
        {hasImages ? (
          <>
            <Image
              src={images[imageIndex].url}
              alt={vendor.businessName}
              fill
              className="object-cover"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); setImageIndex((i) => (i - 1 + images.length) % images.length) }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setImageIndex((i) => (i + 1) % images.length) }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1">
                  {images.map((_, i) => (
                    <div key={i} className={cn('rounded-full transition-all', i === imageIndex ? 'w-3 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50')} />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl">
            {vendor.businessType.startsWith('Solar') ? '☀️' :
             vendor.businessType.startsWith('Event Space') ? '🏛️' :
             vendor.businessType.startsWith('Catering') ? '🍽️' :
             vendor.businessType.startsWith('Make Up') ? '💄' :
             vendor.businessType.startsWith('Protocol') ? '🎖️' :
             vendor.businessType.startsWith('Gadget') ? '📱' : '✨'}
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-black text-foreground text-base leading-tight">{vendor.businessName}</h3>
          <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0', badgeClass)}>
            {vendor.businessType.split(':')[0].trim()}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
          <MapPin className="w-3 h-3" />
          {vendor.location}
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed mb-4">
          {truncate(vendor.description, 120)}
        </p>

        {(vendor.price || vendor.priceRange) && (
          <div className="mb-3 text-sm text-slate-600">
            <span className="font-semibold text-slate-900">{vendor.listingType === 'product' ? 'Product' : 'Service'}:</span>
            {' '}
            {vendor.price ? vendor.price : vendor.priceRange ? vendor.priceRange : 'Contact for pricing'}
          </div>
        )}

        {vendor.variants && vendor.variants.length > 0 && (
          <div className="mb-3 text-xs text-slate-500">
            {vendor.variants.length === 1 ? '1 variant available' : `${vendor.variants.length} variants available`}
          </div>
        )}

        <Link
          href={`/vendor/${vendor.id}`}
          className="inline-flex w-full items-center justify-center py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #0E2A82, #1B4AD4)' }}
          id={`view-vendor-${vendor.id}`}
        >
          View Details & Request
        </Link>
      </div>
    </div>
  )
}

