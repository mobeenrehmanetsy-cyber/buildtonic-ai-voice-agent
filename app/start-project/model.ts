// Shared, serialisable qualification shape for the form and future voice adapters.
export type ProjectBrief = {
  service: string;
  location: string;
  postcode: string;
  property: string;
  heritage: string;
  description: string;
  desiredOutcome: string;
  size: string;
  drawings: string;
  planning: string;
  listedConsent: string;
  budget: string;
  timeline: string;
  constraints: string;
  name: string;
  email: string;
  phone: string;
  preferredContact: string;
  preferredLanguage: string;
  preferredCallTime: string;
  deadline: string;
  consent: boolean;
  referenceProject: string;
  summaryConfirmed: boolean;
};
export const emptyBrief: ProjectBrief = {
  service: "",
  location: "",
  postcode: "",
  property: "",
  heritage: "Unsure",
  description: "",
  desiredOutcome: "",
  size: "",
  drawings: "",
  planning: "",
  listedConsent: "",
  budget: "",
  timeline: "",
  constraints: "",
  name: "",
  email: "",
  phone: "",
  preferredContact: "Email",
  preferredLanguage: "en-GB",
  preferredCallTime: "",
  deadline: "",
  consent: false,
  referenceProject: "",
  summaryConfirmed: false,
};
export const services = [
  "New home",
  "Extension",
  "Renovation",
  "Extension or renovation",
  "Heritage or conservation",
  "Consent coordination",
  "Survey or building concern",
  "Help me understand what I need",
];
export function needsListedConsent(b: ProjectBrief) {
  return (
    // Assistant notes may use natural wording such as "Grade II listed".
    // Keep the question for unknown/custom statuses instead of losing consent notes.
    !["Not listed / no known heritage status", "Period or heritage, not known to be listed"].includes(b.heritage) ||
    b.service === "Heritage or conservation" ||
    b.service === "Consent coordination"
  );
}
export function isBuildingWork(b: ProjectBrief) {
  return !["Survey or building concern", "Consent coordination"].includes(
    b.service,
  );
}
export function briefRows(b: ProjectBrief): [string, string][] {
  return [
    ["Project", b.service],
    ["Location", b.location],
    ["Postcode", b.postcode],
    ["Property", b.property],
    ["Heritage status", b.heritage],
    ["Your idea", b.description],
    ["Desired outcome", b.desiredOutcome],
    ...(isBuildingWork(b) ? [["Approximate size", b.size]] : []),
    ["Drawings", b.drawings],
    ["Planning", b.planning],
    ...(needsListedConsent(b)
      ? [["Listed Building Consent", b.listedConsent]]
      : []),
    ["Budget preference", b.budget],
    ["Timing", b.timeline],
    ["Important deadline", b.deadline],
    ["Known constraints", b.constraints],
    ["Name", b.name],
    ["Email", b.email],
    ["Telephone", b.phone],
    ["Preferred contact", b.preferredContact],
    ["Preferred language", b.preferredLanguage],
    ["Best time to contact", b.preferredCallTime],
    ["Project that inspired you", b.referenceProject],
  ].map(([label, value]) => [label, value.trim() || "Not specified"]);
}
export function formatBrief(b: ProjectBrief) {
  return (
    "BUILDTONIC / PROJECT ENQUIRY\n\n" +
    briefRows(b)
      .map(([k, v]) => `${k}\n${v}`)
      .join("\n\n") +
    "\n\nPrivacy acknowledgement: " +
    (b.consent
      ? "Agreed to sharing this brief with Buildtonic for this enquiry."
      : "Not agreed.")
  );
}
