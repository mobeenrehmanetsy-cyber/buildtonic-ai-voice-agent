import { errorResponse, json, PublicError } from "../../../agent/server";
import { verifiedBody } from "../../../phone/telnyx";
import {
  callKeyFor,
  processCallCompletion,
  processInsights,
} from "../../../phone/service";
import { getStore } from "../../../leads/store";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const raw = await verifiedBody(request);
    if (request.headers.get("content-type")?.includes("application/json")) {
      const event = JSON.parse(raw);
      if (event.event_type === "conversation_insight_result")
        return json(await processInsights(getStore(), event.payload));
      if (event.data?.event_type !== "call.hangup")
        return json({ acknowledged: true, ignored: true });
      const p = event.data.payload;
      if (typeof p?.call_control_id !== "string")
        throw new PublicError(400, "Missing call ID.");
      return json(
        await processCallCompletion(
          getStore(),
          callKeyFor(p.call_control_id),
          p.call_control_id,
          "completed",
          undefined,
          true,
        ),
      );
    }
    if (
      !request.headers
        .get("content-type")
        ?.includes("application/x-www-form-urlencoded")
    )
      throw new PublicError(415, "Unexpected format.");
    const f = new URLSearchParams(raw),
      outboundKey = new URL(request.url).searchParams.get("call"),
      key = outboundKey || callKeyFor(f.get("CallSid") || "");
    if (!/^(outbound|inbound)-[a-z0-9-]{1,70}$/i.test(key) || !f.get("CallSid"))
      throw new PublicError(400, "Missing call reference.");
    const state =
      f.get("CallStatus") === "answered"
        ? "in-progress"
        : f.get("CallStatus") || "unknown";
    const duration = f.has("CallDuration")
      ? Number(f.get("CallDuration"))
      : undefined;
    return json(
      await processCallCompletion(
        getStore(),
        key,
        f.get("CallSid")!,
        state,
        duration,
        !outboundKey,
      ),
    );
  } catch (error) {
    return errorResponse(error);
  }
}
