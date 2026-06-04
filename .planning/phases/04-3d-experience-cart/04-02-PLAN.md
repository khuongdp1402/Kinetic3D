---
wave: 2
depends_on: [04-PLAN-1]
files_modified:
  - src/Kinetic3D.WebUI/package.json
  - src/Kinetic3D.WebUI/src/store/useCartStore.ts
  - src/Kinetic3D.WebUI/src/components/storefront/FlashSaleBanner.tsx
  - src/Kinetic3D.WebUI/src/components/storefront/CartModal.tsx
  - src/Kinetic3D.WebUI/src/components/storefront/CheckoutForm.tsx
  - src/Kinetic3D.WebUI/src/app/layout.tsx
autonomous: true
---

# Plan 2: Cart, checkout flow, and Umami analytics

## Goal
Implement the shopping cart using Zustand (with localStorage persistence), a flash sale countdown banner, a basic checkout form, and integrate Umami analytics for conversion tracking.

## Tasks

```xml
<task>
  <description>Install Zustand</description>
  <action>
    Add `zustand` to `src/Kinetic3D.WebUI/package.json`. Run `npm install zustand`.
  </action>
  <read_first>
    - src/Kinetic3D.WebUI/package.json
  </read_first>
  <acceptance_criteria>
    - `src/Kinetic3D.WebUI/package.json` contains `zustand`.
  </acceptance_criteria>
</task>

<task>
  <description>Create Cart Store (Zustand)</description>
  <action>
    Create `src/Kinetic3D.WebUI/src/store/useCartStore.ts`.
    Define standard types for `CartItem` (id, name, price, quantity, customText, variants).
    Create a Zustand store with `persist` middleware using `name: "kinetic3d-cart"`.
    Include methods: `addItem`, `removeItem`, `updateQuantity`, `clearCart`.
  </action>
  <read_first>
    - src/Kinetic3D.WebUI/package.json
  </read_first>
  <acceptance_criteria>
    - `src/Kinetic3D.WebUI/src/store/useCartStore.ts` exports `useCartStore`.
    - Uses `persist` from `zustand/middleware`.
  </acceptance_criteria>
</task>

<task>
  <description>Create Flash Sale Banner</description>
  <action>
    Create `src/Kinetic3D.WebUI/src/components/storefront/FlashSaleBanner.tsx`.
    Component must be `"use client"`.
    Accepts an `endTime` prop (Date/timestamp).
    Uses `useEffect` to tick every second and calculate remaining hours/minutes/seconds.
    To avoid hydration errors, don't render the dynamic time until `useEffect` sets an `isMounted` state to true.
  </action>
  <read_first>
    - src/Kinetic3D.WebUI/src/components/storefront/ProductConfigurator.tsx
  </read_first>
  <acceptance_criteria>
    - `src/Kinetic3D.WebUI/src/components/storefront/FlashSaleBanner.tsx` exists.
    - Handles hydration correctly with `isMounted` state.
  </acceptance_criteria>
</task>

<task>
  <description>Create Cart Modal and Checkout Form</description>
  <action>
    Create `src/Kinetic3D.WebUI/src/components/storefront/CartModal.tsx`.
    Must be `"use client"`.
    Reads from `useCartStore`. Displays list of items with their configurations.
    Create `src/Kinetic3D.WebUI/src/components/storefront/CheckoutForm.tsx` (a simple shipping/payment mockup form).
    When checkout form is submitted, call `useCartStore.getState().clearCart()` and trigger `window.umami.track('checkout')`.
  </action>
  <read_first>
    - src/Kinetic3D.WebUI/src/store/useCartStore.ts
  </read_first>
  <acceptance_criteria>
    - `src/Kinetic3D.WebUI/src/components/storefront/CartModal.tsx` exists.
    - `src/Kinetic3D.WebUI/src/components/storefront/CheckoutForm.tsx` exists and calls `umami.track`.
  </acceptance_criteria>
</task>

<task>
  <description>Integrate Umami Analytics script</description>
  <action>
    Edit `src/Kinetic3D.WebUI/src/app/layout.tsx`.
    Add `next/script` in the `<head>` section (or just inside `<body>`) pointing to `http://localhost:3000/script.js` (Umami's default port, or whichever port it's running on) with `data-website-id="kinetic3d-id"`.
  </action>
  <read_first>
    - src/Kinetic3D.WebUI/src/app/layout.tsx
  </read_first>
  <acceptance_criteria>
    - `src/Kinetic3D.WebUI/src/app/layout.tsx` contains `<Script src=".../script.js" data-website-id="..." />`.
  </acceptance_criteria>
</task>
```

## Verification
- Add an item to the cart and verify it persists after page reload via `localStorage`.
- Verify FlashSaleBanner counts down correctly without hydration mismatch errors.
- Verify `umami.track('checkout')` is present in checkout logic.

## Requirements Covered
- EXP-04
- EXP-05
- EXP-06
