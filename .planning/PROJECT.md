# Kinetic3D

## What This Is

Kinetic3D is a disruptive 3D e-commerce platform that functions as a futuristic custom workshop. It features a Cyber-Tech aesthetic, 3D interactive product visualization using Three.js, real-time dynamic pricing, and a fast, scalable architecture (.NET 8 backend, Next.js frontend, PostgreSQL with JSONB).

## Core Value

Providing an immersive, real-time interactive 3D customization experience with instantaneous feedback (pricing and search) to elevate the standard of e-commerce.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

(None yet — ship to validate)

### Active

<!-- Current scope. Building toward these. -->

- [ ] DevOps: Docker Compose setup for PostgreSQL, MinIO, Meilisearch, and Umami Analytics.
- [ ] Backend: .NET 8 Web API using Clean Architecture and CQRS (MediatR).
- [ ] Database: PostgreSQL with JSONB for dynamic variants (`ProductVariants` attributes, `OrderItems` custom 3D configs).
- [ ] Backend API: CRUD for Products/Categories, MinIO AWS SDK integration, and Meilisearch syncing.
- [ ] Admin Dashboard: Next.js app with multi-thread image upload, dynamic variants matrix, and Flash Sale management.
- [ ] Storefront: Next.js app with Tailwind CSS, Framer Motion, and Aceternity UI.
- [ ] Search: Real-time dropdown search via Meilisearch.
- [ ] 3D Integration: Interactive Three.js viewer for .glb files with text mapping and dynamic pricing animation.
- [ ] FOMO Features: Flash Sale countdown timer and progress bar.

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- Complex AI integrations in Phase 1 — the focus is solely on direct interactive 3D experiences. AI generation will be pushed to Phase 2/3.
- Traditional relational structures for variants — to prevent table bloat, using JSONB instead.
- ERP Tracking (PrintJobs) — moved to Phase 3.

## Context

- Tech Stack: .NET 8, PostgreSQL, MinIO, Meilisearch, Umami, Next.js (App Router), Three.js/React Three Fiber.
- Design: Dark Mode (Obsidian Black) with Cyan/Neon Orange accents, 3D Tilt product cards, Bento Grid layouts, and Scroll Reveal effects.
- Database relies on JSONB heavily for scaling dynamic product configurations.

## Constraints

- **Architecture**: Clean Architecture — to maintain scalable separation of concerns.
- **Database Model**: No separate tables for Color/Size — must use JSONB to store dynamic attributes.
- **Self-Hosted Infrastructure**: MinIO, Meilisearch, Umami must run in local Docker rather than managed cloud services to minimize costs.
- **UI/UX**: Strictly adhere to the Cyber-Tech / Modern Minimalist aesthetic without typical E-commerce clutter.

## Key Decisions

<!-- Decisions that constrain future work. Add throughout project lifecycle. -->

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| PostgreSQL JSONB for Variants | Prevents table bloat and allows flexible dynamic attributes. | — Pending |
| Self-hosted Infrastructure | Controls costs and data privacy. | — Pending |
| Three.js for 3D customization | Provides interactive preview mapping directly in browser. | — Pending |
| Exclude AI from Phase 1 | Focus on interactive foundations and core business logic first. | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-06-04 after initialization*
