# Phase 4: 3D Experience & Cart - Research

**Date:** 2026-06-04
**Goal:** Deliver the interactive Three.js customization and complete the shopping flow.

## 1. Three.js in Next.js App Router
**Challenge:** Next.js uses Server Components by default, but Three.js / React Three Fiber (`@react-three/fiber`, `@react-three/drei`) relies entirely on the browser's WebGL API and React state.
**Solution:** 
- The 3D viewer components must be marked with `"use client"`.
- It's best practice to dynamically import the 3D viewer component using `next/dynamic` with `ssr: false` to avoid hydration mismatches and prevent the server from attempting to render WebGL context.

## 2. Loading `.glb` assets from MinIO
**Challenge:** Assets will be hosted on the MinIO bucket (e.g., `http://localhost:9000/kinetic3d-assets/model.glb`). 
**Solution:**
- The `@react-three/drei` `useGLTF` hook supports passing full URLs.
- Cross-Origin Resource Sharing (CORS) must be properly configured on the MinIO bucket to allow `GET` requests from `localhost:3000`. We assume this is handled in infrastructure, or we can proxy the request if CORS issues arise. 

## 3. Real-Time Text Mapping (EXP-02)
**Challenge:** Mapping user-input text onto a loaded `.glb` 3D model dynamically.
**Solution:** 
- Standard approach is to create a 2D HTML `<canvas>` element in memory, draw the text onto it using `CanvasRenderingContext2D.fillText`, and then create a `THREE.CanvasTexture` from that canvas.
- This texture can then be applied to the specific mesh material of the GLTF model (e.g., `mesh.material.map = newTexture`).
- `@react-three/drei`'s `<Text>` component or `<Decal>` can also be used if projecting text onto complex surfaces is required, which is often much simpler than manual UV/CanvasTexture mapping.

## 4. Odometer / Counter Animation (EXP-03)
**Challenge:** Animating the price numbers when the variant changes.
**Solution:**
- Instead of building a complex rolling odometer from scratch, we can use `framer-motion` to animate the vertical Y-translation of individual digits, or use a library like `react-countup` for a simpler fade/count transition.
- Since the user explicitly decided on an "Odometer roll (numbers spin)", `framer-motion` is ideal for sliding numbers up/down in an `overflow-hidden` container.

## 5. Local Storage Cart (EXP-05)
**Challenge:** Persisting the cart without a backend session.
**Solution:**
- `Zustand` state management library with the `persist` middleware is the industry standard for React apps to automatically sync state to `localStorage`.
- We'll create a `useCartStore` to hold `items` (including the `Custom3DConfig` JSON representation), `addItem`, `removeItem`, and `clearCart` methods.

## 6. Flash Sale & Checkout (EXP-04, EXP-05)
**Challenge:** Tracking time and managing a checkout form.
**Solution:**
- A client-side `useEffect` timer can handle the countdown. Hydration mismatch is common here, so the initial render should either be delayed until client mount or show a generic "Loading..." before showing the local time calculation.
- Checkout form will be a simple UI form that submits to an API route (to be fully integrated with the DB later).

## 7. Umami Analytics (EXP-06)
**Challenge:** Tracking conversions.
**Solution:**
- Next.js `next/script` component can load the Umami script asynchronously.
- For conversion tracking, we can use Umami's Javascript API (`window.umami.track('checkout')`) on successful form submission.

## Dependencies to Add
```json
"dependencies": {
  "three": "^0.160.0",
  "@react-three/fiber": "^8.15.0",
  "@react-three/drei": "^9.96.0",
  "zustand": "^4.5.0",
  "framer-motion": "^11.0.0"
}
```

## Validation Architecture
- **EXP-01**: Smoke test Next.js route with `<Canvas>` element.
- **EXP-02**: Validate `useGLTF` loads a test URL and material updates.
- **EXP-03, EXP-04**: Verify odometer changes value and countdown decreases.
- **EXP-05**: Check `localStorage` populates when item is added.
- **EXP-06**: Verify `umami.track` is called.

## RESEARCH COMPLETE
