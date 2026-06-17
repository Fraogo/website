# Fraogo Colour Palette

## Primary Brand Blues

The core identity colours. All blues must come from this scale — never introduce a new blue.

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--blue-deep` | `#070F2B` | 7, 15, 43 | Hero/dark backgrounds, deepest gradients |
| `--blue-dark` | `#0E2A82` | 14, 42, 130 | Footer, sidebar, deep section backgrounds |
| `--blue-primary` | `#1B4AD4` | 27, 74, 212 | **Main brand** — buttons, links, active states, headings on light bg |
| `--blue-mid` | `#2A5EE8` | 42, 94, 232 | Hover states, gradient lighter ends |
| `--blue-pale` | `#EEF2FF` | 238, 242, 255 | Section tints, tag backgrounds, subtle highlights |

### Gradients

```css
/* Hero / dark sections */      linear-gradient(160deg, #070F2B 0%, #0E2A82 50%, #1B4AD4 100%);
/* Inner page headers */        linear-gradient(135deg, #070F2B 0%, #0E2A82 60%, #1B4AD4 100%);
/* Brand statement / CTA */     linear-gradient(135deg, #070F2B 0%, #0E2A82 50%, #1B4AD4 100%);
/* Photo overlay (readability) */ rgba(7, 15, 43, 0.75);
/* Cinematic bottom-up hero */  linear-gradient(to top, rgba(7,15,43,0.97) 0%, rgba(7,15,43,0.75) 30%, rgba(7,15,43,0.30) 60%, transparent 100%);
```

## Neutrals

| Token | Hex | Usage |
|-------|-----|-------|
| White | `#FFFFFF` | Page backgrounds, cards, buttons on dark bg |
| `--gray-50` | `#F8FAFC` | Subtle page tint |
| `--gray-100` | `#F1F5F9` | Dividers, borders |
| `--gray-200` | `#E2E8F0` | Input/card borders |
| `--gray-500` | `#64748B` | Body text, secondary copy |
| `--gray-700` | `#334155` | Strong body text |
| `--gray-900` | `#0F172A` | Headings, primary text |

Alternating service strip background: `#F5F7FF` (blue-tinted white).

## Semantic Colours

Admin status indicators **only** — never decorative, never on marketing pages.

| Colour | Hex | Use |
|--------|-----|-----|
| Success | `#059669` | Completed, active, delivered |
| Warning | `#D97706` | Pending, in progress |
| Error | `#DC2626` | Failed, cancelled, rejected |
| Info | `#0891B2` | Informational states |

## Rules

- Never use semantic colours decoratively on public pages.
- Never introduce a blue outside the primary palette.
- Buttons on dark bg: `btn-white` (white fill, blue text). On light bg: `btn-primary` (blue fill, white text).
- Service strip photo overlays use each service's `overlayColor` — see `app/page.tsx`.
