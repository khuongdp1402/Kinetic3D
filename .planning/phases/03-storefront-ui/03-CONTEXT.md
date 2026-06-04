# Phase 3: Storefront UI - Context

**Gathered:** 2026-06-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the customer-facing Next.js storefront: a sticky header with real-time Meilisearch search, a Hero carousel with video and image slides, and a product grid with 3D tilt effects. Scope includes `/` homepage and a `/products` listing page.

</domain>

<decisions>
## Implementation Decisions

### D-01: Hero Carousel Content
- **Mix of video + images** — first slide is a full-screen video loop, the remaining 3–4 slides are high-quality hero images.
- Total: 4–5 slides.

### D-02: Hero Carousel Transition
- **Horizontal slide** transition between slides (Framer Motion or Embla Carousel).
- Autoplay enabled.

### D-03: Product Card Information
Each card displays:
- Product name
- Price (with sale price strikethrough if on flash sale)
- Category badge
- Flash Sale countdown badge (if a sale is active on that product)
- Short description / tagline
- "Customize" CTA button (links to product detail page in Phase 4)
- 3D model preview thumbnail (static .glb screenshot/image)

### D-04: Product Card 3D Tilt Effect
- **Hover-only** — card tilts following the cursor while hovered, snaps back flat on mouse leave.
- Use `react-parallax-tilt` or a Framer Motion approach.

### D-05: Search Header Placement
- **Search icon in header** — clicking it expands to a full-width search bar with a dark overlay backdrop.
- Closes on Escape key or clicking outside.

### D-06: Meilisearch Dropdown Results
- Each result row shows: **product thumbnail + name + price**.
- Max 5–6 results shown, with a "See all results" link to `/products?q=...`.

### D-07: Page Architecture
- `/` (Homepage) — Sticky header, Hero carousel, Featured Products section (subset of products).
- `/products` (Listing page) — Full product grid with:
  - Category filter
  - Price range slider
  - 3D tilt cards

### Agent's Discretion
- Specific Framer Motion animation durations and easing curves.
- Aceternity UI component selection (e.g., which specific effects to use for scroll reveal).
- Exact grid column count at different breakpoints (responsive).
- Font choice for headings (already has Geist from scaffold — can keep or swap to something more cyber).
- Skeleton loading states for product grid.

</decisions>

<canonical_refs>
## Canonical References

- `.planning/REQUIREMENTS.md` — STORE-01 through STORE-04 define the scope.
- `src/Kinetic3D.WebUI/src/app/layout.tsx` — Root layout to extend (already has Geist, Tailwind).
- `src/Kinetic3D.WebUI/src/app/(admin)/layout.tsx` — Admin layout pattern to mirror for storefront.
- `src/Kinetic3D.WebUI/src/components/admin/` — Existing component folder pattern to follow.

External:
- Framer Motion docs: https://www.framer.com/motion/
- Aceternity UI: https://ui.aceternity.com/
- react-parallax-tilt: https://github.com/mkosir/react-parallax-tilt
- Meilisearch JS SDK: https://github.com/meilisearch/meilisearch-js

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/Kinetic3D.WebUI/src/app/layout.tsx` — Root layout with Geist font and Tailwind dark mode ready.
- `src/Kinetic3D.WebUI/src/app/globals.css` — Global CSS baseline (needs extending for design tokens).
- `src/Kinetic3D.WebAPI/Controllers/ProductsController.cs` — GET `/api/products` endpoint available.

### Established Patterns
- Tailwind CSS for all styling (no CSS modules).
- Next.js App Router — page.tsx convention.
- Admin components in `src/components/admin/` — storefront components go in `src/components/storefront/`.

### Integration Points
- `src/Kinetic3D.WebUI/src/app/page.tsx` — Replace scaffold with real homepage.
- Meilisearch runs on `http://localhost:7700` — search calls go from the browser directly to Meilisearch JS SDK.
- Product images served from MinIO at `http://localhost:9000/kinetic3d-assets/`.

</code_context>

<specifics>
## Specific Ideas

- The design must strictly follow the Cyber-Tech / Modern Minimalist aesthetic: **Obsidian Black** background, **Cyan (#00FFFF or close)** and **Neon Orange** accents.
- No typical e-commerce clutter — minimal copy, large visuals, premium feel.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 03-storefront-ui*
*Context gathered: 2026-06-04*
