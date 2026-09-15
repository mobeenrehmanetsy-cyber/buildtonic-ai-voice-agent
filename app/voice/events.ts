import type { VoiceSnapshot } from "./model";
export function voiceEventState(
  snapshot: VoiceSnapshot,
  type: string,
): VoiceSnapshot {
  const phase = (
    {
      "session.created": "listening",
      "input_audio_buffer.speech_started": "user-speaking",
      "input_audio_buffer.speech_stopped": "assistant-thinking",
      "response.created": "assistant-thinking",
      "output_audio_buffer.started": "assistant-speaking",
      "output_audio_buffer.stopped": "listening",
      "output_audio_buffer.cleared": "listening",
    } as const
  )[type as "session.created"];
  if (!phase) return snapshot;
  return {
    ...snapshot,
    phase: snapshot.microphone === "muted" ? "muted" : phase,
  };
}
export function microphoneError(error: unknown) {
  const name = error instanceof Error ? error.name : "";
  if (name === "NotAllowedError" || name === "SecurityError")
    return "Microphone access was denied or blocked. You can keep chatting by text, or allow microphone access in your browser and try again.";
  if (
    name === "NotFoundError" ||
    name === "NotReadableError" ||
    name === "OverconstrainedError"
  )
    return "No available microphone was found. Check your device or continue by text.";
  return "Voice could not connect. Please try again or continue by text.";
}
export async function waitForIce(pc: RTCPeerConnection, signal: AbortSignal) {
  if (pc.iceGatheringState === "complete") return;
  await new Promise<void>((resolve, reject) => {
    const finish = (error?: Error) => {
      clearTimeout(timer);
      pc.removeEventListener("icegatheringstatechange", onState);
      signal.removeEventListener("abort", onAbort);
      if (error) reject(error);
      else resolve();
    };
    const onState = () => {
      if (pc.iceGatheringState === "complete") finish();
    };
    const onAbort = () => finish(new Error("Connection cancelled"));
    const timer = setTimeout(
      () => finish(new Error("Connection timed out")),
      8000,
    );
    pc.addEventListener("icegatheringstatechange", onState);
    signal.addEventListener("abort", onAbort, { once: true });
    if (signal.aborted) onAbort();
    else onState();
  });
}
