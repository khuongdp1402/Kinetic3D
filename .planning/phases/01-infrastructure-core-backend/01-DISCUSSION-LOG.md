# Phase 1: Infrastructure & Core Backend - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-04
**Phase:** 1-Infrastructure & Core Backend
**Areas discussed:** Docker Infrastructure, .NET Clean Architecture, EF Core Migrations

---

## Docker Infrastructure

| Option | Description | Selected |
|--------|-------------|----------|
| (Recommended) All-in-one network with auto-init scripts for MinIO buckets | All-in-one network with auto-init scripts for MinIO buckets | ✓ |
| Isolated networks (DB separate from public) and manual bucket creation | Isolated networks (DB separate from public) and manual bucket creation | |

**User's choice:** (Recommended) All-in-one network with auto-init scripts for MinIO buckets
**Notes:** 

---

## .NET Clean Architecture

| Option | Description | Selected |
|--------|-------------|----------|
| (Recommended) Folder-by-feature (e.g., Features/Products/CreateProductCommand) | (Recommended) Folder-by-feature (e.g., Features/Products/CreateProductCommand) | ✓ |
| Folder-by-type (e.g., Commands/Products, Queries/Products) | Folder-by-type (e.g., Commands/Products, Queries/Products) | |

**User's choice:** (Recommended) Folder-by-feature (e.g., Features/Products/CreateProductCommand)
**Notes:** 

---

## EF Core Migrations

| Option | Description | Selected |
|--------|-------------|----------|
| (Recommended) Auto-apply on WebAPI startup (context.Database.Migrate()) | (Recommended) Auto-apply on WebAPI startup (context.Database.Migrate()) | ✓ |
| Manual CLI application during deployment (dotnet ef database update) | Manual CLI application during deployment (dotnet ef database update) | |

**User's choice:** (Recommended) Auto-apply on WebAPI startup (context.Database.Migrate())
**Notes:** 

---

## the agent's Discretion

Docker container naming conventions and port mappings
Specific folder structure for Domain and Infrastructure layers
Exact JSONB mapping syntax and ValueConverter implementations for EF Core

## Deferred Ideas

None
