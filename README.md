# Fraogo

Nigerian multi-service platform for procurement, logistics, and general services.
**CAC Registered: RC8967311** · Ikeja, Lagos · Founded 2024 · https://github.com/Fraogo/website.git

---

## What It Does

Nigerian businesses and individuals struggle to reliably source products, coordinate shipments, and find trustworthy service providers. Fraogo handles all three as a managed, end-to-end service:

| Service | What Fraogo does |
|---------|------------------|
| **Procurement** | Sources products locally or internationally — supplier contact, documentation, delivery. |
| **Logistics** | Ships goods internationally or transports cargo within Nigeria. |
| **General Services** | Verified vendors for events/projects, plus bulk supply orders (drinks, water, event materials). |

**Flow:** Customer submits request → Fraogo contacts them in 24–48h → Fraogo executes → Customer tracks by reference number.

**Position vs competitors** (Procurement: Jiji, Jumia Business · Logistics: DHL, FedEx, GIG, Sendbox, Kwik · General: Vendease, Terawork): all three as one managed service — not a marketplace where the customer deals with vendors directly.

---

## Site Map

**Public:** `/` · `/about` · `/services` · `/contact` · `/track` (by reference number) · `/blog` · `/blog/[slug]`

**Procurement:** `/procurement/nigeria` · `/procurement/international` · `/procurement/cart` · `/procurement/success`

**Logistics:** `/logistics/delivery` (international) · `/logistics/relocation` (within Nigeria)

**General Services:** `/general-service/rental` (browse vendors) · `…/rental/hire-vendor` · `…/rental/register-vendor` · `/general-service/supply` (bulk order)

**Admin** (`/admin`, password-protected — manages all orders + content):
`/admin` dashboard · `/orders` · `/deliveries` · `/relocations` · `/supply-orders` · `/vendor-requests` · `/vendors` · `/contacts` · `/tracking` (+ `/new`, `/[id]`) · `/blog` (+ `/new`, `/[id]`) · `/invoice`

---

## Asset Structure

Drop files in `public/`. Site works without images — gradient fallback shows until photos are added.

```
public/
├── favicon.ico
├── logo/  logo.png (light bg) · logo-white.png (dark bg)   NOTE: current files are .jpeg — rename to .png
├── images/
│   ├── hero-bg.jpg (1920×1080) · cta-bg.jpg (1920×600)
│   ├── about-hero-bg.jpg · services-hero-bg.jpg (1920×600)
│   └── services/  procurement.jpg · logistics.jpg · general.jpg (800×500)
└── team/  member-1.jpg … (square, min 400×400)
```

Photo ideas: cargo ports, shipping containers, trucks on Nigerian roads, warehouse interiors, logistics scenes.

---

## Setup

```bash
npm install                       # 1. dependencies
cp .env.example .env              # 2. fill in secrets (see below)
npx prisma db push                # 3. create DB tables (once, on fresh DB)
npm run dev                       # 4. run locally
```

**`.env`** — URL-encode special characters in the DB password (`?` → `%3F`). Password: Supabase Dashboard → Settings → Database.
```
DATABASE_URL="postgresql://postgres.weuclpucfwltxqhxsava:YOUR-PASSWORD@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.weuclpucfwltxqhxsava:YOUR-PASSWORD@aws-0-eu-west-1.pooler.supabase.com:5432/postgres"
```
Also: `NEXTAUTH_SECRET` via `openssl rand -base64 32`, and admin password hash via `npx tsx scripts/hash-password.ts`.

**Deploy (Vercel):** add all `.env` variables in Project → Settings → Environment Variables. Build runs `prisma generate` automatically.

---

## Tech Stack

Next.js 16.2.6 (App Router, React 19) · Prisma (`prisma/schema.prisma`) · Supabase PostgreSQL (`weuclpucfwltxqhxsava`) · Tailwind CSS v4 · Resend (email) · Vercel (hosting).

**Content:** all site copy lives in `content/index.ts` — edit there for text, contact details, team, or company info.
