import { assertSameOriginRequest, errorResponse, json } from "../../../agent/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    assertSameOriginRequest(request);
    return json({ configured: !!process.env.OPENAI_API_KEY?.trim() });
  } catch (error) {
    return errorResponse(error);
  }
}
