import { json, errorResponse, PublicError } from "../../../agent/server";
import { requireOperator, type PhoneCall } from "../../../phone/service";
import { getStore } from "../../../leads/store";
export const runtime = "nodejs";
export async function GET(request: Request) {
  try {
    requireOperator(request);
    const key = new URL(request.url).searchParams.get("call") || "";
    if (!/^(outbound|inbound)-[a-z0-9-]{1,70}$/i.test(key))
      throw new PublicError(400, "Invalid call reference.");
    const call = await getStore().get<PhoneCall>(key);
    if (!call) throw new PublicError(404, "Call not found.");
    return json({
      call: call.value,
      source: "stored_provider_events_and_project_tools",
    });
  } catch (error) {
    return errorResponse(error);
  }
}
