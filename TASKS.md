# Fraogo — Things To Do

Your personal checklist. (CLAUDE.md is for the AI assistant; **this file is for you.**)
Tick items off as you go. Two kinds of tasks: **in the code/repo** and **outside** (Supabase, Resend, Vercel, assets).

---

## 🎨 Assets to add (drop into `public/`)

> The site works without these — a blue gradient shows as a fallback — but real photos make it look finished.

- [ ] **Logo** → `public/logo/logo.png` and `public/logo/logo-white.png`
      Current files are `.jpeg`, so the navbar shows the text "F FRAOGO" fallback for now.
      **Use PNG (or SVG) for the logo — see "Logo format" note at the bottom.**
- [ ] **Favicon** → `public/favicon.ico` (shows in the browser tab)
- [ ] **Social share image** → `public/og-image.jpg` (1200×630) — used for link previews on WhatsApp/Twitter/Facebook
- [ ] **Homepage hero** → `public/images/hero-bg.jpg` (1920×1080)
- [ ] **CTA banner** → `public/images/cta-bg.jpg` (1920×600)
- [ ] **About page header** → `public/images/about-hero-bg.jpg` (1920×600)
- [ ] **Services page header** → `public/images/services-hero-bg.jpg` (1920×600)
- [ ] **Service strip photos** (800×500 each):
      `public/images/services/procurement.jpg` · `logistics.jpg` · `general.jpg`
- [ ] **Team photos** (square, min 400×400) → `public/team/member-1.jpg`, `member-2.jpg`, …
      Then fill in real names in `content/index.ts` (members whose name starts with `[` stay hidden).

---

## ✍️ Content to finalise (edit `content/index.ts`)

- [ ] Real team member names, roles, and bios (currently placeholders → team section is hidden until filled)
- [ ] Confirm contact details are correct (phone, email `fraogo6@gmail.com`, address)
- [ ] Add a Google Maps embed URL for the contact page (`contact.googleMapsEmbedUrl`) — optional
- [ ] Double-check social media links point to the real Fraogo accounts

---

## 🔧 Outside the code (services & dashboards)

### Supabase (database)
- [ ] Confirm `npx prisma db push` has been run so all tables exist
- [ ] Keep the database password safe — it lives only in `.env` (never commit `.env`)

### Resend (email)
- [ ] Create a Resend account and get an API key → set `RESEND_API_KEY`
- [ ] **Verify the `fraogo.com` domain in Resend** so emails can send from `noreply@fraogo.com`.
      (Resend can't send "from" a Gmail address — it must be your own verified domain.)
- [ ] Set `ADMIN_EMAIL=fraogo6@gmail.com` so order/contact notifications reach you
      (it already defaults to this, but setting it explicitly is cleaner)

### Vercel (hosting)
- [ ] Add **every** variable from `.env` into Vercel → Project → Settings → Environment Variables:
      `DATABASE_URL`, `DIRECT_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `ADMIN_LOGIN_EMAIL`,
      `ADMIN_LOGIN_PASSWORD_HASH`, `RESEND_API_KEY`, `EMAIL_FROM`, `ADMIN_EMAIL`
- [ ] Set `NEXT_PUBLIC_SITE_URL` to your live domain (e.g. `https://fraogo.com`) — used by the
      sitemap and robots files for SEO
- [ ] Point the `fraogo.com` domain at the Vercel project

---

## 🔐 Security — needs your action (outside the code)

- [ ] **Supabase Storage policies (important).** NIN documents upload from the browser using the
      anon key. In Supabase → Storage, make sure:
      - `vendor-documents` bucket is **Private** with an RLS policy that only allows uploads (no
        public read). Admins read it via short-lived signed URLs (already handled in code).
      - `vendor-portfolio` bucket is public-read but restrict who can upload/delete.
- [ ] Set `SUPABASE_URL` in your env (the portfolio image-URL allowlist depends on it).

## 🔐 Optional hardening (later, not urgent)

- [ ] Admin-login rate limiter is in-memory (resets on restart / per serverless instance). For
      stronger protection move it to a durable store like **Upstash Redis**. Fine for launch.
- [ ] Magic-link vendor tokens use `cuid()`. For a security token, a crypto-random value
      (`crypto.randomUUID()`) is stronger. Low priority — links already expire in 7 days.
- [ ] The Content-Security-Policy allows inline scripts (needed for Next.js hydration without
      extra setup). For a stricter CSP, switch to nonce-based scripts later.

---

## 💡 Logo format — which loads faster?

For a **logo** (flat colours, sharp edges, needs a transparent background):

| Format | Verdict |
|--------|---------|
| **SVG** | 🥇 Best — tiny file, infinitely sharp at any size, transparent. Use this if you have a vector version. |
| **PNG** | 🥈 Good — transparent, crisp. What the code expects. Small logos are only a few KB. |
| **JPEG** | 🚫 Avoid for logos — no transparency (you'd get a white box on the dark navbar) and lossy edges/halos. |

**Recommendation:** export the logo as **SVG** if you can, otherwise **PNG** with a transparent
background. JPEG is only good for *photographs* (hero/service images) — for those, **WebP** is even
faster than JPEG if your editor can export it.
