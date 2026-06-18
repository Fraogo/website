import { getContactInquiries, markContactRead, deleteContactInquiry } from '@/app/actions/contact'
import { formatDateTime } from '@/lib/utils'
import { MessageSquare, Mail, Phone, CheckCircle2 } from 'lucide-react'
import type { Metadata } from 'next'
import { revalidatePath } from 'next/cache'
import DeleteButton from '@/components/admin/DeleteButton'
import RefreshButton from '@/components/admin/RefreshButton'
import ContactButtons from '@/components/admin/ContactButtons'

export const metadata: Metadata = { title: 'Contact Messages — Admin' }
export const dynamic = 'force-dynamic'

const STATUS_STYLES: Record<string, string> = {
  new:        'bg-blue-100 text-blue-700',
  read:       'bg-gray-100 text-gray-600',
  responded:  'bg-green-100 text-green-700',
}

async function markAsRead(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const status = formData.get('status') as 'read' | 'responded'
  await markContactRead(id, status)
  revalidatePath('/admin/contacts')
}

export default async function AdminContactsPage() {
  const [all, newOnly] = await Promise.all([
    getContactInquiries(),
    getContactInquiries('new'),
  ])

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="flex items-center justify-between gap-3 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#EEF2FF' }}>
            <MessageSquare className="w-5 h-5" style={{ color: '#1B4AD4' }} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Contact Messages</h1>
            <p className="text-sm text-gray-400">
              {newOnly.length} unread · {all.length} total
            </p>
          </div>
        </div>
        <RefreshButton />
      </div>

      {all.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-soft">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-200" />
          <p className="text-gray-400 font-semibold">No messages yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {all.map((inquiry) => (
            <div
              key={inquiry.id}
              className={`bg-white rounded-2xl border shadow-soft p-5 ${inquiry.status === 'new' ? 'border-blue-200' : 'border-gray-100'}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-black text-gray-900 text-base">{inquiry.name}</h2>
                    <span className={`status-badge text-xs px-2.5 py-1 ${STATUS_STYLES[inquiry.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {inquiry.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 font-semibold mt-0.5">{inquiry.subject}</p>
                </div>
                <p className="text-xs text-gray-300 flex-shrink-0">{formatDateTime(inquiry.createdAt)}</p>
              </div>

              {/* Contact info */}
              <div className="flex flex-wrap gap-4 mb-3">
                <a href={`mailto:${inquiry.email}`} className="flex items-center gap-1.5 text-xs text-[#1B4AD4] hover:underline font-medium">
                  <Mail className="w-3.5 h-3.5" /> {inquiry.email}
                </a>
                {inquiry.phone && (
                  <a href={`tel:${inquiry.phone}`} className="flex items-center gap-1.5 text-xs text-gray-500 hover:underline font-medium">
                    <Phone className="w-3.5 h-3.5" /> {inquiry.phone}
                  </a>
                )}
              </div>

              {/* Message */}
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap border-l-2 border-gray-100 pl-3">
                {inquiry.message}
              </p>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-50">
                {inquiry.status === 'new' && (
                  <form action={markAsRead}>
                    <input type="hidden" name="id" value={inquiry.id} />
                    <input type="hidden" name="status" value="read" />
                    <button type="submit" className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                      Mark as Read
                    </button>
                  </form>
                )}
                {inquiry.status !== 'responded' && (
                  <form action={markAsRead}>
                    <input type="hidden" name="id" value={inquiry.id} />
                    <input type="hidden" name="status" value="responded" />
                    <button type="submit" className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mark Responded
                    </button>
                  </form>
                )}
                <ContactButtons
                  phone={inquiry.phone}
                  email={inquiry.email}
                  subject={`Re: ${inquiry.subject}`}
                  message={`Hi ${inquiry.name}, thank you for contacting Fraogo regarding "${inquiry.subject}".`}
                />
                <DeleteButton id={inquiry.id} action={deleteContactInquiry} label="Delete" confirmText="Delete this message permanently?" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
