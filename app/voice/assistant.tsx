"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  getPageContext,
  resolveLanguage,
  starters,
  type LanguagePreference,
} from "./model";

function Microphone() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
    >
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M6 10v2a6 6 0 0 0 12 0v-2M12 18v4m-3 0h6" />
    </svg>
  );
}
export function VoiceAssistant() {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const previousPath = useRef(pathname);
  const [open, setOpen] = useState(false);
  const [invited, setInvited] = useState(false);
  const [selected, setSelected] = useState<string>();
  const [notice, setNotice] = useState(false);
  const [language, setLanguage] = useState<LanguagePreference>({
    mode: "automatic",
    browserLanguages: [],
    resolvedLanguage: "en-GB",
  });
  const context = getPageContext(pathname, selected);
  const starter = starters.find((s) => s.id === selected);
  const close = () => {
    dialog.current?.close();
  };
  useEffect(() => {
    if (previousPath.current !== pathname) {
      dialog.current?.close();
      previousPath.current = pathname;
    }
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  function show() {
    setLanguage(
      resolveLanguage(
        navigator.languages?.length
          ? navigator.languages
          : [navigator.language || "en-GB"],
        language.manualLanguage,
      ),
    );
    setNotice(false);
    setOpen(true);
    dialog.current?.showModal();
  }
  return (
    <div
      className="voice-root"
      data-phase={open ? "open" : invited ? "invitation" : "idle"}
      data-page-type={context.pageType}
      data-page-id={context.identifier}
      data-starter={selected}
    >
      <button
        ref={launcher}
        className="voice-launcher"
        aria-label="Talk to Buildtonic — conversational assistant"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="buildtonic-assistant"
        onClick={show}
        onMouseEnter={() => setInvited(true)}
        onMouseLeave={() => setInvited(false)}
        onFocus={() => setInvited(true)}
        onBlur={() => setInvited(false)}
      >
        <span className="voice-invitation">Talk to Buildtonic</span>
        <span className="voice-orb">
          <Microphone />
        </span>
      </button>
      <dialog
        ref={dialog}
        id="buildtonic-assistant"
        className="voice-panel"
        aria-labelledby="voice-title"
        aria-describedby="voice-description"
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const controls = event.currentTarget.querySelectorAll<HTMLElement>(
            'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), [tabindex="0"]',
          );
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
        onClose={() => {
          setOpen(false);
          setInvited(false);
          launcher.current?.focus();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            const rect = event.currentTarget.getBoundingClientRect();
            if (
              event.clientX < rect.left ||
              event.clientX > rect.right ||
              event.clientY < rect.top ||
              event.clientY > rect.bottom
            )
              close();
          }
        }}
      >
        <div className="voice-panel-top">
          <div>
            <span className="voice-brand">
              BUILDTONIC<span>.</span>
            </span>
            <p>Conversational assistant</p>
          </div>
          <button
            className="voice-close"
            onClick={close}
            aria-label="Close assistant"
            autoFocus
          >
            ×
          </button>
        </div>
        <div className="voice-panel-body">
          <p className="eyebrow">A helpful place to begin</p>
          <h2 id="voice-title">
            How can we help
            <br />
            with your project?
          </h2>
          <p id="voice-description">
            Choose a topic to explore. Browser voice is being prepared and is
            not connected yet.
          </p>
          <fieldset className="voice-starters">
            <legend className="sr-only">Choose a project topic</legend>
            {starters.map((s) => (
              <label key={s.id} className={selected === s.id ? "selected" : ""}>
                <input
                  type="radio"
                  name="voice-topic"
                  value={s.id}
                  checked={selected === s.id}
                  onChange={() => {
                    setSelected(s.id);
                    setNotice(false);
                  }}
                />
                <span>{s.label}</span>
                <span aria-hidden="true">{selected === s.id ? "✓" : "+"}</span>
              </label>
            ))}
          </fieldset>
          {starter && (
            <div className="voice-suggestion">
              <span>While voice is being prepared</span>
              <Link href={starter.href} onClick={close}>
                {starter.linkLabel}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          )}
          <button
            className="voice-start"
            onClick={() => setNotice(true)}
            aria-describedby="voice-availability"
          >
            <Microphone />
            Start voice conversation<span aria-hidden="true">↗</span>
          </button>
          <p
            id="voice-availability"
            className="voice-availability"
            role="status"
          >
            {notice
              ? "Voice is not connected in this preview. Your microphone is off. Please explore the website or contact the team below."
              : "Coming soon · Microphone off"}
          </p>
          <div className="voice-panel-links">
            <Link href="/start-project" onClick={close}>
              Contact the team
            </Link>
            <Link href="/start-project#telephone" onClick={close}>
              Telephone options
            </Link>
          </div>
        </div>
        <div className="voice-panel-bottom">
          <span>English · Browser conversation</span>
          <span>No audio recorded</span>
        </div>
      </dialog>
    </div>
  );
}
