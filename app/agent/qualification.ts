import { emptyBrief, type ProjectBrief } from "../start-project/model.ts";
export const briefKeys = Object.keys(emptyBrief).filter(
  (k) => typeof emptyBrief[k as keyof ProjectBrief] === "string",
) as (keyof Omit<ProjectBrief, "consent" | "summaryConfirmed">)[];
export type Qualification = { brief: ProjectBrief; summaryOffered: boolean };
export const emptyQualification: Qualification = {
  brief: { ...emptyBrief, heritage: "", preferredContact: "" },
  summaryOffered: false,
};
export const qualificationSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    changes: {
      type: "object",
      additionalProperties: false,
      properties: Object.fromEntries(
        briefKeys.map((k) => [k, { type: ["string", "null"] }]),
      ),
      required: briefKeys,
    },
    summaryOffered: { type: "boolean" },
    confirmationEvidence: { type: ["string", "null"] },
  },
  required: ["changes", "summaryOffered", "confirmationEvidence"],
};
export type QualificationUpdate = {
  changes: Partial<Record<(typeof briefKeys)[number], string | null>>;
  summaryOffered: boolean;
  confirmationEvidence: string | null;
};
export function parseUpdate(value: unknown): QualificationUpdate {
  if (!value || typeof value !== "object")
    throw Error("Invalid project details");
  const v = value as Record<string, unknown>;
  if (
    !v.changes ||
    typeof v.changes !== "object" ||
    Array.isArray(v.changes) ||
    typeof v.summaryOffered !== "boolean" ||
    !(
      v.confirmationEvidence === null ||
      typeof v.confirmationEvidence === "string"
    )
  )
    throw Error("Invalid project details");
  const changes: QualificationUpdate["changes"] = {};
  for (const [key, val] of Object.entries(v.changes)) {
    if (
      !briefKeys.includes(key as (typeof briefKeys)[number]) ||
      !(val === null || typeof val === "string") ||
      (typeof val === "string" && val.length > 2000)
    )
      throw Error("Invalid project details");
    changes[key as (typeof briefKeys)[number]] = val;
  }
  return {
    changes,
    summaryOffered: v.summaryOffered,
    confirmationEvidence: v.confirmationEvidence as string | null,
  };
}
export function applyQualification(
  previous: Qualification,
  update: QualificationUpdate,
  latestUserText: string,
): Qualification {
  const brief = { ...previous.brief, consent: false };
  let changed = false;
  for (const key of briefKeys) {
    const val = update.changes[key];
    if (typeof val === "string" && brief[key] !== val.trim()) {
      brief[key] = val.trim();
      changed = true;
    }
  }
  if (changed) brief.summaryConfirmed = false;
  const evidence = update.confirmationEvidence?.trim();
  if (
    !changed &&
    previous.summaryOffered &&
    evidence &&
    latestUserText.includes(evidence) &&
    hasBrief(brief)
  )
    brief.summaryConfirmed = true;
  return {
    brief,
    summaryOffered:
      update.summaryOffered || (!changed && previous.summaryOffered),
  };
}
export function hasBrief(brief: ProjectBrief) {
  return !!(
    brief.description.trim() ||
    brief.location.trim() ||
    brief.service.trim()
  );
}
export function readQualification(value: unknown): Qualification {
  if (!value || typeof value !== "object")
    return { ...emptyQualification, brief: { ...emptyQualification.brief } };
  const q = value as Partial<Qualification>;
  const brief = { ...emptyQualification.brief };
  if (q.brief && typeof q.brief === "object") {
    for (const key of briefKeys) {
      const v = q.brief[key];
      if (typeof v === "string" && v.length <= 2000) brief[key] = v.trim();
    }
    brief.summaryConfirmed = q.brief.summaryConfirmed === true;
  }
  return { brief, summaryOffered: q.summaryOffered === true };
}
