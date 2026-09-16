import "server-only";
import {
  createPublicKey,
  createHmac,
  verify,
  timingSafeEqual,
} from "node:crypto";
import { normalisePhone, type Lead } from "../leads/model";
import { PublicError } from "../agent/server";

export function phoneConfig() {
  const token = process.env.TELNYX_API_KEY;
  const assistant = process.env.TELNYX_ASSISTANT_ID;
  const connection = process.env.TELNYX_TEXML_CONNECTION_ID;
  const number = process.env.TELNYX_PHONE_NUMBER;
  const base = process.env.PHONE_PUBLIC_BASE_URL;
  if (
    !token ||
    !assistant ||
    !connection ||
    !number ||
    normalisePhone(number) !== number ||
    !base ||
    !process.env.TELNYX_PUBLIC_KEY ||
    (process.env.TELNYX_TOOL_SECRET?.length ?? 0) < 32
  )
    return null;
  try {
    const url = new URL(base);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.pathname !== "/" ||
      url.search ||
      url.hash
    )
      return null;
  } catch {
    return null;
  }
  return {
    token,
    assistant,
    connection,
    number,
    base: base.replace(/\/$/, ""),
  };
}
export function requireBearer(request: Request, secret: string | undefined) {
  const expected = Buffer.from("Bearer " + (secret || ""));
  const actual = Buffer.from(request.headers.get("authorization") || "");
  if (
    !secret ||
    secret.length < 32 ||
    actual.length !== expected.length ||
    !timingSafeEqual(actual, expected)
  )
    throw new PublicError(401, "Not authorised.");
}
export function callBinding(callKey: string) {
  const secret = process.env.TELNYX_TOOL_SECRET;
  if (!secret || secret.length < 32)
    throw new PublicError(503, "phone_not_configured");
  return createHmac("sha256", secret)
    .update("buildtonic-call:" + callKey)
    .digest("hex");
}
export function verifyCallBinding(callKey: string, token: unknown) {
  const expected = Buffer.from(callBinding(callKey));
  const actual = Buffer.from(typeof token === "string" ? token : "");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected))
    throw new PublicError(403, "Invalid call binding.");
}
export async function verifiedBody(request: Request) {
  const publicKey = process.env.TELNYX_PUBLIC_KEY;
  if (!publicKey) throw new PublicError(503, "phone_not_configured");
  const timestamp = request.headers.get("telnyx-timestamp") || "";
  const signature = request.headers.get("telnyx-signature-ed25519") || "";
  if (
    !/^\d{10}$/.test(timestamp) ||
    Math.abs(Date.now() / 1000 - Number(timestamp)) > 300
  )
    throw new PublicError(403, "Invalid webhook timestamp.");
  const reader = request.body?.getReader();
  if (!reader) throw new PublicError(400, "Missing request.");
  const parts: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 90000) {
        await reader.cancel();
        throw new PublicError(413, "Request too large.");
      }
      parts.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const raw = Buffer.concat(parts).toString("utf8");
  let valid = false;
  try {
    const bytes = Buffer.from(publicKey, "base64");
    if (bytes.length !== 32) throw Error("Invalid key");
    const key = createPublicKey({
      key: Buffer.concat([
        Buffer.from("302a300506032b6570032100", "hex"),
        bytes,
      ]),
      format: "der",
      type: "spki",
    });
    valid = verify(
      null,
      Buffer.from(timestamp + "|" + raw),
      key,
      Buffer.from(signature, "base64"),
    );
  } catch {
    /* Fail closed; never print provider input or credentials. */
  }
  if (!valid) throw new PublicError(403, "Invalid webhook signature.");
  return raw;
}
export interface PhoneProvider {
  initiateOutboundCall(
    callId: string,
    lead: Lead,
  ): Promise<{ providerId: string }>;
  getCallStatus(providerId: string): Promise<string>;
}
export class TelnyxProvider implements PhoneProvider {
  async initiateOutboundCall(callId: string, lead: Lead) {
    const c = phoneConfig();
    if (!c) throw Error("phone_not_configured");
    const response = await fetch(
      `https://api.telnyx.com/v2/texml/ai_calls/${encodeURIComponent(c.connection)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${c.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          AIAssistantId: c.assistant,
          From: c.number,
          To: lead.project.phone,
          AIAssistantDynamicVariables: {
            buildtonic_call_key: callId,
            buildtonic_call_token: callBinding(callId),
            buildtonic_direction: "outbound",
            buildtonic_context: JSON.stringify(lead.project),
          },
          StatusCallback: `${c.base}/api/phone/finished?call=${callId}`,
          StatusCallbackMethod: "POST",
          StatusCallbackEvent:
            "initiated ringing answered completed no-answer busy canceled failed",
          Record: false,
          TimeLimit: 600,
          Timeout: 30,
        }),
        signal: AbortSignal.timeout(12000),
        redirect: "error",
        cache: "no-store",
      },
    );
    if (!response.ok) throw Error("Provider rejected request");
    const data = await response.json();
    if (typeof data.call_sid !== "string" || !data.call_sid)
      throw Error("Missing provider acceptance");
    return { providerId: data.call_sid };
  }
  async getCallStatus(providerId: string) {
    const c = phoneConfig();
    if (!c) return "phone_not_configured";
    if (!process.env.TELNYX_ACCOUNT_SID) return "status_lookup_not_configured";
    const response = await fetch(
      `https://api.telnyx.com/v2/texml/Accounts/${encodeURIComponent(process.env.TELNYX_ACCOUNT_SID || "")}/Calls/${encodeURIComponent(providerId)}`,
      {
        headers: { Authorization: `Bearer ${c.token}` },
        signal: AbortSignal.timeout(8000),
        redirect: "error",
        cache: "no-store",
      },
    );
    if (!response.ok) throw Error("Provider status unavailable");
    const data = await response.json();
    return typeof data.status === "string" ? data.status : "unknown";
  }
}
