'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { AlertCircle, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react'
import { registerVendor } from '@/app/actions/vendor'
import { cn } from '@/lib/utils'
import PhoneField from '@/components/ui/PhoneField'

const BUSINESS_TYPES = ['Event Space', 'Protocol Service', 'Catering & Small Chops', 'Make Up', 'Other']

const formSchema = z.object({
  businessName: z.string().min(2, 'Business name is required'),
  email: z.string().email('Invalid email address'),
  description: z.string().min(20, 'Please provide a detailed description (at least 20 characters)'),
  location: z.string().min(3, 'Location is required'),
  phone: z.string().min(7, 'Phone number is required'),
  businessType: z.string().min(1, 'Please select a business type'),
  businessTypeOther: z.string().optional(),
  consentFee: z.literal(true, { message: 'You must agree to the 10% service fee' }),
  consentNoDirect: z.literal(true, { message: 'You must agree not to negotiate directly with customers' }),
})

type FormValues = z.infer<typeof formSchema>

export default function VendorRegistrationForm() {
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  const selectedType = watch('businessType')

  const onSubmit = async (data: FormValues) => {
    setServerError(null)
    const result = await registerVendor(data)
    if (result.success) {
      setSuccess(true)
    } else {
      setServerError(typeof result.error === 'string' ? result.error : 'Something went wrong. Please try again.')
    }
  }

  if (success) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #0E2A82, #1B4AD4)' }}>
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-black text-foreground mb-3">Application Submitted! 🎉</h2>
        <p className="text-muted-foreground mb-3 max-w-sm mx-auto">
          Thank you for applying to the FRAOGO vendor network. Your application is under review.
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          We&apos;ll email you once it&apos;s approved (usually 1–3 business days). The approval email includes a private link to set up your portfolio.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-left text-sm text-green-800 max-w-sm mx-auto mb-8">
          <p><strong>Reminder:</strong> FRAOGO takes 10% of the total bargain as a service fee, and all customer negotiations must go through FRAOGO.</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      {/* Business Info */}
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-border">
        <h2 className="text-base font-bold text-foreground mb-5 flex items-center gap-2">
          <span className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold" style={{ background: '#0E2A82' }}>1</span>
          Business Information
        </h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="form-label" htmlFor="business-name">Vendor / Business Name *</label>
            <input id="business-name" type="text" className={cn('form-input', errors.businessName && 'error')} placeholder="Your business name" {...register('businessName')} />
            {errors.businessName && <p className="form-error"><AlertCircle className="w-3 h-3" />{errors.businessName.message}</p>}
          </div>

          <div>
            <label className="form-label" htmlFor="vendor-email">Email Address *</label>
            <input id="vendor-email" type="email" className={cn('form-input', errors.email && 'error')} placeholder="business@example.com" {...register('email')} />
            {errors.email && <p className="form-error"><AlertCircle className="w-3 h-3" />{errors.email.message}</p>}
          </div>

          <div>
            <label className="form-label" htmlFor="vendor-phone">Phone Number *</label>
            <PhoneField id="vendor-phone" value={watch('phone') ?? ''} onChange={(v) => setValue('phone', v, { shouldValidate: true })} error={!!errors.phone} />
            <input type="hidden" {...register('phone')} />
            {errors.phone && <p className="form-error"><AlertCircle className="w-3 h-3" />{errors.phone.message}</p>}
          </div>

          <div>
            <label className="form-label" htmlFor="vendor-location">Location *</label>
            <input id="vendor-location" type="text" className={cn('form-input', errors.location && 'error')} placeholder="e.g. Lekki, Lagos" {...register('location')} />
            {errors.location && <p className="form-error"><AlertCircle className="w-3 h-3" />{errors.location.message}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="form-label" htmlFor="vendor-description">Description of Service *</label>
            <textarea id="vendor-description" rows={4} className={cn('form-input resize-none', errors.description && 'error')} placeholder="What services do you offer? Be detailed about your expertise, experience, and what makes you unique..." {...register('description')} />
            {errors.description && <p className="form-error"><AlertCircle className="w-3 h-3" />{errors.description.message}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="form-label" htmlFor="business-type">Business Type *</label>
            <select id="business-type" className={cn('form-input', errors.businessType && 'error')} {...register('businessType')}>
              <option value="">Select a business type...</option>
              {BUSINESS_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.businessType && <p className="form-error"><AlertCircle className="w-3 h-3" />{errors.businessType.message}</p>}
          </div>

          {selectedType === 'Other' && (
            <div className="sm:col-span-2 animate-fade-in">
              <label className="form-label" htmlFor="business-type-other">Please Specify Your Service *</label>
              <input id="business-type-other" type="text" className={cn('form-input', errors.businessTypeOther && 'error')} placeholder="e.g. Photography, Wedding Planning..." {...register('businessTypeOther')} />
              {errors.businessTypeOther && <p className="form-error"><AlertCircle className="w-3 h-3" />{errors.businessTypeOther.message}</p>}
            </div>
          )}
        </div>
      </div>

      {/* Consent */}
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-border">
        <h2 className="text-base font-bold text-foreground mb-5 flex items-center gap-2">
          <span className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold" style={{ background: '#0E2A82' }}>2</span>
          Terms & Consent
        </h2>
        <div className="space-y-4">
          <label className={cn('flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all', errors.consentFee ? 'border-red-200 bg-red-50' : 'border-border hover:bg-gray-50')}>
            <input type="checkbox" {...register('consentFee')} className="mt-0.5 w-4 h-4 accent-[#0E2A82] flex-shrink-0" />
            <span className="text-sm text-foreground leading-relaxed">
              I agree that <strong>FRAOGO takes 10% of the total bargain</strong> as a service fee for facilitating the vendor-customer connection. *
            </span>
          </label>
          {errors.consentFee && <p className="form-error text-xs ml-1"><AlertCircle className="w-3 h-3" />{errors.consentFee.message}</p>}

          <label className={cn('flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all', errors.consentNoDirect ? 'border-red-200 bg-red-50' : 'border-border hover:bg-gray-50')}>
            <input type="checkbox" {...register('consentNoDirect')} className="mt-0.5 w-4 h-4 accent-[#0E2A82] flex-shrink-0" />
            <span className="text-sm text-foreground leading-relaxed">
              I agree <strong>not to negotiate with customers directly</strong> outside the FRAOGO platform. All transactions must be facilitated through FRAOGO. *
            </span>
          </label>
          {errors.consentNoDirect && <p className="form-error text-xs ml-1"><AlertCircle className="w-3 h-3" />{errors.consentNoDirect.message}</p>}
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
        id="vendor-register-submit-btn"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" />
            Submitting Application...
          </span>
        ) : 'Submit Vendor Application'}
      </button>
    </form>
  )
}
