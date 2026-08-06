# Decision log

Record decisions that should survive individual features and conversations. Append new entries; do
not rewrite past reasoning to make it appear inevitable. If a decision changes, mark the old entry
Superseded and link the replacement.

## Decision template

```md
## ADR-NNN: Short decision title

- **Date:** YYYY-MM-DD
- **Status:** Proposed | Accepted | Superseded
- **Related spec:** `specs/features/...`

### Context

What forces, constraints, or problems require a decision?

### Decision

What was chosen?

### Consequences

What becomes easier, harder, required, or intentionally unsupported?

### Alternatives considered

What credible alternatives were rejected, and why?
```

## ADR-001: WordPress is the portfolio content source

- **Date:** 2026-08-04
- **Status:** Accepted
- **Related spec:** Existing architecture

### Context

Portfolio works require maintainable editorial content and media. The repository already integrates
WPGraphQL, Apollo Client, generated operation types, and a server-side mapper.

### Decision

WordPress remains the source of truth for portfolio work. SvelteKit fetches it on the server through
WPGraphQL and maps upstream responses into application-facing types.

### Consequences

- Data-backed builds and code generation require `WORDPRESS_GRAPHQL_URL`.
- Components stay independent of Apollo and raw GraphQL response shapes.
- Schema, query, generated types, mapper, and application types must evolve together.
- Upstream failures are explicit errors, not empty portfolio states.

## ADR-002: Motion is progressive enhancement

- **Date:** 2026-08-04
- **Status:** Accepted
- **Related spec:** Existing architecture

### Context

The visual identity uses GSAP, ScrollTrigger, Flip, CSS transitions, and Lenis. These techniques can
improve continuity and expression but can also reduce access, performance, and input responsiveness.

### Decision

Essential content, navigation, and actions work without motion. CSS handles simple state transitions;
GSAP handles orchestrated motion; Lenis enhances scroll feel. Every motion feature defines cleanup,
interruption, coarse-pointer behavior where relevant, and a reduced-motion equivalent.

### Consequences

- Motion cannot be the only carrier of state or meaning.
- Reduced motion removes nonessential travel and scroll effects.
- Feature verification includes motion disabled and interrupted interactions.

## ADR-003: Use project tokens and component-scoped CSS

- **Date:** 2026-08-04
- **Status:** Accepted
- **Related spec:** Existing architecture

### Context

The project has global color, typography, layout, easing, and media-query definitions plus
component-scoped styles.

### Decision

Reusable design decisions are expressed as global custom properties and primitives in `src/lib/css/`.
Feature styling remains in component `<style>` blocks and consumes those shared tokens.

### Consequences

- One-off values do not automatically become global tokens.
- Hard-coded values require a feature-specific reason when a semantic token exists.
- New global styles must be imported once through the root layout.
