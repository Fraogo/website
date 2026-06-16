'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Plus, Trash2, Package, Globe, AlertCircle } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { cn } from '@/lib/utils'

const itemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  specification: z.string().min(1, 'Specification is required'),
  quantity: z.number({ message: 'Quantity must be a number' }).min(1, 'Min 1'),
  deliveryMode: z.enum(['pickup', 'dispatch']),
  deliveryAddress: z.string().optional(),
}).refine(
  (data) => data.deliveryMode !== 'dispatch' || (data.deliveryAddress && data.deliveryAddress.trim().length > 0),
  { message: 'Delivery address required', path: ['deliveryAddress'] }
)

const formSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(7, 'Phone number is required'),
  items: z.array(itemSchema).min(1).max(20),
})

type FormValues = z.infer<typeof formSchema>

interface ProcurementFormProps {
  type: 'nigeria' | 'international'
}

export default function ProcurementForm({ type }: ProcurementFormProps) {
  const router = useRouter()
  const { setOrderType, setCustomerInfo, setItems } = useCartStore()
  const cart = useCartStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: cart.customerInfo?.fullName ?? '',
      email: cart.customerInfo?.email ?? '',
      phone: cart.customerInfo?.phone ?? '',
      items: cart.items.length > 0
        ? cart.items.map((item) => ({
            name: item.name,
            specification: item.specification,
            quantity: item.quantity,
            deliveryMode: item.deliveryMode,
            deliveryAddress: item.deliveryAddress ?? '',
          }))
        : [{ name: '', specification: '', quantity: 1, deliveryMode: 'pickup', deliveryAddress: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'items' })
  const watchedItems = watch('items')

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)

    setOrderType(type)
    setCustomerInfo({ fullName: data.fullName, email: data.email, phone: data.phone })
    setItems(
      data.items.map((item, i) => ({
        id: `item_${Date.now()}_${i}`,
        name: item.name,
        specification: item.specification,
        quantity: item.quantity,
        deliveryMode: item.deliveryMode,
        deliveryAddress: item.deliveryAddress,
      }))
    )

    router.push('/procurement/cart')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      {/* Order type badge */}
      <div className="flex items-center gap-3">
        {type === 'nigeria' ? (
          <span className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white" style={{ background: '#0E2A82' }}>
            <Package className="w-4 h-4" />
            🇳🇬 Nigeria Order
          </span>
        ) : (
          <span className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white" style={{ background: '#1B4AD4' }}>
            <Globe className="w-4 h-4" />
            🌍 International Order
          </span>
        )}
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-border">
        <h2 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: '#0E2A82' }}>1</span>
          Your Contact Information
        </h2>

        <div className="grid sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className="form-label" htmlFor="fullName">Full Name *</label>
            <input
              id="fullName"
              type="text"
              className={cn('form-input', errors.fullName && 'error')}
              placeholder="e.g. Amara Okonkwo"
              {...register('fullName')}
            />
            {errors.fullName && (
              <p className="form-error"><AlertCircle className="w-3 h-3" />{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label className="form-label" htmlFor="email">Email Address *</label>
            <input
              id="email"
              type="email"
              className={cn('form-input', errors.email && 'error')}
              placeholder="you@example.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="form-error"><AlertCircle className="w-3 h-3" />{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="form-label" htmlFor="phone">Phone Number *</label>
            <input
              id="phone"
              type="tel"
              className={cn('form-input', errors.phone && 'error')}
              placeholder="+234 800 000 0000"
              {...register('phone')}
            />
            {errors.phone && (
              <p className="form-error"><AlertCircle className="w-3 h-3" />{errors.phone.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: '#0E2A82' }}>2</span>
          Items to Order
        </h2>

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="bg-white rounded-2xl p-6 shadow-soft border border-border relative animate-fade-in"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-foreground text-sm">
                Item #{index + 1}
              </h3>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors font-medium"
                  id={`remove-item-${index}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {/* Item name */}
              <div>
                <label className="form-label" htmlFor={`item-name-${index}`}>Name of Item *</label>
                <input
                  id={`item-name-${index}`}
                  type="text"
                  className={cn('form-input', errors.items?.[index]?.name && 'error')}
                  placeholder="e.g. iPhone 15 Pro Max"
                  {...register(`items.${index}.name`)}
                />
                {errors.items?.[index]?.name && (
                  <p className="form-error"><AlertCircle className="w-3 h-3" />{errors.items[index].name?.message}</p>
                )}
              </div>

              {/* Quantity */}
              <div>
                <label className="form-label" htmlFor={`item-qty-${index}`}>Number of Items *</label>
                <input
                  id={`item-qty-${index}`}
                  type="number"
                  min={1}
                  className={cn('form-input', errors.items?.[index]?.quantity && 'error')}
                  placeholder="1"
                  {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                />
                {errors.items?.[index]?.quantity && (
                  <p className="form-error"><AlertCircle className="w-3 h-3" />{errors.items[index].quantity?.message}</p>
                )}
              </div>

              {/* Specification */}
              <div className="sm:col-span-2">
                <label className="form-label" htmlFor={`item-spec-${index}`}>Specification *</label>
                <textarea
                  id={`item-spec-${index}`}
                  rows={3}
                  className={cn('form-input resize-none', errors.items?.[index]?.specification && 'error')}
                  placeholder="Describe size, color, brand, model, or any specific requirements..."
                  {...register(`items.${index}.specification`)}
                />
                {errors.items?.[index]?.specification && (
                  <p className="form-error"><AlertCircle className="w-3 h-3" />{errors.items[index].specification?.message}</p>
                )}
              </div>

              {/* Delivery Mode */}
              <div className="sm:col-span-2">
                <label className="form-label">Mode of Delivery *</label>
                <div className="flex gap-4">
                  {(['pickup', 'dispatch'] as const).map((mode) => (
                    <label
                      key={mode}
                      className={cn(
                        'flex items-center gap-3 flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all',
                        watchedItems?.[index]?.deliveryMode === mode
                          ? 'border-[#0E2A82] bg-green-50'
                          : 'border-border hover:border-gray-300'
                      )}
                    >
                      <input
                        type="radio"
                        value={mode}
                        {...register(`items.${index}.deliveryMode`)}
                        className="accent-[#0E2A82]"
                      />
                      <span className="font-semibold text-sm capitalize">
                        {mode === 'pickup' ? 'Pick Up' : 'Dispatch'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Delivery Address (conditional) */}
              {watchedItems?.[index]?.deliveryMode === 'dispatch' && (
                <div className="sm:col-span-2 animate-fade-in">
                  <label className="form-label" htmlFor={`item-addr-${index}`}>Delivery Address *</label>
                  <textarea
                    id={`item-addr-${index}`}
                    rows={2}
                    className={cn('form-input resize-none', errors.items?.[index]?.deliveryAddress && 'error')}
                    placeholder="Enter full delivery address..."
                    {...register(`items.${index}.deliveryAddress`)}
                  />
                  {errors.items?.[index]?.deliveryAddress && (
                    <p className="form-error"><AlertCircle className="w-3 h-3" />{errors.items[index].deliveryAddress?.message}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Add Item Button */}
        {fields.length < 20 && (
          <button
            type="button"
            onClick={() => append({ name: '', specification: '', quantity: 1, deliveryMode: 'pickup', deliveryAddress: '' })}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-gray-300 text-sm font-semibold text-gray-500 hover:border-[#0E2A82] hover:text-[#0E2A82] hover:bg-blue-50 transition-all"
            id="add-another-item"
          >
            <Plus className="w-4 h-4" />
            + Add Another Item
            <span className="text-xs text-gray-400 ml-1">({fields.length}/20)</span>
          </button>
        )}
      </div>

      {/* Preview Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full py-4 text-base rounded-2xl disabled:opacity-60 disabled:cursor-not-allowed"
        id="preview-order-btn"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Preparing preview...
          </span>
        ) : (
          'Preview Order →'
        )}
      </button>
    </form>
  )
}

