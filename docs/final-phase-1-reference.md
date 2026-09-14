# Final Phase 1: research, content decisions and integration preparation

Research reviewed on 14 September 2026. This supplements and supersedes the initial scope in `phase-1-reference.md`. Buildtonic's public website is a factual and asset reference only; it is not a navigation destination in the application.

## Public pages reviewed

All paths below are relative to https://buildtonic.co.uk.

- `/` — positioning, identity, original homepage and contact signals.
- `/services/` — full service range and hierarchy.
- `/services/new-builds/` — groundworks-to-finish delivery, annexes, replacement dwellings and working with designers.
- `/services/extensions/` — additions, openings, layout changes and finishing.
- `/services/renovations/` — whole-house and room-by-room work, kitchens, bathrooms and fabric repairs.
- `/services/listed-building-consent/` — coordination, documentation and professional liaison.
- `/surveys/` — survey categories.
- `/surveys/condition-surveys/` — photographed assessments and the distinction between contractor-led assessment and chartered input.
- `/surveys/pre-purchase-surveys/` — purchase-related assessments, access and reporting scope.
- `/surveys/defect-investigation/` — damp and defect investigation.
- `/surveys/drone-surveys/` — high-level inspection imagery.
- `/heritage/` — conservation positioning and approach.
- `/heritage/lime-plastering/` — plaster, render and pointing.
- `/heritage/limecrete-floors/` — breathable floor build-ups.
- `/heritage/listed-building-repairs/` — fabric retention and compatible repairs.
- `/heritage/timber-treatment/` — timber assessment and repair.
- `/heritage/structural-repairs/` — structural repair capabilities and engineer coordination.
- `/projects/` — published portfolio.
- `/projects/rose-cottage/` — Hampshire renovation.
- `/projects/guildford-quaker-meeting-house/` — Grade II listed external repairs.
- `/projects/the-old-thatch/` — flint repairs and lime repointing; no completion year invented.
- `/projects/the-laurels/` — internal opening, services and finishes; represented as renovation, not an unverified extension.
- `/projects/elm-park-gardens/` — Chelsea basement-flat renovation.
- `/projects/winters-hill/` — principal contractor delivery; images explicitly disclosed as design material.
- `/about/` — founding year, named team, company details and published accreditations.
- `/values/` — craft, clarity, care, accountability and safety.
- `/areas/` — Hampshire, Surrey and London locations.
- `/faq/` — common enquiries, contracts and getting started.
- `/health-and-safety/` — published safety approach; summarised, not presented as a newly approved full policy.
- `/careers/` — CV introductions, not a list of confirmed vacancies.
- `/contact/` — published email, telephone and registered address.
- `/guides/` — range of public resources reviewed for relevance.
- `/guides/lime-vs-cement-render/` — material compatibility as a short project-planning topic.
- `/guides/do-i-need-listed-building-consent/` — early coordination as a planning topic, without reproducing legal guidance.

The initial visual review of the live homepage informed the decision to retain the earthy identity and editorial direction, rather than reproduce its navigation or repeated content. Facts are paraphrased and grouped; source attribution is kept here, away from visitor navigation.

## Voice pattern references

- https://elevenlabs.io/docs/eleven-agents/customization/widget — compact site-wide entry, brand-aligned appearance, explicit start and language/muting affordances. No widget code or third-party widget was embedded.
- https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/ — named modal, focus containment, close control, Escape and return focus. Implemented using a native dialog.

The interface deliberately uses Buildtonic's own colours, typography and restrained microphone motif. It does not simulate a conversation or copy a vendor interface.

## Additional asset provenance

The original six image sources remain recorded in `phase-1-reference.md`. The following local copies are added for this final refinement. Rights remain with their respective owners; public access does not establish an open licence. The user-authorised prototype reuses the company's published material. Publication beyond that scope should be cleared with the company and photographers.

| File under `public/images/` | Exact asset URL | Project |
| --- | --- | --- |
| laurels.webp | https://buildtonic.co.uk/_astro/g6.iIGs1EIa_ZS6UiC.webp | The Laurels |
| laurels-detail.webp | https://buildtonic.co.uk/_astro/g1.wh-58mWc_2id6zN.webp | The Laurels |
| elm-park.webp | https://buildtonic.co.uk/_astro/cover._kmQVFpK_1YU7ya.webp | Elm Park Gardens |
| elm-park-detail.webp | https://buildtonic.co.uk/_astro/g1.DVi6YGd-_ZmShQM.webp | Elm Park Gardens |
| winters-hill-visual.webp | https://buildtonic.co.uk/_astro/cover.QAgK3spM_1s7JFh.webp | Kitchen render, Winter's Hill |
| winters-hill-detail-visual.webp | https://buildtonic.co.uk/_astro/g1.CIMqqTK__1t5PKw.webp | Kitchen layout drawing, Winter's Hill |

