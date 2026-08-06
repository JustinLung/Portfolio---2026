# Project context

## Product

Portfolio 2026 is a fast, expressive personal portfolio that presents selected work, communicates
creative and technical range, and gives prospective collaborators a clear path to make contact.

## Primary goals

1. Make the strongest work understandable within one browsing session.
2. Use typography, layout, and motion to create a distinctive identity without obscuring content.
3. Preserve excellent keyboard, screen-reader, reduced-motion, and responsive experiences.
4. Keep portfolio content maintainable in WordPress while keeping presentation in SvelteKit.
5. Ship a resilient, performant site with deliberate loading, empty, error, and offline-adjacent
   behavior.

## Product principles

- **Content leads:** motion and decoration clarify hierarchy; they do not compete with the work.
- **A clear idea per screen:** each section has one primary message and one primary action.
- **Progressive enhancement:** essential content and navigation remain usable without animation.
- **Responsive by composition:** layouts adapt to available space, content length, and input mode,
  not only named device widths.
- **Motion has a job:** every animation must orient, relate, acknowledge, or focus.
- **Accessible by default:** accessibility is an acceptance criterion, not a cleanup phase.
- **Tokens over exceptions:** use the shared color, typography, spacing, easing, and media-query
  system before introducing local values.

## Technical baseline

- Svelte 5 with runes
- SvelteKit 2 and TypeScript
- Server-side WordPress data through WPGraphQL and Apollo Client
- Component-scoped CSS plus global PostCSS design tokens
- GSAP for orchestrated interaction and scroll motion
- Lenis for smooth scrolling

Exact installed versions are defined by `package.json` and the lockfile.

## Specification vocabulary

- **Requirement:** behavior the implementation must provide.
- **Acceptance criterion:** an observable, testable statement that proves a requirement.
- **Constraint:** a boundary that limits valid solutions.
- **Non-goal:** behavior intentionally excluded from the current scope.
- **Decision:** a lasting choice with consequences for future work.
- **Assumption:** an unverified belief; assumptions must be validated or accepted as risks.

## Specification states

- **Draft:** intent is being explored; implementation must not begin.
- **Ready:** scope, states, constraints, and acceptance criteria are implementable.
- **In progress:** implementation is underway against the approved spec.
- **Verified:** acceptance criteria and quality gates pass, and durable documentation is updated.

## Definition of done

A feature is done when:

- Every acceptance criterion has verification evidence.
- Loading, empty, error, long-content, and narrow/wide viewport states are addressed where relevant.
- Keyboard, focus, semantics, contrast, and reduced-motion behavior are verified.
- `pnpm check`, `pnpm lint`, and `pnpm build` pass.
- Generated GraphQL types are current when a query or schema contract changed.
- New lasting decisions are recorded in `specs/05_project_memory/decision-log.md`.
