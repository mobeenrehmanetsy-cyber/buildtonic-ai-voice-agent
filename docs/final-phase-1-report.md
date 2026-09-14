# Final Phase 1 report

Status: implemented locally, awaiting visual approval. Preview: http://localhost:3100. No commit, push, deployment, database, provider connection or credentials were added.

## A. Pages reviewed

See [the complete 34-page research inventory](final-phase-1-reference.md#public-pages-reviewed), including homepage; services and four service details; surveys and four survey details; heritage and five specialism pages; projects and all six case studies; About, Values, Areas, FAQ, Health & Safety, Careers, Contact, guides index and two relevant guides. The same reference document records voice interaction research and image provenance.

## B. Local routes

| Route | Purpose |
| --- | --- |
| `/` | Editorial homepage, company introduction, selected work, services and enquiry |
| `/projects` | All six verified projects |
| `/projects/rose-cottage` | Period-home renovation |
| `/projects/guildford-quaker-meeting-house` | Grade II listed external restoration |
| `/projects/the-old-thatch` | Traditional flint and lime repairs |
| `/projects/the-laurels` | Residential reconfiguration and finishing |
| `/projects/elm-park-gardens` | Chelsea flat refurbishment |
| `/projects/winters-hill` | New-home delivery, clearly labelled design material |
| `/expertise` | Complete service discovery hub |
| `/expertise/new-homes` | Residential delivery from site to finish |
| `/expertise/extensions-renovations` | Extensions, alterations and refurbishment |
| `/expertise/consent` | Listed Building Consent coordination and preparation |
| `/expertise/surveys` | Condition, purchase, defect/damp and drone assessments |
| `/heritage` | Traditional materials, conservation and specialist repairs |
| `/about` | Company, named team, values and standards |
| `/areas` | Hampshire, Surrey and London coverage |
| `/faq` | Common visitor questions and relevant next steps |
| `/guides` | Concise preparation and planning notes |
| `/health-and-safety` | Safety approach and policy-document enquiry |
| `/careers` | Honest CV introduction route |
| `/start-project` | Local enquiry preparation with email and phone actions |
| `/privacy` | Notice describing this prototype's actual behaviour |

The application also serves `/icon.svg`, Next.js static assets/image optimisation and a branded 404 for unknown paths. There is no AI, form-submission or telephone endpoint.

## C. Content incorporated

Six authentic projects, the full researched service range, conservation methods, all four survey categories, regional coverage, real team roles, published values, company registration, NFB/FMB/Constructionline claims, contract/safety/CIS approach and verified contact details. The ten requested visitor journeys are mapped in the research document.

## D. Content excluded

No repetitive town pages, fragmented repair pages, copied pricing guidance, legal conclusions, guaranteed consent outcomes, unverified statistics, fabricated reviews or decorative testimonials. Careers is not represented as confirmed vacancies. Winter's Hill is not presented as finished photography. Embedded videos and tracking scripts were unnecessary. No fake form submission or fake conversation exists.

## E. UX improvements

Navigation, body copy, metadata, accreditations, contact details and footer text are larger. Desktop content width is more confident while reading columns remain bounded. Six projects now have a real portfolio destination, linked expertise and next-project navigation. Values, specialist services and coverage are grouped instead of multiplied into near-duplicate pages. A single local enquiry journey replaces vague or external fallback CTAs. Shared site chrome lives in the root layout; content is data-driven.

## F. Major CTA audit

| CTA | Destination | Intent |
| --- | --- | --- |
| Buildtonic wordmark | `/` | Return home |
| Our work / View all work / All work | `/projects` | Browse portfolio |
| Explore our work (homepage hero) | `#projects` | See selected work before the complete portfolio |
| Rose Cottage hero caption / project entry / View project | Relevant `/projects/[slug]` | Open a real case study |
| Next project title | Next local project | Continue portfolio exploration |
| Expertise / Our expertise | `/expertise` | Discover services |
| Explore this expertise | Relevant local detail, heritage or hub consent/survey section | Understand service scope |
| Explore heritage | `/heritage` | Understand conservation expertise |
| Meet Buildtonic / About | `/about` | Evaluate company and team |
| Our credentials | `/about#standards` | View evidence and membership links |
| Our values | `/about#values` | Understand working principles |
| Areas / Where we work / Check service area | `/areas` | Check coverage |
| Regional project | Relevant case study | See regional work |
| Start a project / Discuss your project / Share your brief | `/start-project` | Prepare an enquiry |
| Email your project brief | `mailto:team@buildtonic.co.uk?subject=Project%20enquiry` | Compose an email, not submit a website form |
| Email address / phone number | `mailto:` / `tel:` | Use the visitor's own application |
| Request policy documentation | Email with safety-documentation subject | Ask for current policy |
| Email your CV | Email with careers subject | Send an introduction |
| FAQ answers / planning notes | Relevant local expertise, coverage or enquiry page | Act on the information |
| Privacy & cookies | `/privacy` | Understand current data handling |
| Talk to Buildtonic | Local modal | Open assistant shell |
| Conversation starter | Local selection and relevant reading link | Express interest and continue browsing |
| Start voice conversation | Honest unavailability notice | Explain that voice is not connected; microphone stays off |
| Contact the team (assistant) | `/start-project` | Reach current contact options |
| Telephone options (assistant) | `/start-project#telephone` | Distinguish direct calling from future AI callbacks |
| Close assistant / Escape | Close modal and return focus | Dismiss safely |
| Skip to content / Back to top | `#main-content` | Keyboard access / orientation |

Service and FAQ disclosure controls reveal useful content. Image arrows only accompany actual project links. Non-interactive credentials are not styled as buttons. There are no `href="#"` placeholders.

## G. External links

Only two HTTPS visitor destinations remain: the [NFB member profile](https://builders.org.uk/members/buildtonic-ltd/) and [FMB member profile](https://www.fmb.org.uk/builder/buildtonic-ltd.html). They are legitimate third-party verification destinations supplied by Buildtonic's public site. The remaining external actions are the team's email, telephone and three email-subject variants for project briefs, careers and policy requests.

No application navigation URL points to the original Buildtonic site. Research URLs occur only in internal documentation. No external browser API or asset request was observed in the tested journeys; local fonts/images are served with the application.

## H. Voice UI

Compact circular microphone launcher, desktop hover/focus invitation, compact anchored desktop dialog and mobile bottom sheet with safe-area padding. Close stays reachable, the body scrolls independently, Tab/Shift+Tab are contained, Escape closes and focus returns to the launcher. Topic choices link to useful local content. Start reveals an explicit unavailable message rather than accessing audio.

Typed future states, actual microphone-state separation, adapter connect/subscribe/mute/end contract, page/service/project/topic context and language resolution are in `app/voice`. The future active-controls component is not mounted. English is the only supported language now; browser preference ordering, a future manual override and English fallback are prepared without translation APIs or persistent storage.

The future telephone path is separate at `/start-project#telephone`; its data contract requires explicit AI-call consent. No telephone input or callback workflow is active. See the research document for integration boundaries and guardrails.

## I. Accessibility results

Axe WCAG 2 A/AA and 2.1 AA checks found no violations across all 22 content routes at 1440px and 390px, plus the open/selected assistant panel at both sizes. Keyboard opening, focus containment, Escape, focus return and mobile navigation passed. Reduced motion produces no panel animation and no smooth scrolling. Instrumented microphone request count: zero, including after pressing Start.

Automated checks and keyboard review do not replace a comprehensive assistive-technology audit across real devices.

## J. Responsive results

All 22 content routes were exercised at 1920, 1440, 1366, 768, 390 and 320px. No horizontal overflow remained. Desktop/laptop/tablet/mobile screenshots were reviewed. Images decoded successfully, local destinations returned 200, unknown paths returned 404, each content route had one H1 and retained noindex/nofollow. No invalid anchors or browser page errors remained. Raw results: [audit.json](review/audit.json).

## K–M. Technical checks

- ESLint: pass.
- Standalone TypeScript (`tsc --noEmit --incremental false`): pass.
- Production build: pass; all content pages are static or statically generated.
- Context/language tests: 3 passed.
- Git whitespace check: pass (existing Windows LF/CRLF conversion notices only).
- No added runtime dependencies, secrets, database or provider connections.

## O. Screenshot review

Reviewed all saved screenshots in `review/`. Corrected a 320px contact-heading overflow, increased useful text sizes, widened desktop content, kept mobile layouts single-column where appropriate and reserved room beside the hero footer link for the launcher. Replaced the portfolio's close-up Old Thatch lead image with its facade while retaining repair detail in the case study. Corrected image descriptions and made design material visibly distinct. Native focus cycling was supplemented with explicit first/last-control wrapping after keyboard testing.

Voice screenshots are captured after the short entrance transition, avoiding misleading mid-animation transparency. The mobile sheet has a separate scrollable body rather than a scaled-down desktop panel.

## P. Remaining recommendations

Obtain visual approval before Phase 2. Before any official launch, confirm rights to reused photography and company sign-off on current contact, team and accreditation information. Before connecting voice or callback services, finalise privacy/consent, verified agent knowledge and server-side credential/session handling. Keep the prototype noindex until an intentional launch decision. No infrastructure is required for further visual review.

## N. File inventory

The inventory below is relative to repository HEAD and includes the earlier approved Phase 1 work, which remains uncommitted. `M` means modified, `D` deleted and `??` created/untracked. Package manifests and lockfile are unchanged.

```text
 M README.md
 D app/favicon.ico
 M app/globals.css
 M app/layout.tsx
 M app/page.tsx
?? app/about/page.tsx
?? app/areas/page.tsx
?? app/careers/page.tsx
?? app/components/editorial.tsx
?? app/components/header.tsx
?? app/content/company.ts
?? app/content/expertise.ts
?? app/expertise/[slug]/page.tsx
?? app/expertise/page.tsx
?? app/faq/page.tsx
?? app/guides/page.tsx
?? app/health-and-safety/page.tsx
?? app/heritage/page.tsx
?? app/icon.svg
?? app/not-found.tsx
?? app/privacy/page.tsx
?? app/projects/[slug]/page.tsx
?? app/projects/data.ts
?? app/projects/page.tsx
?? app/refinements.css
?? app/start-project/page.tsx
?? app/ui.tsx
?? app/voice/assistant.tsx
?? app/voice/model.ts
?? app/voice/session-controls.tsx
?? docs/final-phase-1-reference.md
?? docs/final-phase-1-report.md
?? docs/phase-1-reference.md
?? docs/review/audit.json
?? docs/review/expertise-surveys.jpg
?? docs/review/home-1366.jpg
?? docs/review/home-1440.jpg
?? docs/review/home-1920.jpg
?? docs/review/home-320.jpg
?? docs/review/home-390.jpg
?? docs/review/home-768.jpg
?? docs/review/projects-winters-hill.jpg
?? docs/review/projects.jpg
?? docs/review/start-project.jpg
?? docs/review/voice-1440.jpg
?? docs/review/voice-390.jpg
?? public/images/elm-park-detail.webp
?? public/images/elm-park.webp
?? public/images/guildford-detail.webp
?? public/images/guildford.webp
?? public/images/laurels-detail.webp
?? public/images/laurels.webp
?? public/images/old-thatch-detail.webp
?? public/images/old-thatch.webp
?? public/images/rose-cottage.webp
?? public/images/rose-detail.webp
?? public/images/winters-hill-detail-visual.webp
?? public/images/winters-hill-visual.webp
?? tests/voice-model.test.mjs
```
