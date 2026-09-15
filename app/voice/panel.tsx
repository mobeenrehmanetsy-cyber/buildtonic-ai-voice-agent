"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  boundedHistory,
  contextualStarters,
  languages,
  safeContext,
  safeHref,
} from "../agent/conversation";
import {
  applyQualification,
  hasBrief,
  readQualification,
} from "../agent/qualification";
import {
  getSession,
  putMessage,
  resetSession,
  setSession,
  useAgentSession,
} from "../agent/session-store";
import { briefRows } from "../start-project/model";
import { resolveLanguage, type VoiceSnapshot } from "./model";
import { SessionControls } from "./session-controls";
import type { BrowserRealtime } from "./realtime";
function Reply({ text }: { text: string }) {
  return text.split(/(\[[^\]]+\]\(\/[^)]+\))/g).map((part, i) => {
    const m = part.match(/^\[([^\]]+)\]\((\/[^)]+)\)$/);
    const href = m && safeHref(m[2]);
    return href ? (
      <Link key={i} href={href}>
        {m![1]}
      </Link>
    ) : (
      <span key={i}>{part}</span>
    );
  });
}
export default function AssistantPanel({
  pathname,
  close,
}: {
  pathname: string;
  close: () => void;
}) {
  const session = useAgentSession();
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [voice, setVoice] = useState<VoiceSnapshot>({
    phase: "idle",
    microphone: "off",
  });
  const [detected] = useState(
    () =>
      resolveLanguage(
        typeof navigator === "undefined"
          ? []
          : navigator.languages?.length
            ? navigator.languages
            : [navigator.language || "en-GB"],
        undefined,
        languages.map(([code]) => code),
      ).resolvedLanguage,
  );
  const controller = useRef<AbortController | null>(null);
  const realtime = useRef<BrowserRealtime | null>(null);
  const mounted = useRef(true);
  const voiceStarting = useRef(false);
  const voiceGeneration = useRef(0);
  const log = useRef<HTMLDivElement>(null);
  const follow = useRef(true);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const selectedStarter = useRef<string | undefined>(undefined);
  const language = session.manualLanguage ?? detected;
  const activeVoice = [
    "requesting-permission",
    "connecting",
    "listening",
    "user-speaking",
    "assistant-thinking",
    "assistant-speaking",
    "muted",
    "ending",
  ].includes(voice.phase);
  useEffect(() => {
    mounted.current = true;
    const stop = new AbortController();
    fetch("/api/assistant/status", { signal: stop.signal })
      .then((r) => r.json())
      .then((data) => {
        if (mounted.current) setConfigured(data.configured === true);
      })
      .catch(() => {});
    return () => {
      mounted.current = false;
      stop.abort();
      controller.current?.abort();
      realtime.current?.dispose();
    };
  }, []);
  useEffect(() => {
    if (follow.current && log.current)
      log.current.scrollTop = log.current.scrollHeight;
  }, [session.messages, busy, notice]);
  function endVoice() {
    voiceGeneration.current++;
    voiceStarting.current = false;
    realtime.current?.end();
    if (!realtime.current) setVoice({ phase: "ended", microphone: "off" });
  }
  async function send(question: string, retry = false, starterId?: string) {
    if (busy || !question.trim()) return;
    selectedStarter.current = starterId ?? selectedStarter.current;
    endVoice();
    setBusy(true);
    setError("");
    setNotice("");
    follow.current = true;
    const text = question.trim();
    if (!retry) {
      putMessage({
        id: crypto.randomUUID(),
        role: "user",
        text,
        channel: "text",
      });
      setInput("");
    }
    setSession({ pendingQuestion: text });
    const abort = new AbortController();
    controller.current = abort;
    try {
      const current = getSession();
      const r = await fetch("/api/assistant/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.any([abort.signal, AbortSignal.timeout(30000)]),
        body: JSON.stringify({
          messages: boundedHistory(current.messages),
          context: safeContext({
            pathname,
            selectedStarter: selectedStarter.current,
          }),
          language,
          qualification: current.qualification,
        }),
      });
      const data = await r.json();
      if (!mounted.current || abort.signal.aborted) return;
      if (!r.ok)
        throw Error(
          typeof data.error === "string"
            ? data.error
            : "The assistant could not reply. Please try again.",
        );
      if (
        typeof data.reply !== "string" ||
        !data.reply.trim() ||
        data.reply.length > 4000
      )
        throw Error("The reply was not readable. Please retry.");
      putMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        text: data.reply,
        channel: "text",
      });
      setSession({
        qualification: readQualification(data.qualification),
        pendingQuestion: undefined,
      });
      setConfigured(true);
    } catch (e) {
      if (mounted.current && !abort.signal.aborted)
        setError(
          e instanceof Error && e.name !== "TimeoutError"
            ? e.message
            : "The reply took too long. Please retry or contact the team.",
        );
    } finally {
      if (controller.current === abort) {
        if (mounted.current) setBusy(false);
        controller.current = null;
      }
    }
  }
  async function startVoice() {
    if (voiceStarting.current || activeVoice || busy) return;
    voiceStarting.current = true;
    setSession({ pendingQuestion: undefined });
    const generation = ++voiceGeneration.current;
    setError("");
    setNotice("");
    setVoice({ phase: "connecting", microphone: "off" });
    try {
      const { BrowserRealtime } = await import("./realtime");
      if (!mounted.current || generation !== voiceGeneration.current) return;
      const adapter = new BrowserRealtime({
        state: (s) => {
          if (mounted.current) setVoice(s);
        },
        message: (m) => putMessage(m),
        notice: setNotice,
        qualification: (update) => {
          const current = getSession();
          const lastUser =
            [...current.messages].reverse().find((m) => m.role === "user")
              ?.text ?? "";
          const qualification = applyQualification(
            current.qualification,
            update,
            lastUser,
          );
          setSession({ qualification });
          return { draft: qualification, submitted: false };
        },
      });
      realtime.current = adapter;
      const current = getSession();
      await adapter.connect({
        activatedByUser: true,
        payload: {
          messages: boundedHistory(current.messages),
          qualification: current.qualification,
          context: safeContext({ pathname }),
          language,
        },
      });
    } catch {
      if (mounted.current)
        setVoice({
          phase: "error",
          microphone: "off",
          error: "Voice could not load. Please use text or try again.",
        });
    } finally {
      if (generation === voiceGeneration.current) voiceStarting.current = false;
    }
  }
  function clear() {
    controller.current?.abort();
    endVoice();
    resetSession();
    setInput("");
    setBusy(false);
    setError("");
    setNotice("Conversation cleared from this page’s memory.");
  }
  const label = languages.find(([code]) => code === language)?.[1] ?? "English";
  return (
    <>
      <div className="ai-toolbar">
        <label>
          Language
          <select
            aria-label="Assistant language"
            value={session.manualLanguage ?? "automatic"}
            disabled={activeVoice}
            onChange={(e) =>
              setSession({
                manualLanguage:
                  e.target.value === "automatic" ? undefined : e.target.value,
              })
            }
          >
            <option value="automatic">
              Automatic ·{" "}
              {languages.find(([code]) => code === detected)?.[1] ?? "English"}
            </option>
            {languages.map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <button type="button" onClick={clear} disabled={busy}>
          Clear chat
        </button>
      </div>
      <div
        className="ai-log"
        ref={log}
        onScroll={() => {
          const e = log.current;
          if (e)
            follow.current = e.scrollHeight - e.scrollTop - e.clientHeight < 80;
        }}
        role="log"
        aria-label="Conversation with Buildtonic AI"
        aria-live="polite"
        aria-relevant="additions text"
        tabIndex={0}
      >
        <div className="ai-intro">
          <p className="eyebrow">A helpful place to begin</p>
          <h2 id="voice-title">
            Your project.
            <br />
            Let’s talk.
          </h2>
          <p>
            Type a question or talk to Buildtonic. You’re speaking with AI; the
            team confirms project advice.
          </p>
        </div>
        {configured === false && (
          <p className="ai-config">
            AI configuration is pending. The project brief and direct contact
            options are available.
          </p>
        )}
        {!session.messages.length && (
          <div className="ai-starters" aria-label="Suggested questions">
            {contextualStarters(pathname).map((s, i) => (
              <button
                key={s}
                disabled={busy}
                onClick={() => send(s, false, `context-${i}`)}
                data-starter={`starter-${i}`}
              >
                {s}
                <span aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
        )}
        {session.messages.map((m) => (
          <article key={m.id} className={`ai-message ai-${m.role}`} dir="auto">
            <p className="ai-message-label">
              {m.role === "user" ? "You" : "Buildtonic AI"}
              {m.channel === "voice" ? " · Voice transcript" : ""}
            </p>
            <div>
              {m.text ? <Reply text={m.text} /> : <small>Transcript not yet available.</small>}
            </div>
            {m.interrupted && (
              <small>
                Audio was interrupted; some text may not have been heard.
              </small>
            )}
          </article>
        ))}
        {busy && (
          <p className="ai-thinking" role="status">
            Considering your question…
          </p>
        )}
        {hasBrief(session.qualification.brief) && (
          <details className="ai-brief">
            <summary>
              Your project notes{" "}
              <span>
                {session.qualification.brief.summaryConfirmed
                  ? "Confirmed"
                  : "Review"}
              </span>
            </summary>
            <p>Draft only. Nothing has been sent to the team.</p>
            <dl>
              {briefRows(session.qualification.brief)
                .filter(([, v]) => v !== "Not specified")
                .map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
            </dl>
            <button
              type="button"
              onClick={() => {
                setSession({
                  qualification: {
                    ...session.qualification,
                    summaryOffered: true,
                    brief: {
                      ...session.qualification.brief,
                      summaryConfirmed: true,
                    },
                  },
                });
                setNotice(
                  "You confirmed these project notes. Nothing has been submitted.",
                );
              }}
              disabled={
                busy ||
                activeVoice ||
                session.qualification.brief.summaryConfirmed
              }
            >
              Confirm these notes
            </button>
            <Link href="/start-project" onClick={close}>
              Continue with the project brief →
            </Link>
            <p>
              Use “Use assistant notes” on the enquiry page to import this
              draft, then review and choose how to share it.
            </p>
          </details>
        )}
      </div>
      {(error || (!busy && session.pendingQuestion)) && (
        <div className="ai-error" role="alert">
          <p>{error || "This question has not received a reply yet."}</p>
          {session.pendingQuestion && (
            <button
              onClick={() => send(session.pendingQuestion!, true)}
              disabled={busy}
            >
              Retry question
            </button>
          )}
        </div>
      )}
      {notice && (
        <p className="ai-notice" role="status">
          {notice}
        </p>
      )}
      <div className="ai-voice" data-phase={voice.phase}>
        {activeVoice ? (
          <SessionControls
            snapshot={voice}
            onMute={(muted) => realtime.current?.setMuted(muted)}
            onEnd={endVoice}
          />
        ) : (
          <button
            className="ai-voice-start"
            onClick={startVoice}
            disabled={busy}
          >
            Talk to Buildtonic <span aria-hidden="true">↗</span>
          </button>
        )}
        {voice.error && <p role="alert">{voice.error}</p>}
        {voice.phase === "ended" && (
          <p role="status">Voice ended · Microphone off</p>
        )}
      </div>
      <form
        className="ai-composer"
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
      >
        <label className="sr-only" htmlFor="ai-question">
          Type a question
        </label>
        <textarea
          id="ai-question"
          ref={textarea}
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a question…"
          maxLength={3000}
          enterKeyHint="send"
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey &&
              !e.nativeEvent.isComposing
            ) {
              e.preventDefault();
              void send(input);
            }
          }}
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          aria-label="Send message"
        >
          ↑
        </button>
      </form>
      <p className="ai-input-help">
        {activeVoice
          ? "Sending a message ends voice and continues by text."
          : "Enter to send · Shift+Enter for a new line"}
      </p>
      <div className="ai-footer">
        <Link href="/start-project" onClick={close}>
          Project brief
        </Link>
        <a href="mailto:team@buildtonic.co.uk">Email</a>
        <a href="tel:+442081292694">Call the team</a>
        <Link href="/privacy" onClick={close}>
          Privacy
        </Link>
      </div>
      <p className="ai-privacy">
        {label} · Messages and activated voice are processed by OpenAI.
        Microphone access begins only when you choose voice.
      </p>
    </>
  );
}
