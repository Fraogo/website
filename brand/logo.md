# Fraogo Logo

## Files (`public/logo/`)

| File | Background | Use |
|------|-----------|-----|
| `logo.png` | Transparent | Light pages/cards/navbars |
| `logo-white.png` | Transparent | Dark backgrounds, hero, dark/scrolled navbars |

> Current files are `.jpeg` — replace with `.png` for transparency. Code expects `.png`.

## Placement

- **Navbar:** `logo-white.png` over hero (transparent), `logo.png` when scrolled (solid white). Height `36px` (`h-9`), max width `120px`, `object-contain`. Falls back to text **"F FRAOGO"** if image fails (`Navbar.tsx`).
- **Admin sidebar:** always dark → `logo-white.png`. Same dimensions.
- **Footer:** text-only **"F · FRAOGO"** — no image logo.

## Clearspace

Minimum clearspace = height of the logo's "F" on all sides. Never place on a busy photo/dark pattern without a clear backing.

## Don'ts

- Don't stretch, distort, tint, or colour-filter the logo.
- Don't put `logo.png` (full colour) on dark bg — use `logo-white.png`. Don't put `logo-white.png` on light bg.
- Don't use smaller than 80px wide.

## Fallback Text Mark

When the image is unavailable: `F FRAOGO` — `F` in brand blue (`#1B4AD4`), `FRAOGO` in dark text, bold. Must always be readable.
