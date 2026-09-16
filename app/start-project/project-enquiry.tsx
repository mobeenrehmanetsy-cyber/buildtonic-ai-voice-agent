"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { projects } from "../projects/data";
import { useAgentSession, setSession } from "../agent/session-store";
import { hasBrief, readQualification } from "../agent/qualification";
import { languages } from "../agent/conversation";
import {
  callConsentText,
  mergeProjectNotes,
  normalisePhone,
} from "../leads/model";
import { OpenAssistant } from "../components/open-assistant";
import { Arrow } from "../ui";
import {
  emptyBrief,
  formatBrief,
  isBuildingWork,
  needsListedConsent,
  services,
  type ProjectBrief,
} from "./model";
const steps = [
  "Your project",
  "Your plans",
  "Project status",
  "Budget & timing",
  "Contact",
  "AI call option",
  "Review",
];
const groups: (keyof ProjectBrief)[][] = [
  ["service", "property", "location", "postcode", "heritage"],
  ["description", "desiredOutcome", "size", "constraints"],
  ["drawings", "planning", "listedConsent"],
  ["budget", "timeline", "deadline"],
  [
    "name",
    "email",
    "phone",
    "preferredContact",
    "preferredLanguage",
    "preferredCallTime",
  ],
];
const labels: Partial<Record<keyof ProjectBrief, string>> = {
  service: "Project type",
  property: "Property type",
  location: "Project location",
  postcode: "Postcode",
  heritage: "Heritage status",
  description: "What you are planning",
  desiredOutcome: "Desired outcome",
  size: "Approximate size",
  constraints: "Existing conditions or constraints",
  drawings: "Drawings",
  planning: "Planning",
  listedConsent: "Listed Building Consent",
  budget: "Budget preference",
  timeline: "Desired start",
  deadline: "Important deadline",
  name: "Full name",
  email: "Email",
  phone: "Telephone",
  preferredContact: "Preferred contact",
  preferredLanguage: "Preferred language",
  preferredCallTime: "Best time to contact",
};
type Receipt = { leadId: string; message: string; status: string };
// Browser memory only: survives local navigation, clears on reload. Never used server-side.
let retained:
  | {
      brief: ProjectBrief;
      step: number;
      callChoice: boolean | null;
      requestId: string;
    }
  | undefined;
