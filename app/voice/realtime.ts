import type { VoiceSnapshot } from "./model";
import { microphoneError, voiceEventState, waitForIce } from "./events";
import { parseUpdate, type QualificationUpdate } from "../agent/qualification";
import type { ChatMessage } from "../agent/conversation";
export type VoicePayload = {
  context: unknown;
  language: string;
  messages: ChatMessage[];
  qualification: unknown;
};
type Hooks = {
  state: (state: VoiceSnapshot) => void;
  message: (message: ChatMessage) => void;
  qualification: (update: QualificationUpdate) => unknown;
  notice: (message: string) => void;
};
type Attempt = {
  id: number;
  abort: AbortController;
  pc?: RTCPeerConnection;
  channel?: RTCDataChannel;
  stream?: MediaStream;
  audio?: HTMLAudioElement;
  timer?: ReturnType<typeof setTimeout>;
  duration?: ReturnType<typeof setTimeout>;
  ready: boolean;
};
export class BrowserRealtime {
  private attempt?: Attempt;
  private generation = 0;
  private snapshot: VoiceSnapshot = { phase: "idle", microphone: "off" };
  private hooks: Hooks;
  private partials = new Map<string, ChatMessage>();
  private calls = new Set<string>();
  constructor(hooks: Hooks) {
    this.hooks = hooks;
  }
  private state(value: VoiceSnapshot) {
    this.snapshot = value;
    this.hooks.state(value);
  }
  private current(a: Attempt) {
    return this.attempt === a && !a.abort.signal.aborted;
  }
  private send(a: Attempt, event: unknown) {
    if (this.current(a) && a.channel?.readyState === "open")
      a.channel.send(JSON.stringify(event));
  }
  private cleanup() {
    const a = this.attempt;
    this.attempt = undefined;
    if (!a) return;
    a.abort.abort();
    clearTimeout(a.timer);
    clearTimeout(a.duration);
    a.stream?.getTracks().forEach((t) => {
      t.onended = null;
      t.stop();
    });
    if (a.channel) {
      a.channel.onopen = null;
      a.channel.onmessage = null;
      a.channel.onerror = null;
      a.channel.onclose = null;
      a.channel.close();
    }
    if (a.pc) {
      a.pc.ontrack = null;
      a.pc.onconnectionstatechange = null;
      a.pc.close();
    }
    if (a.audio) {
      a.audio.pause();
      a.audio.srcObject = null;
      a.audio.remove();
    }
    this.partials.clear();
    this.calls.clear();
  }
  private fail(message: string) {
    this.cleanup();
    this.state({ phase: "error", microphone: "off", error: message });
  }
  async connect(input: { activatedByUser: boolean; payload: VoicePayload }) {
    if (!input.activatedByUser)
      throw Error("Voice requires an explicit user action.");
    if (this.attempt) return;
    if (
      typeof window === "undefined" ||
      !window.isSecureContext ||
      !navigator.mediaDevices?.getUserMedia ||
      typeof RTCPeerConnection === "undefined"
    ) {
      this.fail(
        "Voice is unavailable in this browser. Use HTTPS or localhost in a supported browser, or continue by text.",
      );
      return;
    }
    const a: Attempt = {
      id: ++this.generation,
      abort: new AbortController(),
      ready: false,
    };
    this.attempt = a;
    this.state({ phase: "requesting-permission", microphone: "requesting" });
    a.timer = setTimeout(() => {
      if (this.current(a))
        this.fail(
          "Voice setup timed out. Your microphone is off. Please try again or use text.",
        );
    }, 30000);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
        video: false,
      });
      if (!this.current(a)) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      a.stream = stream;
      this.state({ phase: "connecting", microphone: "live" });
      const pc = new RTCPeerConnection();
      a.pc = pc;
      const audio = new Audio();
      a.audio = audio;
      audio.autoplay = true;
      pc.ontrack = (event) => {
        if (!this.current(a)) return;
        audio.srcObject = event.streams[0] ?? new MediaStream([event.track]);
        audio.play().catch(() => {
          if (this.current(a))
            this.fail(
              "Your browser blocked voice playback. Your microphone is off. Check audio permissions and retry, or use text.",
            );
        });
      };
      pc.onconnectionstatechange = () => {
        if (!this.current(a)) return;
        if (["failed", "disconnected", "closed"].includes(pc.connectionState))
          this.fail(
            "The voice connection was interrupted. Your microphone is off. Please reconnect or continue by text.",
          );
      };
      stream.getAudioTracks().forEach((track) => {
        track.onended = () => {
          if (this.current(a))
            this.fail(
              "The microphone disconnected. Please reconnect it or use text.",
            );
        };
        pc.addTrack(track, stream);
      });
      const channel = pc.createDataChannel("oai-events");
      a.channel = channel;
      channel.onmessage = (event) => {
        if (this.current(a)) this.event(a, event.data);
      };
      channel.onerror = () => {
        if (this.current(a))
          this.fail("The voice connection failed. Please retry or use text.");
      };
      channel.onclose = () => {
        if (this.current(a))
          this.fail(
            "The voice connection ended unexpectedly. Please retry or use text.",
          );
      };
      await pc.setLocalDescription(await pc.createOffer());
      await waitForIce(pc, a.abort.signal);
      if (!this.current(a)) return;
      const r = await fetch("/api/assistant/realtime", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...input.payload,
          sdp: pc.localDescription?.sdp,
        }),
        signal: a.abort.signal,
      });
      const data = await r.json();
      if (!this.current(a)) return;
      if (!r.ok) {
        this.fail(
          typeof data.error === "string"
            ? data.error
            : "Voice could not connect. Please use text.",
        );
        return;
      }
      if (typeof data.sdp !== "string" || !data.sdp.startsWith("v=0"))
        throw Error("Invalid voice response");
      await pc.setRemoteDescription({ type: "answer", sdp: data.sdp });
    } catch (error) {
      if (this.current(a)) this.fail(microphoneError(error));
    }
  }
  private event(a: Attempt, raw: unknown) {
    let e: Record<string, unknown>;
    try {
      if (typeof raw !== "string" || raw.length > 150000) throw Error();
      e = JSON.parse(raw);
      if (typeof e.type !== "string") throw Error();
    } catch {
      this.fail(
        "The voice service returned an unreadable event. Please reconnect or use text.",
      );
      return;
    }
    const type = e.type as string;
    if (type === "session.created") {
      if (a.ready) return;
      a.ready = true;
      clearTimeout(a.timer);
      a.duration = setTimeout(() => {
        if (this.current(a)) {
          this.end();
          this.hooks.notice(
            "This voice session reached the 10-minute preview limit. You can start another or use text.",
          );
        }
      }, 600000);
    }
    if (!a.ready && type !== "error") return;
    this.state(voiceEventState(this.snapshot, type));
    if (type === "error") {
      this.fail(
        "The voice service reported a problem. Please reconnect or continue by text.",
      );
      return;
    }
    if (type === "conversation.item.input_audio_transcription.failed") {
      this.hooks.notice(
        "A spoken turn could not be transcribed. Please repeat it or type the important details.",
      );
      return;
    }
    if (
      type === "input_audio_buffer.committed" &&
      typeof e.item_id === "string"
    ) {
      this.hooks.message({
        id: `voice-${a.id}-${e.item_id}`,
        role: "user",
        text: "",
        channel: "voice",
      });
    }
    if (
      type === "conversation.item.input_audio_transcription.completed" &&
      typeof e.transcript === "string" &&
      typeof e.item_id === "string"
    ) {
      this.hooks.message({
        id: `voice-${a.id}-${e.item_id}`,
        role: "user",
        text: e.transcript.slice(0, 4000),
        channel: "voice",
      });
    }
    if (
      [
        "response.output_audio_transcript.delta",
        "response.output_audio_transcript.done",
      ].includes(type) &&
      typeof e.item_id === "string"
    ) {
      const id = `voice-${a.id}-${e.item_id}`;
      const old = this.partials.get(id);
      const text = type.endsWith(".done")
        ? e.transcript
        : (old?.text ?? "") + String(e.delta ?? "");
      if (typeof text === "string" && text.trim()) {
        const message: ChatMessage = {
          id,
          role: "assistant",
          text: text.slice(0, 4000),
          channel: "voice",
        };
        this.partials.set(id, message);
        this.hooks.message(message);
      }
    }
    if (type === "output_audio_buffer.cleared") {
      const last = [...this.partials.values()].at(-1);
      if (last) this.hooks.message({ ...last, interrupted: true });
    }
    if (type === "response.done") {
      const response = e.response as
        | {
            status?: string;
            output?: {
              type?: string;
              name?: string;
              call_id?: string;
              arguments?: string;
            }[];
          }
        | undefined;
      if (
        !response ||
        typeof response !== "object" ||
        !Array.isArray(response.output) ||
        response.output.some((item) => !item || typeof item !== "object")
      ) {
        this.fail("The voice reply was unreadable. Please reconnect or use text.");
        return;
      }
      if (response?.status === "failed") {
        this.fail("The voice reply failed. Please reconnect or use text.");
        return;
      }
      let called = false;
      for (const item of response?.output ?? []) {
        if (
          item.type !== "function_call" ||
          typeof item.call_id !== "string" ||
          !item.call_id ||
          this.calls.has(item.call_id)
        )
          continue;
        this.calls.add(item.call_id);
        called = true;
        let result: unknown;
        try {
          if (
            item.name !== "update_project_brief" ||
            typeof item.arguments !== "string" ||
            item.arguments.length > 30000
          )
            throw Error();
          result = this.hooks.qualification(
            parseUpdate(JSON.parse(item.arguments)),
          );
        } catch {
          result = {
            error:
              "Invalid draft update. Nothing was changed. Ask the visitor to clarify.",
          };
          this.hooks.notice(
            "Some project details could not be added to the draft. Please check the brief.",
          );
        }
        this.send(a, {
          type: "conversation.item.create",
          item: {
            type: "function_call_output",
            call_id: item.call_id,
            output: JSON.stringify(result),
          },
        });
      }
      if (called) this.send(a, { type: "response.create" });
      else if (this.snapshot.phase === "assistant-thinking")
        this.state({
          ...this.snapshot,
          phase: this.snapshot.microphone === "muted" ? "muted" : "listening",
        });
    }
  }
  setMuted(muted: boolean) {
    const a = this.attempt;
    if (!a?.stream) return;
    a.stream.getAudioTracks().forEach((t) => {
      t.enabled = !muted;
    });
    if (muted) this.send(a, { type: "input_audio_buffer.clear" });
    this.state({
      ...this.snapshot,
      microphone: muted ? "muted" : "live",
      phase: muted ? "muted" : "listening",
    });
  }
  end() {
    if (this.attempt) {
      this.state({ ...this.snapshot, phase: "ending" });
      this.cleanup();
    }
    this.state({ phase: "ended", microphone: "off" });
  }
  dispose() {
    this.cleanup();
  }
}
