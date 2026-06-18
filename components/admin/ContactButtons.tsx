import { Mail, Phone, MessageCircle } from 'lucide-react'

function waNumber(phone: string) {
  // wa.me wants international digits only, no "+" or spaces
  return phone.replace(/\D/g, '')
}
function telNumber(phone: string) {
  return phone.replace(/[^\d+]/g, '')
}

/**
 * One-click ways for the admin to reach a customer, pre-filled with the
 * record's details. All plain links — no client JS needed.
 */
export default function ContactButtons({
  phone,
  email,
  subject,
  message,
}: {
  phone?: string | null
  email?: string | null
  subject: string
  message: string
}) {
  const wa = phone ? `https://wa.me/${waNumber(phone)}?text=${encodeURIComponent(message)}` : null
  const mail = email ? `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}` : null

  if (!phone && !email) return null

  return (
    <div className="flex flex-wrap gap-2">
      {wa && (
        <a href={wa} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors">
          <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
        </a>
      )}
      {mail && (
        <a href={mail}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-[#1B4AD4] hover:bg-blue-100 transition-colors">
          <Mail className="w-3.5 h-3.5" /> Email
        </a>
      )}
      {phone && (
        <a href={`tel:${telNumber(phone)}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
          <Phone className="w-3.5 h-3.5" /> Call
        </a>
      )}
    </div>
  )
}
