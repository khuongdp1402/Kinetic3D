# Phase 3: Storefront UI - Technical Research

## What we need to build
- A responsive Next.js storefront (`/` and `/products`).
- Sticky Header with Meilisearch dropdown integration.
- Hero Carousel (mixed media: video + images, horizontal slide).
- Product Grid with 3D Tilt effect on hover (`react-parallax-tilt` or `framer-motion`).
- Styling: Cyber-Tech/Obsidian aesthetic (Tailwind + Aceternity UI).

## Dependencies Required
The current Next.js project has basic Tailwind v4 setup. We need to install:
```bash
npm install framer-motion clsx tailwind-merge meilisearch react-parallax-tilt lucide-react embla-carousel-react
```
*Note: `embla-carousel-react` is lightweight and great for the Hero Carousel. `lucide-react` for icons.*

## Integration Points
1. **Meilisearch:** 
   - Connect directly to `http://localhost:7700` using the `meilisearch` JS client.
   - Use a public search key if configured, or default master key for local dev.
   - The dropdown should debounce input and query the `products` index.
2. **MinIO Images:**
   - Display product thumbnails directly using their MinIO presigned or public URL.
3. **Backend API:**
   - Fetch featured products for the homepage from `.NET` backend.
   - Note: Since we have Meilisearch, the `/products` page filter and grid could actually just be powered by Meilisearch directly for instantaneous UI response, rather than querying `.NET`. Meilisearch is ideal for faceted search (Category + Price).

## Architecture & Patterns
- **Storefront Components (`src/components/storefront/`):**
  - `Header.tsx` (sticky, contains `Search.tsx`)
  - `Search.tsx` (Meilisearch logic + dropdown UI)
  - `HeroCarousel.tsx` (Embla + Framer Motion)
  - `ProductCard.tsx` (react-parallax-tilt)
  - `ProductGrid.tsx`
- **Pages (`src/app/`):**
  - `/page.tsx`: Uses `HeroCarousel` and featured `ProductGrid`.
  - `/products/page.tsx`: Uses `ProductGrid` with sidebar filters (Category, Price).
- **Styling:**
  - Update `globals.css` with Obsidian Black (`#0B0B0B`) background, Cyan (`#00FFFF`), and Neon Orange accents.

## Risks & Considerations
- **Meilisearch CORS:** Need to ensure Meilisearch allows requests from `localhost:3000`.
- **Next.js Images:** If using Next.js `<Image>`, we must configure `next.config.ts` to allow `localhost` or the MinIO domain, otherwise use standard `<img>`.
- **Tailwind v4:** `tailwind-merge` and Aceternity UI components (often written for Tailwind v3) might need slight tweaks.

## Validation Architecture
- Verify `npm run dev` builds the storefront without errors.
- Verify Meilisearch dropdown returns results when typed.
- Verify product cards tilt on hover.
- Verify carousel auto-plays and has the horizontal slide transition.
