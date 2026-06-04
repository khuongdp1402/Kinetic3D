# Roadmap: Kinetic3D

## Overview

Kinetic3D will be built in 4 coarse phases starting with the foundational DevOps and .NET 8 backend, followed by the Admin Dashboard and integration points (MinIO, Meilisearch). The third phase establishes the Next.js Storefront UI. Finally, the fourth phase delivers the core value proposition: the interactive 3D customization experience and e-commerce flow.

## Phases

- [ ] **Phase 1: Infrastructure & Core Backend** - Setup Docker, PostgreSQL, and .NET 8 Clean Architecture.
- [ ] **Phase 2: Admin API & Dashboard** - API CRUD, MinIO, Meilisearch sync, and Admin UI.
- [ ] **Phase 3: Storefront UI** - Next.js storefront foundation and styling.
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
- [ ] 01-02: Backend Core layer and EF JSONB mappings.

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
- [ ] 02-01: Backend API CRUD and integrations (MinIO, Meilisearch).
- [ ] 02-02: Next.js Admin Dashboard and variant matrix.

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
- [ ] 03-01: Setup UI components, layout, and search integration.

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
- [ ] 04-01: Three.js viewer and dynamic pricing integration.
- [ ] 04-02: Cart, checkout flow, and Umami analytics.

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Infrastructure & Core Backend | 1/2 | In Progress|  |
| 2. Admin API & Dashboard | 0/2 | Not started | - |
| 3. Storefront UI | 0/1 | Not started | - |
| 4. 3D Experience & Cart | 0/2 | Not started | - |
