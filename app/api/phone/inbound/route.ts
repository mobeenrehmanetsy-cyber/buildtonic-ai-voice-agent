import { errorResponse, json, PublicError } from "../../../agent/server";
import { verifiedBody } from "../../../phone/telnyx";
import { prepareInboundCall } from "../../../phone/service";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const event = JSON.parse(await verifiedBody(request));
    if (event.data?.event_type !== "assistant.initialization")
      throw new PublicError(400, "Unexpected event.");
    return json(prepareInboundCall(event.data.payload));
  } catch (error) {
    return errorResponse(error);
  }
}
