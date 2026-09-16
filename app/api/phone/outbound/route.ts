import {
  json,
  readJson,
  errorResponse,
  PublicError,
} from "../../../agent/server";
import { getStore } from "../../../leads/store";
import { requireOperator, requestOutbound } from "../../../phone/service";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    requireOperator(request);
    const body = await readJson(request);
    if (
      typeof body.leadKey !== "string" ||
      !/^lead-[a-z0-9-]+$/i.test(body.leadKey) ||
      body.confirmedSuitableTime !== true
    )
      throw new PublicError(
        400,
        "Choose a stored enquiry and confirm a suitable contact time.",
      );
    return json(await requestOutbound(body.leadKey, getStore()));
  } catch (error) {
    return errorResponse(error);
  }
}
