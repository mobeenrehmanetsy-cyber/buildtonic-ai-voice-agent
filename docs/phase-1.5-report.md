# Buildtonic — Phase 1.5 review

Local implementation, 15 September 2026. No commit, push or deployment performed.

## Visual direction and originality

The homepage is rebuilt around a typographic masthead, a full-width Laurels interior photograph and a project-led editorial sequence. Warm white, charcoal and mineral blue replace the previous dominant cream/forest/orange treatment. Large sans-serif display type, selective italic serif accents, technical captions, asymmetric photography and square, restrained controls form the shared system.

The sequence is now: identity and region → Laurels opening image → relationship between preservation and residential work → three selected project stories → flint/material story → project-type expertise index → verified professional memberships → guided enquiry invitation. It does not reproduce the reference site’s hero/services-grid/heritage/process/contact sequence.

Side-by-side assessment: the typography, image selection, section order, project emphasis, palette and spacing create a substantially different experience. The retained company name, factual scope, regional information and real imagery keep it recognisably Buildtonic. The existing site remains a content reference rather than a layout template.

## Six project stories

| Project | Local case-study additions |
|---|---|
| Rose Cottage | Room-by-room scope, four gallery images, original client testimonial and published before/after social links |
| Guildford Quaker Meeting House | Material-specific conservation detail, three portrait gallery photographs, short attributed client-review excerpt |
| The Old Thatch | Flint/lime repair narrative, genuine detail image and original testimonial link |
| The Laurels | Structural and underfloor detail, six gallery images, Tom Howley collaboration credit and original project-media links |
| Elm Park Gardens | Interior/exterior finishing scope, four gallery photographs, restrained image display |
| Winter’s Hill Eco House | Principal-contractor scope, four design-gallery images/drawings, explicit distinction between published delivery and visual evidence |

All stories include local expertise links, location/type/year where published, previous/next navigation and a contextual “Discuss a similar project” enquiry. Galleries preserve aspect ratio, support enlargement, arrow keys, Escape, focus containment and focus restoration. Content varies with the source evidence.

## Image recovery

28 public source files were recovered and copied without recompression. The Laurels improves from 720-pixel copies to 6000 × 4000 originals. Rose Cottage gallery sources reach 4000 × 3000 and Old Thatch sources reach 2400 × 1800. Next Image delivers responsive variants.

Guildford and Elm Park Gardens do not have genuinely high-resolution originals available in the discovered assets. Elm Park’s former cover was already an enlarged derivative of a smaller 1024 × 768 source. Those photographs use constrained layouts. Winter’s Hill remains design material throughout; completed-building photography was not found. Detailed URLs, dimensions and limitations are in [the source audit](phase-1.5-research.md).

## Enquiry and future voice preparation

`/start-project` now provides five stages: idea, place, plans, contact details, review/share. It includes conditional size and Listed Building Consent questions, optional budget and timing, required-field validation, privacy acknowledgement, review and back navigation. A project link preselects the relevant service and carries the project reference into the brief.

The final actions open an email draft or download a text brief. The website explicitly says it has not submitted anything and cannot confirm email delivery. No database, submission endpoint, persistent storage, extra runtime dependency or credentials were introduced. Long mailto drafts have a download fallback.

The serialisable `ProjectBrief` model, relevance helpers and text formatter provide a reusable qualification boundary; the future `QualifiedEnquiry` can carry that shape. The bottom-right assistant uses the new visual styling while retaining its state, context and language model. No voice connection, microphone permission, fabricated conversation or automated telephone call was added.

## Validation

- Production build and TypeScript pass; all application pages remain statically rendered.
- ESLint passes. Six Node tests pass for enquiry relevance/export and voice context/language fallback.
- All 22 visitor routes checked at 1920, 1440, 1366, 768, 390 and 320 pixels: no horizontal overflow.
- All 22 routes return 200, have one main H1 and retain preview noindex metadata. Unknown routes return the branded 404.
- No broken internal links, missing local images or browser page errors found.
- Axe WCAG A/AA checks found no violations on all pages at desktop/mobile, or on the enquiry review at all six widths. This is automated evidence, not a claim of complete accessibility certification.
- Enquiry checks cover required description/telephone, conditional consent, review contents, downloadable output and clearing after reload. No local form network submission occurred.
- Voice checks cover topic/context selection, truthful unavailable state, keyboard containment, Escape, restored focus, mobile navigation and reduced motion. Instrumentation recorded zero microphone requests and no third-party requests from the prototype.
- The source-site screenshot navigation is recorded separately from prototype network activity; the original site’s own analytics request is not generated by this implementation.

Machine-readable evidence: [site audit](review-1.5/audit.json), [enquiry checks](review-1.5/journeys.json), [final interaction checks](review-1.5/final-interactions.json).

## Screenshots

- [Homepage desktop opening](review-1.5/home-opening-1440.png), [mobile opening](review-1.5/home-opening-390.png), [320-pixel opening](review-1.5/home-opening-320.png)
- [Full desktop homepage](review-1.5/home-1440.jpg), [full mobile homepage](review-1.5/home-390.jpg), [original reference homepage](review-1.5/original-home-1440.jpg)
- [Rose Cottage](review-1.5/projects-rose-cottage.jpg), [Guildford](review-1.5/projects-guildford-quaker-meeting-house.jpg), [Old Thatch](review-1.5/projects-the-old-thatch.jpg), [Laurels](review-1.5/projects-the-laurels.jpg), [Elm Park](review-1.5/projects-elm-park-gardens.jpg), [Winter’s Hill](review-1.5/projects-winters-hill.jpg)
- [Enquiry opening](review-1.5/enquiry-start-1440.jpg), [desktop review](review-1.5/enquiry-review-1440.jpg), [mobile review](review-1.5/enquiry-review-390.jpg)
- [Gallery desktop](review-1.5/gallery-1440.jpg), [gallery mobile](review-1.5/gallery-390.jpg), [assistant desktop](review-1.5/voice-1440.jpg), [assistant mobile](review-1.5/voice-390.jpg)

Additional homepage, enquiry and gallery screenshots cover the other requested widths in `docs/review-1.5/`. Screenshot enquiry values are synthetic test data.

## Changed files

- Homepage/shared identity: `app/page.tsx`, `app/layout.tsx`, new `app/architecture.css`.
- Case studies/media: `app/projects/[slug]/page.tsx`, `data.ts`, new `stories.ts`, `media.json`, `gallery.tsx`, new `app/components/project-image.tsx`, and 28 originals under `public/images/projects/`.
- Existing image consumers: `app/content/expertise.ts`, `app/expertise/[slug]/page.tsx`, `app/heritage/page.tsx`.
- Enquiry: `app/start-project/page.tsx`, new `model.ts` and `project-enquiry.tsx`.
- Privacy/future boundary: `app/privacy/page.tsx`, `app/voice/model.ts`.
- Validation/research: new `tests/project-brief.test.mjs`, this report, the source audit and review screenshots/JSON.

## Decisions remaining

Visual approval is the next gate. Production enquiry delivery/storage and live voice remain future phases. Larger Guildford/Elm Park photographs and completed Winter’s Hill photography would require business-supplied assets. Optional YouTube/Instagram media are verified as links on the original project pages, but automated playback inspection was restricted; their current availability and any sign-in requirement remain platform-dependent. Business confirmation of image/testimonial reuse rights is needed before a public replacement launch.

Nothing has been committed, pushed or deployed.
