import { json, errorResponse, PublicError } from "../../../agent/server";
import { requireOperator } from "../../../phone/service";
import {
  assistantConfiguration,
  projectInsight,
} from "../../../phone/assistant-config";
export const runtime = "nodejs";
export async function GET(request: Request) {
  try {
    requireOperator(request);
    const base = process.env.PHONE_PUBLIC_BASE_URL;
    if (!base || !/^https:\/\/[^/]+\/?$/.test(base))
      throw new PublicError(503, "Set the public HTTPS website origin first.");
    return json({
      assistant: assistantConfiguration(base.replace(/\/$/, "")),
      projectInsight,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
