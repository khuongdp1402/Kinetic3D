/gsd-plan-phase 5# Roadmap: Kinetic3D

## Overview

Kinetic3D will be built in 4 coarse phases starting with the foundational DevOps and .NET 8 backend, followed by the Admin Dashboard and integration points (MinIO, Meilisearch). The third phase establishes the Next.js Storefront UI. Finally, the fourth phase delivers the core value proposition: the interactive 3D customization experience and e-commerce flow.

## Phases

- [x] **Phase 1: Infrastructure & Core Backend** - Setup Docker, PostgreSQL, and .NET 8 Clean Architecture. (completed 2026-06-04)
- [ ] **Phase 2: Admin API & Dashboard** - API CRUD, MinIO, Meilisearch sync, and Admin UI.
- [x] **Phase 3: Storefront UI** - Next.js storefront foundation and styling. (completed 2026-06-04)
- [ ] **Phase 4: 3D Experience & Cart** - Three.js integration, dynamic pricing, and checkout.

## Phase Details

### Phase 1: Infrastructure & Core Backend
**Goal**: Establish the self-hosted environment and the .NET 8 database/core structure.
**Depends on**: Nothing (first phase)
**Requirements**: [INFRA-01, INFRA-02, CORE-01, CORE-02, CORE-03, CORE-04, CORE-05, CORE-06]
**Success Criteria** (what must be TRUE):
  1. Docker compose brings up PostgreSQL, MinIO, Meilisearch, and Umami.
  2. Entity Framework can read/write JSONB attributes in ProductVariants and OrderItems.
  3. CQRS structure is established via MediatR.
**Plans**: 2 plans

Plans:
- [x] 01-01: DevOps setup and database initialization.
- [x] 01-02: Backend Core layer and EF JSONB mappings.

### Phase 2: Admin API & Dashboard
**Goal**: Create the APIs and Admin UI to manage products, variants, and flash sales.
**Depends on**: Phase 1
**Requirements**: [API-01, API-02, API-03, ADMIN-01, ADMIN-02, ADMIN-03, ADMIN-04]
**Success Criteria** (what must be TRUE):
  1. Admin can upload product images which sync directly to MinIO.
  2. Products can be created with a dynamic variant matrix.
  3. Product additions/modifications are synced to Meilisearch.
**Plans**: 2 plans

Plans:
- [x] 02-01: Backend API CRUD and integrations (MinIO, Meilisearch).
- [x] 02-02: Next.js Admin Dashboard and variant matrix.

### Phase 3: Storefront UI
**Goal**: Build the fast, responsive storefront UI without the heavy 3D logic yet.
**Depends on**: Phase 2
**Requirements**: [STORE-01, STORE-02, STORE-03, STORE-04]
**Success Criteria** (what must be TRUE):
  1. The storefront reflects the Cyber-Tech/Obsidian aesthetic.
  2. Real-time search dropdown via Meilisearch works flawlessly.
  3. Product Grid cards exhibit 3D Tilt effects.
**Plans**: 1 plan

Plans:
- [x] 03-01: Setup UI components, layout, and search integration.

### Phase 4: 3D Experience & Cart
**Goal**: Deliver the interactive Three.js customization and complete the shopping flow.
**Depends on**: Phase 3
**Requirements**: [EXP-01, EXP-02, EXP-03, EXP-04, EXP-05, EXP-06]
**Success Criteria** (what must be TRUE):
  1. Users can view a 3D model, map text onto it, and see pricing update dynamically.
  2. Flash Sale timer accurately reflects remaining time/stock.
  3. Users can complete a checkout which triggers an order record with the Custom3DConfig JSONB.
**Plans**: 2 plans

Plans:
- [x] 04-01: Three.js viewer and dynamic pricing integration.
- [x] 04-02: Cart, checkout flow, and Umami analytics.

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase                            | Plans Complete | Status      | Completed  |
| -------------------------------- | -------------- | ----------- | ---------- |
| 1. Infrastructure & Core Backend | 2/2            | Complete    | 2026-06-04 |
| 2. Admin API & Dashboard         | 0/2            | Not started | -          |
| 3. Storefront UI                 | 1/1            | Complete    | 2026-06-04 |
| 4. 3D Experience & Cart          | 0/2            | Not started | -          |

