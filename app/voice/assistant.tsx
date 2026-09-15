"use client";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
const AssistantPanel = dynamic(() => import("./panel"), {
  ssr: false,
  loading: () => (
    <div className="ai-loading">
      <h2 id="voice-title">Buildtonic assistant</h2>
      <p role="status">Opening the assistant…</p>
    </div>
  ),
});
export function VoiceAssistant() {
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  const dialog = useRef<HTMLDialogElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [invited, setInvited] = useState(false);
  const close = () => dialog.current?.close();
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
  return (
    <div
      className="voice-root"
      data-phase={open ? "open" : invited ? "invitation" : "idle"}
    >
      <button
        ref={launcher}
        className="voice-launcher"
        aria-label="Talk to Buildtonic — AI assistant"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="buildtonic-assistant"
        onClick={() => {
          setOpen(true);
          dialog.current?.showModal();
        }}
        onMouseEnter={() => setInvited(true)}
        onMouseLeave={() => setInvited(false)}
        onFocus={() => setInvited(true)}
        onBlur={() => setInvited(false)}
      >
        <span className="voice-invitation">Ask Buildtonic · Text or voice</span>
        <span className="voice-orb">
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
        </span>
      </button>
      <dialog
        ref={dialog}
        id="buildtonic-assistant"
        className="voice-panel ai-panel"
        aria-labelledby="voice-title"
        onClose={() => {
          setOpen(false);
          setInvited(false);
          requestAnimationFrame(() => launcher.current?.focus());
        }}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const controls = [
            ...event.currentTarget.querySelectorAll<HTMLElement>(
              'button:not([disabled]),a[href],input:not([disabled]),textarea:not([disabled]),select:not([disabled]),summary,[tabindex="0"]',
            ),
          ].filter((e) => e.getClientRects().length);
          const first = controls[0],
            last = controls.at(-1);
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
      >
        <div className="voice-panel-top">
          <div>
            <span className="voice-brand">
              BUILDTONIC<span>.</span>
            </span>
            <p>AI project assistant · Text & voice</p>
          </div>
          <button
            autoFocus
            className="voice-close"
            aria-label="Close assistant"
            onClick={close}
          >
            ×
          </button>
        </div>
        {open && <AssistantPanel pathname={pathname} close={close} />}
      </dialog>
    </div>
  );
}