Images were visually inspected. Winter's Hill has a visible design-visual badge in the portfolio, disclosure before the case-study image and a labelled caption. Its drawing is not called a photograph. No stock or generated project images were substituted. No image watermark was edited out.

## Editorial decisions

- Six real projects, a portfolio index, local cross-links to expertise and next-project navigation.
- Four homepage categories lead to an expertise hub with new homes, combined extensions/renovations, consent and surveys pages, plus a substantial heritage page.
- All five specialist heritage repair areas are grouped on the heritage page, with a sixth entry directing visitors to consent support. All four survey types live on the surveys page with anchored navigation.
- Values and real team roles sit within About. Coverage is a single regional page instead of repetitive town landing pages. Secondary pages handle FAQ, planning notes, safety and careers.
- Published NFB/FMB/Constructionline claims are retained. Only NFB and FMB provide the genuine third-party profile links supplied by Buildtonic. The prototype does not claim independent re-certification or invent accreditation logos.
- No review score, awards, estimates, timescale promises, counts of clients or fabricated testimonial. Real published testimonials were not needed to establish trust alongside project evidence and named credentials.
- Pricing guides, detailed planning-law articles, embedded videos and tracking scripts were excluded. Planning notes explain what to bring to a conversation instead of reproducing uncertain legal or cost claims.
- No RICS accreditation is attributed to Buildtonic. Contractor-led survey work is distinguished from chartered professionals' involvement where needed.
- No contact form, callback booking or CV-upload fiction. Email and telephone actions use the visitor's own application. The privacy notice describes this implementation rather than copying the original site's policy.

## Visitor-journey map

| Visitor | Capability and evidence | Coverage and next step |
| --- | --- | --- |
| New-home owner | `/expertise/new-homes` → Winter's Hill, with design disclosure | `/areas` → `/start-project` |
| Extension owner | `/expertise/extensions-renovations#extensions` → The Laurels for relevant structural alteration experience | `/areas` → `/start-project` |
| Renovation owner | `/expertise/extensions-renovations#renovation` → Rose Cottage / Elm Park Gardens | `/areas` → `/start-project` |
| Period-property owner | `/heritage` → traditional methods and The Old Thatch | `/areas` → `/start-project` |
| Listed-building owner | `/heritage` → Guildford case study and consent page | `/areas` → `/start-project` |
| Consent enquiry | `/expertise/consent` → role, preparation, heritage experience and no-guarantee boundary | `/areas` → `/start-project` |
| Damp/defect concern | `/expertise/surveys#defects` → investigation scope, not remote diagnosis | `/areas` → `/start-project` |
| Survey enquiry | `/expertise/surveys` → condition, purchase, defect and drone options | `/areas` → `/start-project` |
| Architect/professional | expertise → delivery role → projects → About / safety | `/areas` → `/start-project` |
| Project landing visitor | case study → relevant expertise / next project / portfolio | main navigation → `/areas`; case-study enquiry band → `/start-project` |

## Voice integration contract (unconnected)

`app/voice/model.ts` contains the page-context resolver, starter catalogue, language resolver, future session snapshot, lead data and explicitly consented AI-call request types. Source business data is separately maintained in `app/content` and `app/projects/data.ts` so a future server layer can retrieve verified content by identifier.

The shell only reaches idle, invitation and open. Selecting a topic creates a local reading suggestion, not an AI response. The start button reveals an honest availability notice. Native dialog close/Escape, focus return and scroll locking are implemented. No `getUserMedia`, network connection, browser speech synthesis or fabricated transcript is present.

Future session phases are typed: requesting permission, connecting, listening, user speaking, assistant thinking, assistant speaking, muted, ending, ended and error. Microphone state is separate from conversation phase so the future adapter must report the real media state. `SessionControls` is reserved for actual future adapter events; it includes mute/unmute, end and microphone status but is never mounted by this preview.

`VoiceSessionAdapter` defines connect, subscribe, mute and end. A future implementation must be connected only after explicit start intent, release media on end/close/navigation and reflect actual state/error events. Private provider credentials and call orchestration must remain on a trusted server. Nothing currently calls OpenAI or Twilio.

`getPageContext` supplies pathname, page type, service/project identifier and selected topic. `resolveLanguage` preserves browser preference order, allows a manual override when supported and falls back to English. Only English is currently supported; there is no translation UI or false multilingual promise. Language/topic state lives in memory, not persistent browser storage.

Telephone requests are separate from browser voice. `/start-project#telephone` explains the two channels and offers the real contact path while AI calls are unavailable. The future request type requires name, international telephone number, location, language, service interest and explicit consent with timestamp. No telephone form or stored lead exists yet.

Future agent guardrails: use verified content; guide visitors to local pages; clarify needs and prepare a structured human handoff. Do not invent prices, quotations, availability, appointments, consent outcomes, structural/legal conclusions or technical claims unsupported by the building assessment.
