# Phase 2: Admin API & Dashboard - Research

## Technical Approaches

### 1. MinIO Presigned URLs for Image Upload
- **How it works:** The frontend requests a presigned upload URL from the .NET WebAPI. The API generates a short-lived URL via the `AWSSDK.S3` library pointing to the MinIO container. The frontend then PUTs the file directly to MinIO using this URL.
- **Dependencies:** `AWSSDK.S3` in `Kinetic3D.Infrastructure`.
- **Considerations:** Ensure CORS is configured properly on the MinIO bucket to allow PUT requests from the Next.js frontend (`localhost:3000`).

### 2. Meilisearch Sync via MediatR
- **How it works:** After `ApplicationDbContext.SaveChangesAsync()` commits successfully, we publish an `INotification` (e.g., `ProductUpdatedEvent`). An `INotificationHandler` in the Infrastructure or Application layer handles this event by pushing the updated JSON representation to Meilisearch.
- **Dependencies:** `Meilisearch` NuGet package in `Kinetic3D.Infrastructure`.
- **Considerations:** The sync should ideally be non-blocking. MediatR `Publish` is synchronous by default unless handled in a background task or using a Fire-and-Forget approach, but for Phase 2 a simple synchronous handler is acceptable as a starting point.

### 3. Next.js App Router Structure
- **How it works:** The Next.js frontend will use the App Router. The admin dashboard will reside in `app/(admin)/` or `app/admin/`. We'll use a `layout.tsx` specifically for the admin section to house the Admin Sidebar.
- **Dependencies:** `next`, `react`, `react-dom`, `tailwindcss`.
- **Considerations:** We will need to set up the base Next.js app in `src/Kinetic3D.WebUI` (or similar).

### 4. Editable Grid for Variant Matrix
- **How it works:** Products have dynamic variants. The Admin UI needs a table where rows correspond to a combination of attributes (e.g., Color + Size) and columns allow setting `Price`, `Stock`, and `SKU`.
- **Dependencies:** Standard HTML tables with Tailwind or a lightweight library like `react-data-grid` or just custom mapped inputs.

## Requirements Coverage
- **API-01**: EF Core repository/services for `Product` and `Category`.
- **API-02**: Endpoint `/api/uploads/presigned-url` using MinIO.
- **API-03**: MediatR Event handler calling Meilisearch client.
- **ADMIN-01**: Next.js Admin layout with sidebar.
- **ADMIN-02**: Product form components utilizing the presigned URL endpoint.
- **ADMIN-03**: React component for variant generation and matrix editing.
- **ADMIN-04**: Flash Sale management UI.

## Validation Architecture
- **API Testing:** Can be verified with the `Kinetic3D.WebAPI.http` file.
- **Integration Testing:** MinIO and Meilisearch must be accessible on `localhost`.
- **Frontend Validation:** Next.js dev server starts and renders the admin routes.

## RESEARCH COMPLETE
