'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { AlertCircle, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react'
import { submitRelocationRequest } from '@/app/actions/relocation'
import { cn } from '@/lib/utils'

const formSchema = z.object({
  customerName: z.string().min(2, 'Full name is required'),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().min(7, 'Phone number is required'),
  pickupLocation: z.string().min(5, 'Pick-up location is required'),
  destination: z.string().min(5, 'Destination is required'),
  itemsList: z.string().min(3, 'Please list the items'),
  itemDescription: z.string().min(10, 'Please provide a description'),
  transportBy: z.enum(['self', 'fraogo']),
})

type FormValues = z.infer<typeof formSchema>

export default function RelocationForm() {
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { transportBy: 'fraogo' },
  })

  const selectedTransport = watch('transportBy')

  const onSubmit = async (data: FormValues) => {
    setServerError(null)
    const result = await submitRelocationRequest(data)
    if (result.success) {
      setSuccess(true)
    } else {
      setServerError(typeof result.error === 'string' ? result.error : 'Something went wrong.')
    }
  }

  if (success) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #0E2A82, #1B4AD4)' }}>
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-black text-foreground mb-3">Relocation Request Received! ✅</h2>
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
          We&apos;ve received your request and a confirmation has been sent to your email. Our team will contact you within 24–48 hours.
        </p>
        <button onClick={() => setSuccess(false)} className="btn-outline-green px-8 py-3 rounded-2xl text-sm">
          Submit Another Request
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      {/* Contact Info */}
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-border">
        <h2 className="text-base font-bold text-foreground mb-5 flex items-center gap-2">
          <span className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold" style={{ background: '#0E2A82' }}>1</span>
          Your Information
        </h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className="form-label" htmlFor="reloc-name">Full Name *</label>
            <input id="reloc-name" type="text" className={cn('form-input', errors.customerName && 'error')} placeholder="Your full name" {...register('customerName')} />
            {errors.customerName && <p className="form-error"><AlertCircle className="w-3 h-3" />{errors.customerName.message}</p>}
          </div>
          <div>
            <label className="form-label" htmlFor="reloc-email">Email Address *</label>
            <input id="reloc-email" type="email" className={cn('form-input', errors.customerEmail && 'error')} placeholder="you@example.com" {...register('customerEmail')} />
            {errors.customerEmail && <p className="form-error"><AlertCircle className="w-3 h-3" />{errors.customerEmail.message}</p>}
          </div>
          <div>
            <label className="form-label" htmlFor="reloc-phone">Phone Number *</label>
            <input id="reloc-phone" type="tel" className={cn('form-input', errors.customerPhone && 'error')} placeholder="+234 800 000 0000" {...register('customerPhone')} />
            {errors.customerPhone && <p className="form-error"><AlertCircle className="w-3 h-3" />{errors.customerPhone.message}</p>}
          </div>
        </div>
      </div>

      {/* Locations */}
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-border">
        <h2 className="text-base font-bold text-foreground mb-5 flex items-center gap-2">
          <span className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold" style={{ background: '#0E2A82' }}>2</span>
          Locations
        </h2>
        <div className="space-y-5">
          <div>
            <label className="form-label" htmlFor="pickup-location">Pick-up Location *</label>
            <textarea id="pickup-location" rows={2} className={cn('form-input resize-none', errors.pickupLocation && 'error')} placeholder="Full address of pick-up location..." {...register('pickupLocation')} />
            {errors.pickupLocation && <p className="form-error"><AlertCircle className="w-3 h-3" />{errors.pickupLocation.message}</p>}
          </div>
          <div>
            <label className="form-label" htmlFor="reloc-destination">Desired Destination *</label>
            <textarea id="reloc-destination" rows={2} className={cn('form-input resize-none', errors.destination && 'error')} placeholder="Full address of destination..." {...register('destination')} />
            {errors.destination && <p className="form-error"><AlertCircle className="w-3 h-3" />{errors.destination.message}</p>}
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-border">
        <h2 className="text-base font-bold text-foreground mb-5 flex items-center gap-2">
          <span className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold" style={{ background: '#0E2A82' }}>3</span>
          Items to Move
        </h2>
        <div className="space-y-5">
          <div>
            <label className="form-label" htmlFor="items-list">Items to be Moved *</label>
            <input id="items-list" type="text" className={cn('form-input', errors.itemsList && 'error')} placeholder="e.g. Furniture, Electronics, Books, Appliances" {...register('itemsList')} />
            {errors.itemsList && <p className="form-error"><AlertCircle className="w-3 h-3" />{errors.itemsList.message}</p>}
          </div>
          <div>
            <label className="form-label" htmlFor="item-desc">Description of Items *</label>
            <textarea id="item-desc" rows={3} className={cn('form-input resize-none', errors.itemDescription && 'error')} placeholder="Size, fragility, special handling needs (e.g. Piano, fragile glass items, heavy machinery)..." {...register('itemDescription')} />
            {errors.itemDescription && <p className="form-error"><AlertCircle className="w-3 h-3" />{errors.itemDescription.message}</p>}
          </div>
        </div>
      </div>

      {/* Transport */}
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-border">
        <h2 className="text-base font-bold text-foreground mb-5 flex items-center gap-2">
          <span className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold" style={{ background: '#0E2A82' }}>4</span>
          Transport Arrangement
        </h2>
        <div className="space-y-3">
          {[
            {
              value: 'self',
              label: 'I will arrange my own transport',
              desc: 'FRAOGO only provides labor and coordination',
            },
            {
              value: 'fraogo',
              label: 'FRAOGO should provide transport',
              desc: 'We handle both transport and coordination for you',
            },
          ].map((option) => (
            <label
              key={option.value}
              className={cn(
                'flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all',
                selectedTransport === option.value
                  ? 'border-[#0E2A82] bg-green-50'
                  : 'border-border hover:border-gray-300'
              )}
            >
              <input type="radio" value={option.value} {...register('transportBy')} className="mt-0.5 accent-[#0E2A82]" />
              <div>
                <div className="font-semibold text-sm text-foreground">{option.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{option.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {serverError && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full py-4 text-base rounded-2xl disabled:opacity-60"
        id="relocation-submit-btn"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" />
            Submitting...
          </span>
        ) : 'Submit Relocation Request'}
      </button>
    </form>
  )
}

