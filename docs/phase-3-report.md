# Buildtonic Phase 3 — local implementation and Telnyx preparation

Implementation continued on 16 September; final validation completed on 17 September 2026. Continued the existing working tree. No reset, commit, push, deployment, number purchase, credential access or live AI/telephone request was performed.

**Ready for local review. Not ready for production enquiry collection or live telephone calls.** The remaining prerequisites are durable storage, Telnyx resources/configuration, operational/privacy review and authorised live acceptance tests.

## 1. Work already present

The interrupted work contained the editorial footer, seven-step enquiry draft, expanded ProjectBrief, server-owned Lead envelope, local/HTTP record-store adapters, enquiry route, AI-note import/conflict handling and incomplete telephone routes. These were retained and completed. The previous website, projects and assistant panel/launcher were preserved.

## 2. Completed in this continuation

Replaced the unfinished telephone implementation with Telnyx; removed its unused provider/streaming dependencies. Added authenticated tools, signed lifecycle/insight callbacks, assistant configuration export, outbound consent checks and duplicate-attempt protection. Finished browser validation, accessibility corrections, privacy copy, failure handling, production storage guard, tests and screenshots. Reformatted the new implementation for review.

## 3. Footer

Deep green editorial closing section, large typographic project invitation, Start a project and Talk to Buildtonic AI actions, organised expertise/explore/contact columns, regional positioning and restrained credentials strip. Contact and company details come from the existing verified company content. NFB Heritage Approved, FMB membership and Constructionline Silver remain the published credentials; no new awards or statistics were added. All tested internal footer destinations returned HTTP 200.

## 4. Form flow

1. Project: service, property, location, postcode, heritage status.
2. Plans: description, outcome, relevant size and constraints.
3. Status: drawings, planning and conditional Listed Building Consent.
4. Budget/timing: visitor intentions, start preference and deadline; never a quote.
5. Contact: name, email, optional/conditional phone, contact method, language and best time.
6. Optional AI call: neither Yes nor No preselected. No is a valid normal enquiry.
7. Review: editable sections, explicit summary confirmation and separate privacy acknowledgement.

Back/forward and local navigation preserve browser-memory drafts. Reload clears them. Import fills gaps and presents conflicts without overwriting manual answers. Sending the current draft to the assistant is an explicit action. Changing the phone number resets the call choice. Failed submission retains the draft; only confirmed storage produces a receipt. Duplicate retries reuse a submission UUID. Visitors can download their copy.

## 5. Shared lead model

`app/start-project/model.ts` remains the canonical project shape used by form, text and browser voice. `app/leads/model.ts` wraps it in server metadata, rather than creating a second incompatible flat project object.

| Requested concept | Canonical location |
| --- | --- |
| Lead identity/time/source | `leadId`, `createdAt`, `source` |
| Name/email/phone | `project.name`, `project.email`, `project.phone` |
| Location/postcode/property/heritage | `project.location`, `postcode`, `property`, `heritage` |
| Service/description/outcome/size | `project.service`, `description`, `desiredOutcome`, `size` |
| Drawings/planning/listed consent | `project.drawings`, `planning`, `listedConsent` |
| Budget/start/constraints/deadline | `project.budget`, `timeline`, `constraints`, `deadline` |
| Contact/language/call time | `project.preferredContact`, `preferredLanguage`, `preferredCallTime` |
| Outbound consent | `aiCallConsent`, `aiCallConsentTimestamp`, `aiCallConsentVersion`, `consentPhone` |
| Qualification/summary | `qualificationStatus`, `summary`, `project.summaryConfirmed` |
| Channels | `channels`; source union supports website form/text AI/voice AI and inbound/outbound phone |

A reviewed form submission has `website_form` as its source, including when assistant notes contributed to it. Telephone updates append their channel to the existing lead. Telephone tool confirmation remains a draft: this implementation does not present model-reported confirmation as an independently verified transcript.

