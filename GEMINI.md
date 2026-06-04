<!-- GSD:project-start source:PROJECT.md -->
## Project

**Kinetic3D**

Kinetic3D is a disruptive 3D e-commerce platform that functions as a futuristic custom workshop. It features a Cyber-Tech aesthetic, 3D interactive product visualization using Three.js, real-time dynamic pricing, and a fast, scalable architecture (.NET 8 backend, Next.js frontend, PostgreSQL with JSONB).

**Core Value:** Providing an immersive, real-time interactive 3D customization experience with instantaneous feedback (pricing and search) to elevate the standard of e-commerce.

### Constraints

- **Architecture**: Clean Architecture — to maintain scalable separation of concerns.
- **Database Model**: No separate tables for Color/Size — must use JSONB to store dynamic attributes.
- **Self-Hosted Infrastructure**: MinIO, Meilisearch, Umami must run in local Docker rather than managed cloud services to minimize costs.
- **UI/UX**: Strictly adhere to the Cyber-Tech / Modern Minimalist aesthetic without typical E-commerce clutter.
<!-- GSD:project-end -->

<!-- GSD:stack-start source:STACK.md -->
## Technology Stack

Technology stack not yet documented. Will populate after codebase mapping or first phase.
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.agent/skills/`, `.agents/skills/`, `.cursor/skills/`, or `.github/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
