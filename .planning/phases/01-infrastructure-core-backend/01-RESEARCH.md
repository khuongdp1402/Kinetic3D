# Phase 1: Infrastructure & Core Backend - Technical Research

**Target:** Setup Docker infrastructure and .NET 8 Core Backend architecture with Postgres JSONB support.
**Focus:** Investigate best practices and implementation details for the locked decisions in CONTEXT.md.

## 1. Docker Infrastructure & MinIO Initialization

### Docker Compose Network Setup
- As per CONTEXT.md, an all-in-one network will be used. This simplifies communication between the backend and services like Postgres, MinIO, and Meilisearch.
- A bridge network `kinetic3d_network` should be defined in `docker-compose.yml` and all services attach to it.

### MinIO Bucket Auto-initialization
- MinIO server starts on port `9000` (API) and `9001` (Console).
- To automatically create buckets, we can use a secondary `mc` (MinIO Client) container that waits for MinIO to start, configures the host, and creates the required buckets (e.g., `products`, `assets`).
- Example command for the init container:
  ```sh
  /bin/sh -c "
  /usr/bin/mc alias set myminio http://minio:9000 minioadmin minioadmin;
  /usr/bin/mc mb myminio/products;
  /usr/bin/mc anonymous set public myminio/products;
  exit 0;
  "
  ```

### Other Services (PostgreSQL, Meilisearch, Umami)
- **PostgreSQL:** Uses `postgres:16-alpine`. Initialize two databases (one for Kinetic3D backend, one for Umami) using `/docker-entrypoint-initdb.d/` init scripts.
- **Meilisearch:** Uses `getmeili/meilisearch:v1.6`. Set `MEILI_MASTER_KEY` and expose port `7700`.
- **Umami:** Uses `ghcr.io/umami-software/umami:postgresql-latest`. Point it to the Umami database initialized in Postgres.

## 2. .NET 8 Clean Architecture

### Project Structure
The solution `Kinetic3D.sln` will contain four main projects:
- `Kinetic3D.Domain` (Class Library) - Entities, Enums, Value Objects.
- `Kinetic3D.Application` (Class Library) - CQRS (MediatR), Interfaces, DTOs.
- `Kinetic3D.Infrastructure` (Class Library) - EF Core, Postgres DB Context, external service integrations.
- `Kinetic3D.WebAPI` (Web API) - Controllers, Program.cs, Middleware.

### MediatR Folder-by-Feature Layout
As decided in CONTEXT.md, the Application layer will be organized by feature, not by type.
```text
Kinetic3D.Application/
└── Features/
    └── Products/
        ├── Commands/
        │   └── CreateProduct/
        │       ├── CreateProductCommand.cs
        │       ├── CreateProductCommandHandler.cs
        │       └── CreateProductCommandValidator.cs
        └── Queries/
            └── GetProduct/
                ├── GetProductQuery.cs
                └── GetProductQueryHandler.cs
```

## 3. EF Core Migrations & JSONB

### Postgres JSONB Mapping
Entity Framework Core with the `Npgsql.EntityFrameworkCore.PostgreSQL` provider has native support for JSONB.
- The `ProductVariant.Attributes` and `OrderItem.Custom3DConfig` properties can be strongly typed (e.g., `Dictionary<string, string>` or a custom class).
- In the `DbContext`'s `OnModelCreating`, we explicitly map them to `jsonb`:
  ```csharp
  modelBuilder.Entity<ProductVariant>()
      .Property(v => v.Attributes)
      .HasColumnType("jsonb");
  ```
- Npgsql automatically serializes and deserializes the objects to JSON, and supports querying inside the JSONB column.

### Auto-apply Migrations on Startup
As per CONTEXT.md, migrations should be applied automatically when the WebAPI starts.
- This is done in `Program.cs` before `app.Run()`.
- Example implementation:
  ```csharp
  using (var scope = app.Services.CreateScope())
  {
      var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
      dbContext.Database.Migrate();
  }
  ```

## 4. Dependencies
- `Npgsql.EntityFrameworkCore.PostgreSQL` (EF Core Provider)
- `MediatR` and `MediatR.Extensions.Microsoft.DependencyInjection`
- `FluentValidation.AspNetCore`
- `Microsoft.EntityFrameworkCore.Design` (for migrations)

## Summary of Technical Risks
- **MinIO Init Timing:** The MinIO client container must wait for the MinIO server to be fully ready before attempting to create buckets. Using a `sleep` or a retry loop in the `mc` command is highly recommended.
- **EF Core JSONB querying:** While storing JSONB is easy, querying deeply nested attributes can be tricky with LINQ. The Application layer should try to keep LINQ queries simple or use raw SQL if complex JSON querying is needed.
