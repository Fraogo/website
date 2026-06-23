'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { submitDeliveryRequest } from '@/app/actions/delivery'
import { cn } from '@/lib/utils'
import PhoneField from '@/components/ui/PhoneField'
import ConfirmSubmitModal from '@/components/ui/ConfirmSubmitModal'

const formSchema = z.object({
  type: z.enum(['local', 'international']),
  senderName: z.string().min(2, 'Sender name is required'),
  senderEmail: z.string().email('Invalid email address'),
  senderPhone: z.string().min(7, 'Phone number is required'),
  itemDescription: z.string().min(5, 'Please describe the item(s)'),
  itemWeight: z.number({ message: 'Weight must be a number' }).min(0.01, 'Weight must be greater than 0'),
  weightUnit: z.enum(['kg', 'lbs']),
  destination: z.string().min(3, 'Destination is required'),
  receiverName: z.string().min(2, 'Receiver name is required'),
  receiverContact: z.string().min(7, 'Receiver contact is required'),
  consentGiven: z.literal(true, { message: 'You must agree to the inspection consent' }),
})

type FormValues = z.infer<typeof formSchema>

interface DeliveryFormProps {
  defaultType?: 'local' | 'international'
}

export default function DeliveryForm({ defaultType = 'local' }: DeliveryFormProps) {
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [pending, setPending] = useState<FormValues | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: defaultType,
      weightUnit: 'kg',
    },
  })

  const selectedType = watch('type')

  const confirmSubmit = async () => {
    if (!pending) return
    setServerError(null)
    setSubmitting(true)
    const result = await submitDeliveryRequest(pending)
    setSubmitting(false)
    if (result.success) {
      setPending(null)
      setSuccess(true)
    } else {
      setServerError(typeof result.error === 'string' ? result.error : 'Something went wrong.')
    }
  }

  const reviewRows = pending ? [
    { label: 'Delivery type', value: pending.type === 'local' ? 'Local Delivery' : 'International Delivery' },
    { label: 'Sender', value: pending.senderName },
    { label: 'Email', value: pending.senderEmail },
    { label: 'Phone', value: pending.senderPhone },
    { label: 'Item(s)', value: pending.itemDescription },
    { label: 'Weight', value: `${pending.itemWeight} ${pending.weightUnit}` },
    { label: 'Destination', value: pending.destination },
    { label: 'Receiver', value: `${pending.receiverName} — ${pending.receiverContact}` },
  ] : []

  if (success) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #0E2A82, #1B4AD4)' }}>
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-black text-foreground mb-3">Delivery Request Sent! ✅</h2>
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
          We&apos;ve received your delivery request and sent a confirmation to your email. Our team will be in touch shortly.
        </p>
        <button onClick={() => { setSuccess(false) }} className="btn-outline-green px-8 py-3 rounded-2xl text-sm">
          Submit Another Request
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit((data) => setPending(data))} className="space-y-8" noValidate>
      {/* Type toggle */}
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-border">
        <label className="form-label mb-3">Delivery Type *</label>
        <div className="grid grid-cols-2 gap-3">
          {(['local', 'international'] as const).map((t) => (
            <label
              key={t}
              className={cn(
                'flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 cursor-pointer transition-all font-semibold text-sm',
                selectedType === t
                  ? 'border-[#0E2A82] bg-green-50 text-[#0E2A82]'
                  : 'border-border text-muted-foreground hover:border-gray-300'
              )}
            >
              <input type="radio" value={t} {...register('type')} className="sr-only" />
              {t === 'local' ? '🇳🇬 Local Delivery' : '🌍 International Delivery'}
            </label>
          ))}
        </div>
      </div>

      {/* Sender Info */}
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-border">
        <h2 className="text-base font-bold text-foreground mb-5 flex items-center gap-2">
          <span className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold" style={{ background: '#0E2A82' }}>1</span>
          Sender Information
        </h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className="form-label" htmlFor="delivery-sender-name">Sender Full Name *</label>
            <input id="delivery-sender-name" type="text" className={cn('form-input', errors.senderName && 'error')} placeholder="Your full name" {...register('senderName')} />
            {errors.senderName && <p className="form-error"><AlertCircle className="w-3 h-3" />{errors.senderName.message}</p>}
          </div>
          <div>
            <label className="form-label" htmlFor="delivery-sender-email">Email Address *</label>
            <input id="delivery-sender-email" type="email" className={cn('form-input', errors.senderEmail && 'error')} placeholder="you@example.com" {...register('senderEmail')} />
            {errors.senderEmail && <p className="form-error"><AlertCircle className="w-3 h-3" />{errors.senderEmail.message}</p>}
          </div>
          <div>
            <label className="form-label" htmlFor="delivery-sender-phone">Phone Number *</label>
            <PhoneField id="delivery-sender-phone" value={watch('senderPhone') ?? ''} onChange={(v) => setValue('senderPhone', v, { shouldValidate: true })} error={!!errors.senderPhone} />
            <input type="hidden" {...register('senderPhone')} />
            {errors.senderPhone && <p className="form-error"><AlertCircle className="w-3 h-3" />{errors.senderPhone.message}</p>}
          </div>
        </div>
      </div>

      {/* Item Info */}
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-border">
        <h2 className="text-base font-bold text-foreground mb-5 flex items-center gap-2">
          <span className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold" style={{ background: '#0E2A82' }}>2</span>
          Item Details
        </h2>
        <div className="space-y-5">
          <div>
            <label className="form-label" htmlFor="item-description">Description of Item(s) *</label>
            <textarea id="item-description" rows={3} className={cn('form-input resize-none', errors.itemDescription && 'error')} placeholder="Describe the item(s) being sent..." {...register('itemDescription')} />
            {errors.itemDescription && <p className="form-error"><AlertCircle className="w-3 h-3" />{errors.itemDescription.message}</p>}
          </div>

          <div>
            <label className="form-label">Weight of Item *</label>
            <div className="flex gap-3">
              <input
                type="number"
                step="0.01"
                min="0.01"
                className={cn('form-input flex-1', errors.itemWeight && 'error')}
                placeholder="0.00"
                {...register('itemWeight', { valueAsNumber: true })}
              />
              <select className="form-input w-28 flex-shrink-0" {...register('weightUnit')}>
                <option value="kg">kg</option>
                <option value="lbs">lbs</option>
              </select>
            </div>
            {errors.itemWeight && <p className="form-error"><AlertCircle className="w-3 h-3" />{errors.itemWeight.message}</p>}
          </div>

          <div>
            <label className="form-label" htmlFor="destination">
              Destination *
              <span className="ml-1 font-normal text-muted-foreground text-xs">
                ({selectedType === 'local' ? 'City and State' : 'City and Country'})
              </span>
            </label>
            <input
              id="destination"
              type="text"
              className={cn('form-input', errors.destination && 'error')}
              placeholder={selectedType === 'local' ? 'e.g. Abuja, FCT' : 'e.g. London, United Kingdom'}
              {...register('destination')}
            />
            {errors.destination && <p className="form-error"><AlertCircle className="w-3 h-3" />{errors.destination.message}</p>}
          </div>
        </div>
      </div>

      {/* Receiver Info */}
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-border">
        <h2 className="text-base font-bold text-foreground mb-5 flex items-center gap-2">
          <span className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold" style={{ background: '#0E2A82' }}>3</span>
          Receiver Information
        </h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="form-label" htmlFor="receiver-name">Receiver&apos;s Full Name *</label>
            <input id="receiver-name" type="text" className={cn('form-input', errors.receiverName && 'error')} placeholder="Receiver&apos;s name" {...register('receiverName')} />
            {errors.receiverName && <p className="form-error"><AlertCircle className="w-3 h-3" />{errors.receiverName.message}</p>}
          </div>
          <div>
            <label className="form-label" htmlFor="receiver-contact">Receiver&apos;s Contact Number *</label>
            <PhoneField id="receiver-contact" value={watch('receiverContact') ?? ''} onChange={(v) => setValue('receiverContact', v, { shouldValidate: true })} error={!!errors.receiverContact} />
            <input type="hidden" {...register('receiverContact')} />
            {errors.receiverContact && <p className="form-error"><AlertCircle className="w-3 h-3" />{errors.receiverContact.message}</p>}
          </div>
        </div>
      </div>

      {/* Consent & Notice */}
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-border space-y-4">
        {/* Warning notice */}
        <div className="info-box">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#93A9F5' }} />
          <p>
            <strong>Important Notice:</strong> Receiver must come with a valid means of identification upon collection.
          </p>
        </div>

        {/* Consent checkbox */}
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            {...register('consentGiven')}
            className="mt-0.5 w-4 h-4 rounded accent-[#0E2A82] flex-shrink-0"
          />
          <span className="text-sm text-foreground leading-relaxed">
            I agree that item(s) can be checked/inspected before sending to the destination. *
          </span>
        </label>
        {errors.consentGiven && (
          <p className="form-error text-xs"><AlertCircle className="w-3 h-3" />{errors.consentGiven.message}</p>
        )}
      </div>

      {serverError && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          {serverError}
        </div>
      )}

      <button
        type="submit"
        className="btn-primary w-full py-4 text-base rounded-2xl"
        id="delivery-submit-btn"
      >
        Review &amp; Submit
      </button>

      <ConfirmSubmitModal
        open={!!pending}
        rows={reviewRows}
        submitting={submitting}
        error={serverError}
        onConfirm={confirmSubmit}
        onCancel={() => { setPending(null); setServerError(null) }}
      />
    </form>
  )
}

