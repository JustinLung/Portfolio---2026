# Portfolio domain

## Audience

### Prospective client or collaborator

Wants to understand the creator's taste, capabilities, role, and availability quickly. They need
credible work evidence and a low-friction contact path.

### Hiring decision-maker

Wants to scan relevant work, distinguish individual contribution from team output, and understand
the thinking and outcomes behind a project.

### Peer or returning visitor

Wants to explore visual details, interaction craft, writing, and recent work without being blocked
by a linear presentation.

## Core journeys

1. Arrive on the home page, understand positioning, inspect latest work or writing, and open a
   case study or post.
2. Browse all work, change view or filter, compare projects, and open a relevant project.
3. Read a case study, understand context and contribution, then continue to another project or
   contact.
4. Browse writing, filter by category, and read a post.
5. Visit About to understand practice, experience, and working style.
6. Reach a reliable contact method from any major route (header, footer, or `/contact`).

## Domain entities

### Work

A published portfolio case study.

Required application fields:

- `title` — human-readable project name.
- `slug` — stable public route identifier.
- `date` — CMS publication date used for mapping and fallbacks.

Optional presentation fields may include:

- project year (used to order the work index and home latest-work list);
- summary or introduction;
- rich case-study content;
- featured image and other media;
- categories, role, workplace (`at`), live site URL, and GitHub URL.

The GraphQL fragment, generated types, server mapper, and `WorkItem` application type together define
the actual field contract.

### Post

A published writing piece.

Required application fields:

- `title`
- `slug`
- `date`

Optional presentation fields may include excerpt, rich content, featured image, and category.
Uncategorized posts still appear, labeled `Writing`. The GraphQL fragment, generated types, server
mapper, and `PostItem` application type together define the actual field contract.

### Experience

A workplace or role shown on About.

Required application fields:

- `title`
- `startYear`

Optional fields include `role`, `endYear`, `currentYear`, and `link`. Experiences are ordered by
start year ascending.

### Category

A visitor-facing grouping used to describe or filter work and writing. Category labels must be
understandable without internal agency or CMS context. An uncategorized item remains browsable.

### Case study

The narrative presentation of one Work. A strong case study distinguishes:

- context or challenge;
- creator's role and constraints;
- approach and key decisions;
- outcome or impact;
- supporting visual evidence.

Not every case study must use the same section count, but navigation and typography must remain
predictable.

### Home

Editorial fields for the landing page: hero title and subtitle, latest-work heading, and personal
intro copy and image. Latest work on home is a subset of published works (currently six), ordered
by project year descending. Latest posts on home are a subset of published posts (currently five).

### About

The biography page: title, rich content, featured image, optional photo-stack images, and the
experience list.

### Legal page

Privacy Policy and Terms of Service are CMS pages rendered as trusted HTML. They are public routes
and must remain reachable from the footer.

## Business rules

- Only published WordPress works and posts appear publicly.
- Slugs are canonical route identifiers; title changes must not silently break existing URLs.
- Latest work on home is ordered by project year descending and limited by the home route.
- Filtering never makes a valid project or post unreachable from the complete index.
- Missing optional metadata must be omitted gracefully, never displayed as empty labels.
- A missing work or post slug returns a true `404`.
- CMS connection or mapping failures must not masquerade as empty content.
- Contact is a maintained `mailto:` path plus public social links; it must not imply a ticketed
  inbox or stored submissions.
- Availability copy in the footer is an explicit product flag (`availableForProjects`) and must
  stay truthful before it is flipped.

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
- visitors opening a post from Home or Writing;
- visitors reaching a contact action after viewing work;
- completion and error rates for the contact path;
- performance and Core Web Vitals on image- and motion-heavy routes.

Metrics should assess comprehension and connection, not incentivize intrusive interaction patterns.
