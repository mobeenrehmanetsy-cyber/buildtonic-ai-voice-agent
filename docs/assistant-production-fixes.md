# Assistant production fixes

## Findings

The disabled message came from `assertLocalRequest` in `app/agent/server.ts`. It unconditionally threw a 403 when `process.env.VERCEL` existed, and separately rejected nonlocal hostnames. Status, text and Realtime routes called this helper before checking the server API key. Adding the production key therefore could not enable the assistant. The panel also interpreted any status response without `configured: true`, including that 403, as missing configuration.

The layout had a separate full-width dark voice action above the text composer, while the external microphone launcher remained visible behind the open dialog. Active controls also inherited legacy `.voice-session button` margins, backgrounds and border styling. These contributed to the appearance of separate stacked interfaces. The current deployed idle state was inspected without sending a message or activating the microphone: its voice region measured approximately 61 px high, with a labelled button. The exact large empty area/empty rectangle in the user's referenced screenshots could not be reproduced, and those screenshots were not attached to this request. No unsupported claim about that specific rendering fault is made.

## Changes

- Replaced the local-only helper with `assertSameOriginRequest`. Public HTTPS requests work without an additional enable flag. Browser POST Origin must match Host, malformed/cross-site origins are rejected, and local HTTP remains supported. No forwarded-host header is trusted.
- Made status explicitly dynamic and uncached. It returns only a boolean derived from the server-side key's presence. The client distinguishes a failed status check from an actual unconfigured result. Key presence does not prove valid billing or model access.
- Kept text requests and Realtime setup on the existing server endpoints. Permanent credentials never enter browser configuration or API responses.
- Reordered the panel to conversation, composer, compact voice action, contact links and secondary privacy copy. The launcher hides while the dialog is open; focus returns after it becomes visible again.
- Replaced the dark full-width voice treatment with a small microphone icon and labelled outlined action. Active controls retain the existing real event-driven status, mute and End conversation functions, with scoped styling that overrides legacy margins.
- Added a bounded, scrollable controls area for short mobile viewports. Privacy text stays readable and accessible instead of being hidden at reduced heights.
- Stopped ordinary text sends from showing a misleading “Voice ended” state when voice had never started. Empty conversations now open at the top rather than scrolling past the introduction.
- Prevented mute/unmute during setup from prematurely displaying “Listening”. Listening still requires an actual session event.

## Realtime verification

The adapter still follows the [official Realtime WebRTC unified-interface flow](https://developers.openai.com/api/docs/guides/voice-webrtc?api=realtime): browser SDP offer → server multipart `/v1/realtime/calls` request with server-owned session configuration and permanent key → SDP answer returned to the browser. This supported flow does not require exposing an ephemeral key. Subsequent audio/events use WebRTC.

Microphone permission is requested only after explicit voice activation. Ending or closing aborts setup, stops media tracks, closes the peer/data channel, removes handlers, clears timers and stops playback. Denied permission, setup/API errors, malformed events, timeout and audio failure retain text as an available channel. No fake response or microphone state was added to the application.

## Files changed

- `app/agent/server.ts`: production-compatible same-origin guard.
- `app/api/assistant/{status,text,realtime}/route.ts`: guard replacement; dynamic status.
- `app/voice/panel.tsx`: status handling, unified control order, accurate idle state and initial scroll.
- `app/voice/assistant.css`: compact scoped layout, active controls, launcher visibility and mobile overflow.
- `app/voice/assistant.tsx`: focus restoration after launcher visibility updates.
- `app/voice/realtime.ts`: accurate connection state while muting during setup.
- `tests/agent-server.test.mjs`: configured Vercel status/text/voice and production-origin regression checks.
- `tests/realtime.test.mjs`: setup mute/unmute state regression.
- This report and `docs/review-assistant-fix/`: review screenshots and browser results.

The session store, shared company knowledge, enquiry flow, homepage, galleries, imagery and dependency list did not need modification.

## Validation

- `npm test`: **33 passed**. External requests are mocked; no paid API calls.
- TypeScript `tsc --noEmit`, ESLint and production build: **passed**.
- Browser checks at **1920, 1440, 1366, 768, 390 and 320 px**: passed. Each exercised opening, loading, a fixture text reply, API error, denied microphone, active controls, mute/unmute, End, close/reopen and media/peer cleanup.
- Each tested idle layout had zero axe WCAG A/AA violations, no horizontal panel overflow, a compact voice region below the composer, a visible label and no separate visible launcher. No browser runtime errors were observed.
- Additional **390×500 and 320×500** checks passed with missing configuration, permission denial and text errors together. Composer, voice action and privacy link remained reachable by scrolling the controls area.
- The API tests explicitly set `VERCEL=1`, use the production HTTPS hostname and a test-only credential marker, and verify successful mocked text/SDP responses without credential disclosure. Status tests cover both missing and present keys and `Cache-Control: no-store`.
- Screenshots show only idle UI, with status mocked as configured for review. They do not show fabricated successful AI conversations. Browser media/session events were isolated fixtures; physical audio and live provider access were not tested.

Evidence: [six-width results](review-assistant-fix/results.json), [short mobile viewport results](review-assistant-fix/mobile-height-results.json), [desktop screenshot](review-assistant-fix/ready-1440.png), [390 px screenshot](review-assistant-fix/ready-390.png), [320 px screenshot](review-assistant-fix/ready-320.png).

## Readiness and review

Both transports are ready for controlled production testing **after these fixes are reviewed and deployed**. No real provider request was made, so actual Vercel credentials, account/model access, latency, audio negotiation and microphone hardware remain to be verified. The production site still runs the previously deployed code until a later authorized deployment.

The existing process-local rate limiter is retained. It is not a distributed production quota or spend cap, and same-origin checking is not authentication against custom HTTP clients. This change removes the obsolete deployment restriction; it does not claim to solve all public-service abuse controls.

No key was requested, read out, logged or committed. No commit, push, installation or deployment was performed. Earlier Phase 2 notes describing a local-only/Vercel block are historical and superseded by this change.
