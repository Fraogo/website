@AGENTS.md

# Fraogo — Project Instructions for Claude

---

## Repository

| Remote | URL | Purpose |
|--------|-----|---------|
| `fraogo` | https://github.com/Fraogo/website.git | **Official repo — push here only** |
| `origin` | https://github.com/DevMarvellous/fraogo.git | Personal fork — never push here |

**Rule:** Only push to the `fraogo` remote. Never push to `origin`. Never push at all without explicit user approval.

---

## What Fraogo Is

Fraogo is a registered Nigerian multi-service platform (CAC RC8967311), headquartered in Ikeja, Lagos. Founded 2024.

It solves one problem: Nigerian businesses and individuals struggle to reliably source products, coordinate shipments, and find trustworthy service providers. Fraogo handles all three under one roof:

| Service | What it does |
|---------|-------------|
| **Procurement** | Source products locally (within Nigeria) or internationally (import from anywhere). Fraogo handles supplier contact, documentation, and delivery. |
| **Logistics** | Ship goods internationally (send abroad) or transport cargo within Nigeria. Fraogo coordinates the freight/transport. |
| **General Services** | Hire verified vendors for events/projects, or place bulk supply orders (drinks, water, event materials, etc.). |

The business model: customer submits a request form → Fraogo team contacts them within 24–48 hours → Fraogo executes → customer tracks via tracking number.

---

## Competitive Landscape (Opponents)

Fraogo competes in the Nigerian logistics and procurement space. Key players in each vertical:

**Procurement / sourcing:**
- Jiji Nigeria — classifieds/marketplace (no managed sourcing)
- Jumia Business — B2B e-commerce (no custom import service)
- Individual clearing agents / freight forwarders (fragmented, informal)

**Logistics / freight:**
- DHL Nigeria — international courier (premium pricing, consumer-focused)
- FedEx Nigeria — international courier (premium pricing)
- GIG Logistics — domestic Nigerian freight and parcel
- Sendbox — e-commerce fulfilment and delivery for Nigerian sellers
- Kwik Delivery — last-mile Lagos delivery

**Vendor marketplace / general services:**
- Vendease — food/beverage supply for hospitality
- Terawork — freelancer/professional services marketplace
- Fiverr / Upwork — global, not Nigeria-specific

**Fraogo's positioning:** Handles all three categories as a single managed service — not a marketplace where you deal with the vendor/agent yourself. Fraogo acts as the intermediary and takes accountability end-to-end.

---

## System Map — All Pages & Routes

### Public-facing

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Homepage — hero, services strips, how we work, brand statement, track, CTA |
| `/about` | `app/about/page.tsx` | Company story, mission/vision, values, team |
| `/services` | `app/services/page.tsx` | Overview of all 3 services with process steps |
| `/contact` | `app/contact/page.tsx` | Contact form + prominent phone/email/address |
| `/track` | `app/track/page.tsx` | Real-time order tracking by reference number |
| `/blog` | `app/blog/page.tsx` | Blog post listing |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | Individual blog post |

### Procurement

| Route | File | Description |
|-------|------|-------------|
| `/procurement/nigeria` | `app/procurement/nigeria/page.tsx` | Order form — source products within Nigeria |
| `/procurement/international` | `app/procurement/international/page.tsx` | Order form — import from outside Nigeria |
| `/procurement/cart` | `app/procurement/cart/page.tsx` | Cart / review before submission |
| `/procurement/success` | `app/procurement/success/page.tsx` | Order confirmed page |

### Logistics

| Route | File | Description |
|-------|------|-------------|
| `/logistics/delivery` | `app/logistics/delivery/page.tsx` | Form — ship goods internationally |
| `/logistics/relocation` | `app/logistics/relocation/page.tsx` | Form — cargo transport within Nigeria |

### General Services

| Route | File | Description |
|-------|------|-------------|
| `/general-service/rental` | `app/general-service/rental/page.tsx` | Browse verified vendors |
| `/general-service/rental/hire-vendor` | `app/general-service/rental/hire-vendor/page.tsx` | Form — hire a listed vendor |
| `/general-service/rental/register-vendor` | `app/general-service/rental/register-vendor/page.tsx` | Form — register as a vendor |
| `/general-service/supply` | `app/general-service/supply/page.tsx` | Form — bulk supply order |

### Admin Panel (`/admin`)

Password-protected. Admin manages all incoming orders and publishes content.

| Route | File | Description |
|-------|------|-------------|
| `/admin` | `app/admin/page.tsx` | Dashboard — order counts and recent activity |
| `/admin/login` | `app/admin/login/page.tsx` | Login page |
| `/admin/orders` | `app/admin/orders/page.tsx` | Procurement orders list |
| `/admin/deliveries` | `app/admin/deliveries/page.tsx` | Send-abroad delivery orders |
| `/admin/relocations` | `app/admin/relocations/page.tsx` | Local transport orders |
| `/admin/supply-orders` | `app/admin/supply-orders/page.tsx` | Supply orders |
| `/admin/vendor-requests` | `app/admin/vendor-requests/page.tsx` | Hire-vendor requests |
| `/admin/vendors` | `app/admin/vendors/page.tsx` | Registered vendor profiles |
| `/admin/contacts` | `app/admin/contacts/page.tsx` | Contact form submissions |
| `/admin/tracking` | `app/admin/tracking/page.tsx` | All tracking records |
| `/admin/tracking/new` | `app/admin/tracking/new/page.tsx` | Create new tracking record |
| `/admin/tracking/[id]` | `app/admin/tracking/[id]/page.tsx` | Add update to a tracking record |
| `/admin/blog` | `app/admin/blog/page.tsx` | Blog post management |
| `/admin/blog/new` | `app/admin/blog/new/page.tsx` | Write new post |
| `/admin/blog/[id]` | `app/admin/blog/[id]/page.tsx` | Edit existing post |
| `/admin/invoice` | `app/admin/invoice/page.tsx` | Invoice management |

