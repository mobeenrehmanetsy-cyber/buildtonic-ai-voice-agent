import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { createLead, validateSubmission, type Lead } from "./model";
import type { RecordStore } from "./store";
export async function submitEnquiry(input: unknown, store: RecordStore) {
  const data = validateSubmission(input);
  const key =
    "lead-" + createHash("sha256").update(data.requestId).digest("hex");
  const lead = createLead(
    data.project,
    "website_form",
    randomUUID(),
    data.aiCallConsent,
  );
  const old = await store.get<Lead>(key);
  if (old) {
    if (
      JSON.stringify(old.value.project) !== JSON.stringify(data.project) ||
      old.value.aiCallConsent !== data.aiCallConsent
    )
      throw Error(
        "This submission reference was already used. Please refresh before starting a different enquiry.",
      );
    return { lead: old.value, key, duplicate: true };
  }
  if (!(await store.put(key, lead, null)))
    throw Error(
      "Your enquiry is still being processed. Please retry in a moment.",
    );
  return { lead, key, duplicate: false };
}
