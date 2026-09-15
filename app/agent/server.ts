import "server-only";
export class PublicError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
export function assertLocalRequest(request: Request) {
  if (process.env.VERCEL)
    throw new PublicError(403, "AI public deployment has not been enabled.");
  const url = new URL(request.url);
  if (!["localhost", "127.0.0.1", "[::1]"].includes(url.hostname))
    throw new PublicError(403, "AI access is limited to local testing.");
  // Next can normalise request.url to localhost even when the browser uses
  // 127.0.0.1. Check the actual Host too, without trusting forwarded headers.
  if (request.method === "POST") {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host") ?? url.host;
    let valid = false;
    try {
      const browser = new URL(origin ?? "");
      valid = ["localhost", "127.0.0.1", "[::1]"].includes(browser.hostname)
        && browser.host === host && browser.protocol === url.protocol;
    } catch { /* Missing or malformed origins are rejected. */ }
    if (!valid)
      throw new PublicError(403, "Please use the assistant on this website.");
  }
}
const requests = new Map<string, { count: number; until: number }>();
export function limit(kind: "text" | "voice") {
  const now = Date.now();
  let entry = requests.get(kind);
  if (!entry || entry.until < now) {
    entry = { count: 0, until: now + 60000 };
    requests.set(kind, entry);
  }
  entry.count++;
  if (entry.count > (kind === "voice" ? 6 : 30))
    throw new PublicError(429, "Please wait a minute before trying again.");
}
export function apiKey() {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key)
    throw new PublicError(
      503,
      "The AI assistant is not configured yet. You can still use the project brief or contact the team.",
    );
  return key;
}
export function json(value: unknown, status = 200) {
  return Response.json(value, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
export function errorResponse(error: unknown) {
  return error instanceof PublicError
    ? json({ error: error.message }, error.status)
    : json(
        {
          error:
            "The assistant could not connect. Please try again, or use the project brief.",
        },
        502,
      );
}
export async function readJson(
  request: Request,
): Promise<Record<string, unknown>> {
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    throw new PublicError(415, "Unsupported request format.");
  const reader = request.body?.getReader();
  if (!reader) throw new PublicError(400, "Missing request.");
  let size = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 90000) {
        await reader.cancel();
        throw new PublicError(
          413,
          "This conversation is too long. Please start a new conversation.",
        );
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  try {
    const data = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!data || typeof data !== "object" || Array.isArray(data)) throw Error();
    return data;
  } catch {
    throw new PublicError(400, "Invalid request.");
  }
}
export async function upstream(
  path: string,
  body: BodyInit,
  key: string,
  request: Request,
  jsonBody = true,
) {
  const response = await fetch("https://api.openai.com/v1/" + path, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      ...(jsonBody ? { "Content-Type": "application/json" } : {}),
    },
    body,
    signal: AbortSignal.any([request.signal, AbortSignal.timeout(25000)]),
    cache: "no-store",
  });
  if (!response.ok) {
    await response.body?.cancel();
    throw new PublicError(
      response.status === 429 ? 429 : 502,
      response.status === 429
        ? "The AI service is busy or its usage limit has been reached. Please try later or contact the team."
        : "The AI service could not complete this request. Please try again or contact the team.",
    );
  }
  return response;
}
