# Fraogo Logo

## Files

| File | Background | Use |
|------|-----------|-----|
| `public/logo/logo.png` | Transparent | White pages, light cards, light navbars |
| `public/logo/logo-white.png` | Transparent | Dark backgrounds, hero sections, dark/scrolled navbars |

> Current files are `.jpeg` — replace with `.png` versions for correct transparency support.

---

## Placement

### Navbar
- Scrolled (solid white navbar): `logo.png`
- Transparent (over hero): `logo-white.png`
- Height: `36px` (`h-9`), width: `120px` max, `object-contain`
- Falls back to text **"F FRAOGO"** if image fails to load (handled in `Navbar.tsx`)

### Admin Sidebar
- Always dark background → `logo-white.png`
- Same dimensions as navbar

### Footer
- Text-only fallback: **"F · FRAOGO"** — no image logo in footer

---

## Clearspace

Maintain a minimum clearspace equal to the height of the logo's letter "F" on all sides.
Never place the logo directly against a busy photo or dark-pattern background without a clear backing.

---

## Don'ts

- Do not stretch or distort the logo
- Do not apply colour filters or tints to the logo
- Do not place `logo.png` (full colour) on a dark background — use `logo-white.png`
- Do not place `logo-white.png` on a white or light background
- Do not use a logo size smaller than 80px wide

---

## Fallback Text Mark

When the logo image is unavailable, the site shows:

```
F FRAOGO
```

Styled as: bold, brand blue (`#1B4AD4`) for `F`, dark text for `FRAOGO`.
This is intentional — it must always be readable.
