# Requirements: Kinetic3D

**Defined:** 2026-06-04
**Core Value:** Providing an immersive, real-time interactive 3D customization experience with instantaneous feedback (pricing and search) to elevate the standard of e-commerce.

## v1 Requirements

### Infrastructure (DevOps)

- [ ] **INFRA-01**: Setup Docker Compose for PostgreSQL, MinIO, Meilisearch, and Umami Analytics
- [ ] **INFRA-02**: Configure persistent storage volumes and standard `.env` file

### Backend Core (.NET 8)

- [ ] **CORE-01**: Initialize Clean Architecture (Domain, Application, Infrastructure, WebAPI)
- [ ] **CORE-02**: Setup Entity Framework Core with PostgreSQL connection
- [ ] **CORE-03**: Implement Entities: Product, Category, ProductVariant
- [ ] **CORE-04**: Implement JSONB mapping for dynamic attributes in ProductVariants
- [ ] **CORE-05**: Implement JSONB mapping for Custom3DConfig in OrderItems
- [ ] **CORE-06**: Configure MediatR for CQRS pattern

### Backend API & Integrations

- [ ] **API-01**: Implement CRUD endpoints for Products and Categories
- [ ] **API-02**: Integrate AWS SDK to upload files/images to MinIO
- [ ] **API-03**: Implement background service to synchronize product data to Meilisearch

### Admin Dashboard (Next.js)

- [ ] **ADMIN-01**: Create Admin Sidebar layout and navigation
- [ ] **ADMIN-02**: Implement Product creation form with multi-thread image upload to MinIO
- [ ] **ADMIN-03**: Implement Dynamic Variants Matrix configuration and pricing setup
- [ ] **ADMIN-04**: Implement Flash Sale management (set times, select products)

### Storefront UI (Next.js)

- [x] **STORE-01**: Setup Next.js with Tailwind CSS, Framer Motion, and Aceternity UI
- [x] **STORE-02**: Implement Sticky Header with real-time Meilisearch dropdown
- [x] **STORE-03**: Implement Hero Section with auto-play Carousel (video loop support)
- [x] **STORE-04**: Implement Product Grid with 3D Tilt hover effects on product cards

### 3D E-commerce Experience

- [ ] **EXP-01**: Implement Product Details page with Three.js viewer for .glb files
- [ ] **EXP-02**: Allow users to input custom text that maps onto the 3D model in real-time
- [ ] **EXP-03**: Implement dynamic pricing logic with Counter Animation when variants change
- [ ] **EXP-04**: Implement Flash Sale banner with countdown timer and progress bar
- [ ] **EXP-05**: Implement basic Cart and Checkout form
- [ ] **EXP-06**: Integrate Umami analytics script for conversion tracking

## v2 Requirements

### Advanced AI Generative

- **AI-01**: User can generate custom 3D models from text prompts
- **AI-02**: System automatically validates generated 3D models for printability

### ERP Tracking

- **ERP-01**: Track order items on specific 3D printers (e.g., Bambu Lab, Elegoo)
- **ERP-02**: Estimate material usage and track printer status

## Out of Scope

| Feature | Reason |
|---------|--------|
| AI Generation in Phase 1 | Focus is strictly on direct interactive 3D experiences. AI generation will be pushed to Phase 2/3. |
| Traditional Relational Attributes | To prevent table bloat, we strictly use JSONB instead. |
| ERP Print Tracking | Moved to Phase 3 to keep the initial focus on customer-facing e-commerce. |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 | Phase 1 | Pending |
| INFRA-02 | Phase 1 | Pending |
| CORE-01 | Phase 1 | Pending |
| CORE-02 | Phase 1 | Pending |
| CORE-03 | Phase 1 | Pending |
| CORE-04 | Phase 1 | Pending |
| CORE-05 | Phase 1 | Pending |
| CORE-06 | Phase 1 | Pending |
| API-01 | Phase 2 | Pending |
| API-02 | Phase 2 | Pending |
| API-03 | Phase 2 | Pending |
| ADMIN-01 | Phase 2 | Pending |
| ADMIN-02 | Phase 2 | Pending |
| ADMIN-03 | Phase 2 | Pending |
| ADMIN-04 | Phase 2 | Pending |
| STORE-01 | Phase 3 | Complete |
| STORE-02 | Phase 3 | Complete |
| STORE-03 | Phase 3 | Complete |
| STORE-04 | Phase 3 | Complete |
| EXP-01 | Phase 4 | Pending |
| EXP-02 | Phase 4 | Pending |
| EXP-03 | Phase 4 | Pending |
| EXP-04 | Phase 4 | Pending |
| EXP-05 | Phase 4 | Pending |
| EXP-06 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 25 total
- Mapped to phases: 25
- Unmapped: 0 ✓

---
*Requirements defined: 2026-06-04*
*Last updated: 2026-06-04 after initial definition*
