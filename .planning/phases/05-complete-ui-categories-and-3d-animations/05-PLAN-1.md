# Phase 5: Complete UI, Categories, and 3D Animations

This phase focuses on completing the missing UI pages (Admin lists and Storefront categories) and elevating the 3D visual experience.

## User Review Required

> [!WARNING]
> **WebGL Performance Considerations**
> The Category Page will render multiple 3D models concurrently in a grid. Rendering a separate WebGL `<Canvas>` for each item is highly resource-intensive and will crash mobile browsers. I will implement `@react-three/drei`'s `<View>` component, which tracks DOM elements and renders them using a single global Canvas. This requires injecting a Canvas at the root layout or utilizing an overlay.

## Proposed Changes

### Admin UI Components

#### [NEW] `src/components/admin/ui/ExpandableTable.tsx`
- A data table component that supports clicking on a row to expand a details pane below it.

#### [NEW] `src/app/admin/products/page.tsx`
- Admin products list page.
- Utilizes `ExpandableTable` to list products.
- The expanded view will parse and display the complex `variants` JSONB matrix.

#### [NEW] `src/app/admin/categories/page.tsx`
- Admin categories management list.

### Storefront Components

#### [NEW] `src/components/ui/CyberpunkEmptyState.tsx`
- Reusable empty state component with "No signals found" text.
- CSS-based glitch effects and TV noise overlays.

#### [NEW] `src/components/storefront/ProductGrid3D.tsx`
- A grid of products that uses `<View>` for rendering 3D models.
- Integrates `<Float>` to give models a continuous floating idle animation.

#### [NEW] `src/app/categories/[slug]/page.tsx`
- The storefront category browsing page displaying products in that category using `ProductGrid3D`.
- Uses `CyberpunkEmptyState` when the category has no products.

#### [MODIFY] `src/components/storefront/ProductViewer3D.tsx`
- Upgrade the main viewer to use `<PresentationControls>` for smooth drag-to-rotate interaction.
- Add `<Float>` for the idle animation.

## Verification Plan

### Automated Tests
- Check if `ExpandableTable` correctly toggles expanded state.
- Ensure the routing for Admin Products and Categories returns 200 OK.

### Manual Verification
- Navigate to the Admin Products list and expand a product to view its variants.
- Navigate to a Storefront Category page and verify multiple 3D models render smoothly without dropping frames.
- Interact with the 3D models to ensure drag-to-rotate and floating animations are functioning.
- View an empty category to confirm the Cyberpunk glitch empty state displays correctly.
