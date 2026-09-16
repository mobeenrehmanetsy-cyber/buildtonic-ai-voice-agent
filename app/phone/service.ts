import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { emptyBrief, formatBrief } from "../start-project/model";
import { createLead, normalisePhone, type Lead } from "../leads/model";
import { type RecordStore } from "../leads/store";
import {
  applyQualification,
  parseUpdate,
  type Qualification,
} from "../agent/qualification";
import { PublicError } from "../agent/server";
import {
  phoneConfig,
  callBinding,
  verifyCallBinding,
  requireBearer,
  TelnyxProvider,
  type PhoneProvider,
} from "./telnyx";

export type PhoneCall = {
  id: string;
  leadKey: string;
  direction: "inbound" | "outbound";
  state: string;
  createdAt: string;
  providerId?: string;
  controlId?: string;
  qualification?: Qualification;
  updates: number;
  duration?: number;
  summary?: string;
  missingInformation?: string[];
  followUp?: string;
  analysisId?: string;
  conversationId?: string;
};
export const callKeyFor = (id: string) =>
  "inbound-" + createHash("sha256").update(id).digest("hex");
export function requireOperator(request: Request) {
  requireBearer(request, process.env.LEAD_OPERATIONS_TOKEN);
}
export function outboundEligibility(lead: Lead) {
  if (!lead.aiCallConsent || !lead.aiCallConsentTimestamp)
    return "consent_required";
  if (
    !normalisePhone(lead.project.phone) ||
    lead.consentPhone !== lead.project.phone
  )
    return "phone_or_consent_invalid";
  return "eligible";
}
export async function requestOutbound(
  leadKey: string,
  store: RecordStore,
  provider: PhoneProvider = new TelnyxProvider(),
) {
  const record = await store.get<Lead>(leadKey);
  if (!record) throw new PublicError(404, "Enquiry not found.");
  const policy = outboundEligibility(record.value);
  if (policy !== "eligible") return { status: policy };
  if (!phoneConfig()) return { status: "phone_not_configured" };
  const key = "outbound-" + record.value.leadId;
  const call: PhoneCall = {
    id: key,
    leadKey,
    direction: "outbound",
    state: "preparing",
    createdAt: new Date().toISOString(),
    updates: 0,
  };
  // One attempt per lead; ambiguous network outcomes require human reconciliation.
  if (!(await store.put(key, call, null)))
    return { status: "already_requested" };
  const latest = await store.get<Lead>(leadKey);
  if (!latest || outboundEligibility(latest.value) !== "eligible") {
    await store.put(key, { ...call, state: "canceled" }, 1);
    return { status: "consent_required" };
  }
  try {
    const result = await provider.initiateOutboundCall(key, latest.value);
    const current = await store.get<PhoneCall>(key);
    if (
      !current ||
      !(await store.put(
        key,
        {
          ...current.value,
          providerId: result.providerId,
          state:
            current.value.state === "preparing"
              ? "queued"
              : current.value.state,
        },
        current.version,
      ))
    )
      throw Error("Reconciliation needed");
    return { status: "queued", callId: key };
  } catch {
    const current = await store.get<PhoneCall>(key);
    if (current?.value.state === "preparing")
      await store.put(
        key,
        { ...current.value, state: "unknown" },
        current.version,
      );
    return { status: "provider_outcome_unknown", callId: key };
  }
}
// Initialization is deliberately stateless. Outbound API variables override these
// defaults; inbound leads are created only when the caller permits project notes.
export function prepareInboundCall(payload: Record<string, unknown>) {
  if (!process.env.TELNYX_ASSISTANT_ID || !process.env.TELNYX_PHONE_NUMBER)
    throw new PublicError(503, "phone_not_configured");
  if (
    payload.assistant_id !== process.env.TELNYX_ASSISTANT_ID ||
    payload.telnyx_agent_target !== process.env.TELNYX_PHONE_NUMBER ||
    payload.telnyx_conversation_channel !== "phone_call" ||
    typeof payload.call_control_id !== "string"
  )
    throw new PublicError(403, "Unexpected assistant or call.");
  return {
    dynamic_variables: {
      buildtonic_call_key: callKeyFor(payload.call_control_id),
      buildtonic_call_token: callBinding(callKeyFor(payload.call_control_id)),
      buildtonic_direction: "inbound",
      buildtonic_context: "{}",
    },
    conversation: {
      metadata: { buildtonic_control_id: payload.call_control_id },
    },
  };
}
export async function saveCallUpdate(
  store: RecordStore,
  body: Record<string, unknown>,
) {
  const { callKey, controlId, notesPermission } = body;
  if (
    typeof callKey !== "string" ||
    !/^(inbound|outbound)-[a-z0-9-]{1,70}$/i.test(callKey) ||
    typeof controlId !== "string" ||
    controlId.length > 500 ||
    !controlId ||
    notesPermission !== true
  )
    throw new PublicError(
      400,
      "Call context and permission to retain notes are required.",
    );
  const update = parseUpdate(body.update);
  verifyCallBinding(callKey, body.callToken);
  // Telephone confirmation is model-reported, not independently transcribed evidence.
  // Keep it as a draft for human review, never assert verified confirmation.
  update.confirmationEvidence = null;
  let call = await store.get<PhoneCall>(callKey);
  if (!call && callKey === callKeyFor(controlId)) {
    const leadKey =
      "lead-" + createHash("sha256").update(controlId).digest("hex");
    await store.put(
      leadKey,
      createLead({ ...emptyBrief }, "phone_inbound", randomUUID()),
      null,
    );
    await store.put<PhoneCall>(
      callKey,
      {
        id: callKey,
        leadKey,
        direction: "inbound",
        state: "in-progress",
        controlId,
        createdAt: new Date().toISOString(),
        updates: 0,
      },
      null,
    );
    call = await store.get<PhoneCall>(callKey);
  }
  if (!call || (call.value.controlId && call.value.controlId !== controlId))
    throw new PublicError(403, "Unknown call.");
  const mapKey = callKeyFor(controlId).replace("inbound-", "phone-map-");
  const mapping = await store.get<string>(mapKey);
  if (mapping && mapping.value !== callKey)
    throw new PublicError(403, "Call context mismatch.");
  if (!mapping && !(await store.put(mapKey, callKey, null)))
    throw new PublicError(503, "Please retry the project update.");
  if (
    ["completed", "failed", "busy", "no-answer", "canceled"].includes(
      call.value.state,
    )
  )
    throw new PublicError(409, "Call has ended.");
  const lead = await store.get<Lead>(call.value.leadKey);
  if (!lead) throw Error("Missing lead");
  const qualification = applyQualification(
    {
      brief: lead.value.project,
      summaryOffered: call.value.qualification?.summaryOffered ?? false,
    },
    update,
    "",
  );
  qualification.brief.summaryConfirmed = false;
  // Consent envelope is never changed by a model tool. A changed telephone number
  // fails the consentPhone equality check before any later outbound operation.
  const next: Lead = {
    ...lead.value,
    project: qualification.brief,
    summary: formatBrief(qualification.brief),
    qualificationStatus: "draft",
    channels: [
      ...new Set([
        ...lead.value.channels,
        call.value.direction === "inbound"
          ? ("phone_inbound" as const)
          : ("phone_outbound" as const),
      ]),
    ],
  };
  if (!(await store.put(call.value.leadKey, next, lead.version)))
    throw new PublicError(503, "Please retry the project update.");
  if (
    !(await store.put(
      callKey,
      {
        ...call.value,
        controlId,
        qualification,
        updates: call.value.updates + 1,
      },
      call.version,
    ))
  )
    throw new PublicError(503, "Please retry the project update.");
  return { stored: true, submittedToTeam: false, summaryConfirmed: false };
}
export async function processCallCompletion(
  store: RecordStore,
  key: string,
  providerId: string,
  state: string,
  duration?: number,
  isControlId = false,
) {
  const call = await store.get<PhoneCall>(key);
  if (!call) return { acknowledged: true, matched: false };
  if (
    (isControlId ? call.value.controlId : call.value.providerId) !== providerId
  )
    throw new PublicError(
      503,
      "Call correlation is not ready; retry callback.",
    );
  const terminals = ["completed", "failed", "busy", "no-answer", "canceled"];
  const ranks = [
    "preparing",
    "unknown",
    "queued",
    "initiated",
    "ringing",
    "in-progress",
  ];
  if (!terminals.includes(state) && !ranks.includes(state))
    return { acknowledged: true, ignored: true };
  if (
    terminals.includes(call.value.state) ||
    (!terminals.includes(state) &&
      ranks.indexOf(state) < ranks.indexOf(call.value.state))
  )
    return { acknowledged: true };
  const lead = await store.get<Lead>(call.value.leadKey);
  const final = terminals.includes(state);
  const next = {
    ...call.value,
    state,
    ...(Number.isFinite(duration) && duration! >= 0 ? { duration } : {}),
    ...(final
      ? {
          summary:
            call.value.summary ||
            (call.value.updates && lead ? lead.value.summary : undefined),
          missingInformation:
            call.value.missingInformation ||
            (lead
              ? ["service", "location", "description", "name", "email"].filter(
                  (k) =>
                    !lead.value.project[k as keyof typeof lead.value.project],
                )
              : []),
          followUp:
            call.value.followUp ||
            (call.value.updates
              ? "Human review of caller-provided project notes; clarify missing details. No booking or quote was made."
              : "No project notes captured. Review the call outcome before any further contact."),
        }
      : {}),
  };
  if (!(await store.put(key, next, call.version)))
    throw new PublicError(503, "Please retry callback.");
  return { acknowledged: true, matched: true };
}

