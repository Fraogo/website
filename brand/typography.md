# Fraogo Typography

## Primary Typeface

**Plus Jakarta Sans**
Source: Google Fonts
Load method: CSS `@import` in `app/globals.css`

```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&display=swap');
```

Plus Jakarta Sans is a modern geometric sans-serif. It is clean, professional, and confident — suited for a logistics and services brand. It is the **only** typeface used across the entire site.

---

## Weights in Use

| Weight | Name | Use |
|--------|------|-----|
| 300 | Light | Rarely used — large decorative text only |
| 400 | Regular | Body copy, descriptions, secondary text |
| 500 | Medium | UI labels, navigation items |
| 600 | SemiBold | Subheadings, emphasis, form labels |
| 700 | Bold | Section headings |
| 800 | ExtraBold | Page headings, hero subtext |
| 900 | Black *(via Tailwind `font-black`)* | Main headings, h1, large numerals — renders as 800 since Plus Jakarta Sans maxes at 800 |

---

## Responsive Size Scale

All marketing headings use `clamp()` for fluid scaling — no hard breakpoint jumps.

| Element | CSS | Range |
|---------|-----|-------|
| Hero h1 | `clamp(2.5rem, 8vw, 5rem)` | 40px → 80px |
| Section h2 | `text-3xl lg:text-4xl` | 30px → 36px |
| Section h2 (large) | `text-3xl lg:text-5xl` | 30px → 48px |
| Service strip h3 | `text-2xl sm:text-3xl lg:text-4xl` | 24px → 36px |
| Body / description | `text-sm sm:text-[15px]` | 14px → 15px |
| Labels / overlines | `text-xs font-bold uppercase tracking-widest` | 12px always |
| CTA heading | `clamp(1.75rem, 5vw, 3rem)` | 28px → 48px |

---

## Overline / Label Style

Used above section headings to signal what the section is about:

```html
<p class="text-xs font-bold uppercase tracking-widest text-[#1B4AD4]">
  What We Do
</p>
```

Rules:
- Always `#1B4AD4` on light backgrounds
- Always `text-blue-300` or `text-blue-400` on dark backgrounds
- Always uppercase + widest tracking
- Never more than 3–4 words

---

## Typography Rules

- **Headings:** `font-black` (renders as 800), tight `leading-[1.0]` to `leading-tight`
- **Body:** `font-normal` (400), `leading-relaxed` (1.625)
- **No system fonts** on any public page — always Plus Jakarta Sans
- **No decorative serif or display fonts** — the brand is clean and modern
- **No all-caps headings** — only labels/overlines use uppercase
