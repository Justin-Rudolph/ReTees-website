# /public/images — Asset Replacement Guide

Drop real images here and update the corresponding TODO comments in the source files.

| Filename                    | Used in               | Replaces                       |
|-----------------------------|-----------------------|--------------------------------|
| `retees-logo.png`           | Header.tsx            | Text "ReTees" logo             |
| `retees-logo-white.png`     | Footer.tsx            | Text "ReTees" logo (footer)    |
| `favicon.svg` (or .ico)     | index.html            | Default Vite favicon           |
| `hero-artwork.jpg`          | HeroSection.tsx       | `.hero-art-bg` gradient div    |
| `artwork-1.jpg` … `artwork-6.jpg` | ArtworkCarousel.tsx | `.art-bg-1` … `.art-bg-6` divs |
| `heritage-isles.jpg`        | TournamentSection.tsx | `.tournament-bg` gradient div  |
| `retees-hat-product.jpg`    | HatSection.tsx        | `.hat-placeholder-bg` div      |

## How to swap a placeholder image

1. Add the image file to this folder.
2. Find the `TODO` comment in the component (search for `TODO: Replace`).
3. Replace the `<div className="...bg...">` placeholder with an `<img>` tag.

Example:
```tsx
// Before (placeholder)
<div className="hero-art-bg w-full rounded-2xl" style={{ aspectRatio: '3/4' }} />

// After (real image)
<img
  src="/images/hero-artwork.jpg"
  alt="ReTees custom golf artwork made from recycled tees"
  className="w-full rounded-2xl object-cover"
  style={{ aspectRatio: '3/4' }}
/>
```
