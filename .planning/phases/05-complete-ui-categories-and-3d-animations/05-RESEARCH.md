## Objective
What do I need to know to PLAN this phase well?

## Analysis
The phase is "Complete UI, Categories, and 3D Animations".
Decisions from CONTEXT.md:
- **Admin UI**: Use Expandable rows for JSONB variants.
- **Category Page**: Full 3D Grid (load 3D models for all cards). Must optimize WebGL contexts using `drei`'s `<View>`.
- **3D Animations**: Floating idle animation + Drag-to-rotate interaction.
- **Empty States**: Cyberpunk styled graphics (noise/glitch screen with "No signals found").

### Current Codebase
Admin:
- We have `flash-sales` and `products/new` routes. We are missing the main `products` list route and `categories` routes.
- Admin UI uses basic tables. We need to implement a table with expandable rows for variants.

Storefront:
- We have `ProductDetailsPage` which uses `ProductViewer3D`.
- We need a `categories/[id]` route or `products` list route that uses a Grid of 3D models.
- Since multiple 3D models will be rendered on one page, rendering multiple `<Canvas>` elements will crash the browser. We MUST use `@react-three/drei`'s `<View>` component, which allows multiple virtual views mapped to a single WebGL `<Canvas>` overlaid on the screen.

Empty States:
- Need a reusable `CyberpunkEmptyState` component.

### Validation Architecture
We will need to ensure that `<View>` tracking works when scrolling, and that the Admin products list properly expands the variants.
