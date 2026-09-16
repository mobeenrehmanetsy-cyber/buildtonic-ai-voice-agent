import { errorResponse, json, readJson } from "../../../agent/server";
import { requireBearer } from "../../../phone/telnyx";
import { saveCallUpdate } from "../../../phone/service";
import { getStore } from "../../../leads/store";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    // Custom assistant tools use an integration-secret header; provider lifecycle
    // events use Ed25519 instead. Neither boundary accepts unauthenticated input.
    requireBearer(request, process.env.TELNYX_TOOL_SECRET);
    return json(await saveCallUpdate(getStore(), await readJson(request)));
  } catch (error) {
    return errorResponse(error);
  }
}