function retainDraft(value: typeof retained) {
  retained = value;
}
export function ProjectEnquiry() {
  const agent = useAgentSession();
  const query = useSearchParams();
  const reference = projects.find((p) => p.slug === query.get("project"));
  const [brief, setBrief] = useState<ProjectBrief>(
    () =>
      retained?.brief ?? {
        ...emptyBrief,
        heritage: "",
        referenceProject: reference?.title ?? "",
        service: reference
          ? reference.visual
            ? "New home"
            : reference.category.includes("Heritage")
              ? "Heritage or conservation"
              : "Extension or renovation"
          : "",
      },
  );
  const [step, setStep] = useState(retained?.step ?? 0);
  const [callChoice, setCallChoice] = useState<boolean | null>(
    retained?.callChoice ?? null,
  );
  const requestId = useRef(retained?.requestId ?? "");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [imported, setImported] = useState(false);
  const [conflicts, setConflicts] = useState<string[]>([]);
  const heading = useRef<HTMLHeadingElement>(null);
  const abort = useRef<AbortController | null>(null);
  useEffect(() => {
    retained = { brief, step, callChoice, requestId: requestId.current };
  }, [brief, step, callChoice]);
  useEffect(() => () => abort.current?.abort(), []);
  function update<K extends keyof ProjectBrief>(
    key: K,
    value: ProjectBrief[K],
  ) {
    setBrief((b) => ({
      ...b,
      [key]: value,
      ...(key !== "summaryConfirmed" ? { summaryConfirmed: false } : {}),
    }));
    if (key === "phone") setCallChoice(null);
    requestId.current = "";
    setNotice("");
  }
  function move(next: number) {
    setStep(next);
    setNotice("");
    requestAnimationFrame(() => {
      heading.current?.focus();
      heading.current?.scrollIntoView({ block: "start", behavior: "instant" });
    });
  }
  function next() {
    if (step === 0 && (!brief.location.trim() || !brief.service))
      return setNotice("Please choose a project type and add its location.");
    if (step === 1 && !brief.description.trim())
      return setNotice("A short description is enough to begin.");
    if (step === 4 && brief.phone && !normalisePhone(brief.phone))
      return setNotice(
        "Please check your telephone number. Include a country code for numbers outside the UK.",
      );
    if (step === 5 && callChoice === null)
      return setNotice(
        "Please choose whether an AI call is okay. No is absolutely fine.",
      );
    if (step === 5 && callChoice && !normalisePhone(brief.phone))
      return setNotice(
        "An AI call needs a valid telephone number. Go back to Contact to add it, or choose No.",
      );
    move(step + 1);
  }
  const field = (
    key: keyof ProjectBrief,
    label: string,
    options?: readonly string[],
    required = false,
    type = "text",
    placeholder = "",
  ) => (
    <label className="brief-field" key={key}>
      <span>
        {label}
        {required ? " *" : <small>Optional</small>}
      </span>
      {options ? (
        <select
          value={String(brief[key])}
          onChange={(e) => update(key, e.target.value)}
          required={required}
        >
          <option value="">Select an option</option>
          {brief[key] && !options.includes(String(brief[key])) && (
            <option>{String(brief[key])}</option>
          )}
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input
          value={String(brief[key])}
          onChange={(e) => update(key, e.target.value)}
          required={required}
          type={type}
          maxLength={key === "email" ? 254 : 160}
          placeholder={placeholder}
          autoComplete={
            (
              {
                name: "name",
                email: "email",
                phone: "tel",
                postcode: "postal-code",
              } as Record<string, string>
            )[key] ?? "off"
          }
          pattern={required && type === "text" ? ".*\\S.*" : undefined}
        />
      )}
    </label>
  );
  const area = (
    key: "description" | "desiredOutcome" | "constraints",
    label: string,
    required = false,
  ) => (
    <label className="brief-field full">
      <span>
        {label}
        {required ? " *" : <small>Optional</small>}
      </span>
      <textarea
        rows={4}
        value={brief[key]}
        onChange={(e) => update(key, e.target.value)}
        maxLength={2000}
        required={required}
      />
    </label>
  );
  async function submit() {
    if (busyRef.current) return;
    if (!brief.summaryConfirmed || !brief.consent || callChoice === null)
      return setNotice(
        "Please confirm the summary, privacy acknowledgement and your call preference.",
      );
    busyRef.current = true;
    setBusy(true);
    setNotice("");
    requestId.current ||= crypto.randomUUID();
    retainDraft({ brief, step, callChoice, requestId: requestId.current });
    const controller = new AbortController();
    abort.current = controller;
    try {
      const r = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project: brief,
          aiCallConsent: callChoice,
          requestId: requestId.current,
          website:
            (document.getElementById("enquiry-website") as HTMLInputElement)
              ?.value ?? "",
        }),
        signal: AbortSignal.any([
          controller.signal,
          AbortSignal.timeout(15000),
        ]),
      });
      const data = await r.json();
      if (!r.ok)
        throw Error(
          typeof data.error === "string"
            ? data.error
            : "Your enquiry could not be saved. Please retry.",
        );
      if (
        !["saved_locally", "received"].includes(data.status) ||
        typeof data.leadId !== "string"
      )
        throw Error(
          "The server could not confirm receipt. Please retry using this same draft.",
        );
      setReceipt(data);
      retainDraft(undefined);
    } catch (error) {
      if (!controller.signal.aborted)
        setNotice(
          error instanceof Error && error.name !== "TimeoutError"
            ? error.message
            : "Receipt was not confirmed. Retry this draft; the submission reference prevents duplicates.",
        );
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }
  function download() {
    const url = URL.createObjectURL(
      new Blob(
        [
          formatBrief(brief) +
            "\n\nAI call preference: " +
            (callChoice === true
              ? "Explicitly agreed"
              : callChoice === false
                ? "Declined"
                : "Not selected"),
        ],
        { type: "text/plain;charset=utf-8" },
      ),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "buildtonic-project-brief.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <section className="wrap brief-workspace">
      <aside className="brief-sidebar">
        <p className="eyebrow">Your project enquiry</p>
        <ol>
          {steps.map((s, i) => (
            <li key={s} aria-current={step === i ? "step" : undefined}>
              {i < step ? (
                <button type="button" onClick={() => move(i)}>
                  <span>0{i + 1}</span>
                  {s}
                  <span aria-hidden="true">✓</span>
                </button>
              ) : (
                <div>
                  <span>0{i + 1}</span>
                  {s}
                </div>
              )}
            </li>
          ))}
        </ol>
        <p>
          Your draft stays in this browser’s memory as you move around the site.
          Refreshing clears it. It is only sent when you submit.
        </p>
        <Link href="/privacy" target="_blank" className="text-link">
          How your information is used <Arrow />
        </Link>
      </aside>
      <form
        className="brief-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (step === 6) void submit();
          else next();
        }}
      >
        {receipt ? (
          <div className="intake-success" role="status">
            <p className="eyebrow">
              {receipt.status === "saved_locally"
                ? "Local review receipt"
                : "Enquiry received"}
            </p>
            <h2>Your idea, on record.</h2>
            <p>{receipt.message}</p>
            <p>
              Enquiry reference
              <br />
              <strong>{receipt.leadId}</strong>
            </p>
            <p>
              Keep this reference when contacting the team. No appointment,
              quotation or call is confirmed.
            </p>
            <button type="button" className="text-link" onClick={download}>
              Download your copy ↓
            </button>
          </div>
        ) : (
          <>
            <div className="intake-assist">
              <p>Prefer to talk it through?</p>
              <OpenAssistant />
              <button
                type="button"
                onClick={() => {
                  setSession({ qualification: readQualification({ brief }) });
                  window.dispatchEvent(new Event("buildtonic:open-assistant"));
                }}
              >
                Use this draft instead of the assistant’s notes ↗
              </button>
            </div>
            {!imported && hasBrief(agent.qualification.brief) && (
              <div className="agent-import">
                <p>
                  You have assistant notes. We’ll fill empty answers and let you
                  choose between any conflicting details.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const result = mergeProjectNotes(
                      brief,
                      agent.qualification.brief,
                    );
                    if (result.project.phone !== brief.phone)
                      setCallChoice(null);
                    setBrief(result.project);
                    setConflicts(result.conflicts);
                    setImported(true);
                    requestId.current = "";
                    setNotice(
                      "Notes added to empty fields. Existing answers have been preserved.",
                    );
                  }}
                >
                  Use assistant notes
                </button>
              </div>
            )}
            {conflicts.length > 0 && (
              <details className="intake-conflicts" open>
                <summary>Review {conflicts.length} different answers</summary>
                {conflicts.map((k) => {
                  const key = k as keyof ProjectBrief;
                  return (
                    <label key={k}>
                      {labels[key] ?? k}
                      <select
                        value="keep"
                        onChange={(e) => {
                          if (e.target.value === "replace")
                            update(key, agent.qualification.brief[key]);
                          setConflicts((c) => c.filter((v) => v !== k));
                        }}
                      >
                        <option value="keep">
                          Current: {String(brief[key])}
                        </option>
                        <option value="replace">
                          Assistant: {String(agent.qualification.brief[key])}
                        </option>
                        <option value="confirm">Keep my current answer</option>
                      </select>
                    </label>
                  );
                })}
              </details>
            )}
            <div className="brief-step-label">
              <span>
                0{step + 1} / 07 · {steps[step]}
              </span>
              <span>* Required</span>
            </div>
            <progress
              className="intake-progress"
              aria-label="Enquiry progress"
              max={7}
              value={step + 1}
            />
            <h2 ref={heading} tabIndex={-1}>
              {
                [
                  "A little about your project.",
                  "What are you imagining?",
                  "How far have you got?",
                  "Your budget. Your timing.",
                  "Let’s keep in touch.",
                  "A conversation, your choice.",
                  "Your idea, in one place.",
                ][step]
              }
            </h2>
            <p className="brief-step-intro">
              {
                [
                  "Start with what you know. Not sure is always a useful answer.",
                  "A few sentences are enough. Tell us what you want to change and why.",
                  "No technical expertise needed. Skip anything you have not explored yet.",
                  "These are your intentions, not Buildtonic prices or promised dates.",
                  "Choose how you would like the team to respond to your enquiry.",
                  "An optional AI call can clarify a few project details before a human review.",
                  "Check each section. Nothing has been sent yet.",
                ][step]
              }
            </p>
            {brief.referenceProject && (
              <p className="brief-reference">
                Inspired by {brief.referenceProject}
              </p>
            )}
            <label className="intake-honeypot" aria-hidden="true">
              Leave this empty
              <input id="enquiry-website" tabIndex={-1} autoComplete="off" />
            </label>
            <div className="brief-fields">
              {step === 0 && (
                <>
                  {field("service", "Project type", services, true)}
                  {field("property", "Property type", [
                    "Detached house",
                    "Semi-detached or terraced house",
                    "Flat or apartment",
                    "Cottage or period home",
                    "Community or other building",
                    "Plot for a new home",
                    "Not sure",
                  ])}
                  {field(
                    "location",
                    "Project location",
                    undefined,
                    true,
                    "text",
                    "e.g. Farnham, Surrey",
                  )}
                  {field(
                    "postcode",
                    "Postcode",
                    undefined,
                    false,
                    "text",
                    "e.g. GU9 7EQ",
                  )}
                  {field(
                    "heritage",
                    "Heritage status",
                    [
                      "Listed",
                      "Period or heritage, not known to be listed",
                      "Not listed / no known heritage status",
                      "Unsure",
                    ],
                    true,
                  )}
                </>
              )}
              {step === 1 && (
                <>
                  {area("description", "What are you planning?", true)}
                  {area(
                    "desiredOutcome",
                    "What would a successful project give you?",
                  )}
                  {isBuildingWork(brief) &&
                    field("size", "Approximate size or rooms")}
                  {area(
                    "constraints",
                    "Anything about the building we should know?",
                  )}
                  <p className="field-note full">
                    For example: access, damp, existing damage or living there
                    during the work.
                  </p>
                </>
              )}
              {step === 2 && (
                <>
                  {field("drawings", "Do you have drawings?", [
                    "Yes",
                    "In progress",
                    "No",
                    "Not sure",
                    "Not applicable",
                  ])}
                  {field("planning", "Planning status", [
                    "Approved",
                    "Submitted",
                    "Required",
                    "Not started",
                    "Not sure",
                    "Not applicable",
                  ])}
                  {needsListedConsent(brief) &&
                    field("listedConsent", "Listed Building Consent", [
                      "Approved",
                      "Submitted",
                      "Required",
                      "Not sure",
                      "Not applicable",
                    ])}
                  <p className="field-note full">
                    The team would need to review the project before advising
                    what permission or consent is required.
                  </p>
                </>
              )}
              {step === 3 && (
                <>
                  {field("budget", "Approximate budget range", [
                    "Not sure yet",
                    "Prefer to discuss",
                    "Under £50,000",
                    "£50,000–£100,000",
                    "£100,000–£250,000",
                    "£250,000–£500,000",
                    "£500,000–£1 million",
                    "Over £1 million",
                  ])}
                  {field("timeline", "Desired start", [
                    "As soon as practical",
                    "Within 3 months",
                    "3–6 months",
                    "6–12 months",
                    "More than a year",
                    "Flexible / not sure",
                  ])}
                  {field("deadline", "Any important deadline?")}
                </>
              )}
              {step === 4 && (
                <>
                  {field("name", "Full name", undefined, true)}
                  {field("email", "Email address", undefined, true, "email")}
                  {field(
                    "phone",
                    "Telephone number",
                    undefined,
                    brief.preferredContact === "Telephone",
                    "tel",
                    "UK number or international +country code",
                  )}
                  {field(
                    "preferredContact",
                    "Preferred contact",
                    ["Email", "Telephone"],
                    true,
                  )}
                  <label className="brief-field">
                    <span>Preferred language</span>
                    <select
                      value={brief.preferredLanguage}
                      onChange={(e) =>
                        update("preferredLanguage", e.target.value)
                      }
                    >
                      {languages.map(([code, label]) => (
                        <option key={code} value={code}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  {field(
                    "preferredCallTime",
                    "Best time to contact",
                    undefined,
                    false,
                    "text",
                    "e.g. Weekday evenings, UK time",
                  )}
                </>
              )}
              {step === 5 && (
                <fieldset className="intake-call-options full">
                  <legend>
                    Would you like Buildtonic’s AI project assistant to call
                    you?
                  </legend>
                  <p>
                    Telephone AI is not connected yet. You can record your
                    preference now; no call is scheduled or promised. Declining
                    does not prevent a normal enquiry.
                  </p>
                  <label>
                    <input
                      type="radio"
                      name="ai-call"
                      checked={callChoice === true}
                      onChange={() => {
                        setCallChoice(true);
                        requestId.current = "";
                      }}
                      required
                    />
                    <span>
                      Yes, an AI call is okay.
                      <br />
                      <small>{callConsentText}</small>
                    </span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="ai-call"
                      checked={callChoice === false}
                      onChange={() => {
                        setCallChoice(false);
                        requestId.current = "";
                      }}
                      required
                    />
                    <span>No, contact me normally.</span>
                  </label>
                </fieldset>
              )}
              {step === 6 && (
                <div className="full">
                  {groups.map((keys, i) => (
                    <section className="intake-review-section" key={steps[i]}>
                      <div>
                        <h3>{steps[i]}</h3>
                        <button
                          type="button"
                          onClick={() => move(i)}
                          aria-label={`Edit ${steps[i]}`}
                        >
                          Edit ↗
                        </button>
                      </div>
                      <dl>
                        {keys
                          .filter((k) => k !== "size" || isBuildingWork(brief))
                          .filter(
                            (k) =>
                              k !== "listedConsent" ||
                              needsListedConsent(brief),
                          )
                          .map((k) => (
                            <div key={k}>
                              <dt>{labels[k]}</dt>
                              <dd>{String(brief[k]) || "Not specified"}</dd>
                            </div>
                          ))}
                      </dl>
                    </section>
                  ))}
                  <section className="intake-review-section">
                    <div>
                      <h3>AI call preference</h3>
                      <button type="button" onClick={() => move(5)}>
                        Edit call preference ↗
                      </button>
                    </div>
                    <p>
                      {callChoice === true
                        ? "Explicitly agreed to an AI call about this enquiry. No call is scheduled."
                        : callChoice === false
                          ? "No AI call. Normal contact only."
                          : "Not yet selected."}
                    </p>
                  </section>
                  <label className="brief-consent">
                    <input
                      type="checkbox"
                      required
                      checked={brief.summaryConfirmed}
                      onChange={(e) =>
                        update("summaryConfirmed", e.target.checked)
                      }
                    />
                    <span>
                      I have checked this summary and confirm it reflects my
                      enquiry. *
                    </span>
                  </label>
                  <label className="brief-consent">
                    <input
                      type="checkbox"
                      required
                      checked={brief.consent}
                      onChange={(e) =>
                        setBrief((b) => ({ ...b, consent: e.target.checked }))
                      }
                    />
                    <span>
                      I have read the{" "}
                      <Link href="/privacy" target="_blank">
                        privacy notice (opens in a new tab)
                      </Link>{" "}
                      and agree to these details being used to respond to my
                      enquiry. *
                    </span>
                  </label>
                  <p className="field-note">
                    Submit sends the brief to this website’s server. We will
                    only show a receipt after it confirms storage. An AI call is
                    a separate, optional request.
                  </p>
                  <button
                    type="button"
                    className="text-link"
                    onClick={download}
                  >
                    Download a copy ↓
                  </button>
                </div>
              )}
            </div>
            <p className="brief-status" role="status">
              {notice}
            </p>
            <div className="brief-actions">
              {step > 0 ? (
                <button
                  type="button"
                  className="text-link"
                  disabled={busy}
                  onClick={() => move(step - 1)}
                >
                  ← Back
                </button>
              ) : (
                <span />
              )}
              <button
                type="submit"
                className="button button-dark"
                disabled={busy}
              >
                {busy
                  ? "Saving your enquiry…"
                  : step === 6
                    ? "Submit enquiry"
                    : step === 5
                      ? "Review your enquiry"
                      : "Continue"}
                <Arrow />
              </button>
            </div>
          </>
        )}
      </form>
    </section>
  );
}
