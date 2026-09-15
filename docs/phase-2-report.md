# Phase 2: Buildtonic text and browser voice

Implementation and unpaid local validation complete, 15 September 2026. **Live OpenAI validation is pending your local API configuration.** No commit, push, deployment, telephone integration, dependency installation or database was performed. Approved Phase 1.5 pages and original project imagery remain in place.

## A–F. Architecture, sources and models

One server-owned Buildtonic knowledge/instruction layer feeds two transports:

```text
Website assistant + in-memory conversation/project draft
  Text -> Next POST /api/assistant/text -> OpenAI Responses
  Voice -> explicit microphone action -> browser WebRTC
        -> Next POST /api/assistant/realtime -> OpenAI Realtime calls
        <- SDP answer only; subsequent audio/events use WebRTC

Shared: verified knowledge, behaviour, qualification schema, context, language
Future: a telephone adapter can reuse that shared business layer
```

The text endpoint uses the Responses API with strict Structured Outputs for a short reply and a validated draft update. It sends bounded recent history, uses `store: false`, and owns all instructions/model settings. The UI displays the complete validated reply, rather than streaming partially valid JSON.

Voice uses the documented unified WebRTC connection flow: the browser creates an SDP offer; the server posts multipart `sdp` and `session` to `/v1/realtime/calls` with its permanent key; the browser receives an SDP answer. No permanent or ephemeral API credential is returned to the browser. Audio plays through a remote audio element. The data channel receives actual voice/transcription events and handles the local `update_project_brief` tool. Semantic VAD supports natural turn-taking and interruption.

Direct REST and browser WebRTC keep the implementation small and fit the existing lifecycle/UI. No additional SDK is required. The Agents SDK is a documented higher-level option; this implementation uses the supported direct connection architecture instead.

| Purpose | Default | Reason |
| --- | --- | --- |
| Text | `gpt-5.4-mini` | Efficient short, grounded conversations with Structured Outputs; `reasoning.effort: none` |
| Live voice | `gpt-realtime-2.1` | Current Realtime model documented for low-latency speech, interruption and improved recognition |
| Voice identity | `marin` | Built-in Realtime voice; shared personality comes from Buildtonic instructions |
| Input transcript | `gpt-4o-mini-transcribe` | Optional readable transcript; transcription is not a perfect record of what the audio model heard |

Official documentation consulted during implementation:

