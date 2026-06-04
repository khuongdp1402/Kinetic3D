---
wave: 1
depends_on: []
files_modified:
  - src/Kinetic3D.WebUI/package.json
  - src/Kinetic3D.WebUI/src/components/storefront/ProductViewer3D.tsx
  - src/Kinetic3D.WebUI/src/components/storefront/ProductConfigurator.tsx
  - src/Kinetic3D.WebUI/src/components/storefront/PricingOdometer.tsx
  - src/Kinetic3D.WebUI/src/app/products/[id]/page.tsx
autonomous: true
---

# Plan 1: Three.js viewer and dynamic pricing integration

## Goal
Implement the core 3D e-commerce experience on the product details page: an interactive Three.js viewer that loads `.glb` files from MinIO, allows real-time custom text mapping onto the model, and displays dynamic pricing with an odometer animation.

## Tasks

```xml
<task>
  <description>Install 3D and animation dependencies</description>
  <action>
    Add `three`, `@react-three/fiber`, `@react-three/drei`, and `framer-motion` to `src/Kinetic3D.WebUI/package.json`. Run `npm install`.
  </action>
  <read_first>
    - src/Kinetic3D.WebUI/package.json
  </read_first>
  <acceptance_criteria>
    - `src/Kinetic3D.WebUI/package.json` contains `@react-three/fiber`, `@react-three/drei`, `three`, and `framer-motion` in dependencies.
  </acceptance_criteria>
</task>

<task>
  <description>Create PricingOdometer component</description>
  <action>
    Create `src/Kinetic3D.WebUI/src/components/storefront/PricingOdometer.tsx`.
    Implement an odometer effect using `framer-motion`. The component accepts a `price: number` prop.
    It should split the number into individual digits and use `<motion.div>` with a vertical transition (`y` value based on digit) inside an `overflow-hidden` container.
  </action>
  <read_first>
    - src/Kinetic3D.WebUI/src/components/storefront/ProductCard.tsx
  </read_first>
  <acceptance_criteria>
    - `src/Kinetic3D.WebUI/src/components/storefront/PricingOdometer.tsx` exports `PricingOdometer` component.
    - Uses `framer-motion` for vertical translation.
  </acceptance_criteria>
</task>

<task>
  <description>Create ProductViewer3D component</description>
  <action>
    Create `src/Kinetic3D.WebUI/src/components/storefront/ProductViewer3D.tsx`.
    Must include `"use client"` at the top.
    Setup `<Canvas>` from `@react-three/fiber`.
    Add `<OrbitControls>` and `<Environment preset="city">` from `@react-three/drei`.
    Use `useGLTF` to load a model given a `modelUrl` prop.
    Accept a `customText` prop. Inside the model component, map `customText` onto a mesh using `@react-three/drei`'s `<Text>` or `<Decal>` component over a specific node.
  </action>
  <read_first>
    - src/Kinetic3D.WebUI/src/components/storefront/PricingOdometer.tsx
  </read_first>
  <acceptance_criteria>
    - `src/Kinetic3D.WebUI/src/components/storefront/ProductViewer3D.tsx` exports `ProductViewer3D` component.
    - Contains `<Canvas>` and `<OrbitControls>`.
  </acceptance_criteria>
</task>

<task>
  <description>Create ProductConfigurator overlay component</description>
  <action>
    Create `src/Kinetic3D.WebUI/src/components/storefront/ProductConfigurator.tsx`.
    Must include `"use client"`.
    This UI floats over the full-screen 3D viewer (absolute positioning on the right side).
    Includes a text input for `customText`, variant selection buttons (Color, Size), and renders the `PricingOdometer`.
    Accepts `onTextChange` and `onVariantChange` callbacks.
  </action>
  <read_first>
    - src/Kinetic3D.WebUI/src/components/storefront/ProductViewer3D.tsx
  </read_first>
  <acceptance_criteria>
    - `src/Kinetic3D.WebUI/src/components/storefront/ProductConfigurator.tsx` exports `ProductConfigurator` component.
    - Uses absolute positioning to float over content.
  </acceptance_criteria>
</task>

<task>
  <description>Implement Product Details Page</description>
  <action>
    Create `src/Kinetic3D.WebUI/src/app/products/[id]/page.tsx`.
    Setup the page to occupy full screen height (`h-screen`).
    Set background to Obsidian Black (`bg-[#0B0B0B]`).
    Dynamically import `ProductViewer3D` with `ssr: false`.
    Render `ProductViewer3D` taking up the full background, and overlay `ProductConfigurator` on top.
    Manage `customText` and `price` state at this page level.
  </action>
  <read_first>
    - src/Kinetic3D.WebUI/src/components/storefront/ProductConfigurator.tsx
    - src/Kinetic3D.WebUI/src/components/storefront/ProductViewer3D.tsx
  </read_first>
  <acceptance_criteria>
    - `src/Kinetic3D.WebUI/src/app/products/[id]/page.tsx` exists and uses `next/dynamic` for `ProductViewer3D`.
    - Page background is set to Obsidian Black.
  </acceptance_criteria>
</task>
```

## Verification
- Run `npm run dev` in `src/Kinetic3D.WebUI`.
- Navigate to `/products/1`.
- Verify the 3D viewer loads and the overlay configurator appears.

## Requirements Covered
- EXP-01
- EXP-02
- EXP-03
