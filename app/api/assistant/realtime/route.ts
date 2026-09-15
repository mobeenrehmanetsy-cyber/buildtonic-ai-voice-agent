import {
  assertSameOriginRequest,
  apiKey,
  errorResponse,
  json,
  limit,
  PublicError,
  readJson,
  upstream,
} from "../../../agent/server";
import { briefTool, instructions } from "../../../agent/business";
import { parseMessages } from "../../../agent/conversation";
import { readQualification } from "../../../agent/qualification";
export const runtime = "nodejs";
export const maxDuration = 30;
export async function POST(request: Request) {
  try {
    assertSameOriginRequest(request);
    limit("voice");
    const key = apiKey();
    const body = await readJson(request);
    if (
      typeof body.sdp !== "string" ||
      !body.sdp.startsWith("v=0") ||
      body.sdp.length > 30000
    )
      throw new PublicError(
        400,
        "The browser could not prepare a voice connection.",
      );
    let history;
    try {
      history = parseMessages(body.messages ?? []);
    } catch {
      throw new PublicError(400, "Please start a new conversation.");
    }
    const session = {
      type: "realtime",
      model: process.env.OPENAI_REALTIME_MODEL || "gpt-realtime-2.1",
      instructions: instructions(
        body.context,
        body.language,
        readQualification(body.qualification),
        history,
      ),
      output_modalities: ["audio"],
      max_output_tokens: 1024,
      audio: {
        input: {
          transcription: { model: "gpt-4o-mini-transcribe" },
          noise_reduction: { type: "near_field" },
          turn_detection: {
            type: "semantic_vad",
            eagerness: "medium",
            create_response: true,
            interrupt_response: true,
          },
        },
        output: { voice: "marin" },
      },
      tools: [briefTool],
      tool_choice: "auto",
    };
    const form = new FormData();
    form.set("sdp", body.sdp);
    form.set("session", JSON.stringify(session));
    const response = await upstream(
      "realtime/calls",
      form,
      key,
      request,
      false,
    );
    const sdp = await response.text();
    if (!sdp.startsWith("v=0") || sdp.length > 40000)
      throw new PublicError(
        502,
        "The voice service returned an invalid connection. Please try again.",
      );
    return json({ sdp });
  } catch (error) {
    return errorResponse(error);
  }
}
