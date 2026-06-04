# Phase 4: 3D Experience & Cart - Context

**Gathered:** 2026-06-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the 3D E-commerce Experience, including the Product Details page with a Three.js viewer, real-time custom text mapping, dynamic pricing with animations, flash sale countdowns, and a basic local-storage cart with checkout form. Integrate Umami analytics.

</domain>

<decisions>
## Implementation Decisions

### 3D Customizer Layout
- **Overlay** — The configurator panel floats over a full-screen 3D viewer, maximizing immersion and fitting the Cyber-Tech vibe.

### Text Mapping Input
- **Sidebar text box** — Users type into a standard input field in the overlay panel, which then updates the 3D model text. Simpler implementation that guarantees formatting doesn't break.

### Cart Persistence
- **Local Storage** — Guest friendly and simple. Cart data lives in the browser.

### Pricing Animation
- **Odometer roll** — Numbers spin when the price updates due to variant changes, matching the highly dynamic tech aesthetic.

### the agent's Discretion
- Three.js lighting and camera setup (keep it dark/dramatic to match Obsidian Black).
- Cart slide-out or modal design.
- Exact placement of the flash sale countdown banner.

</decisions>

<canonical_refs>
## Canonical References

- `.planning/REQUIREMENTS.md` — EXP-01 through EXP-06 define the scope.
- Three.js docs: https://threejs.org/docs/
- React Three Fiber docs: https://docs.pmnd.rs/react-three-fiber

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/Kinetic3D.WebUI/src/app/globals.css` — Global CSS baseline with Obsidian Black, Cyan, and Neon Orange.
- Storefront UI components (`Header`, etc.) from Phase 3.

### Established Patterns
- Next.js App Router.
- Tailwind CSS styling.

</code_context>

<specifics>
## Specific Ideas

- Ensure the 3D viewer background matches the global Obsidian Black (`#0B0B0B`) so the model appears to float in the page environment.

</specifics>

<deferred>
## Deferred Ideas

- None.

</deferred>

---

*Phase: 04-3d-experience-cart*
*Context gathered: 2026-06-04*
