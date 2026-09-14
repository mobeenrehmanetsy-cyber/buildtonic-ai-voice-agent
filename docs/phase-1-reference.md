# Buildtonic Phase 1 reference and asset provenance

Reviewed 14 September 2026. Business reference: https://buildtonic.co.uk/.

## Findings and design

The live site positions Buildtonic as a heritage and residential main contractor in Hampshire, Surrey and London. It has an established forest, parchment and clay identity, practical copy and a clear service hierarchy. The redesign retains that connection, adding editorial serif typography, asymmetric project layouts and more visible conservation photography. The original homepage's text-led service grid and limited project exposure are the main opportunities.

Sources reviewed: `/`, `/about/`, `/heritage/`, `/projects/`, `/contact/`, and the project pages below. The company publishes NFB Heritage Approved Contractor, FMB membership and Constructionline Silver credentials. These are reproduced as published claims, not independently certified by this prototype. NFB and FMB link to the member profiles used by the original website. No accreditation logos have been invented.

Contact: team@buildtonic.co.uk; 020 8129 2694. Company: Buildtonic Ltd, 13329409. Registered office: Cheyenne House, West Street, Farnham, GU9 7EQ. These details come from the public contact/about pages.

The original homepage describes RICS surveying partners, while the about page describes a developing RICS-backed route. The prototype makes no claim that Buildtonic itself is RICS accredited. Winter's Hill explicitly labels its pictures as design visuals; these are not used as completed project photography. No statistics, testimonials, prices or awards have been invented.

## Reused public project photographs

Files were retrieved from Buildtonic's own public site for this user-requested prototype. Public availability does not establish an open licence or ownership transfer; retain the original rights and obtain company clearance before use beyond the authorised prototype. These are local copies, served through Next.js Image optimisation rather than hotlinked.

| Local file in `public/images/` | Exact source URL                                            | Project source                                                    |
| ------------------------------ | ----------------------------------------------------------- | ----------------------------------------------------------------- |
| rose-cottage.webp              | https://buildtonic.co.uk/_astro/cover.DnEDestF_Z2gCk4h.webp | https://buildtonic.co.uk/projects/rose-cottage/                   |
| rose-detail.webp             | https://buildtonic.co.uk/_astro/g2.oKJZO6lP_OsQkO.webp      | https://buildtonic.co.uk/projects/rose-cottage/                   |
| guildford.webp                 | https://buildtonic.co.uk/_astro/cover.D-wUuZhB_2uzUFl.webp  | https://buildtonic.co.uk/projects/guildford-quaker-meeting-house/ |
| guildford-detail.webp          | https://buildtonic.co.uk/_astro/g1.DaS-Bkaz_1VY4Oi.webp     | https://buildtonic.co.uk/projects/guildford-quaker-meeting-house/ |
| old-thatch.webp                | https://buildtonic.co.uk/_astro/cover.BrvWKiVS_2kBlKq.webp  | https://buildtonic.co.uk/projects/the-old-thatch/                 |
| old-thatch-detail.webp         | https://buildtonic.co.uk/_astro/facade.BZO1TPPQ_1LtB5C.webp | https://buildtonic.co.uk/projects/the-old-thatch/                 |

## Phase boundary

- Homepage and three local, statically generated case studies.
- Mobile navigation, native service disclosures, email and phone enquiry links.
- Service detail links open the corresponding original Buildtonic pages; the privacy link opens the original policy. No nonfunctional form or placeholder voice controls.
- No AI, analytics, cookies, backend, secrets or new runtime dependencies.
- Metadata intentionally uses `noindex, nofollow` for the demonstration domain. Review this and the production domain metadata before launching an official replacement.
- Fonts are self-hosted by Next.js after build-time Google Fonts retrieval.

## Validation

Production build (including TypeScript), ESLint and Git whitespace checks pass. Browser checks covered 375, 390, 768 and 1440px widths without horizontal overflow, menu open/close and Escape handling, service disclosures, the three case-study routes and an unknown-project 404. All homepage images were checked after scrolling into view. Automated axe WCAG A/AA checks returned no violations at 390px and 1440px. Desktop and mobile screenshots were reviewed. Automated checks are not a complete manual accessibility audit.

No commit, push or deployment was performed. The local production preview runs on port 3100.

## Local commands

`npm run dev`, `npm run build`, `npm start`, `npm run lint`.

In this workspace's PowerShell session Node is installed at `C:\Program Files\nodejs` but absent from PATH. A session-only adjustment is sufficient: `$env:Path = 'C:\Program Files\nodejs;' + $env:Path`.