export async function processInsights(
  store: RecordStore,
  payload: Record<string, unknown>,
) {
  if (
    !process.env.TELNYX_INSIGHT_GROUP_ID ||
    payload.insight_group_id !== process.env.TELNYX_INSIGHT_GROUP_ID
  )
    throw new PublicError(403, "Unexpected insight group.");
  const metadata = payload.metadata as Record<string, unknown> | undefined;
  if (
    typeof metadata?.buildtonic_control_id !== "string" ||
    typeof payload.request_id !== "string" ||
    typeof payload.conversation_id !== "string"
  )
    throw new PublicError(400, "Missing conversation context.");
  const mapping = await store.get<string>(
    callKeyFor(metadata.buildtonic_control_id).replace(
      "inbound-",
      "phone-map-",
    ),
  );
  if (!mapping) return { acknowledged: true, matched: false }; // no permission/notes: no new retained PII
  const call = await store.get<PhoneCall>(mapping.value);
  if (!call || call.value.controlId !== metadata.buildtonic_control_id)
    throw new PublicError(403, "Conversation mismatch.");
  if (call.value.analysisId === payload.request_id)
    return { acknowledged: true };
  if (payload.status !== "completed")
    return { acknowledged: true, analysis: "unavailable" };
  const results = payload.results;
  if (
    !Array.isArray(results) ||
    results.length !== 1 ||
    typeof results[0]?.result !== "string"
  )
    throw new PublicError(400, "Expected one structured project insight.");
  const result = JSON.parse(results[0].result);
  if (
    typeof result.summary !== "string" ||
    result.summary.length > 4000 ||
    typeof result.followUp !== "string" ||
    result.followUp.length > 2000 ||
    !Array.isArray(result.missingInformation) ||
    result.missingInformation.length > 30 ||
    result.missingInformation.some(
      (v: unknown) => typeof v !== "string" || v.length > 200,
    )
  )
    throw new PublicError(400, "Invalid project insight.");
  // An insight proves analysis, not a telephone hangup. Keep lifecycle separate.
  if (
    !(await store.put(
      mapping.value,
      {
        ...call.value,
        summary: result.summary,
        missingInformation: result.missingInformation,
        followUp: result.followUp,
        analysisId: payload.request_id,
        conversationId: payload.conversation_id,
      },
      call.version,
    ))
  )
    throw new PublicError(503, "Please retry callback.");
  return { acknowledged: true, analysis: "received" };
}
