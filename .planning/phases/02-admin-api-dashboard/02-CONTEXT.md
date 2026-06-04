# Phase 2: Admin API & Dashboard - Context

**Gathered:** 2026-06-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Create the APIs and Admin UI to manage products, variants, and flash sales. Admin can upload product images which sync directly to MinIO, create products with a dynamic variant matrix, and sync additions/modifications to Meilisearch.

</domain>

<decisions>
## Implementation Decisions

### API: MinIO Image Upload Pattern
- **D-01:** Presigned URLs — Client uploads directly to MinIO, saving .NET backend bandwidth.

### API: Meilisearch Sync Strategy
- **D-02:** Event-driven — Use MediatR INotification after EF Core SaveChanges to trigger sync.

### Admin UI: App Structure
- **D-03:** Single Next.js app — Storefront and Admin in one codebase, with the admin panel under an `/admin` route group.

### Admin UI: Variant Matrix Layout
- **D-04:** Editable Grid — Excel-like table for fast data entry of pricing and stock.

### the agent's Discretion
- Authentication approach for the Admin area (JWT vs NextAuth vs custom cookie).
- Grid editing state management logic.

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches based on Next.js App Router and .NET 8 conventions.

</specifics>

<canonical_refs>
## Canonical References

No external specs — requirements are fully captured in decisions above and `PROJECT.md` / `REQUIREMENTS.md`.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `ProductVariant` and `OrderItem` EF Core entities with `jsonb` configured.
- `MediatR` installed and configured in `Kinetic3D.WebAPI`.

### Established Patterns
- Clean Architecture (`Domain`, `Application`, `Infrastructure`, `WebAPI`).
- CQRS ready via MediatR (use for Event-driven Meilisearch sync).

### Integration Points
- `src/Kinetic3D.WebAPI/Program.cs` - Add Meilisearch and MinIO clients here.
- `src/Kinetic3D.Infrastructure` - Implement Meilisearch syncing and MinIO presigned URL logic.

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 02-admin-api-dashboard*
*Context gathered: 2026-06-04*
