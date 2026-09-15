import { assertLocalRequest, errorResponse, json } from "../../../agent/server";
export const runtime = "nodejs";
export async function GET(request: Request) {
  try {
    assertLocalRequest(request);
    return json({ configured: !!process.env.OPENAI_API_KEY?.trim() });
  } catch (error) {
    return errorResponse(error);
  }
}
