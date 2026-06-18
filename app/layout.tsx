import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FloatingWhatsApp from '@/components/ui/floating-whatsapp'
import PublicChrome from '@/components/layout/PublicChrome'
import { Toaster } from '@/components/ui/sonner'
import { company, contact } from '@/content'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fraogo.com'),
  title: {
    default: `${company.name} — ${company.tagline}`,
    template: `%s | ${company.name}`,
  },
  description: company.shortDescription,
  keywords: ['procurement', 'logistics', 'delivery', 'Nigeria', 'supply', 'vendors', 'Fraogo', 'freight', 'import', 'export'],
  openGraph: {
    title: `${company.name} — ${company.tagline}`,
    description: company.shortDescription,
    type: 'website',
    url: 'https://fraogo.com',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Fraogo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${company.name} — ${company.tagline}`,
    description: company.shortDescription,
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans antialiased">
        <PublicChrome>
          <Navbar />
        </PublicChrome>
        <main className="flex-1">{children}</main>
        <PublicChrome>
          <Footer />
          <FloatingWhatsApp />
        </PublicChrome>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
