export interface CategoryMeta {
  name: string
  slug: string
  icon: string
  description: string
  badgeBg: string
  badgeText: string
}

export const KNOWN_CATEGORIES: CategoryMeta[] = [
  {
    name: 'Solar & Energy',
    slug: 'solar-products',
    icon: '☀️',
    description: 'Solar panels, hybrid inverters, lithium batteries, and renewable energy equipment.',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-800',
  },
  {
    name: 'Event Space',
    slug: 'event-space',
    icon: '🏛️',
    description: 'Halls, event centers, and outdoor venues for corporate and private events.',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-800',
  },
  {
    name: 'Protocol Service',
    slug: 'protocol-service',
    icon: '🎖️',
    description: 'VIP airport escort, executive security, and protocol logistics.',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-800',
  },
  {
    name: 'Catering & Small Chops',
    slug: 'catering-and-small-chops',
    icon: '🍽️',
    description: 'Event catering, outdoor food services, and finger foods.',
    badgeBg: 'bg-orange-100',
    badgeText: 'text-orange-800',
  },
  {
    name: 'Make Up',
    slug: 'make-up',
    icon: '💄',
    description: 'Professional makeup artists for bridal, fashion, and special events.',
    badgeBg: 'bg-pink-100',
    badgeText: 'text-pink-800',
  },
  {
    name: 'Gadgets',
    slug: 'gadgets',
    icon: '📱',
    description: 'Phones, laptops, power stations, and consumer electronics.',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-800',
  },
]

/**
 * Converts a raw category name into a URL-friendly slug.
 * e.g. "Solar & Energy" -> "solar-products" (if matched) or "solar-energy"
 */
export function slugifyCategory(categoryName: string): string {
  const cleanName = categoryName.split(':')[0].trim()
  const matched = KNOWN_CATEGORIES.find(
    (c) => c.name.toLowerCase() === cleanName.toLowerCase()
  )
  if (matched) return matched.slug

  return cleanName
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Gets category metadata given a URL slug. Works dynamically for unlisted categories.
 */
export function getCategoryFromSlug(slug: string): CategoryMeta {
  const matched = KNOWN_CATEGORIES.find((c) => c.slug === slug.toLowerCase())
  if (matched) return matched

  // Fallback for dynamically created future categories
  const formattedName = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace(/ And /g, ' & ')

  return {
    name: formattedName,
    slug: slug,
    icon: '📦',
    description: `Browse verified ${formattedName} vendors and product listings.`,
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-800',
  }
}
