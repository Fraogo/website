'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AlertCircle, AlertTriangle, CheckCircle2, ShoppingBag } from 'lucide-react'
import { submitSupplyOrder } from '@/app/actions/supply'
import { getMinDeliveryDate, cn } from '@/lib/utils'
import PhoneField from '@/components/ui/PhoneField'
import ConfirmSubmitModal from '@/components/ui/ConfirmSubmitModal'

const SUPPLY_ITEMS = [
  { id: 'event-supplies', label: 'Supply for Events', emoji: '🎉', description: 'Generic event supplies and materials' },
  { id: 'bottled-water', label: 'Bottled Water', emoji: '💧', description: 'Various sizes and brands available' },
  { id: 'soft-drinks', label: 'Soft Drinks / Juice', emoji: '🥤', description: 'Assorted soft drinks and juices' },
  { id: 'fruit-wine', label: 'Fruit Wine', emoji: '🍷', description: 'Selection of fruit wines' },
]

const formSchema = z.object({
  customerName: z.string().min(2, 'Full name is required'),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().min(7, 'Phone number is required'),
  destination: z.string().min(5, 'Delivery destination is required'),
  preferredDate: z.string().refine((date) => {
    const d = new Date(date)
    const minDate = new Date()
    minDate.setDate(minDate.getDate() + 2)
    minDate.setHours(0, 0, 0, 0)
    return d >= minDate
  }, { message: 'Preferred date must be at least 2 days from today' }),
  items: z.array(z.object({
    name: z.string(),
    quantity: z.number().min(1, 'Min 1'),
    unit: z.enum(['Packs', 'Cartons']),
  })).min(1, 'Select at least one item'),
})

type FormValues = z.infer<typeof formSchema>

