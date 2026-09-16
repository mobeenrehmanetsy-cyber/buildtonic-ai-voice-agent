import {
  emptyBrief,
  formatBrief,
  type ProjectBrief,
} from "../start-project/model.ts";
import { briefKeys } from "../agent/qualification.ts";
import { safeLanguage } from "../agent/conversation.ts";

export const callConsentText =
  "I agree to an AI project assistant calling the telephone number I provided about this enquiry. I can decline or withdraw without preventing a normal enquiry.";
export const consentVersion = "2026-09-16-v1";
export type LeadSource =
  | "website_form"
  | "website_text_ai"
  | "website_voice_ai"
  | "phone_inbound"
  | "phone_outbound";
// One project model, shared with form/chat/voice. Provider IDs and consent are
// server-owned metadata, never fields an AI qualification tool can change.
export type Lead = {
  leadId: string;
  createdAt: string;
  source: LeadSource;
  project: ProjectBrief;
  aiCallConsent: boolean;
  aiCallConsentTimestamp: string | null;
  aiCallConsentVersion: string;
  consentPhone: string;
  qualificationStatus: "draft" | "confirmed";
  summary: string;
  channels: LeadSource[];
};
export function normalisePhone(value: string) {
  let phone = value.replace(/[\s().-]/g, "");
  if (phone.startsWith("00")) phone = "+" + phone.slice(2);
  if (/^0\d{10}$/.test(phone)) phone = "+44" + phone.slice(1);
  return /^\+[1-9]\d{7,14}$/.test(phone) ? phone : "";
}
export function normaliseProject(value: unknown): ProjectBrief {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw Error("Invalid project details.");
  const input = value as Record<string, unknown>;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(emptyBrief, key))
      throw Error("Unexpected project field.");
  const project = { ...emptyBrief };
  for (const key of briefKeys) {
    const value = input[key];
    if (
      value !== undefined &&
      (typeof value !== "string" || value.length > 2000)
    )
      throw Error("Please shorten your project details.");
    project[key] = typeof value === "string" ? value.trim() : project[key];
  }
  project.email = project.email.toLowerCase();
  project.postcode = project.postcode.toUpperCase();
  project.preferredLanguage = safeLanguage(project.preferredLanguage);
  if (project.phone && !normalisePhone(project.phone))
    throw Error(
      "Enter a valid telephone number, including the country code for numbers outside the UK.",
    );
  project.phone = normalisePhone(project.phone);
  project.consent = input.consent === true;
  project.summaryConfirmed = input.summaryConfirmed === true;
  return project;
}
export function validateSubmission(value: unknown) {
  if (!value || typeof value !== "object") throw Error("Invalid enquiry.");
  const body = value as Record<string, unknown>;
  if (body.website) throw Error("Unable to accept this enquiry.");
  if (
    typeof body.requestId !== "string" ||
    !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(body.requestId)
  )
    throw Error("Please reload the enquiry page.");
  const project = normaliseProject(body.project);
  if (
    !project.service ||
    !project.location ||
    !project.description ||
    !project.name
  )
    throw Error(
      "Please complete your project type, location, description and name.",
    );
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(project.email) ||
    project.email.length > 254
  )
    throw Error("Enter a valid email address.");
  if (project.preferredContact === "Telephone" && !project.phone)
    throw Error("Please add a telephone number.");
  if (!["Email", "Telephone"].includes(project.preferredContact))
    throw Error("Please choose email or telephone for normal contact.");
  if (!project.consent || !project.summaryConfirmed)
    throw Error(
      "Please review and confirm the brief and privacy acknowledgement.",
    );
  if (typeof body.aiCallConsent !== "boolean")
    throw Error("Please choose whether an AI call is okay.");
  if (body.aiCallConsent && !project.phone)
    throw Error("An AI call requires a valid telephone number.");
  return {
    project,
    aiCallConsent: body.aiCallConsent,
    requestId: body.requestId,
  };
}
export function createLead(
  project: ProjectBrief,
  source: LeadSource,
  leadId: string,
  aiCallConsent = false,
  now = new Date().toISOString(),
): Lead {
  return {
    leadId,
    createdAt: now,
    source,
    project,
    aiCallConsent,
    aiCallConsentTimestamp: aiCallConsent ? now : null,
    aiCallConsentVersion: consentVersion,
    consentPhone: aiCallConsent ? project.phone : "",
    qualificationStatus: project.summaryConfirmed ? "confirmed" : "draft",
    summary: formatBrief(project),
    channels: [source],
  };
}
// Safe import: fill gaps only. Existing answers win and conflicts are named.
export function mergeProjectNotes(current: ProjectBrief, notes: ProjectBrief) {
  const project = { ...current, consent: false, summaryConfirmed: false };
  const conflicts: string[] = [];
  for (const key of briefKeys) {
    if (!notes[key].trim()) continue;
    if (!current[key].trim()) project[key] = notes[key];
    else if (current[key] !== notes[key]) conflicts.push(key);
  }
  return { project, conflicts };
}
