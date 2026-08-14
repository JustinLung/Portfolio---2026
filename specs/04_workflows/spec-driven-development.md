# Spec-driven development workflow

## 1. Frame

Create a feature spec from `feature-spec-template.md`. Describe the user problem, desired outcome,
scope, non-goals, constraints, dependencies, and assumptions.

Do not begin implementation while a material product or architectural question is unresolved.

## 2. Specify experience

Define the complete experience before choosing implementation details:

- entry points and primary journey;
- content hierarchy and primary action;
- responsive composition;
- keyboard and assistive-technology behavior;
- interface audio cues and the sound-off equivalent;
- loading, empty, error, success, and long-content states;
- motion purpose, timing character, interruption behavior, and reduced-motion equivalent;
- performance expectations.

Use plain, observable language. “Feels premium” is not an acceptance criterion; describe the visual
and interaction decisions that should create that feeling.

## 3. Define acceptance

Write acceptance criteria in Given/When/Then form where useful:

```text
Given a keyboard user is on the Work page
When they move through the filters
Then each filter receives visible focus and can be activated with the keyboard
```

Each criterion must be:

- observable by a visitor or developer;
- verifiable without knowing the implementation;
- scoped to one outcome;
- clear about relevant state and viewport conditions.

## 4. Technical review

Before marking the spec Ready, identify:

- affected routes, components, types, queries, styles, and assets;
- server/client boundary and data normalization;
- reusable tokens or primitives;
- animation lifecycle and cleanup;
- security and privacy implications;
- migration or content-entry work;
- verification approach.

Record a durable decision in `../05_project_memory/decision-log.md` if it changes a project-wide
contract.

## 5. Implement

Implement in thin vertical slices that can be verified:

1. Data and type contract.
2. Semantic static experience.
3. Responsive visual design.
4. Interaction and motion enhancement.
5. Edge states and resilience.

Keep the feature spec open while coding. If implementation reveals a false assumption, update the
spec and return it to review rather than silently changing scope.

## 6. Verify

For every acceptance criterion, add a short evidence note in the feature spec. Evidence can be:

- automated test name;
- manual verification step and result;
- screenshot or recording path;
- accessibility-tree or keyboard result;
- performance measurement.

Run:

```sh
pnpm check
pnpm lint
pnpm build
```

When applicable, also verify:

- narrow, medium, and wide layouts;
- touch/coarse-pointer and keyboard input;
- reduced motion;
- missing/slow/failed CMS responses;
- long and missing content;
- direct navigation and browser history;
- no new console errors or hydration warnings.

## 7. Close

Mark a spec Verified only when all criteria pass. Then:

- summarize implementation deviations and why they were approved;
- update architecture or domain docs if their contracts changed;
- add lasting decisions to the decision log;
- leave follow-up ideas as explicit non-goals or separate draft specs.

## Change control

- **Editorial clarification:** update the spec without changing status.
- **Behavior or acceptance change:** return the spec to Draft or Ready for review.
- **New cross-project constraint:** update canonical docs and record a decision.
- **Unrelated improvement discovered during implementation:** do not expand scope; create a separate
  feature spec or backlog note.
