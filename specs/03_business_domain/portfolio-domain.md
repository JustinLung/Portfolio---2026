# Portfolio domain

## Audience

### Prospective client or collaborator

Wants to understand the creator's taste, capabilities, role, and availability quickly. They need
credible work evidence and a low-friction contact path.

### Hiring decision-maker

Wants to scan relevant work, distinguish individual contribution from team output, and understand
the thinking and outcomes behind a project.

### Peer or returning visitor

Wants to explore visual details, interaction craft, and recent work without being blocked by a
linear presentation.

## Core journeys

1. Arrive on the home page, understand positioning, inspect latest work, and open a case study.
2. Browse all work, change view or filter, compare projects, and open a relevant project.
3. Read a case study, understand context and contribution, then continue to another project or
   contact.
4. Visit About to understand practice, experience, and working style.
5. Reach a reliable contact method from any major route.

## Domain entities

### Work

A published portfolio case study.

Required application fields:

- `title` — human-readable project name.
- `slug` — stable public route identifier.

Optional presentation fields may include:

- publication date;
- summary or introduction;
- rich case-study content;
- featured image and other media;
- categories, disciplines, client, role, services, and project metadata.

The GraphQL fragment, generated types, server mapper, and `WorkItem` application type together define
the actual field contract.

### Category

A visitor-facing grouping used to describe or filter work. Category labels must be understandable
without internal agency or CMS context. An uncategorized project remains browsable.

### Case study

The narrative presentation of one Work. A strong case study distinguishes:

- context or challenge;
- creator's role and constraints;
- approach and key decisions;
- outcome or impact;
- supporting visual evidence.

Not every case study must use the same section count, but navigation and typography must remain
predictable.

## Business rules

- Only published WordPress works appear publicly.
- Slugs are canonical route identifiers; title changes must not silently break existing URLs.
- Latest work is ordered by the CMS publication order and limited by the home route query.
- Filtering never makes a valid project unreachable from the complete work index.
- Missing optional metadata must be omitted gracefully, never displayed as an empty label.
- A missing work slug returns a true `404`.
- CMS connection or mapping failures must not masquerade as empty content.
- Contact routes or links must point to a real, maintained channel before they are published.

## Content standards

- Use concise, specific language and active voice.
- Describe personal contribution accurately; do not imply sole ownership of team work.
- Prefer measurable outcomes when they are truthful and useful.
- Media supports the narrative and includes appropriate alternative text or captions.
- Avoid publishing confidential information, private client data, or unlicensed assets.

## Product success signals

No analytics implementation is assumed. If measurement is introduced, define its privacy model first.
Useful signals could include:

- visitors opening a case study from Home or Work;
- visitors reaching a contact action after viewing work;
- completion and error rates for the contact path;
- performance and Core Web Vitals on image- and motion-heavy routes.

Metrics should assess comprehension and connection, not incentivize intrusive interaction patterns.