## 6. Enquiry storage

`RecordStore` is the shared persistence boundary for enquiries, call records and correlation mappings. It provides `get` and atomic compare-and-swap `put`. Local `FileStore` uses restricted files, exclusive per-record locks and atomic replacement. Default directory `.local-data/` is ignored by Git. The review server uses a dedicated temporary fixture directory outside the repository.

On Vercel, filesystem fallback is explicitly forbidden. Without remote configuration, submission returns HTTP 503 `storage_not_configured`; the visitor retains their draft. **No durable external provider has been selected or installed.** `HttpStore` implements an adapter contract; setting its URL to an arbitrary CRM/database API will not make that API compatible.

The selected storage service must implement:

- HTTPS `GET /records/:key`: 404, or `{ "version": 1, "value": ... }`.
- HTTPS `PUT /records/:key`: body `{ "value": ... }`, bearer authentication, `If-None-Match: *` for creation or `If-Match: <integer version>` for update.
- Atomic conflict responses 409/412; successful durable writes return 200/201/204 and increment the version. A 202 queue acknowledgement is not accepted as persistence.
- Private access, retention/deletion procedures and backups appropriate to the eventual deployment.

There is no email notification, CRM delivery, operator dashboard or automatic call scheduler. An operator selects the internal `lead-...` record key from the chosen store. The form receipt is an enquiry UUID, not a claim that a person has read it. A process crash during a local write can leave a lock; inspect/reconcile it before removing it. Do not use local files as a distributed production database. In-memory rate limits are basic load shedding; production infrastructure needs its own abuse controls.

## 7–8. Telephone architecture and reason

**Option A: Telnyx hosted AI Assistant, an OpenAI model, and Buildtonic HTTP tools/webhooks.** The exported configuration selects `openai/gpt-5.4-mini`, with the same Buildtonic facts and qualification schema as the website. Telephone speech recognition/synthesis is hosted by Telnyx; it is not the browser's OpenAI Realtime audio connection.

Telnyx documents hosted inbound number assignment, outbound AI calls, dynamic project variables, fixed tool parameters and post-conversation insights. These meet this phase's requirements without our own media/WebSocket bridge. See the official [assistant quickstart](https://developers.telnyx.com/docs/inference/ai-assistants/no-code-voice-assistant), [dynamic variables](https://developers.telnyx.com/docs/inference/ai-assistants/dynamic-variables) and [OpenAI model reference](https://developers.openai.com/api/docs/models/gpt-5.4-mini).

Provider-specific HTTP/signature logic lives in `app/phone/telnyx.ts`. The workflow uses `PhoneProvider`, `initiateOutboundCall`, `prepareInboundCall`, `getCallStatus` and `processCallCompletion`. There is no alternative telephone provider or worker dependency.

## 9. Inbound calls

Assign the number to the hosted assistant. Its dynamic-variable webhook calls `/api/phone/inbound`. The route verifies the raw-body Ed25519 signature, timestamp, expected assistant, channel and destination. It returns an opaque per-call binding and conversation metadata. It never uses caller ID to retrieve another person's enquiry.

After permission to retain project notes, the hosted tool calls `/api/phone/tools`. The server creates an inbound lead and records structured notes. An inbound call never grants outbound AI-call consent. Calls without retained notes do not create a new enquiry in this application. Missing initialization/binding causes tools to fail closed; the assistant's instructions offer the verified team contact instead of claiming notes were saved.

## 10–11. Outbound calls and supplied form data

Submission stores the preference but does **not** automatically dial. An authorised operator first checks the requested contact time and calls `POST /api/phone/outbound` with `{ "leadKey": "lead-...", "confirmedSuitableTime": true }` using the operations bearer token. The server checks consent, timestamp, valid number and consent-number equality, then configuration. It reserves one attempt per lead, rechecks eligibility and calls Telnyx's documented `POST /v2/texml/ai_calls/{connection_id}`.

