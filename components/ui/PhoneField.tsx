'use client'

import { useMemo, useState } from 'react'

// Common country dialing codes — Nigeria first (default).
const COUNTRIES = [
  { code: '+234', flag: '🇳🇬', name: 'Nigeria' },
  { code: '+233', flag: '🇬🇭', name: 'Ghana' },
  { code: '+254', flag: '🇰🇪', name: 'Kenya' },
  { code: '+256', flag: '🇺🇬', name: 'Uganda' },
  { code: '+255', flag: '🇹🇿', name: 'Tanzania' },
  { code: '+27',  flag: '🇿🇦', name: 'South Africa' },
  { code: '+250', flag: '🇷🇼', name: 'Rwanda' },
  { code: '+225', flag: '🇨🇮', name: "Côte d'Ivoire" },
  { code: '+221', flag: '🇸🇳', name: 'Senegal' },
  { code: '+237', flag: '🇨🇲', name: 'Cameroon' },
  { code: '+20',  flag: '🇪🇬', name: 'Egypt' },
  { code: '+212', flag: '🇲🇦', name: 'Morocco' },
  { code: '+1',   flag: '🇺🇸', name: 'USA / Canada' },
  { code: '+44',  flag: '🇬🇧', name: 'United Kingdom' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: '+86',  flag: '🇨🇳', name: 'China' },
  { code: '+91',  flag: '🇮🇳', name: 'India' },
  { code: '+49',  flag: '🇩🇪', name: 'Germany' },
  { code: '+33',  flag: '🇫🇷', name: 'France' },
  { code: '+39',  flag: '🇮🇹', name: 'Italy' },
  { code: '+31',  flag: '🇳🇱', name: 'Netherlands' },
  { code: '+90',  flag: '🇹🇷', name: 'Türkiye' },
  { code: '+55',  flag: '🇧🇷', name: 'Brazil' },
  { code: '+61',  flag: '🇦🇺', name: 'Australia' },
]

const DEFAULT_CODE = '+234'

/** Split an existing "+234 801..." value back into a known dial code + local part. */
function splitValue(value: string): { code: string; local: string } {
  const v = (value ?? '').trim()
  if (!v) return { code: DEFAULT_CODE, local: '' }
  // Longest matching code wins (e.g. +234 before +2)
  const match = [...COUNTRIES]
    .sort((a, b) => b.code.length - a.code.length)
    .find((c) => v.startsWith(c.code))
  if (match) return { code: match.code, local: v.slice(match.code.length).trim() }
  return { code: DEFAULT_CODE, local: v.replace(/^\+/, '') }
}

interface PhoneFieldProps {
  value: string
  onChange: (combined: string) => void
  id?: string
  required?: boolean
  placeholder?: string
  className?: string
  error?: boolean
}

export default function PhoneField({
  value, onChange, id, required, placeholder = '801 234 5678', className = '', error,
}: PhoneFieldProps) {
  const initial = useMemo(() => splitValue(value), []) // eslint-disable-line react-hooks/exhaustive-deps
  const [code, setCode]   = useState(initial.code)
  const [local, setLocal] = useState(initial.local)

  const emit = (nextCode: string, nextLocal: string) => {
    const cleaned = nextLocal.replace(/[^\d\s-]/g, '')
    onChange(cleaned ? `${nextCode} ${cleaned.trim()}` : '')
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      <select
        aria-label="Country code"
        value={code}
        onChange={(e) => { setCode(e.target.value); emit(e.target.value, local) }}
        className="form-input w-[7.5rem] flex-shrink-0 pr-2"
      >
        {COUNTRIES.map((c) => (
          <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
        ))}
      </select>
      <input
        id={id}
        type="tel"
        inputMode="tel"
        required={required}
        placeholder={placeholder}
        value={local}
        onChange={(e) => { setLocal(e.target.value); emit(code, e.target.value) }}
        className={`form-input flex-1 ${error ? 'error' : ''}`}
      />
    </div>
  )
}