---

## Stack

- **Next.js 16.2.6** — App Router, React 19
- `params` and `searchParams` are **Promises** — always `await` them
- **`proxy.ts`** replaces `middleware.ts` — do not create `middleware.ts`
- **Prisma** — run `prisma generate` before build (already in package.json `"build"` script)
- **Tailwind v4** via `@import "tailwindcss"` in globals.css

---

## Design Rules

- Style: **logistics/freight company** (DHL / Maersk pattern) — not SaaS startup
- Full-bleed photography with gradient fallback (CSS `background-image` — no JS needed)
- Left-aligned text on most sections; never centred hero layout
- **No icon grids** on any marketing page — no `Package`, `Truck`, `Wrench`, `ShieldCheck` etc. as decorative headers
- **No fake claims** — the only confirmed fact is CAC registration RC8967311
- "Why Choose Us" section is permanently removed
- CAC number appears in: footer prose + homepage brand statement only

## Server vs Client Components

- Server Components cannot have `onError`, `onClick`, or any event handler props
- Use plain `<img>` + `useState` in Client Components for image error handling
- Do NOT use `next/image` with `onError` — it breaks prerender

## Brand Colours

```
#070F2B  — darkest navy (hero, dark sections)
#0E2A82  — deep blue
#1B4AD4  — primary blue (buttons, links)
#2A5EE8  — mid blue
#EEF2FF  — pale blue (section tints)
```

## Font

Plus Jakarta Sans (Google Fonts, loaded via CSS `@import` in globals.css)

## Content File

All site text, contact info, team data, and company details live in `content/index.ts`.
Edit that file to update copy — no other files need changing for text edits.

## CSS Classes (defined in globals.css)

```
.btn-primary       — blue filled button
.btn-outline       — blue outline button
.btn-white         — white button (for dark backgrounds)
.form-input        — styled input / select / textarea
.form-label        — label above inputs
.section-container — max-w-80rem centred, responsive padding
.section-padding   — py-[4.5rem] lg:py-[6rem]
.page-header       — dark blue gradient banner for inner pages
.card-hover        — lift-on-hover transition
.shadow-soft / .shadow-card / .shadow-elevated
.hover-lift        — translateY(-2px) on hover
```

## Image Fallback Pattern

Every image section stacks 3 layers (all CSS, no JS, works in Server Components):

```html
<div class="relative overflow-hidden">
  <!-- 1. Colour/gradient fallback — always visible -->
  <div class="absolute inset-0" style="background: #0E2A82" />
  <!-- 2. Photo — CSS silently ignores missing files -->
  <div class="absolute inset-0 bg-cover bg-center"
       style="background-image: url('/images/hero-bg.jpg')" />
  <!-- 3. Dark overlay for text readability -->
  <div class="absolute inset-0" style="background: rgba(7,15,43,0.75)" />
</div>
```

---

## Asset Structure

Drop all assets in `public/`. The site works without any images (gradient fallback shows).

```
public/
│
├── favicon.ico                  ← browser favicon (app/favicon.ico was deleted)
│
├── logo/
│   ├── logo.png                 ← full-colour logo (light backgrounds / dark navbars)
│   └── logo-white.png           ← white version (dark backgrounds)
│                                   NOTE: current files are .jpeg — rename to .png
│
├── images/
│   ├── hero-bg.jpg              ← homepage hero          recommended: 1920×1080
│   ├── cta-bg.jpg               ← CTA banner             recommended: 1920×600
│   ├── about-hero-bg.jpg        ← About page header      recommended: 1920×600
│   ├── services-hero-bg.jpg     ← Services page header   recommended: 1920×600
│   └── services/
│       ├── procurement.jpg      ← Procurement strip      recommended: 800×500
│       ├── logistics.jpg        ← Logistics strip        recommended: 800×500
│       └── general.jpg          ← General Services strip recommended: 800×500
│
└── team/
    ├── member-1.jpg             ← team member photo      square, min 400×400
    ├── member-2.jpg
    └── member-3.jpg
```

Image subject ideas: cargo ports, shipping containers, trucks on Nigerian roads, warehouse interiors, people working in an office/logistics context.

---

## Conditional Sections

- **Team section** only renders when a member's `name` in `content/index.ts` does NOT start with `[`
- **Stats section** only renders when `company.stats` array is non-empty (currently empty — no fake numbers)

## Contact Details (from `content/index.ts`)

- Phone: `+234 802 822 9002`
- Email: `fraogo6@gmail.com`
- WhatsApp: `2348028229002` (digits only, no `+`)
- Address: Plot 35b, Abisogun Leigh str, Ikeja, Lagos-State, Nigeria
