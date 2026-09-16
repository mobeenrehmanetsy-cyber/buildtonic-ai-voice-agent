import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID, generateKeyPairSync, sign } from "node:crypto";
import { emptyBrief } from "../app/start-project/model.ts";
import {
  createLead,
  normalisePhone,
  validateSubmission,
  mergeProjectNotes,
} from "../app/leads/model.ts";
import { FileStore, HttpStore, getStore } from "../app/leads/store.ts";
import { submitEnquiry } from "../app/leads/submission.ts";
import {
  requestOutbound,
  outboundEligibility,
  prepareInboundCall,
  saveCallUpdate,
  processCallCompletion,
  callKeyFor,
  processInsights,
} from "../app/phone/service.ts";
import {
  TelnyxProvider,
  callBinding,
  verifiedBody,
  requireBearer,
} from "../app/phone/telnyx.ts";
import { assistantConfiguration } from "../app/phone/assistant-config.ts";
import { POST as enquiry } from "../app/api/enquiries/route.ts";
import { POST as completion } from "../app/api/phone/finished/route.ts";
const project = {
  ...emptyBrief,
  service: "Renovation",
  location: "Guildford",
  description: "Repair an existing home",
  name: "Test Enquirer",
  email: "TEST@example.invalid",
  phone: "+447700900123",
  consent: true,
  summaryConfirmed: true,
};
const input = () => ({
  project,
  requestId: randomUUID(),
  aiCallConsent: false,
});
async function local(t) {
  const root = await mkdtemp(join(tmpdir(), "buildtonic-unit-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  return new FileStore(root);
}
function env(t, k, v) {
  const old = process.env[k];
  if (v === undefined) delete process.env[k];
  else process.env[k] = v;
  t.after(() => {
    if (old === undefined) delete process.env[k];
    else process.env[k] = old;
  });
}
function config(t) {
  for (const [k, v] of Object.entries({
    TELNYX_API_KEY: "unit-provider-key",
    TELNYX_ASSISTANT_ID: "unit-assistant",
    TELNYX_TEXML_CONNECTION_ID: "123",
    TELNYX_PHONE_NUMBER: "+442080001234",
    PHONE_PUBLIC_BASE_URL: "https://example.invalid",
    TELNYX_PUBLIC_KEY: "unit-public-key",
    TELNYX_TOOL_SECRET: "x".repeat(40),
  }))
    env(t, k, v);
}
test("server validates and normalises enquiries, with a genuinely optional AI call", () => {
  assert.equal(normalisePhone("07700 900123"), "+447700900123");
  assert.equal(
    validateSubmission(input()).project.email,
    "test@example.invalid",
  );
  assert.equal(
    validateSubmission({ ...input(), project: { ...project, phone: "" } })
      .aiCallConsent,
    false,
  );
  for (const change of [
    { aiCallConsent: null },
    { aiCallConsent: true, project: { ...project, phone: "" } },
    { project: { ...project, consent: false } },
    { project: { ...project, description: " " } },
    { project: { ...project, aiCallConsent: true } },
    { website: "bot" },
  ])
    assert.throws(() => validateSubmission({ ...input(), ...change }));
});
test("consent is server timestamped and bound to the submitted number", () => {
  const lead = createLead(
    project,
    "website_form",
    "id",
    true,
    "2026-09-16T10:00:00Z",
  );
  assert.equal(outboundEligibility(lead), "eligible");
  assert.equal(lead.aiCallConsentTimestamp, "2026-09-16T10:00:00Z");
  assert.equal(
    outboundEligibility({
      ...lead,
      project: { ...project, phone: "+447700900124" },
    }),
    "phone_or_consent_invalid",
  );
  assert.equal(
    outboundEligibility({ ...lead, aiCallConsent: false }),
    "consent_required",
  );
});
test("AI import fills gaps but preserves conflicting manual answers", () => {
  const result = mergeProjectNotes(
    { ...emptyBrief, location: "Farnham" },
    { ...emptyBrief, location: "London", description: "Roof repair" },
  );
  assert.equal(result.project.location, "Farnham");
  assert.equal(result.project.description, "Roof repair");
  assert.ok(result.conflicts.includes("location"));
  assert.equal(result.project.consent, false);
});
test("atomic local storage, traversal rejection and idempotent submission", async (t) => {
  const store = await local(t),
    data = input();
  const first = await submitEnquiry(data, store),
    second = await submitEnquiry(data, store);
  assert.equal(first.lead.leadId, second.lead.leadId);
  assert.equal(second.duplicate, true);
  await assert.rejects(
    submitEnquiry(
      { ...data, project: { ...project, name: "Different" } },
      store,
    ),
  );
  const results = await Promise.all([
    store.put("race", { v: 1 }, null),
    store.put("race", { v: 2 }, null),
  ]);
  assert.equal(results.filter(Boolean).length, 1);
  assert.equal(await store.put("race", {}, 99), false);
  await assert.rejects(store.get("../escape"));
});
test("Vercel refuses filesystem persistence and endpoint returns truthful error", async (t) => {
  env(t, "VERCEL", "1");
  env(t, "LEAD_STORE_URL", undefined);
  env(t, "LEAD_STORE_TOKEN", undefined);
  assert.throws(getStore, /storage_not_configured/);
  const r = await enquiry(
    new Request("https://example.invalid/api/enquiries", {
      method: "POST",
      headers: {
        origin: "https://example.invalid",
        "content-type": "application/json",
      },
      body: JSON.stringify(input()),
    }),
  );
  assert.equal(r.status, 503);
  assert.equal((await r.json()).status, "storage_not_configured");
});
test("no provider request without consent or configured Telnyx", async (t) => {
  const store = await local(t),
    first = await submitEnquiry(input(), store);
  const provider = {
    initiateOutboundCall: () => assert.fail("Must never call"),
    getCallStatus: async () => "",
  };
  assert.equal(
    (await requestOutbound(first.key, store, provider)).status,
    "consent_required",
  );
  env(t, "TELNYX_API_KEY", undefined);
  const yes = await submitEnquiry({ ...input(), aiCallConsent: true }, store);
  assert.equal(
    (await requestOutbound(yes.key, store, provider)).status,
    "phone_not_configured",
  );
});
test("accepted outbound uses existing context and never dispatches twice", async (t) => {
  config(t);
  const store = await local(t),
    lead = await submitEnquiry({ ...input(), aiCallConsent: true }, store);
  let calls = 0;
  const provider = {
    initiateOutboundCall: async (_, l) => {
      calls++;
      assert.equal(l.project.location, "Guildford");
      return { providerId: "provider-123" };
    },
    getCallStatus: async () => "queued",
  };
  assert.equal(
    (await requestOutbound(lead.key, store, provider)).status,
    "queued",
  );
  assert.equal(
    (await requestOutbound(lead.key, store, provider)).status,
    "already_requested",
  );
  assert.equal(calls, 1);
});
test("ambiguous provider failure never returns started and blocks blind retries", async (t) => {
  config(t);
  const store = await local(t),
    lead = await submitEnquiry({ ...input(), aiCallConsent: true }, store);
  const provider = {
    initiateOutboundCall: async () => {
      throw Error("secret provider error");
    },
    getCallStatus: async () => "",
  };
  assert.equal(
    (await requestOutbound(lead.key, store, provider)).status,
    "provider_outcome_unknown",
  );
  assert.equal(
    (await requestOutbound(lead.key, store, provider)).status,
    "already_requested",
  );
});
test("Telnyx adapter sends official AI call fields and no recording request", async (t) => {
  config(t);
  t.mock.method(globalThis, "fetch", async (url, opts) => {
    assert.match(url, /\/texml\/ai_calls\/123$/);
    const b = JSON.parse(opts.body);
    assert.equal(b.Record, false);
    assert.equal(b.AIAssistantId, "unit-assistant");
    assert.equal(
      b.AIAssistantDynamicVariables.buildtonic_call_key,
      "outbound-unit",
    );
    assert.equal(
      JSON.parse(b.AIAssistantDynamicVariables.buildtonic_context).location,
      "Guildford",
    );
    return Response.json({ call_sid: "accepted-1" });
  });
  assert.equal(
    (
      await new TelnyxProvider().initiateOutboundCall(
        "outbound-unit",
        createLead(project, "website_form", "unit", true),
      )
    ).providerId,
    "accepted-1",
  );
});
test("Ed25519 verifies raw bytes and rejects tampering, stale and unsigned requests", async (t) => {
  const { publicKey, privateKey } = generateKeyPairSync("ed25519");
  env(
    t,
    "TELNYX_PUBLIC_KEY",
    publicKey
      .export({ type: "spki", format: "der" })
      .subarray(-32)
      .toString("base64"),
  );
  const raw = '{"test":true}',
    ts = String(Math.floor(Date.now() / 1000));
  const signature = sign(
    null,
    Buffer.from(ts + "|" + raw),
    privateKey,
  ).toString("base64");
  const req = (body = raw, time = ts, sig = signature) =>
    new Request("https://example.invalid", {
      method: "POST",
      headers: { "telnyx-timestamp": time, "telnyx-signature-ed25519": sig },
      body,
    });
  assert.equal(await verifiedBody(req()), raw);
  await assert.rejects(verifiedBody(req("{}")));
  await assert.rejects(verifiedBody(req(raw, "1000000000")));
  await assert.rejects(verifiedBody(req(raw, ts, "")));
  assert.throws(() =>
    requireBearer(new Request("https://example.invalid"), "x".repeat(40)),
  );
});
test("inbound binding validates account assistant; caller ID cannot recover existing lead PII", (t) => {
  config(t);
  const vars = prepareInboundCall({
    assistant_id: "unit-assistant",
    telnyx_agent_target: "+442080001234",
    telnyx_conversation_channel: "phone_call",
    call_control_id: "control-1",
  });
  assert.equal(vars.dynamic_variables.buildtonic_context, "{}");
  assert.throws(() => prepareInboundCall({ assistant_id: "foreign" }));
});
test("telephone updates cannot grant consent, and duplicate completion is harmless", async (t) => {
  config(t);
  const store = await local(t),
    controlId = "control-2",
    callKey = callKeyFor(controlId);
  const body = {
    callKey,
    controlId,
    callToken: callBinding(callKey),
    notesPermission: true,
    update: {
      changes: { location: "Farnham", description: "Roof repair" },
      summaryOffered: false,
      confirmationEvidence: null,
    },
  };
  await assert.rejects(
    saveCallUpdate(store, { ...body, notesPermission: false }),
  );
  await saveCallUpdate(store, body);
  const call = await store.get(callKey),
    lead = await store.get(call.value.leadKey);
  assert.equal(lead.value.aiCallConsent, false);
  assert.equal(lead.value.aiCallConsentTimestamp, null);
  await assert.rejects(
    saveCallUpdate(store, {
      ...body,
      update: { ...body.update, changes: { aiCallConsent: true } },
    }),
  );
  await processCallCompletion(store, callKey, controlId, "completed", 42, true);
  const once = await store.get(callKey);
  await processCallCompletion(
    store,
    callKey,
    controlId,
    "ringing",
    undefined,
    true,
  );
  assert.equal((await store.get(callKey)).version, once.version);
  assert.equal(once.value.duration, 42);
  assert.match(once.value.summary, /Roof repair/);
});
test("signed insight processing is correlated, idempotent and cannot rewrite consent or call status", async (t) => {
  config(t);
  env(t, "TELNYX_INSIGHT_GROUP_ID", "group-1");
  const store = await local(t),
    controlId = "control-3",
    callKey = callKeyFor(controlId);
  await saveCallUpdate(store, {
    callKey,
    controlId,
    callToken: callBinding(callKey),
    notesPermission: true,
    update: {
      changes: { location: "Farnham" },
      summaryOffered: false,
      confirmationEvidence: null,
    },
  });
  const payload = {
    insight_group_id: "group-1",
    request_id: "request-1",
    conversation_id: "conversation-1",
    status: "completed",
    metadata: { buildtonic_control_id: controlId },
    results: [
      {
        result: JSON.stringify({
          summary: "Caller discussed Farnham.",
          missingInformation: ["Project details"],
          followUp: "Ask for details.",
        }),
      },
    ],
  };
  await processInsights(store, payload);
  const once = await store.get(callKey);
  await processInsights(store, payload);
  assert.equal((await store.get(callKey)).version, once.version);
  assert.equal(once.value.state, "in-progress");
});
test("provider config uses shared knowledge and hidden preset call binding", () => {
  const c = assistantConfiguration("https://example.invalid");
  assert.match(c.instructions, /VERIFIED BUILDTONIC KNOWLEDGE/);
  assert.doesNotMatch(c.instructions, /NO such actions exist/);
  assert.equal(
    c.tools[1].webhook.preset_body_fields.controlId,
    "{{call_control_id}}",
  );
  assert.equal(
    c.tools[1].webhook.body_parameters.properties.update.properties.changes
      .properties.aiCallConsent,
    undefined,
  );
});
test("remote storage requires atomic, completed persistence acknowledgements", async (t) => {
  const store = new HttpStore(
    "https://storage.example.invalid",
    "fixture-token",
  );
  let status = 201;
  t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.match(url, /\/records\/lead-fixture$/);
    assert.equal(options.headers["If-None-Match"], "*");
    return new Response(null, { status });
  });
  assert.equal(await store.put("lead-fixture", {}, null), true);
  status = 412;
  assert.equal(await store.put("lead-fixture", {}, null), false);
  status = 202;
  await assert.rejects(store.put("lead-fixture", {}, null));
});
test("untrusted replacement of preset call keys cannot acquire another call", async (t) => {
  config(t);
  const store = await local(t);
  await assert.rejects(
    saveCallUpdate(store, {
      callKey: callKeyFor("control-4"),
      controlId: "control-4",
      callToken: callBinding("other-call"),
      notesPermission: true,
      update: {
        changes: { location: "London" },
        summaryOffered: false,
        confirmationEvidence: null,
      },
    }),
    /binding/,
  );
});
test("actual signed inbound completion route persists provider status and duration", async (t) => {
  config(t);
  const root = await mkdtemp(join(tmpdir(), "buildtonic-callback-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  env(t, "LEAD_LOCAL_DIR", root);
  env(t, "LEAD_STORE_URL", undefined);
  env(t, "LEAD_STORE_TOKEN", undefined);
  env(t, "VERCEL", undefined);
  const store = getStore(),
    controlId = "v3:fixture-call-control",
    callKey = callKeyFor(controlId);
  await saveCallUpdate(store, {
    callKey,
    controlId,
    callToken: callBinding(callKey),
    notesPermission: true,
    update: {
      changes: { location: "Farnham" },
      summaryOffered: false,
      confirmationEvidence: null,
    },
  });
  const { publicKey, privateKey } = generateKeyPairSync("ed25519");
  env(
    t,
    "TELNYX_PUBLIC_KEY",
    publicKey
      .export({ type: "spki", format: "der" })
      .subarray(-32)
      .toString("base64"),
  );
  const raw = new URLSearchParams({
      CallSid: controlId,
      CallStatus: "completed",
      CallDuration: "51",
    }).toString(),
    ts = String(Math.floor(Date.now() / 1000)),
    sig = sign(null, Buffer.from(ts + "|" + raw), privateKey).toString(
      "base64",
    );
  const r = await completion(
    new Request("https://example.invalid/api/phone/finished", {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "telnyx-timestamp": ts,
        "telnyx-signature-ed25519": sig,
      },
      body: raw,
    }),
  );
  assert.equal(r.status, 200);
  assert.equal((await store.get(callKey)).value.duration, 51);
});
