# Fraogo Typography

## Typeface — Plus Jakarta Sans (only)

A modern geometric sans-serif. Clean, professional, confident. The **only** typeface used site-wide. Loaded via CSS `@import` in `app/globals.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&display=swap');
```

## Weights

| Weight | Use |
|--------|-----|
| 300 Light | Rare — large decorative text only |
| 400 Regular | Body copy, descriptions, secondary text |
| 500 Medium | UI labels, nav items |
| 600 SemiBold | Subheadings, emphasis, form labels |
| 700 Bold | Section headings |
| 800 ExtraBold | Page headings, hero subtext |
| `font-black` | h1, large numerals — **renders as 800** (Plus Jakarta Sans maxes at 800) |

## Responsive Size Scale

Marketing headings use `clamp()` for fluid scaling — no hard breakpoint jumps.

| Element | CSS | Range |
|---------|-----|-------|
| Hero h1 | `clamp(2.5rem, 8vw, 5rem)` | 40→80px |
| Section h2 | `text-3xl lg:text-4xl` | 30→36px |
| Section h2 (large) | `text-3xl lg:text-5xl` | 30→48px |
| Service strip h3 | `text-2xl sm:text-3xl lg:text-4xl` | 24→36px |
| Body | `text-sm sm:text-[15px]` | 14→15px |
| Labels / overlines | `text-xs font-bold uppercase tracking-widest` | 12px |
| CTA heading | `clamp(1.75rem, 5vw, 3rem)` | 28→48px |

## Overline / Label

Above section headings to signal the section's topic:

```html
<p class="text-xs font-bold uppercase tracking-widest text-[#1B4AD4]">What We Do</p>
```

- `#1B4AD4` on light bg · `text-blue-300/400` on dark bg
- Always uppercase + widest tracking · never more than 3–4 words

## Rules

- Headings: `font-black` (=800), `leading-[1.0]`→`leading-tight`
- Body: `font-normal` (400), `leading-relaxed`
- No system fonts, no serif/display fonts anywhere
- No all-caps headings — uppercase is for labels/overlines only
