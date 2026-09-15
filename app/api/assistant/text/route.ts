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
import { instructions } from "../../../agent/business";
import { parseMessages } from "../../../agent/conversation";
import {
  applyQualification,
  parseUpdate,
  qualificationSchema,
  readQualification,
} from "../../../agent/qualification";
export const runtime = "nodejs";
export const maxDuration = 30;
export async function POST(request: Request) {
  try {
    assertSameOriginRequest(request);
    limit("text");
    const key = apiKey();
    const body = await readJson(request);
    let messages;
    try {
      messages = parseMessages(body.messages);
    } catch {
      throw new PublicError(
        400,
        "Please shorten the message or start a new conversation.",
      );
    }
    if (!messages.length || messages.at(-1)?.role !== "user")
      throw new PublicError(400, "Please type a question.");
    const qualification = readQualification(body.qualification);
    const response = await upstream(
      "responses",
      JSON.stringify({
        model: process.env.OPENAI_TEXT_MODEL || "gpt-5.4-mini",
        store: false,
        reasoning: { effort: "none" },
        max_output_tokens: 1600,
        instructions: instructions(body.context, body.language, qualification),
        input: messages.map((m) => ({
          role: m.role,
          content:
            m.text +
            (m.interrupted
              ? " [Audio reply was interrupted; visitor may not have heard all of it.]"
              : ""),
        })),
        text: {
          format: {
            type: "json_schema",
            name: "buildtonic_reply",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                reply: { type: "string" },
                qualification: qualificationSchema,
              },
              required: ["reply", "qualification"],
            },
          },
        },
      }),
      key,
      request,
    );
    const data = await response.json();
    if (data.status !== "completed" || !Array.isArray(data.output))
      throw new PublicError(
        502,
        "The reply was incomplete. Please retry your question.",
      );
    const output = data.output
      .flatMap(
        (item: { content?: { type: string; text?: string }[] }) =>
          item.content ?? [],
      )
      .filter((item: { type: string }) => item.type === "output_text")
      .map((item: { text: string }) => item.text)
      .join("");
    let result;
    try {
      result = JSON.parse(output);
      if (
        typeof result.reply !== "string" ||
        !result.reply.trim() ||
        result.reply.length > 4000
      )
        throw Error();
      result.qualification = applyQualification(
        qualification,
        parseUpdate(result.qualification),
        messages.at(-1)!.text,
      );
    } catch {
      throw new PublicError(
        502,
        "The assistant could not format a reliable reply. Please retry.",
      );
    }
    return json({ reply: result.reply, qualification: result.qualification });
  } catch (error) {
    return errorResponse(error);
  }
}