- [Realtime API guide](https://developers.openai.com/api/docs/guides/realtime)
- [Browser WebRTC guide, Realtime section](https://developers.openai.com/api/docs/guides/voice-webrtc?api=realtime)
- [Realtime conversations and events](https://developers.openai.com/api/docs/guides/realtime-conversations)
- [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)
- [GPT-5.4 mini](https://developers.openai.com/api/docs/models/gpt-5.4-mini)
- [GPT Realtime 2.1](https://developers.openai.com/api/docs/models/gpt-realtime-2.1)
- [API data controls](https://developers.openai.com/api/docs/guides/your-data)

The Realtime event contract is used consistently; the separate GPT-Live event contract is not mixed into this adapter. Installed Next.js route-handler and environment documentation was also consulted.

## G–H. Files

Created in Phase 2:

- `app/agent/business.ts`: server-only verified knowledge and shared instructions/tool definition.
- `app/agent/qualification.ts`: schema derived from the manual brief; validation and confirmation rules.
- `app/agent/conversation.ts`: history limits, safe context, allowed language codes, starters and local links.
- `app/agent/server.ts`: local-access guard, request limits, key access, bounded payloads and safe upstream requests/errors.
- `app/agent/session-store.ts`: shared browser memory for conversation, language and qualification.
- `app/api/assistant/status/route.ts`: configured boolean only.
- `app/api/assistant/text/route.ts`: server-side Responses transport.
- `app/api/assistant/realtime/route.ts`: server-side SDP/session establishment.
- `app/voice/realtime.ts`: cancellable WebRTC adapter, events, transcripts, tools and cleanup.
- `app/voice/events.ts`: state mapping, microphone errors and cancellable ICE gathering.
- `app/voice/panel.tsx`, `app/voice/assistant.css`: integrated text/voice interface.
- `tests/agent.test.mjs`, `tests/agent-server.test.mjs`, `tests/realtime.test.mjs`, `tests/register.mjs`: isolated unpaid tests.
- This report and `docs/review-2/`: browser results and honest configuration/denial screenshots.

Modified relative to the approved local Phase 1.5 work:

- `app/voice/assistant.tsx`: lazy panel, modal focus management and close/navigation cleanup.
- `app/voice/session-controls.tsx`: existing controls connected to real adapter state.
- `app/layout.tsx`: imports scoped assistant styling.
- `app/start-project/model.ts`: shared desired outcome/confirmation fields and safe handling of naturally worded heritage status.
- `app/start-project/project-enquiry.tsx`: explicit draft import, editable imported outcome, preserved custom selections and fresh consent/review.
- `app/start-project/page.tsx`: accurate browser-voice availability copy.
- `app/privacy/page.tsx`: actual AI/transcript/draft data flows and provider-processing disclosure.
- `package.json`: test command only; dependencies unchanged.
- `tsconfig.json`: permits `.ts` imports with `noEmit` for native Node test execution.
- `tests/project-brief.test.mjs`: also verifies naturally worded listed status retains the consent question.

Git also contains pre-existing uncommitted Phase 1.5 changes. They are intentionally preserved and should not be confused with new Phase 2 work. Branch: `main`; origin: `mobeenrehmanetsy-cyber/buildtonic-ai-voice-agent`.

## I–J. Exact local environment setup

No `.env.local` currently exists. Create it yourself at:

```text
C:\Projects\buildtonic-ai-voice-agent\.env.local
```

Add this variable, replacing the placeholder privately in your editor:

```dotenv
OPENAI_API_KEY=YOUR_KEY_HERE
```

Do not paste the key into Codex chat. Do not prefix it with `NEXT_PUBLIC_`. `.env.local` and other `.env*` files are ignored by Git, as are `node_modules`, `.next` and `.vercel`.

Optional server-only overrides are `OPENAI_TEXT_MODEL` and `OPENAI_REALTIME_MODEL`; omit them for the tested configuration contracts above. Alternative text models must support Structured Outputs and the configured reasoning setting. Restart the local server after changing environment values. A configured status only checks that a value exists; it cannot prove valid credentials, billing or model access.

## K–O. Knowledge, context, qualification, form and language

Knowledge is assembled from existing `app/content/company.ts`, `app/content/expertise.ts`, project data and case-study stories. It includes the verified company/team/contact details, service regions, FAQs, residential and heritage capabilities and all six projects. Images are not sent to the model. Winter's Hill's available imagery remains explicitly identified as design material.

Instructions require concise, calm British English, answering first and asking at most one useful question at a time. They prohibit invented prices, approvals, availability, credentials, structural findings, bookings, submissions and calls. Unsupported facts require an honest response and appropriate human review. These are model instructions, not a guarantee of infallible answers; live factual evaluation remains necessary.

Context contains only an allowed pathname, derived page type/project/service identifier and optional selected starter ID. The server recomputes context rather than accepting an asserted project identity. Query strings, browser-language lists and unrelated browser data are not passed as context. Two or three relevant starters appear for the current page.

`ProjectBrief` is shared by the form and both AI channels. The tool/Structured Output schema derives its editable string fields from that model. Unknown fields, invalid types and oversized values are rejected. Updates merge corrections without discarding known details. AI cannot grant privacy consent. `summaryConfirmed` requires a previously offered summary, an unchanged brief and a verbatim excerpt classified by the model as explicit visitor confirmation; visitors can also confirm the displayed notes directly. Changes invalidate confirmation. Speech transcription can lag a tool call, so a spoken confirmation may need repetition or the explicit confirmation button.

The `/start-project` handoff is deliberate: select the project-brief link, then **Use assistant notes**. This merges notes into the form and resets consent/confirmation for manual review. Imported outcomes and custom heritage/property values remain editable. A natural status such as “Grade II listed” retains the Listed Building Consent question. Nothing is saved or sent automatically. The original download/email-draft flow remains the actual sharing mechanism.

Conversation state survives panel close and local navigation in browser memory. Refresh clears it; Clear chat clears messages/draft but retains the selected language. The visible history retains up to 80 entries; provider requests retain up to 24 nonempty messages/24,000 characters plus structured notes. This is bounded continuity, not unlimited memory.

Browser language preferences choose among English, French, Spanish, German, Italian, Portuguese, Polish, Urdu, Arabic and Hindi, with English fallback. The selector can override that preference for the current session. It is disabled during active voice; end/restart to change it. The model is asked to use the chosen language while preserving names/facts. The surrounding website/UI stays English. Accuracy and pronunciation across these languages require live testing; no claim of perfect support is made.

## P–R. Microphone, Realtime lifecycle and errors

Opening the panel, navigating or using text never requests microphone permission. Only the voice button loads the adapter and calls `getUserMedia`. Text remains usable after denial, missing hardware, unsupported capability or failed voice setup. Sending text during voice explicitly ends voice and continues using available transcripts/draft notes.

States cover idle, permission request, connecting, listening, user speaking, thinking, assistant speaking, muted, ending, ended and error. Audio/media events drive the active states. Muting disables actual microphone tracks and clears pending input; event updates cannot silently unmute them.

Ending, closing or navigating aborts pending setup, stops tracks, pauses/removes playback, closes the data channel/peer, removes handlers and clears timers. A late permission result is stopped after cancellation. Duplicate starts are prevented. Setup has a 30-second deadline, ICE gathering an 8-second deadline, and active voice a 10-minute client preview limit. Network failures close the session and offer explicit reconnection; no automatic reconnect can leave the microphone running unexpectedly. These client limits are not server-enforced billing guarantees.

Transcripts contain actual received text only. A committed user turn reserves its position while transcription is pending. Interrupted audio is labelled; transcription and generated text can differ from what was actually heard. Malformed events terminate voice safely; malformed draft tool calls leave notes unchanged and return an error to the model.

Missing configuration, upstream failures/rate limits, invalid request bodies, text timeouts, bad SDP, connection loss, permission denial, unavailable microphone, blocked audio playback, setup timeout and ending while connecting all have recoverable paths. Safe public error text is returned without provider response bodies, credentials or console logging of conversations. Retry does not duplicate the user's message.

## S. Security and performance review

The permanent key is read only in the server-only helper. No public environment variable is used. Responses contain only the reply/draft, SDP answer or configured boolean. API responses are `no-store`; text disables Responses storage. That setting does not promise zero provider retention: the privacy notice links the provider's data controls.

The routes intentionally reject Vercel execution and nonlocal request URLs. POST checks compare the local browser Origin with Host, accommodating Next's localhost URL normalisation without trusting forwarded headers. Process-local limits allow 30 text requests or 6 voice setups per minute, with 90 KB inbound-body and bounded conversation/SDP sizes. This is a local prototype guard, not production authentication or distributed abuse prevention. A custom HTTP client can forge headers. Do not expose this local server through a tunnel.

The voice tool only edits browser draft state. Browser state is untrusted and must not become authoritative for future submissions, billing or telephone actions. Future tools with external effects need server-side enforcement and authorization.

No database, browser transcript storage, analytics or app audio recording was added. UI fixtures exist only in isolated tests; unit-test network access is blocked by default. Production code has no mock-response switch. A scan of 13 generated browser JavaScript chunks found no permanent-key references, test credential marker or project-key pattern. This is a targeted exposure check, not a general security certification.

Visitor pages remain statically generated. The panel loads on open, and WebRTC code loads only on voice activation. No SDK or dependency was installed. Original images/galleries and the homepage composition are unchanged. Core Web Vitals were not remeasured, so no new performance score is claimed.

## T. Validation

| Check | Result |
| --- | --- |
| Unit/API/controller tests | 31 passed, zero paid API calls |
| ESLint | Passed |
| TypeScript `tsc --noEmit` | Passed |
| Production `next build` | Passed; static visitor pages plus three dynamic API routes |
| Browser route regression | 22 pages at 1440, 390 and 320 px: 66 successful checks, no horizontal document overflow |
| Galleries | All six opened/decoded, advanced and restored focus on Escape |
| Assistant responsive checks | 1440×1000, 768×1000, 390×844, 320×568, 390×500 and 320×500 |
| Accessibility automation | Zero axe WCAG A/AA violations in the six tested open-panel layouts |
| Keyboard/interaction | Enter, Shift+Enter, focus containment/restoration, close/reopen history, retry without duplication |
| Context/language/handoff | Relevant starters, selected language/page payload, confirmation and explicit form import verified |
| Reading/invalid reply | Reply arrival preserves manual scroll position; malformed text offers retry |
| Microphone denial | Controlled browser permission rejection exercised; opening/text made zero microphone requests |
| Runtime browser errors | None in recorded checks |
| Git whitespace/ignore checks | Passed; existing LF/CRLF notices only |

Unit/controller tests cover malformed outputs, timeout, playback failure, explicit activation, concurrent start prevention, mute tracks, late permission, end during setup and cleanup. Native Node 24 tests emit a harmless module-type detection warning. Browser testing used cached Playwright/Chrome and axe; no install was needed. Reduced-height tests emulate constrained keyboard space, not a physical iOS/Android keyboard.

Evidence: [browser checks](review-2/browser-results.json), [page/gallery regression](review-2/regression-results.json), [desktop panel](review-2/assistant-idle-1440.png), [mobile panel](review-2/assistant-idle-390.png), [denied microphone state](review-2/microphone-denied-390.png). Screenshots do not contain fabricated successful AI conversations. Successful UI interaction fixtures were isolated and not photographed.

## U. Your next manual steps

1. Add your key to `.env.local` using the path above. Enable billing/model access for that API project if necessary.
2. From the repository, run `npm run dev -- --hostname 127.0.0.1`, then open `http://127.0.0.1:3000`. Restart if it was already running when you added the key.
3. Open the assistant: no microphone request should appear. Ask “Do you work on Grade II listed houses?” Check that the reply answers first without inventing an approval or quotation.
4. On Rose Cottage ask “What did you do here?” On Winter's Hill ask whether the imagery shows completed construction. Verify against the local case studies.
5. Describe a project gradually, correct its postcode/budget, review the summary, and confirm. Check that correcting a confirmed detail requires reconfirmation. Follow the project-brief link and explicitly import/review the draft.
6. Continue a short text conversation by choosing **Talk to Buildtonic**. Allow the microphone, speak naturally and verify real audio replies. Check mute/unmute, interruption and End conversation; the browser microphone indicator should clear. Repeat by closing the panel during setup and during active voice.
7. Deny microphone access and confirm text still works. Restore permission in browser settings before retrying. Briefly test another selected language, spelling and postcode accuracy.
8. Test on actual desktop and mobile hardware, including the onscreen keyboard and headphone/audio behaviour. Keep first voice trials short to limit cost. Share errors or behaviour observations, never the key.

## V–W. Future work and limits

Twilio remains unimplemented. A later server-side phone transport can reuse business instructions, verified knowledge, language rules and qualification validators. That phase still needs telephony authentication/webhook verification, a phone-specific audio bridge or supported SIP path, call/session ownership, consent/recording policy, durable state if authorized, hangup/billing safeguards and separate inbound/outbound authorization.

Before public deployment: approve access/abuse controls, durable rate and spend limits, provider/privacy decisions and real model/language testing. Only then deliberately replace the local-only gate. No public endpoint should be enabled simply by removing the Vercel guard.

Outstanding validation is real model access, answer quality, latency, language quality, WebRTC negotiation and actual hardware audio. A valid key is required for that work. No real conversation, booking, email submission or telephone call has been claimed. The code is ready for **local live testing**, not yet approved for public AI deployment.
