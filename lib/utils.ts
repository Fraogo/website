import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a Date object or string into a readable date-time string
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Formats a Date object or string into a simple date string (e.g. 31 May 2026)
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/** Estimated reading time in minutes from HTML content (~200 words/min). */
export function readingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  const words = text ? text.split(' ').length : 0
  return Math.max(1, Math.round(words / 200))
}

/**
 * Returns a date string formatted for input[type="date"] (YYYY-MM-DD)
 * offsetDays: how many days from today
 */
export function getMinDeliveryDate(offsetDays: number = 0): string {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().split('T')[0]
}

/**
 * Returns Tailwind classes for status badges based on status string
 */
export function getStatusColor(status: string): string {
  const s = status.toLowerCase()
  switch (s) {
    case 'pending':
    case 'pending_review':
      return 'bg-amber-100 text-amber-700 border-amber-200'
    case 'confirmed':
    case 'active':
      return 'bg-green-100 text-green-700 border-green-200'
    case 'completed':
      return 'bg-blue-100 text-blue-700 border-blue-200'
    case 'rejected':
    case 'cancelled':
      return 'bg-red-100 text-red-700 border-red-200'
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

/**
 * Truncates text to a specified length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}
