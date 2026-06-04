# Phase 1: Infrastructure & Core Backend - Context

**Gathered:** 2026-06-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Setup the Docker infrastructure and .NET 8 Core Backend architecture with Postgres JSONB support.

</domain>

<decisions>
## Implementation Decisions

### Docker Infrastructure
- All-in-one network with auto-init scripts for MinIO buckets

### .NET Clean Architecture
- Folder-by-feature layout for MediatR Commands/Queries (e.g., Features/Products/CreateProductCommand)

### EF Core Migrations
- Auto-apply on WebAPI startup (context.Database.Migrate())

### the agent's Discretion
- Docker container naming conventions and port mappings (as long as they don't conflict)
- Specific folder structure for Domain and Infrastructure layers
- Exact JSONB mapping syntax and ValueConverter implementations for EF Core

</decisions>

<canonical_refs>
## Canonical References

No external specs — requirements are fully captured in PROJECT.md and REQUIREMENTS.md.

</canonical_refs>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-infrastructure-core-backend*
*Context gathered: 2026-06-04*