### Phase 5: Complete UI, Categories, and 3D Animations

**Goal:** [To be planned]
**Requirements**: TBD
**Depends on:** Phase 4
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 5 to break down)

### Phase 6: tôi cần phân UI ấn tượng hơn, hiện tại trang home đang khá đơn điệu, ko xem được chi tiết sản phẩm, ko có sản phẩm theo danh mục, tôi cần bám sát ý tưởng, các danh mục sản phẩm đã vạch ra như proposal https://docs.google.com/presentation/d/1n19WNHoQQyYAPGjPp95KXB9o7k0JZ3lXlq07Dykgt5k/edit?slide=id.p1#slide=id.p1. hãy xem và phát triển thêm các UI còn thiếu

**Goal:** Hoàn thiện UI trang Home, Chi tiết sản phẩm & Danh mục theo style Cyber-Tech
**Requirements**: TBD
**Depends on:** Phase 5
**Plans:** 2/2 plans complete

Plans:
- [x] 06-01: Product Detail Split-Screen & Page Transitions
- [x] 06-02: Home Page Scrolling Storytelling & Slider

### Phase 7: 7 Context & Role:Act as an Expert Frontend Architect specializing in Next.js, Tailwind CSS, and Award-winning WebGL/GSAP animations. Your task is to build the Home Page for " Kinetic3D\ - a high-end, cyber-tech 3D printing and customization E-commerce platform.Tech Stack Requirements:Framework: Next.js (App Router).Styling: Tailwind CSS.Smooth Scrolling: @studio-freight/lenis.Core Animation Engine: GSAP (with ScrollTrigger and SplitText logic).Micro-interactions: Framer Motion (specifically for 3D Tilt on product cards).Design System & Vibe:Aesthetic: Cyber-tech, Modern Minimalist, Dark Mode.Background: Obsidian Black (#0B0C10).Accents: Cybernetic Cyan (#66FCF1) and Neon Orange (#FF5722).Typography: Oversized, sans-serif fonts, using heavy negative space. Avoid traditional borders; use subtle glows or glassmorphism.Task Breakdown (Build these components sequentially):SectionTechnical & Animation RequirementsGlobal SetupWrap the main layout in a Lenis smooth scroll provider. Initialize GSAP ScrollTrigger globally.Sticky HeaderGlassmorphism background. Includes a minimalist Logo, Navigation links, and a Search Bar component.Hero SectionFull-screen (100vh). Use an HTML5 <video> tag (autoplay, muted, loop) as the absolute background. Apply GSAP text-reveal (clip-path masking) for the main oversized headline. The text should slide up smoothly on mount.Flash Sale BannerA horizontal marquee or distinct strip. Implement a Countdown Timer and a progress bar showing \X% Sold Out\ with a subtle Neon Orange glowing effect to create FOMO.Product GridDisplay standard products. Crucial: Wrap each Product Card in a Framer Motion component that applies a 3D Tilt effect based on mouse hover coordinates.Parallax FeatureA split-screen section. Pin the left side (using GSAP ScrollTrigger pin: true) containing an image/video, while the right side text content continues to scroll upwards.Policy Bento GridUse CSS Grid to create a Bento-box layout for shipping and quality policies. Apply GSAP ScrollReveal (fade-up and opacity) as the user scrolls into this section.Execution Rules:Do not use dummy placeholder colors (like bg-red-500). Use the exact Cyber-tech color palette provided.Break down the code into reusable components (e.g., Hero.tsx, ProductCard.tsx).Ensure the video background is optimized with CSS object-cover.Provide the code for page.tsx that stitches all these components together.

**Goal:** [To be planned]
**Requirements**: TBD
**Depends on:** Phase 6
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 7 to break down)

### Phase 8: Redesign Home Page as Landing Page with bilingual support and Light/Dark mode

**Goal:** [To be planned]
**Requirements**: TBD
**Depends on:** Phase 7
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 8 to break down)

### Phase 9: Terminal Industries UX Overhaul

**Goal:** [To be planned]
**Requirements**: TBD
**Depends on:** Phase 8
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 9 to break down)

### Phase 10: Build a single full-viewport hero section in React, Vite, Tailwind CSS

**Goal:** [To be planned]
**Requirements**: TBD
**Depends on:** Phase 9
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 10 to break down)
