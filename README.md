# Buildtonic website prototype

A self-contained Next.js App Router website for Buildtonic's heritage and residential construction work. Phase 1 includes 22 local content routes, six genuine project stories and an unconnected browser voice receptionist interface.

## Run locally

```sh
npm run dev
```

Production preview:

```sh
npm run build
npm start -- --port 3100
```

Requires Node compatible with Next.js 16 (at least 20.9). Use the committed npm lockfile. No environment variables are needed for this phase.

## Validate

```sh
npm run lint
npx tsc --noEmit --incremental false
npm run build
node --test tests/voice-model.test.mjs
```

The dependency-free model tests use Node's TypeScript stripping, available in the workspace's Node 24 installation. Browser and axe audits were run with temporary tooling outside the project dependencies; results and reviewed screenshots are in `docs/review/`.

## Structure

- `app/content/` — verified company, service, heritage and FAQ content.
- `app/projects/` — portfolio data, index and statically generated case studies.
- `app/expertise/` — service hub and statically generated detailed pages.
- `app/components/` — shared header and editorial presentation.
- `app/voice/` — local UI shell, future session contract, language and page context.
- `public/images/` — authentic public Buildtonic project assets, with source records in documentation.
- `docs/final-phase-1-reference.md` — research, exclusions, user journeys and future integration boundaries.

## Current behaviour

Navigation remains within this application. Only third-party accreditation profiles and email/telephone actions are external. Contact links open the visitor's own applications; there is no form delivery, database or callback service.

The voice panel can be opened and topics selected. It cannot connect to AI, access a microphone, create a transcript or make a call. The future adapter contracts do not implement provider connections. No API credentials are required or included.

Pages retain `noindex, nofollow` for this demonstration. Company approval of content, image rights and the applicable privacy notice belongs before an official public launch. No commit, push or deployment is part of the Phase 1 refinement.
