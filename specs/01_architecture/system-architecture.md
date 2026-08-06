# System architecture

## Context

Portfolio 2026 is a SvelteKit presentation layer backed by WordPress through WPGraphQL.

```text
Visitor
  ↓
SvelteKit route and server loader
  ↓
Apollo Client (server-only)
  ↓
WPGraphQL
  ↓
WordPress portfolio content
```

## Boundaries

### Routes

- `/` presents the introduction and latest work.
- `/work` presents the browsable and filterable work index.
- `/work/[slug]` presents one complete case study.
- `/about` communicates biography, practice, and capabilities.
- `/styleguide` is an internal visual reference.
- `/contact` is a planned route and must not be treated as implemented until a feature spec is
  verified.

Use SvelteKit file-based routing and `resolve()` from `$app/paths` for internal route links.

### UI components

- `src/lib/components/layout/` owns the site shell.
- `src/lib/components/shared/` owns reusable portfolio UI.
- Route files compose features and own route-specific presentation.
- Components receive serializable, presentation-ready data; they do not query WordPress directly.

### Data layer

- GraphQL operations live in `src/lib/graphql/api/documents/`.
- Generated GraphQL types live in `src/lib/graphql/generated/` and are not hand-edited.
- Apollo setup and WordPress mapping remain server-only in `src/lib/server/`.
- Route `+page.server.ts` loaders orchestrate requests and map results into application types.
- `WorkItem`, the `WorkFields` fragment, and `toWorkItem()` form one content contract and must evolve
  together.

## Data-state contract

Every data-backed feature specification must define:

1. Successful data with typical content.
2. Missing optional media or metadata.
3. Empty collections.
4. Long titles, category names, and rich content.
5. Upstream errors and unavailable content.
6. Unknown slugs and the appropriate HTTP status.

Do not leak upstream GraphQL shapes into components. Normalize nullable CMS fields at the server
boundary and make absence intentional in component props.

## Rendering and security

- Fetch WordPress data on the server unless a feature spec demonstrates a user-facing need for
  client fetching.
- Keep `WORDPRESS_GRAPHQL_URL` server-only.
- Treat `{@html}` as trusted-CMS rendering. Any future user-authored or third-party HTML must be
  sanitized before rendering.
- Use SvelteKit errors with meaningful status codes: `404` for absent public resources and `5xx`
  for upstream or mapping failures.

## Styling architecture

- Global tokens and primitives live in `src/lib/css/`.
- Import global styles once from the root layout.
- Component-specific styling stays in the component `<style>` block.
- Follow the custom-property, typography, PostCSS, and media-query conventions in
  [`../02_coding_standards/frontend-standards.md`](../02_coding_standards/frontend-standards.md).
- Add a global token only when it represents a reusable design decision, not a one-off measurement.

## Motion architecture

- CSS transitions handle small state changes such as hover, focus, opacity, and color.
- GSAP handles sequencing, FLIP layout changes, pointer-follow behavior, and scroll orchestration.
- Lenis is a progressive enhancement for scroll feel, not a dependency for content access.
- Any browser-only animation setup belongs in an effect and must clean up timelines, listeners,
  contexts, and ScrollTriggers.
- Every motion spec includes reduced-motion behavior.

## Architectural constraints

- Use Svelte 5 runes; do not introduce legacy reactive syntax into new components.
- Preserve SSR safety: browser globals are accessed only in browser lifecycle code.
- Keep the site usable before animation initialization.
- Avoid new global state unless two independent route branches must coordinate persistent state.
- Prefer platform and SvelteKit capabilities before adding dependencies.
- Choose an explicit SvelteKit adapter before production requirements depend on platform behavior.
