import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FloatingWhatsApp from '@/components/ui/floating-whatsapp'
import PublicChrome from '@/components/layout/PublicChrome'
import { Toaster } from '@/components/ui/sonner'
import { company } from '@/content'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fraogo.com'),
  title: {
    default: `${company.name} — ${company.tagline}`,
    template: `%s | ${company.name}`,
  },
  description: company.shortDescription,
  keywords: ['procurement', 'logistics', 'delivery', 'Nigeria', 'supply', 'vendors', 'Fraogo', 'freight', 'import', 'export', 'sourcing', 'Ikeja', 'Lagos'],
  alternates: {
    canonical: './',
  },
  openGraph: {
    title: `${company.name} — ${company.tagline}`,
    description: company.shortDescription,
    type: 'website',
    url: 'https://fraogo.com',
    siteName: company.name,
    locale: 'en_NG',
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
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LogisticsService',
    name: company.legalName,
    alternateName: company.name,
    description: company.longDescription,
    url: 'https://fraogo.com',
    logo: 'https://fraogo.com/logo/icon.svg',
    identifier: company.rc,
    telephone: '+2348028229002',
    email: 'fraogo6@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Plot 35b, Abisogun Leigh str',
      addressLocality: 'Ikeja',
      addressRegion: 'Lagos State',
      addressCountry: 'NG',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Nigeria',
    },
    sameAs: [
      'https://instagram.com/fraogo',
      'https://facebook.com/fraogo',
      'https://x.com/fraogo92031',
      'https://linkedin.com/company/fraogo',
      'https://www.tiktok.com/@fraogo_services',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Fraogo Multi-Service Catalog',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Global & Local Product Sourcing (Procurement)',
            description: 'International product sourcing, supplier contact, documentation, and local procurement across Nigeria.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Cargo & Freight Logistics',
            description: 'International freight shipping and domestic cargo transportation & relocation across Nigeria.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Verified General Services & Event Materials',
            description: 'Vetted service provider hiring and bulk supply orders for events and projects.',
          },
        },
      ],
    },
  }

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
