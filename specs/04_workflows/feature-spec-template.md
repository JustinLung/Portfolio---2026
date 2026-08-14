---
title: Feature name
status: Draft
owner: ''
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Feature name

## Summary

One paragraph describing the user problem and intended outcome.

## Context

Why is this needed now? Link related decisions, issues, designs, routes, or prior specs.

## Users and jobs

- **User:** Who needs this?
- **Situation:** When and where does the need occur?
- **Job:** What are they trying to accomplish?
- **Success:** What changes for them?

## Goals

- Outcome this feature must achieve.

## Non-goals

- Related behavior deliberately excluded from this feature.

## User journey

1. Entry point.
2. Primary actions and decisions.
3. Successful end state.
4. Recovery path when something fails.

## Experience specification

### Content and hierarchy

Define the page message, information order, primary action, secondary actions, and content rules.

### Responsive behavior

Describe composition at narrow, medium, and wide widths. Include long-content and missing-media
behavior. Specify what reflows, wraps, stacks, scrolls, or disappears and why.

### Interaction

Define pointer, touch, keyboard, focus, hover, pressed, selected, disabled, and interrupted states.
Note any `data-uisfx` cues or `playSfx()` calls; sound-off must remain equivalent.

### Motion

- **Purpose:** Orient, relate, acknowledge, or focus.
- **Trigger:** User action, route state, viewport entry, or scroll progress.
- **Behavior:** Elements, sequence, direction, duration character, and easing character.
- **Interruption:** What happens on repeated input, navigation, resize, or unmount?
- **Reduced motion:** Equivalent static or low-motion behavior.

### Accessibility

Define semantics, accessible names, heading structure, focus order/management, announcements,
alternative text, contrast, target size, and zoom behavior.

## States

- Loading:
- Empty:
- Error:
- Success:
- Partial or missing data:
- Long or unusual content:

## Data and content contract

List required and optional fields, source of truth, validation, normalization, error semantics, and
any CMS authoring work. Note GraphQL/type changes explicitly.

## Technical approach

### Affected areas

- Routes:
- Components:
- Server/data:
- Types/GraphQL:
- CSS/tokens:
- Assets:

### Boundaries and cleanup

Describe server/client responsibilities, SSR behavior, browser-only APIs, animation cleanup, and any
security or privacy considerations.

### Alternatives considered

Record meaningful alternatives and why the proposed approach is preferred.

## Acceptance criteria

- [ ] Given ..., when ..., then ...
- [ ] Given ..., when ..., then ...
- [ ] The feature remains usable with keyboard-only input.
- [ ] The reduced-motion experience preserves all content and actions.
- [ ] Loading, empty, error, and long-content states match this specification where applicable.
- [ ] No new console errors, hydration warnings, type errors, lint errors, or build failures occur.

## Verification plan

- Automated:
- Manual functional:
- Responsive:
- Accessibility:
- Motion/reduced motion:
- Performance:
- Data/error states:

## Verification evidence

Complete during implementation. Map evidence to each acceptance criterion.

## Dependencies and risks

- Dependency:
- Risk and mitigation:

## Assumptions

- Assumption and how it will be validated.

## Open questions

- [ ] Question, owner, and required decision date.

## Rollout and rollback

Describe content migration, flags, deployment order, monitoring, and safe rollback if relevant.

## Decision log impact

List decisions to add or update in `../05_project_memory/decision-log.md`, or write “None.”