`AIAssistantDynamicVariables` contains the existing project brief, direction and protected correlation values. The assistant checks recipient/suitable time before disclosing details, then asks only missing or clarifying questions. There is a ten-minute call limit, thirty-second answer timeout and `Record: false`. See the [official generated Telnyx API types](https://github.com/team-telnyx/telnyx-node/blob/master/src/resources/texml/texml.ts).

Only an accepted provider response with a call SID yields `queued`. Missing configuration yields `phone_not_configured`. An uncertain provider/network outcome yields `provider_outcome_unknown`; another request is blocked pending human reconciliation. There are no automatic retries, fake started statuses or development calls.

## 12. Consent protection

AI-call consent is outside ProjectBrief and its tool schema. The submission server creates the timestamp and binds consent to the normalised number. AI tools cannot grant or change this envelope. A changed project telephone number fails later eligibility checks. The form requires a deliberate Yes/No selection, independently of normal enquiry processing. An operator must handle withdrawal requests before dispatch; there is no automated consent-management dashboard or repeated calling campaign.

Custom tools require a server-held integration-secret bearer header, plus a per-call HMAC binding supplied through Telnyx preset fields. The model cannot choose or overwrite these preset values. This also prevents a caller's custom dynamic variable from changing the lead binding. See [Telnyx preset parameters](https://developers.telnyx.com/docs/inference/ai-assistants/preset-webhook-parameters).

## 13. Call results

`/api/phone/finished` accepts verified TeXML form status callbacks, JSON `call.hangup` events and the documented `conversation_insight_result` event. It stores actual provider status, duration when supplied, structured project notes, available summary, missing information and suggested human follow-up. Terminal statuses do not regress on delayed/replayed lifecycle events. Insight requests are correlated to the bound call and repeated delivery of the same result is idempotent.

Configure one structured project insight using the exported schema; results are separate from consent and do not overwrite the canonical project facts. Insight completion alone never pretends the phone call ended. For inbound TeXML callbacks the current CallSid must match the call-control identifier used by the assistant; confirm the actual account's callback format during acceptance testing. Unknown/unmatched callbacks are acknowledged without inventing a result. If only insights arrive, call status remains its last observed lifecycle state. Outbound callbacks additionally use the stored provider SID and opaque call key.

The operator-only `GET /api/phone/status?call=...` reads stored results. The provider adapter also offers a separate REST status lookup when the account ID is configured. No raw recordings or transcripts are retained by this application. Summaries are only present after actual captured notes or a real insight result. See [signed insight payloads](https://developers.telnyx.com/docs/inference/ai-insights/insight-groups) and [webhook signature verification](https://support.telnyx.com/en/articles/4334722-how-to-leverage-webhooks).

## 14. Exact Telnyx configuration

1. Create a hosted assistant. Review `GET /api/phone/configuration` with operations authentication; this exports configuration without creating external resources or disclosing secret values.
2. Create Telnyx integration secret **`buildtonic-openai`** containing the OpenAI API credential privately. The assistant's `llm_api_key_ref` refers to that identifier. The website's existing OpenAI key stays server-side; it is not automatically copied into Telnyx.
3. Create integration secret **`buildtonic-tool-secret`** with the same value as server `TELNYX_TOOL_SECRET`. Preserve the exported Authorization header and preset call key/token/control ID. Do not expose them as model-chosen tool parameters.
4. Use the exported shared instructions, model, greeting, hangup tool and project-update tool. Choose/test an appropriate British English voice and language settings in Telnyx. Keep recording disabled; review provider transcript/retention settings before real users.
5. Set dynamic-variable webhook to `https://buildtonic-ai-voice-agent.vercel.app/api/phone/inbound`, timeout 5000 ms. Exported fallback defaults contain no caller data or usable binding.
6. Create a TeXML application/connection for outbound hosted AI calls, configure an outbound voice profile/allowed UK destinations and associate the assigned voice-capable number with the assistant according to the Telnyx portal flow. Set the application's POST status callback to `/api/phone/finished`, with lifecycle events enabled. The outbound API supplies its own per-call callback URL.
7. Create **one** structured project insight from exported `projectInsight`, place it in a group, attach the group to the assistant and set its webhook URL to `/api/phone/finished`. Put the group's ID in `TELNYX_INSIGHT_GROUP_ID`.
8. Keep shared instructions synchronised: re-export/review the assistant configuration when Buildtonic knowledge or qualification rules change. This repository does not silently mutate a hosted assistant.

## 15. Exact environment variables

None of the Telnyx values is needed for local website/form review. Do not add placeholder credentials that make an unconfigured service appear ready.

| Variable | When required | Meaning |
| --- | --- | --- |
| `OPENAI_API_KEY` | Existing website AI, unchanged | Server-only OpenAI credential for text/browser voice |
| `LEAD_LOCAL_DIR` | Optional local review | Filesystem directory for local records; default `.local-data` |
| `LEAD_STORE_URL` | Before production enquiries/phone storage | HTTPS origin/base of the selected durable CAS store adapter service |
| `LEAD_STORE_TOKEN` | With remote store | Its server-to-server bearer credential |
| `LEAD_OPERATIONS_TOKEN` | Before configuration export/operations API | Buildtonic-generated secret, at least 32 characters; human/operator access only |
| `PHONE_PUBLIC_BASE_URL` | Before hosted assistant configuration | HTTPS website origin, no path/query; production URL above |
| `TELNYX_API_KEY` | Before outbound integration test | Telnyx Mission Control API key |
| `TELNYX_PUBLIC_KEY` | Before any provider webhook | Base64 Ed25519 public key from Telnyx Keys & Credentials; used for verification |
| `TELNYX_ASSISTANT_ID` | After creating hosted assistant | Its actual assistant identifier |
| `TELNYX_TEXML_CONNECTION_ID` | After creating outbound TeXML application | Connection/application ID used in `/texml/ai_calls/{connection_id}` |
| `TELNYX_TOOL_SECRET` | Before connecting hosted tools | Buildtonic-generated secret, at least 32 characters; matches integration secret above |
| `TELNYX_INSIGHT_GROUP_ID` | Before enabling structured insight delivery | ID of the configured one-insight group |
| `TELNYX_PHONE_NUMBER` | **After purchasing/assigning number** | Assigned voice-capable caller/destination number in E.164, e.g. `+44...`; not an invented number |
| `TELNYX_ACCOUNT_SID` | Optional provider REST status lookup | Telnyx account identifier used in `/texml/Accounts/{account_sid}/Calls/{call_sid}`; stored-status route does not require it |

All application variables remain server-side. There are no new `NEXT_PUBLIC_` credentials, media-bridge URLs or shared-secret substitutes for provider signature verification.

## 16. Vercel and worker requirement

**No persistent media worker is required.** Telnyx hosts telephony/STT/LLM/TTS; Next.js handles short HTTP requests. Vercel cannot replace durable lead storage, however. Its environment variables, webhook reachability, deployment protection exceptions and storage latency must be configured for live use. The local-files adapter is explicitly excluded from production persistence and unnecessary build tracing.

## 17. Ready now

Premium footer, seven-step form, local submission/receipt, consent safeguards, shared data/rules, preserved text/browser-voice implementation, authenticated provider boundaries, Telnyx configuration export, signed event processing, offline tests and local visual review.

## 18. Waiting for Telnyx and production setup

Actual API/public keys, assistant/connection/insight resources, voice selection, number assignment, allowed destinations and webhooks. Separately: approval/implementation of a durable storage provider, operational lead review/withdrawal procedures, provider retention review and live acceptance testing. These are real blockers; no successful live telephone call is claimed.

## 19. Remaining steps after the number is bought

Connect the approved durable store first; validate its CAS contract and production error handling. Configure the server variables and Telnyx resources above. Deploy only after user approval. Verify signed initialization, preset tool binding, actual inbound CallSid/control-ID correlation, lifecycle status/duration and insight metadata with Telnyx's real payloads. Make an explicitly authorised test inbound call, then one consented outbound test to a controlled recipient at an agreed time. Check interruption, wrong recipient, voicemail, no consent, unavailable service, timeout, duplicate callbacks and hangup. Review notes and operator follow-up. Only then change the current truthful “telephone AI is not connected yet” copy and enable public telephone use. Do not enable automatic website-triggered calls without a separately reviewed scheduling/abuse policy.

## 20. Files changed

- Existing: `.gitignore`, `package.json`, `package-lock.json`, `app/layout.tsx`, `app/ui.tsx`, `app/privacy/page.tsx`, `app/agent/business.ts`, `app/start-project/model.ts`, `app/start-project/project-enquiry.tsx`, `app/voice/assistant.tsx`.
- New: `app/phase3.css`, `app/components/open-assistant.tsx`; `app/leads/{model,store,submission}.ts`; `app/phone/{telnyx,service,assistant-config}.ts`.
- Routes: `app/api/enquiries/route.ts`; `app/api/phone/{configuration,inbound,outbound,tools,finished,status}/route.ts`.
- Tests/review: `tests/phase3.test.mjs`, this report, `docs/review-3/browser-check.cjs`, results and screenshots.
- The incomplete alternative-provider route and dependencies were removed. Only `server-only` remains as a newly added runtime dependency relative to the committed baseline.

## 21. Validation and screenshots

50 unit tests pass, including the 33 existing assistant tests. New tests cover validation, storage/CAS, Vercel refusal, consent, duplicate dispatch, failure states, provider request shape, Ed25519 signatures, call binding, updates, actual route parsing and insights. Unit-test network calls are disabled; provider responses are fixtures. TypeScript, ESLint and the production build pass. The final build has no tracing warning. Node's pre-existing module-type inference warning in native TS tests is informational.

Chromium journeys cover **1920, 1440, 1366, 768, 390 and 320 px**. Checked seven steps, native required-field validation, back/forward preservation, edit/review, no preselected call choice, normal local submission without AI-call consent, AI panel open/close, all footer destinations, no horizontal overflow and no page errors. Axe reports zero violations for the tested footer/review workspace at these widths; this is not a claim of a complete accessibility certification. Additional browser tests cover mocked AI notes, conflict preservation, local-navigation retention, resetting consent after phone edits and retaining drafts on HTTP 503. Existing text and browser voice pass automated regression tests; no paid end-to-end OpenAI session or physical phone call was attempted.

Screenshots isolate the requested components; sticky navigation and the floating launcher are hidden only during component captures to avoid full-height capture artefacts, not in the website itself.

| Requested view | Desktop | Mobile |
| --- | --- | --- |
| Premium footer | [1440 px](review-3/footer-1440.png) | [390 px](review-3/footer-390.png) |
| Project form | [1440 px](review-3/form-1440.png) | [390 px](review-3/form-390.png) |
| Review step | [1440 px](review-3/review-1440.png) | [390 px](review-3/review-390.png) |
| AI-call consent | [1440 px](review-3/consent-1440.png) | [390 px](review-3/consent-390.png) |

Every requested width also has its own captures in `docs/review-3/`. `results.json` records browser outcomes. `browser-check.cjs` uses the already available Playwright/Axe modules; `PLAYWRIGHT_MODULE` and `AXE_MODULE` can override their local locations.

## 22. Local review

- Website: http://127.0.0.1:3100
- Guided enquiry: http://127.0.0.1:3100/start-project
- Privacy: http://127.0.0.1:3100/privacy

The local server is a production build. All review submissions are synthetic fixtures and produce an explicit local-review receipt. Changes remain uncommitted for approval.
