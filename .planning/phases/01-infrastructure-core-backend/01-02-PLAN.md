---
wave: 2
depends_on: ["01-PLAN-1.md"]
files_modified:
  - Kinetic3D.sln
  - src/Kinetic3D.Domain/Kinetic3D.Domain.csproj
  - src/Kinetic3D.Application/Kinetic3D.Application.csproj
  - src/Kinetic3D.Infrastructure/Kinetic3D.Infrastructure.csproj
  - src/Kinetic3D.WebAPI/Kinetic3D.WebAPI.csproj
  - src/Kinetic3D.WebAPI/Program.cs
autonomous: true
---

# Plan 2: Core Backend Architecture

## Goal
Initialize the .NET 8 solution with Clean Architecture, setup EF Core with PostgreSQL and JSONB support, create initial domain entities, and configure MediatR.

## Requirements
- CORE-01: Initialize Clean Architecture (Domain, Application, Infrastructure, WebAPI)
- CORE-02: Setup Entity Framework Core with PostgreSQL connection
- CORE-03: Implement Entities: Product, Category, ProductVariant
- CORE-04: Implement JSONB mapping for dynamic attributes in ProductVariants
- CORE-05: Implement JSONB mapping for Custom3DConfig in OrderItems
- CORE-06: Configure MediatR for CQRS pattern

## Tasks

<task>
  <action>
    Create a new solution `Kinetic3D.sln` in the repository root.
    Create four projects in a `src` folder:
    - `src/Kinetic3D.Domain` (classlib)
    - `src/Kinetic3D.Application` (classlib)
    - `src/Kinetic3D.Infrastructure` (classlib)
    - `src/Kinetic3D.WebAPI` (webapi, without controllers initially or just minimal API)
    Add all projects to the solution.
    Set up project references:
    - `WebAPI` references `Application` and `Infrastructure`
    - `Infrastructure` references `Application`
    - `Application` references `Domain`
  </action>
  <read_first>
    - Kinetic3D.sln (to be created)
  </read_first>
  <acceptance_criteria>
    - `dotnet sln Kinetic3D.sln list` contains all 4 projects.
    - `cat src/Kinetic3D.WebAPI/Kinetic3D.WebAPI.csproj | grep Kinetic3D.Application` exits 0
  </acceptance_criteria>
</task>

<task>
  <action>
    Add required NuGet packages:
    - `Kinetic3D.Infrastructure`: `Npgsql.EntityFrameworkCore.PostgreSQL`, `Microsoft.EntityFrameworkCore.Design`
    - `Kinetic3D.Application`: `MediatR`
    - `Kinetic3D.WebAPI`: `Microsoft.EntityFrameworkCore.Design`
  </action>
  <read_first>
    - src/Kinetic3D.Infrastructure/Kinetic3D.Infrastructure.csproj
    - src/Kinetic3D.Application/Kinetic3D.Application.csproj
  </read_first>
  <acceptance_criteria>
    - `cat src/Kinetic3D.Infrastructure/Kinetic3D.Infrastructure.csproj | grep Npgsql.EntityFrameworkCore.PostgreSQL` exits 0
    - `cat src/Kinetic3D.Application/Kinetic3D.Application.csproj | grep MediatR` exits 0
  </acceptance_criteria>
</task>

<task>
  <action>
    Create Domain Entities in `src/Kinetic3D.Domain/Entities`:
    - `Category.cs`: `Id` (Guid), `Name` (string), `Description` (string)
    - `Product.cs`: `Id` (Guid), `Name` (string), `Description` (string), `BasePrice` (decimal), `CategoryId` (Guid), `Category` navigation property.
    - `ProductVariant.cs`: `Id` (Guid), `ProductId` (Guid), `Product` navigation property, `Attributes` (Dictionary<string, string>).
    - `OrderItem.cs`: `Id` (Guid), `ProductId` (Guid), `Quantity` (int), `Custom3DConfig` (Dictionary<string, string>).
  </action>
  <read_first>
    - src/Kinetic3D.Domain/Entities/Product.cs (to be created)
  </read_first>
  <acceptance_criteria>
    - `grep -q "Dictionary<string, string> Attributes" src/Kinetic3D.Domain/Entities/ProductVariant.cs` exits 0
    - `grep -q "Dictionary<string, string> Custom3DConfig" src/Kinetic3D.Domain/Entities/OrderItem.cs` exits 0
  </acceptance_criteria>
</task>

<task>
  <action>
    Create `ApplicationDbContext.cs` in `src/Kinetic3D.Infrastructure/Persistence`.
    Add `DbSet`s for Category, Product, ProductVariant, and OrderItem.
    In `OnModelCreating`, explicitly map JSONB columns:
    ```csharp
    modelBuilder.Entity<ProductVariant>().Property(v => v.Attributes).HasColumnType("jsonb");
    modelBuilder.Entity<OrderItem>().Property(o => o.Custom3DConfig).HasColumnType("jsonb");
    ```
  </action>
  <read_first>
    - src/Kinetic3D.Infrastructure/Persistence/ApplicationDbContext.cs (to be created)
  </read_first>
  <acceptance_criteria>
    - `grep -q "HasColumnType(\"jsonb\")" src/Kinetic3D.Infrastructure/Persistence/ApplicationDbContext.cs` exits 0
  </acceptance_criteria>
</task>

<task>
  <action>
    In `src/Kinetic3D.WebAPI/appsettings.json`, add the connection string `DefaultConnection`:
    `Host=localhost;Database=kinetic3d_db;Username=kinetic3d;Password=kinetic3d_pass`
    Update `src/Kinetic3D.WebAPI/Program.cs` to register `ApplicationDbContext` using the connection string.
    Add the MediatR registration: `builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(Kinetic3D.Application.DependencyInjection).Assembly));` (Need to create a dummy `DependencyInjection.cs` class in Application to reference it).
    Add auto-migration on startup in `Program.cs`:
    ```csharp
    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        db.Database.Migrate();
    }
    ```
  </action>
  <read_first>
    - src/Kinetic3D.WebAPI/Program.cs
  </read_first>
  <acceptance_criteria>
    - `grep -q "db.Database.Migrate();" src/Kinetic3D.WebAPI/Program.cs` exits 0
    - `grep -q "AddMediatR" src/Kinetic3D.WebAPI/Program.cs` exits 0
  </acceptance_criteria>
</task>

<task>
  <action>
    Create the initial EF Core Migration.
    Run `dotnet ef migrations add InitialCreate --project src/Kinetic3D.Infrastructure --startup-project src/Kinetic3D.WebAPI --output-dir Persistence/Migrations`.
  </action>
  <read_first>
    - src/Kinetic3D.Infrastructure/Kinetic3D.Infrastructure.csproj
  </read_first>
  <acceptance_criteria>
    - `ls src/Kinetic3D.Infrastructure/Persistence/Migrations/ | grep "InitialCreate.cs"` exits 0
  </acceptance_criteria>
</task>

## Verification
- `dotnet build Kinetic3D.sln` completes with 0 errors.
- Inspecting the migration file shows `type: "jsonb"` for `Attributes` and `Custom3DConfig`.

## Must Haves
- The solution compiles.
- EF Core is configured with Npgsql and auto-migrate on startup is implemented.
- JSONB types are explicitly configured in the DbContext.
