# Fraogo

Nigerian multi-service platform for procurement, logistics, and general services.
**CAC Registered: RC8967311** · Ikeja, Lagos · Founded 2024

> https://github.com/Fraogo/website.git

---

## What It Does

Fraogo solves one problem: Nigerian businesses and individuals struggle to reliably source products, coordinate shipments, and find trustworthy service providers. Fraogo handles all three:

| Service | Description |
|---------|-------------|
| **Procurement** | Source products locally (Nigeria) or internationally (import). Fraogo handles supplier contact, documentation, and delivery. |
| **Logistics** | Ship goods internationally or transport cargo within Nigeria. Fraogo coordinates the freight/transport. |
| **General Services** | Hire verified vendors for events/projects, or place bulk supply orders (drinks, water, event materials, etc.). |

**How it works:** Customer submits a request → Fraogo team contacts them within 24–48 hours → Fraogo executes → Customer tracks by reference number.

---

## Competitive Landscape

| Vertical | Competitors |
|----------|-------------|
| Procurement | Jiji, Jumia Business, individual clearing agents |
| Logistics | DHL Nigeria, FedEx, GIG Logistics, Sendbox, Kwik Delivery |
| General Services | Vendease, Terawork |

**Fraogo's position:** All three as a managed, end-to-end service — not a marketplace where the customer deals with vendors directly.

---

## Site Map

### Public Pages
| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/about` | Company story, mission/vision, values, team |
| `/services` | Overview of all 3 services |
| `/contact` | Contact form + phone/email/address |
| `/track` | Real-time order tracking by reference number |
| `/blog` | Blog post listing |
| `/blog/[slug]` | Individual blog post |

### Procurement
| Route | Description |
|-------|-------------|
| `/procurement/nigeria` | Order form — source within Nigeria |
| `/procurement/international` | Order form — import from abroad |
| `/procurement/cart` | Review before submission |
| `/procurement/success` | Order confirmed |

### Logistics
| Route | Description |
|-------|-------------|
| `/logistics/delivery` | Form — ship goods internationally |
| `/logistics/relocation` | Form — cargo transport within Nigeria |

### General Services
| Route | Description |
|-------|-------------|
| `/general-service/rental` | Browse verified vendors |
| `/general-service/rental/hire-vendor` | Form — hire a vendor |
| `/general-service/rental/register-vendor` | Form — register as a vendor |
| `/general-service/supply` | Form — bulk supply order |

### Admin (`/admin`)
Password-protected. Manages all incoming orders and content.

| Route | Description |
|-------|-------------|
| `/admin` | Dashboard |
| `/admin/orders` | Procurement orders |
| `/admin/deliveries` | International delivery orders |
| `/admin/relocations` | Local transport orders |
| `/admin/supply-orders` | Supply orders |
| `/admin/vendor-requests` | Hire-vendor requests |
| `/admin/vendors` | Registered vendor profiles |
| `/admin/contacts` | Contact form submissions |
| `/admin/tracking` | Tracking records |
| `/admin/tracking/new` | Create tracking record |
| `/admin/tracking/[id]` | Add update to a record |
| `/admin/blog` | Blog management |
| `/admin/blog/new` | Write new post |
| `/admin/blog/[id]` | Edit post |
| `/admin/invoice` | Invoice management |

---

## Asset Structure

Drop all files in `public/`. The site works without images — gradient fallback shows until photos are added.

```
public/
├── favicon.ico                  ← browser favicon
├── logo/
│   ├── logo.png                 ← full-colour logo (light backgrounds)
│   └── logo-white.png           ← white version (dark backgrounds)
│                                   NOTE: current files are .jpeg — rename to .png
├── images/
│   ├── hero-bg.jpg              ← homepage hero          1920×1080
│   ├── cta-bg.jpg               ← CTA banner             1920×600
│   ├── about-hero-bg.jpg        ← About page header      1920×600
│   ├── services-hero-bg.jpg     ← Services page header   1920×600
│   └── services/
│       ├── procurement.jpg      ← Procurement strip      800×500
│       ├── logistics.jpg        ← Logistics strip        800×500
│       └── general.jpg          ← General Services strip 800×500
└── team/
    ├── member-1.jpg             ← team photo (square, min 400×400)
    ├── member-2.jpg
    └── member-3.jpg
```

Photo ideas: cargo ports, shipping containers, trucks on Nigerian roads, warehouse interiors, office/logistics scenes.

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Create `.env` file
Copy `.env.example` to `.env` and fill in the database password:
```
DATABASE_URL="postgresql://postgres.weuclpucfwltxqhxsava:YOUR-PASSWORD@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.weuclpucfwltxqhxsava:YOUR-PASSWORD@aws-0-eu-west-1.pooler.supabase.com:5432/postgres"
```
Find your password in: **Supabase Dashboard → Settings → Database → Database password**

Also generate a real `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

And hash the admin password:
```bash
npx tsx scripts/hash-password.ts
```

### 3. Push schema to Supabase
```bash
npx prisma db push
```
This creates all database tables. Run once on a fresh database.

### 4. Run locally
```bash
npm run dev
```

### 5. Deploy (Vercel)
Add all variables from `.env` into **Vercel → Project → Settings → Environment Variables**. The build script runs `prisma generate` automatically.

---

## Tech Stack

- **Next.js 16.2.6** — App Router, React 19
- **Prisma** — ORM, schema in `prisma/schema.prisma`
- **Supabase** — PostgreSQL database (project: `weuclpucfwltxqhxsava`)
- **Tailwind CSS v4**
- **Resend** — transactional email
- **Vercel** — hosting

## Content

All site copy lives in `content/index.ts`. Edit there to update text, contact details, team members, or company info — no other files need changing.
