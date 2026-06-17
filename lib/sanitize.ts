import sanitize from 'sanitize-html'

/**
 * Sanitise rich-text blog HTML before storing or rendering it.
 *
 * Allows the formatting a blog post needs (headings, lists, links, images,
 * basic formatting, blockquotes, code) and strips everything dangerous —
 * <script>, event handlers (onclick…), javascript: URLs, <iframe>, etc.
 *
 * Applied both on save (lib actions) and on render (blog page) so legacy
 * unsanitised posts are also cleaned at display time.
 */
export function sanitizeHtml(dirty: string): string {
  return sanitize(dirty, {
    allowedTags: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr', 'blockquote', 'pre', 'code',
      'strong', 'b', 'em', 'i', 'u', 's', 'sub', 'sup', 'mark', 'small',
      'ul', 'ol', 'li',
      'a', 'img', 'figure', 'figcaption',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'span', 'div',
    ],
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height'],
      '*': ['class'],
    },
    // Only allow safe URL schemes; blocks javascript:, data: (except images), etc.
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: { img: ['http', 'https', 'data'] },
    // Force external links to be safe
    transformTags: {
      a: sanitize.simpleTransform('a', { rel: 'noopener noreferrer nofollow' }),
    },
  })
}
