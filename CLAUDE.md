@AGENTS.md

# Fraogo — Claude Context

## Repo
- Push only to `fraogo` remote → https://github.com/Fraogo/website.git
- Never push to `origin` (DevMarvellous/fraogo.git)
- Never push without explicit user approval

## Stack Gotchas
- Next.js 16.2.6, App Router, React 19
- `params` and `searchParams` are **Promises** — always `await` them
- Use `proxy.ts` not `middleware.ts` — do not create middleware.ts
- `"build": "prisma generate && next build"` — Prisma client must generate before build
- Tailwind v4 — configured via `@import "tailwindcss"` in globals.css

## Server vs Client Components
- Server Components cannot have event handler props (`onError`, `onClick`, etc.)
- Never use `next/image` with `onError` — breaks static prerender
- Use plain `<img>` + `useState` inside `'use client'` components for logo/image fallbacks

## Design Rules (non-negotiable)
- Style: logistics/freight company — DHL/Maersk pattern, not SaaS startup
- No icon grids on marketing pages — no `Package`, `Truck`, `Wrench`, `ShieldCheck` as decorative headers
- No fake claims — only confirmed fact is CAC RC8967311 (footer + brand statement only)
- "Why Choose Us" is permanently removed — do not add it back
- Full-bleed photography with CSS gradient fallback (no JS image loading needed)
- Text left-aligned, never centred hero layout

## Brand
- Colours: `#070F2B` (darkest) · `#0E2A82` (deep) · `#1B4AD4` (primary) · `#2A5EE8` (mid) · `#EEF2FF` (pale)
- Font: Plus Jakarta Sans (Google Fonts via CSS `@import` in globals.css)

## Key Files
- `content/index.ts` — all site copy, contact info, team, company details. Edit here for text changes.
- `app/globals.css` — all component classes (`.btn-primary`, `.form-input`, `.section-container`, etc.)

## Image Fallback Pattern
Three stacked divs (CSS only, works in Server Components — no JS):
```html
<div class="relative overflow-hidden">
  <div class="absolute inset-0" style="background: #0E2A82" />          <!-- gradient fallback -->
  <div class="absolute inset-0 bg-cover bg-center"
       style="background-image: url('/images/hero-bg.jpg')" />           <!-- photo (ignored if missing) -->
  <div class="absolute inset-0" style="background: rgba(7,15,43,0.75)"/> <!-- readability overlay -->
</div>
```

## Non-Obvious Behaviour
- Team section only renders when member `name` does not start with `[` (filter in about page)
- Stats section only renders when `company.stats` array is non-empty (currently empty — intentional)
- Logo files in `public/logo/` are currently `.jpeg` — navbar code expects `.png`; shows text fallback until renamed