export default function SupplyOrderForm() {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [quantities, setQuantities] = useState<Record<string, { quantity: number; unit: 'Packs' | 'Cartons' }>>({})
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
  })

  const toggleItem = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((i) => i !== itemId) : [...prev, itemId]
    )
    if (!quantities[itemId]) {
      setQuantities((prev) => ({ ...prev, [itemId]: { quantity: 1, unit: 'Packs' } }))
    }
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    setQuantities((prev) => ({ ...prev, [itemId]: { ...prev[itemId], quantity: Math.max(1, quantity) } }))
  }

  const updateUnit = (itemId: string, unit: 'Packs' | 'Cartons') => {
    setQuantities((prev) => ({ ...prev, [itemId]: { ...prev[itemId], unit } }))
  }

  // Keep RHF's items value in sync with the visual selection so validation passes.
  useEffect(() => {
    const items = selectedItems.map((itemId) => {
      const item = SUPPLY_ITEMS.find((i) => i.id === itemId)!
      const qty = quantities[itemId] ?? { quantity: 1, unit: 'Packs' as const }
      return { name: item.label, quantity: qty.quantity, unit: qty.unit }
    })
    setValue('items', items, { shouldValidate: false })
  }, [selectedItems, quantities, setValue])

  const openReview = (data: FormValues) => {
    if (selectedItems.length === 0) return
    setPending(data)
  }

  const confirmSubmit = async () => {
    if (!pending) return
    setServerError(null)
    setSubmitting(true)
    const result = await submitSupplyOrder(pending)
    setSubmitting(false)
    if (result.success) {
      setPending(null)
      setSuccess(true)
    } else {
      setServerError(typeof result.error === 'string' ? result.error : 'Something went wrong.')
    }
  }

  const reviewRows = pending ? [
    { label: 'Name', value: pending.customerName },
    { label: 'Email', value: pending.customerEmail },
    { label: 'Phone', value: pending.customerPhone },
    { label: 'Preferred date', value: pending.preferredDate },
    { label: 'Destination', value: pending.destination },
    { label: 'Items', value: pending.items.map((i) => `${i.name} — ${i.quantity} ${i.unit}`).join('\n') },
  ] : []

  if (success) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #0E2A82, #1B4AD4)' }}>
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-black text-foreground mb-3">Supply Order Received! ✅</h2>
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
          We&apos;ve received your supply order. A confirmation has been sent to your email. Our team will contact you to confirm and arrange payment.
        </p>
        <button onClick={() => { setSuccess(false); setSelectedItems([]) }} className="btn-outline-green px-8 py-3 rounded-2xl text-sm">
          Place Another Order
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(openReview)} className="space-y-8" noValidate>
      {/* Item Selection */}
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-border">
        <h2 className="text-base font-bold text-foreground mb-2 flex items-center gap-2">
          <span className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold" style={{ background: '#0E2A82' }}>1</span>
          Select Items
        </h2>
        <p className="text-xs text-muted-foreground mb-5">Click on items to select them, then set quantities below</p>

        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          {SUPPLY_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleItem(item.id)}
              className={cn(
                'flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all',
                selectedItems.includes(item.id)
                  ? 'border-[#0E2A82] bg-green-50'
                  : 'border-border hover:border-gray-300'
              )}
            >
              <span className="text-2xl flex-shrink-0">{item.emoji}</span>
              <div>
                <div className={cn('font-bold text-sm', selectedItems.includes(item.id) ? 'text-[#0E2A82]' : 'text-foreground')}>
                  {item.label}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{item.description}</div>
              </div>
              {selectedItems.includes(item.id) && (
                <div className="ml-auto flex-shrink-0">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#0E2A82' }}>
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Quantity rows */}
        {selectedItems.length > 0 && (
          <div className="border-t border-border pt-5 space-y-3">
            <h3 className="font-bold text-sm text-foreground mb-3">Set Quantities</h3>
            {selectedItems.map((itemId) => {
              const item = SUPPLY_ITEMS.find((i) => i.id === itemId)!
              const qty = quantities[itemId] ?? { quantity: 1, unit: 'Packs' }
              return (
                <div key={itemId} className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                  <span className="text-lg">{item.emoji}</span>
                  <span className="text-sm font-semibold text-foreground flex-1">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => updateQuantity(itemId, qty.quantity - 1)} className="w-7 h-7 rounded-lg border border-border bg-white flex items-center justify-center text-sm font-bold hover:bg-gray-50">−</button>
                    <span className="w-8 text-center text-sm font-bold">{qty.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(itemId, qty.quantity + 1)} className="w-7 h-7 rounded-lg border border-border bg-white flex items-center justify-center text-sm font-bold hover:bg-gray-50">+</button>
                    <select
                      value={qty.unit}
                      onChange={(e) => updateUnit(itemId, e.target.value as 'Packs' | 'Cartons')}
                      className="form-input py-1 px-2 text-xs w-24"
                    >
                      <option value="Packs">Packs</option>
                      <option value="Cartons">Cartons</option>
                    </select>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {selectedItems.length === 0 && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
            <ShoppingBag className="w-4 h-4 flex-shrink-0" />
            Please select at least one item above
          </div>
        )}
      </div>

      {/* Contact & Delivery */}
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-border">
        <h2 className="text-base font-bold text-foreground mb-5 flex items-center gap-2">
          <span className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold" style={{ background: '#0E2A82' }}>2</span>
          Contact & Delivery Details
        </h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="form-label" htmlFor="supply-name">Full Name *</label>
            <input id="supply-name" type="text" className={cn('form-input', errors.customerName && 'error')} placeholder="Your full name" {...register('customerName')} />
            {errors.customerName && <p className="form-error"><AlertCircle className="w-3 h-3" />{errors.customerName.message}</p>}
          </div>
          <div>
            <label className="form-label" htmlFor="supply-email">Email Address *</label>
            <input id="supply-email" type="email" className={cn('form-input', errors.customerEmail && 'error')} placeholder="you@example.com" {...register('customerEmail')} />
            {errors.customerEmail && <p className="form-error"><AlertCircle className="w-3 h-3" />{errors.customerEmail.message}</p>}
          </div>
          <div>
            <label className="form-label" htmlFor="supply-phone">Phone Number *</label>
            <PhoneField id="supply-phone" value={watch('customerPhone') ?? ''} onChange={(v) => setValue('customerPhone', v, { shouldValidate: true })} error={!!errors.customerPhone} />
            <input type="hidden" {...register('customerPhone')} />
            {errors.customerPhone && <p className="form-error"><AlertCircle className="w-3 h-3" />{errors.customerPhone.message}</p>}
          </div>
          <div>
            <label className="form-label" htmlFor="supply-date">Preferred Delivery Date *</label>
            <input
              id="supply-date"
              type="date"
              min={getMinDeliveryDate(2)}
              className={cn('form-input', errors.preferredDate && 'error')}
              {...register('preferredDate')}
            />
            {errors.preferredDate && <p className="form-error"><AlertCircle className="w-3 h-3" />{errors.preferredDate.message}</p>}
            <p className="text-xs text-muted-foreground mt-1">Must be at least 2 days from today</p>
          </div>
          <div className="sm:col-span-2">
            <label className="form-label" htmlFor="supply-destination">Delivery Destination *</label>
            <textarea id="supply-destination" rows={2} className={cn('form-input resize-none', errors.destination && 'error')} placeholder="Full delivery address..." {...register('destination')} />
            {errors.destination && <p className="form-error"><AlertCircle className="w-3 h-3" />{errors.destination.message}</p>}
          </div>
        </div>
      </div>

      {serverError && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          {serverError}
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        {/* Payment placeholder */}
        {/* TODO: Integrate Paystack or Flutterwave payment gateway here */}
        <p className="font-semibold mb-1">💳 Payment Note</p>
        <p className="text-xs">No payment required now. FRAOGO will contact you to confirm your order and arrange payment after submission.</p>
      </div>

      <button
        type="submit"
        disabled={selectedItems.length === 0}
        className="btn-primary w-full py-4 text-base rounded-2xl disabled:opacity-60"
        id="supply-submit-btn"
      >
        Review &amp; Submit ({selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''})
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

