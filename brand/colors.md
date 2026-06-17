# Fraogo Colour Palette

## Primary Brand Blues

These are the core colours that define Fraogo's visual identity.
All blues must come from this scale — do not introduce new blues.

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--blue-deep` | `#070F2B` | 7, 15, 43 | Hero backgrounds, dark sections, deepest gradients |
| `--blue-dark` | `#0E2A82` | 14, 42, 130 | Footer, sidebar, deep section backgrounds |
| `--blue-primary` | `#1B4AD4` | 27, 74, 212 | **Main brand colour** — buttons, links, active states, headings on light bg |
| `--blue-mid` | `#2A5EE8` | 42, 94, 232 | Hover states, gradient lighter ends |
| `--blue-pale` | `#EEF2FF` | 238, 242, 255 | Section background tints, tag backgrounds, subtle highlights |

### Gradient Combinations

```css
/* Hero / dark sections */
background: linear-gradient(160deg, #070F2B 0%, #0E2A82 50%, #1B4AD4 100%);

/* Page headers (inner pages) */
background: linear-gradient(135deg, #070F2B 0%, #0E2A82 60%, #1B4AD4 100%);

/* Brand statement / CTA */
background: linear-gradient(135deg, #070F2B 0%, #0E2A82 50%, #1B4AD4 100%);

/* Overlay on photos (for text readability) */
background: rgba(7, 15, 43, 0.75);

/* Bottom-up gradient on hero (cinematic) */
background: linear-gradient(to top, rgba(7,15,43,0.97) 0%, rgba(7,15,43,0.75) 30%, rgba(7,15,43,0.30) 60%, transparent 100%);
```

---

## Neutrals

| Token | Hex | Usage |
|-------|-----|-------|
| White | `#FFFFFF` | Page backgrounds, cards, buttons on dark bg |
| `--gray-50` | `#F8FAFC` | Subtle page background tint |
| `--gray-100` | `#F1F5F9` | Dividers, borders |
| `--gray-200` | `#E2E8F0` | Input borders, card borders |
| `--gray-500` | `#64748B` | Body text, secondary copy |
| `--gray-700` | `#334155` | Strong body text |
| `--gray-900` | `#0F172A` | Headings, primary text |

Alternate section background: `#F5F7FF` (slightly blue-tinted white — used for alternating service strips)

---

## Semantic Colours

Used only for status indicators in the admin panel, never on marketing pages.

| Colour | Hex | Use |
|--------|-----|-----|
| Success green | `#059669` | Completed, active, delivered |
| Warning amber | `#D97706` | Pending, in progress |
| Error red | `#DC2626` | Failed, cancelled, rejected |
| Info blue | `#0891B2` | Informational states |

---

## Colour Rules

- **Never** use the semantic colours decoratively on public pages
- **Never** introduce a new blue that isn't on the primary palette
- Buttons on dark backgrounds: always `btn-white` (white fill, blue text)
- Buttons on light backgrounds: always `btn-primary` (blue fill, white text)
- Overlay tints on service strip photos use each service's `overlayColor` — see `app/page.tsx`
