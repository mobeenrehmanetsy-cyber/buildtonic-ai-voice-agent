import {
  assertSameOriginRequest,
  json,
  PublicError,
  readJson,
} from "../../agent/server";
import { getStore } from "../../leads/store";
import { submitEnquiry } from "../../leads/submission";
import { validateSubmission } from "../../leads/model";
export const runtime = "nodejs";
const attempts = new Map<string, { count: number; until: number }>();
export async function POST(request: Request) {
  try {
    assertSameOriginRequest(request);
    // In-memory load shedding, deliberately bounded. Infrastructure rate limits
    // must supplement this on a multi-instance public deployment.
    const key = process.env.VERCEL
      ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0] || "shared"
      : "local";
    const now = Date.now();
    for (const [k, entry] of attempts)
      if (entry.until < now) attempts.delete(k);
    const entry = attempts.get(key) || { count: 0, until: now + 60000 };
    if (attempts.size > 5000 || ++entry.count > 8)
      throw new PublicError(
        429,
        "Please wait a minute before submitting again.",
      );
    attempts.set(key, entry);
    const body = await readJson(request);
    try {
      validateSubmission(body);
    } catch (error) {
      throw new PublicError(
        400,
        error instanceof Error ? error.message : "Please check your enquiry.",
      );
    }
    const store = getStore();
    const { lead, duplicate } = await submitEnquiry(body, store);
    return json(
      {
        status: store.mode === "local" ? "saved_locally" : "received",
        leadId: lead.leadId,
        duplicate,
        callStatus: lead.aiCallConsent
          ? "awaiting_call_review"
          : "not_requested",
        message:
          store.mode === "local"
            ? "Saved on this review server. This has not been delivered to Buildtonic and no call has been scheduled."
            : "Your enquiry has been received. No call has been scheduled; the team must review any call request.",
      },
      duplicate ? 200 : 201,
    );
  } catch (error) {
    if (error instanceof PublicError)
      return json({ error: error.message }, error.status);
    if (error instanceof Error && error.message === "storage_not_configured")
      return json(
        {
          error:
            "Online submission is not configured yet. Your draft is still here; please email or call the team.",
          status: "storage_not_configured",
        },
        503,
      );
    // Validation is shown separately from persistence failures; never return raw
    // filesystem, network or provider error detail.
    return json(
      {
        error:
          "We could not save this enquiry. Please retry, or email the team. Your draft is still available.",
      },
      503,
    );
  }
}
