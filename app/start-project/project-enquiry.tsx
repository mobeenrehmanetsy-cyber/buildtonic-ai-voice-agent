"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { projects } from "../projects/data";
import { useAgentSession } from "../agent/session-store";
import { briefKeys, hasBrief } from "../agent/qualification";
import { Arrow } from "../ui";
import {
  briefRows,
  emptyBrief,
  formatBrief,
  isBuildingWork,
  needsListedConsent,
  services,
  type ProjectBrief,
} from "./model";
const steps = [
  "The idea",
  "The place",
  "Your plans",
  "About you",
  "Review & share",
];
export function ProjectEnquiry() {
  const agentSession = useAgentSession();
  const [imported, setImported] = useState(false);
  const query = useSearchParams();
  const reference = projects.find((p) => p.slug === query.get("project"));
  const [brief, setBrief] = useState<ProjectBrief>(() => ({
    ...emptyBrief,
    referenceProject: reference?.title ?? "",
    service: reference
      ? reference.visual
        ? "New home"
        : reference.category.includes("Heritage")
          ? "Heritage or conservation"
          : "Extension or renovation"
      : "",
  }));
  const [step, setStep] = useState(0);
  const [notice, setNotice] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  function update<K extends keyof ProjectBrief>(
    key: K,
    value: ProjectBrief[K],
  ) {
    setBrief((b) => ({ ...b, [key]: value }));
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
  const field = (
    key: keyof ProjectBrief,
    label: string,
    options?: string[],
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
            <option value={String(brief[key])}>{String(brief[key])}</option>
          )}
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={String(brief[key])}
          onChange={(e) => update(key, e.target.value)}
          required={required}
          maxLength={key === "email" ? 254 : 160}
          autoComplete={
            {
              name: "name",
              email: "email",
              phone: "tel",
              location: "postal-code",
            }[key as string] ?? "off"
          }
          placeholder={placeholder}
          pattern={
            required && (type === "text" || type === "tel")
              ? ".*\\S.*"
              : undefined
          }
        />
      )}
    </label>
  );
  const area = (
    key: "description" | "constraints" | "desiredOutcome",
    label: string,
    required = false,
  ) => (
    <label className="brief-field full">
      <span>
        {label}
        {required ? " *" : <small>Optional</small>}
      </span>
      <textarea
        value={brief[key]}
        onChange={(e) => update(key, e.target.value)}
        required={required}
        maxLength={key === "description" ? 2000 : 1000}
        rows={5}
      />
    </label>
  );
  function download() {
    const url = URL.createObjectURL(
      new Blob([formatBrief(brief)], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "buildtonic-project-brief.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice(
      "Your brief has been prepared as a download. Nothing has been sent to Buildtonic. Attach the file to an email when you are ready.",
    );
  }
  return (
    <section className="wrap brief-workspace">
      <aside className="brief-sidebar">
        <p className="eyebrow">Your project brief</p>
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
          Your answers stay in this page’s memory. Nothing is saved online.
          Leaving or refreshing clears your brief.
        </p>
        <Link
          href="/privacy"
          target="_blank"
          className="text-link"
          aria-label="How your information is used (opens in a new tab)"
        >
          How your information is used <Arrow />
        </Link>
      </aside>
      <form
        className="brief-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (step === 0 && !brief.description.trim()) {
            setNotice("Please describe what you would like to achieve.");
            return;
          }
          move(Math.min(step + 1, 4));
        }}
      >
        {!imported && hasBrief(agentSession.qualification.brief) && (
          <div className="agent-import">
            <p>
              You have project notes from the AI assistant. Importing fills the
              matching fields below; please check them before sharing.
            </p>
            <button
              type="button"
              onClick={() => {
                setBrief((current) => {
                  const next = {
                    ...current,
                    consent: false,
                    summaryConfirmed: false,
                  };
                  for (const key of briefKeys) {
                    const value = agentSession.qualification.brief[key];
                    if (value.trim()) next[key] = value;
                  }
                  return next;
                });
                setImported(true);
                setStep(0);
                setNotice(
                  "Assistant notes added to this draft. Please review the details; nothing has been submitted.",
                );
              }}
            >
              Use assistant notes
            </button>
          </div>
        )}
        <div className="brief-step-label">
          <span>0{step + 1} / 05</span>
          <span>{step === 4 ? "Ready to review" : "* Required fields"}</span>
        </div>
        <h2 ref={heading} tabIndex={-1}>
          {
            [
              "What do you have in mind?",
              "Tell us about the place.",
              "How far have you got?",
              "Who are we talking to?",
              "Your idea, in one place.",
            ][step]
          }
        </h2>
        <p className="brief-step-intro">
          {
            [
              "A clear starting point is enough. You do not need a finished specification.",
              "The building and its location help shape the right conversation.",
              "Early ideas and approved plans are both welcome. Skip anything you do not know.",
              "Choose how you would like the team to respond when you send your brief.",
              "Check your answers below. You can go back and change any section before sharing.",
            ][step]
          }
        </p>
        {brief.referenceProject && (
          <p className="brief-reference">
            Inspired by {brief.referenceProject}
          </p>
        )}
        <div className="brief-fields">
          {step === 0 && (
            <>
              {field("service", "Type of project", services, true)}
              {area("description", "What would you like to achieve?", true)}
              {imported && area("desiredOutcome", "Your desired outcome")}
            </>
          )}
          {step === 1 && (
            <>
              {field(
                "location",
                "Project postcode or location",
                undefined,
                true,
                "text",
                "e.g. GU9 or Farnham, Surrey",
              )}
              {field("property", "Property type", [
                "Detached house",
                "Semi-detached or terraced house",
                "Flat or apartment",
                "Cottage or period home",
                "Community or other building",
                "Plot for a new home",
                "Not yet decided",
              ])}
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
              {isBuildingWork(brief) &&
                field(
                  "size",
                  "Approximate size or rooms",
                  undefined,
                  false,
                  "text",
                  "e.g. two-storey extension or whole house",
                )}
            </>
          )}
          {step === 2 && (
            <>
              {field("drawings", "Drawings", [
                "No drawings yet",
                "Early sketches or ideas",
                "Architect appointed",
                "Detailed drawings available",
                "Not applicable",
              ])}
              {field("planning", "Planning status", [
                "Not explored yet",
                "Advice being sought",
                "Application in progress",
                "Permission granted",
                "Believed not required",
                "Not applicable",
              ])}
              {needsListedConsent(brief) &&
                field("listedConsent", "Listed Building Consent", [
                  "Unsure whether needed",
                  "Advice being sought",
                  "Application in progress",
                  "Consent granted",
                  "Not applicable",
                ])}
              {field("budget", "Approximate budget", [
                "Still exploring",
                "Prefer to discuss",
                "Under £50,000",
                "£50,000–£100,000",
                "£100,000–£250,000",
                "£250,000–£500,000",
                "£500,000–£1 million",
                "Over £1 million",
              ])}
              <p className="field-note full">
                Budget ranges describe your intentions; they are not Buildtonic
                prices or estimates.
              </p>
              {field("timeline", "Ideal timing", [
                "As soon as practical",
                "Within 3 months",
                "3–6 months",
                "6–12 months",
                "More than a year",
                "Flexible / still exploring",
              ])}
              {area("constraints", "Anything else we should know?")}
              <p className="field-note full">
                For example: access, occupancy during work, advisers or a
                particular building concern.
              </p>
            </>
          )}
          {step === 3 && (
            <>
              {field("name", "Your name", undefined, true)}
              {field("email", "Email address", undefined, true, "email")}
              {field(
                "preferredContact",
                "Preferred contact",
                ["Email", "Telephone"],
                true,
              )}
              {field(
                "phone",
                "Telephone number",
                undefined,
                brief.preferredContact === "Telephone",
                "tel",
              )}
              <label className="brief-consent full">
                <input
                  type="checkbox"
                  checked={brief.consent}
                  onChange={(e) => update("consent", e.target.checked)}
                  required
                />
                <span>
                  I have read the{" "}
                  <Link href="/privacy" target="_blank">
                    privacy notice (opens in a new tab)
                  </Link>{" "}
                  and agree to share these details with Buildtonic for this
                  enquiry when I send my email or brief. *
                </span>
              </label>
            </>
          )}
          {step === 4 && (
            <>
              <dl className="brief-review full">
                {briefRows(brief).map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="brief-delivery full">
                <h3>Your brief is ready. It has not been sent.</h3>
                <p>
                  Open a draft in your email application, check it and send it
                  yourself. If your email application cannot open a long draft,
                  download the brief and attach it to an email to
                  team@buildtonic.co.uk.
                </p>
                <a
                  className="button button-dark"
                  href={`mailto:team@buildtonic.co.uk?subject=${encodeURIComponent("Project enquiry" + (brief.referenceProject ? " · " + brief.referenceProject : ""))}&body=${encodeURIComponent(formatBrief(brief))}`}
                  onClick={() =>
                    setNotice(
                      "Email draft requested. Check your email application and press Send there. This website cannot confirm delivery.",
                    )
                  }
                >
                  Open email draft <Arrow />
                </a>
                <button type="button" className="text-link" onClick={download}>
                  Download your brief ↓
                </button>
              </div>
            </>
          )}
        </div>
        <p role="status" className="brief-status">
          {notice}
        </p>
        <div className="brief-actions">
          {step > 0 ? (
            <button
              type="button"
              className="text-link"
              onClick={() => move(step - 1)}
            >
              ← Back
            </button>
          ) : (
            <span />
          )}
          {step < 4 && (
            <button type="submit" className="button button-dark">
              {step === 3 ? "Review your brief" : "Continue"} <Arrow />
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
