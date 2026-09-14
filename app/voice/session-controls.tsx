"use client";
import { voiceLabels, type VoiceSnapshot } from "./model";
// Reserved for actual adapter events in Phase 2; never mounted by the preview shell.
export function SessionControls({
  snapshot,
  onMute,
  onEnd,
}: {
  snapshot: VoiceSnapshot;
  onMute: (muted: boolean) => void;
  onEnd: () => void;
}) {
  const canMute =
    snapshot.microphone === "live" || snapshot.microphone === "muted";
  return (
    <div className="voice-session">
      <p role="status">{voiceLabels[snapshot.phase]}</p>
      <p>Microphone: {snapshot.microphone}</p>
      <div>
        <button
          disabled={!canMute}
          aria-pressed={snapshot.microphone === "muted"}
          onClick={() => onMute(snapshot.microphone !== "muted")}
        >
          {snapshot.microphone === "muted"
            ? "Unmute microphone"
            : "Mute microphone"}
        </button>
        <button onClick={onEnd}>End conversation</button>
      </div>
    </div>
  );
}
