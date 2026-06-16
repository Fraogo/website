'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState, useRef } from 'react'
import { AlertCircle, AlertTriangle, CheckCircle2, Loader2, Upload, X } from 'lucide-react'
import { registerVendor } from '@/app/actions/vendor'
import { supabaseClient, VENDOR_DOCUMENTS_BUCKET } from '@/lib/storage'
import { cn } from '@/lib/utils'

const BUSINESS_TYPES = ['Event Space', 'Protocol Service', 'Catering & Small Chops', 'Make Up', 'Other']

const formSchema = z.object({
  businessName: z.string().min(2, 'Business name is required'),
  email: z.string().email('Invalid email address'),
  description: z.string().min(20, 'Please provide a detailed description (at least 20 characters)'),
  location: z.string().min(3, 'Location is required'),
  phone: z.string().min(7, 'Phone number is required'),
  businessType: z.string().min(1, 'Please select a business type'),
  businessTypeOther: z.string().optional(),
  ninDocumentUrl: z.string().min(1, 'NIN document is required'),
  consentFee: z.literal(true, { message: 'You must agree to the 10% service fee' }),
  consentNoDirect: z.literal(true, { message: 'You must agree not to negotiate directly with customers' }),
})

type FormValues = z.infer<typeof formSchema>

export default function VendorRegistrationForm() {
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')
  const [uploadedFileName, setUploadedFileName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

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
  const ninUrl = watch('ninDocumentUrl')

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
      setUploadState('error')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadState('error')
      return
    }

    setUploadState('uploading')
    setUploadProgress(0)
    setUploadedFileName(file.name)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress((p) => Math.min(p + 10, 85))
    }, 200)

    const ext = file.name.split('.').pop()
    const path = `pending/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error } = await supabaseClient.storage
      .from(VENDOR_DOCUMENTS_BUCKET)
      .upload(path, file, { contentType: file.type })

    clearInterval(progressInterval)

    if (error) {
      setUploadState('error')
      setUploadProgress(0)
      console.error('Upload error:', error)
      return
    }

    setUploadProgress(100)
    setUploadState('done')
    setValue('ninDocumentUrl', path, { shouldValidate: true })
  }

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
          We&apos;ll notify you by email once your application is approved (usually 1–3 business days).
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
            <input id="vendor-phone" type="tel" className={cn('form-input', errors.phone && 'error')} placeholder="+234 800 000 0000" {...register('phone')} />
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

      {/* NIN Document Upload */}
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-border">
        <h2 className="text-base font-bold text-foreground mb-2 flex items-center gap-2">
          <span className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold" style={{ background: '#0E2A82' }}>2</span>
          NIN Document Upload
        </h2>
        <p className="text-sm text-muted-foreground mb-4">Upload your National Identification Number (NIN) document. Accepted formats: JPEG, PNG, PDF. Max size: 5MB.</p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleFileUpload}
          className="sr-only"
          id="nin-upload"
        />

        {uploadState === 'idle' && !ninUrl && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex flex-col items-center justify-center gap-3 py-8 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#0E2A82] hover:bg-blue-50 transition-all cursor-pointer"
            id="nin-upload-btn"
          >
            <Upload className="w-8 h-8 text-gray-400" />
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-600">Click to upload NIN document</p>
              <p className="text-xs text-gray-400 mt-1">JPEG, PNG, or PDF — max 5MB</p>
            </div>
          </button>
        )}

        {uploadState === 'uploading' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">{uploadedFileName}</span>
              <span className="text-muted-foreground">{uploadProgress}%</span>
            </div>
            <div className="upload-bar">
              <div className="upload-bar-fill" style={{ width: `${uploadProgress}%` }} />
            </div>
            <p className="text-xs text-muted-foreground">Uploading securely...</p>
          </div>
        )}

        {uploadState === 'done' && (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-green-800">Document uploaded successfully</p>
              <p className="text-xs text-green-600 truncate">{uploadedFileName}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setUploadState('idle')
                setUploadProgress(0)
                setUploadedFileName('')
                setValue('ninDocumentUrl', '', { shouldValidate: true })
                if (fileInputRef.current) fileInputRef.current.value = ''
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {uploadState === 'error' && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              Invalid file or upload failed. Please try again with a JPEG, PNG, or PDF under 5MB.
            </div>
            <button
              type="button"
              onClick={() => { setUploadState('idle'); fileInputRef.current?.click() }}
              className="w-full py-2 rounded-lg border border-border text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {errors.ninDocumentUrl && uploadState !== 'done' && (
          <p className="form-error mt-2"><AlertCircle className="w-3 h-3" />NIN document upload is required</p>
        )}

        <input type="hidden" {...register('ninDocumentUrl')} />
      </div>

      {/* Consent */}
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-border">
        <h2 className="text-base font-bold text-foreground mb-5 flex items-center gap-2">
          <span className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold" style={{ background: '#0E2A82' }}>3</span>
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
        disabled={isSubmitting || uploadState === 'uploading'}
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

