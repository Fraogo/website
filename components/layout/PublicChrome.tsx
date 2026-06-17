'use client'

import { usePathname } from 'next/navigation'

/**
 * Renders its children only on public pages. Used to keep the marketing
 * Footer and floating WhatsApp button off the admin panel.
 */
export default function PublicChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) return null
  return <>{children}</>
}
