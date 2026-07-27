import type { Metadata } from 'next'
import { company, contact } from '@/content'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: `Get in touch with Fraogo — Phone: ${contact.phone}, Email: ${contact.email}, Office: ${contact.address}. Response within 24-48 hours.`,
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Us | Fraogo',
    description: `Contact Fraogo Limited in Ikeja, Lagos — ${company.shortDescription}`,
    url: 'https://fraogo.com/contact',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
