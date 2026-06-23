'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MapPin, ChevronLeft, ChevronRight, X, Calendar, AlertCircle, AlertTriangle, Loader2, CheckCircle2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { submitVendorRequest } from '@/app/actions/vendorRequest'
import { cn } from '@/lib/utils'
import PhoneField from '@/components/ui/PhoneField'

interface VendorImage {
  id: string
  url: string
}

interface Vendor {
  id: string
  businessName: string
  description: string
  location: string
  businessType: string
  portfolioImages: VendorImage[]
}

interface VendorDetailModalProps {
  vendor: Vendor
  onClose: () => void
}

const requestSchema = z.object({
  customerName: z.string().min(2, 'Full name is required'),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().min(7, 'Phone number is required'),
  eventDate: z.string().optional(),
  description: z.string().min(10, 'Please describe what you need (min 10 characters)'),
  budget: z.string().optional(),
})

type RequestFormValues = z.infer<typeof requestSchema>

// Budget currencies — Naira default, plus common international + diaspora ones.
const CURRENCIES = [
  { symbol: '₦',   code: 'NGN', label: '₦ Naira' },
  { symbol: '$',   code: 'USD', label: '$ Dollar' },
  { symbol: '£',   code: 'GBP', label: '£ Pound' },
  { symbol: '€',   code: 'EUR', label: '€ Euro' },
  { symbol: '₵',   code: 'GHS', label: '₵ Cedi' },
  { symbol: 'R',   code: 'ZAR', label: 'R Rand' },
  { symbol: '¥',   code: 'CNY', label: '¥ Yuan' },
  { symbol: 'C$',  code: 'CAD', label: 'C$ Dollar' },
  { symbol: 'AED', code: 'AED', label: 'AED Dirham' },
]

export default function VendorDetailModal({ vendor, onClose }: VendorDetailModalProps) {
  const [imageIndex, setImageIndex] = useState(0)
  const [requestSuccess, setRequestSuccess] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [currency, setCurrency] = useState('₦')

  const images = vendor.portfolioImages
  const hasImages = images.length > 0

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
  })

  const onSubmit = async (data: RequestFormValues) => {
    setServerError(null)
    const budget = data.budget?.trim() ? `${currency}${data.budget.trim()}` : data.budget
    const result = await submitVendorRequest({ ...data, budget, vendorId: vendor.id })
    if (result.success) {
      setRequestSuccess(true)
    } else {
      setServerError(typeof result.error === 'string' ? result.error : 'Something went wrong.')
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-elevated animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border p-4 flex items-center justify-between z-10 rounded-t-2xl">
          <div>
            <h2 className="font-black text-foreground text-lg">{vendor.businessName}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white" style={{ background: '#0E2A82' }}>
                {vendor.businessType}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                {vendor.location}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Portfolio Images */}
          {hasImages && (
            <div>
              <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden mb-3">
                <Image
                  src={images[imageIndex].url}
                  alt={`${vendor.businessName} portfolio ${imageIndex + 1}`}
                  fill
                  className="object-cover"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setImageIndex((i) => (i - 1 + images.length) % images.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setImageIndex((i) => (i + 1) % images.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                      {images.map((_, i) => (
                        <button key={i} onClick={() => setImageIndex(i)} className={cn('w-1.5 h-1.5 rounded-full transition-all', i === imageIndex ? 'bg-white w-4' : 'bg-white/50')} />
                      ))}
                    </div>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.slice(0, 10).map((img, i) => (
                    <button key={img.id} onClick={() => setImageIndex(i)} className={cn('flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all', i === imageIndex ? 'border-[#0E2A82]' : 'border-transparent hover:border-gray-300')}>
                      <Image src={img.url} alt="" width={56} height={56} className="object-cover w-full h-full" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {!hasImages && (
            <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center text-muted-foreground text-sm">
              No portfolio images yet
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="font-bold text-foreground mb-2">About</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{vendor.description}</p>
          </div>

          {/* Request Form */}
          <div className="border-t border-border pt-6">
            <h3 className="font-bold text-foreground mb-4 text-base">Request This Vendor</h3>

            {requestSuccess ? (
              <div className="text-center py-6 animate-fade-in">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3" style={{ color: '#0E2A82' }} />
                <h4 className="font-bold text-foreground mb-2">Request Sent! ✅</h4>
                <p className="text-sm text-muted-foreground">
                  Your request has been sent to {vendor.businessName}. FRAOGO will facilitate the connection and reach out to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label text-xs" htmlFor="req-name">Full Name *</label>
                    <input id="req-name" type="text" className={cn('form-input py-2.5 text-sm', errors.customerName && 'error')} placeholder="Your name" {...register('customerName')} />
                    {errors.customerName && <p className="form-error"><AlertCircle className="w-3 h-3" />{errors.customerName.message}</p>}
                  </div>
                  <div>
                    <label className="form-label text-xs" htmlFor="req-email">Email Address *</label>
                    <input id="req-email" type="email" className={cn('form-input py-2.5 text-sm', errors.customerEmail && 'error')} placeholder="you@example.com" {...register('customerEmail')} />
                    {errors.customerEmail && <p className="form-error"><AlertCircle className="w-3 h-3" />{errors.customerEmail.message}</p>}
                  </div>
                  <div>
                    <label className="form-label text-xs" htmlFor="req-phone">Phone Number *</label>
                    <PhoneField id="req-phone" value={watch('customerPhone') ?? ''} onChange={(v) => setValue('customerPhone', v, { shouldValidate: true })} error={!!errors.customerPhone} />
                    <input type="hidden" {...register('customerPhone')} />
                    {errors.customerPhone && <p className="form-error"><AlertCircle className="w-3 h-3" />{errors.customerPhone.message}</p>}
                  </div>
                  <div>
                    <label className="form-label text-xs" htmlFor="req-date">Event / Occasion Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input id="req-date" type="date" className="form-input py-2.5 text-sm pl-9" {...register('eventDate')} />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="form-label text-xs" htmlFor="req-desc">What Do You Need? *</label>
                    <textarea id="req-desc" rows={3} className={cn('form-input resize-none text-sm', errors.description && 'error')} placeholder="Describe your requirements, event details, etc..." {...register('description')} />
                    {errors.description && <p className="form-error"><AlertCircle className="w-3 h-3" />{errors.description.message}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="form-label text-xs" htmlFor="req-budget">Budget (Optional)</label>
                    <div className="flex gap-2">
                      <select
                        aria-label="Currency"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="form-input py-2.5 text-sm w-28 flex-shrink-0"
                      >
                        {CURRENCIES.map((c) => (
                          <option key={c.code} value={c.symbol}>{c.label}</option>
                        ))}
                      </select>
                      <input id="req-budget" type="text" className="form-input py-2.5 text-sm flex-1" placeholder="e.g. 50,000 – 100,000" {...register('budget')} />
                    </div>
                  </div>
                </div>

                {serverError && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {serverError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full py-3 rounded-xl text-sm disabled:opacity-60"
                  id="send-vendor-request-btn"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2 justify-center">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending Request...
                    </span>
                  ) : 'Send Request to Vendor'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

