import test from "node:test";
import assert from "node:assert/strict";
import { BrowserRealtime } from "../app/voice/realtime.ts";
import { voiceEventState, microphoneError } from "../app/voice/events.ts";
const payload = {
  context: { pathname: "/" },
  language: "en-GB",
  messages: [],
  qualification: {},
};
function setup(t, media) {
  const saved = new Map();
  const set = (k, v) => {
    saved.set(k, Object.getOwnPropertyDescriptor(globalThis, k));
    Object.defineProperty(globalThis, k, {
      value: v,
      writable: true,
      configurable: true,
    });
  };
  const states = [],
    messages = [],
    pcs = [];
  const track = {
    enabled: true,
    stops: 0,
    stop() {
      this.stops++;
    },
    onended: null,
  };
  const stream = { getTracks: () => [track], getAudioTracks: () => [track] };
  class Peer extends EventTarget {
    constructor() {
      super();
      pcs.push(this);
      this.iceGatheringState = "complete";
      this.connectionState = "new";
    }
    createDataChannel() {
      this.channel = {
        readyState: "open",
        send() {},
        close() {
          this.closed = true;
        },
      };
      return this.channel;
    }
    addTrack() {}
    async createOffer() {
      return { type: "offer", sdp: "v=0\r\nTEST OFFER" };
    }
    async setLocalDescription(d) {
      this.localDescription = d;
    }
    async setRemoteDescription() {
      this.remoteSet = true;
    }
    close() {
      this.closed = true;
    }
  }
  class Audio {
    play() {
      return Promise.resolve();
    }
    pause() {
      this.paused = true;
    }
    remove() {}
  }
  set("window", { isSecureContext: true });
  set("navigator", {
    mediaDevices: { getUserMedia: media ?? (async () => stream) },
  });
  set("RTCPeerConnection", Peer);
  set("Audio", Audio);
  set("fetch", async () => Response.json({ sdp: "v=0\r\nTEST ANSWER" }));
  t.after(() => {
    for (const [k, d] of saved) {
      if (d) Object.defineProperty(globalThis, k, d);
      else delete globalThis[k];
    }
  });
  const adapter = new BrowserRealtime({
    state: (s) => states.push(s),
    message: (m) => messages.push(m),
    qualification: () => ({ submitted: false }),
    notice: () => {},
  });
  t.after(() => adapter.dispose());
  return {
    adapter,
    states,
    messages,
    pcs,
    track,
    stream,
    event(e) {
      pcs.at(-1).channel.onmessage({ data: JSON.stringify(e) });
    },
  };
}
test("no microphone request without explicit activation", async (t) => {
  let count = 0;
  const { adapter } = setup(t, async () => {
    count++;
    throw Error();
  });
  assert.equal(count, 0);
  await assert.rejects(
    adapter.connect({ activatedByUser: false, payload }),
    /explicit/,
  );
  assert.equal(count, 0);
});
test("denied microphone becomes recoverable error with microphone off", async (t) => {
  const { adapter, states } = setup(t, async () => {
    throw new DOMException("TEST DENIAL", "NotAllowedError");
  });
  await adapter.connect({ activatedByUser: true, payload });
  assert.equal(states.at(-1).phase, "error");
  assert.equal(states.at(-1).microphone, "off");
  assert.match(states.at(-1).error, /denied/);
});
test("end while permission pending stops a late stream and prevents a connection", async (t) => {
  let resolve;
  const pending = new Promise((r) => (resolve = r));
  const { adapter, stream, track, pcs, states } = setup(t, () => pending);
  const connecting = adapter.connect({ activatedByUser: true, payload });
  adapter.end();
  resolve(stream);
  await connecting;
  assert.equal(track.stops, 1);
  assert.equal(pcs.length, 0);
  assert.equal(states.at(-1).phase, "ended");
});
test("one session only, actual mute tracks, cleanup and event states", async (t) => {
  const s = setup(t);
  await s.adapter.connect({ activatedByUser: true, payload });
  await s.adapter.connect({ activatedByUser: true, payload });
  assert.equal(s.pcs.length, 1);
  s.adapter.setMuted(true);
  s.adapter.setMuted(false);
  assert.equal(s.states.at(-1).phase, "connecting");
  s.event({ type: "session.created" });
  assert.equal(s.states.at(-1).phase, "listening");
  s.event({ type: "input_audio_buffer.speech_started" });
  assert.equal(s.states.at(-1).phase, "user-speaking");
  s.adapter.setMuted(true);
  assert.equal(s.track.enabled, false);
  s.event({ type: "output_audio_buffer.started" });
  assert.equal(s.states.at(-1).phase, "muted");
  s.adapter.setMuted(false);
  assert.equal(s.track.enabled, true);
  s.adapter.end();
  assert.equal(s.track.stops, 1);
  assert.equal(s.pcs[0].closed, true);
  assert.equal(s.pcs[0].channel.closed, true);
  assert.equal(s.pcs[0].channel.onmessage, null);
  assert.equal(s.states.at(-1).phase, "ended");
});
test("network and malformed events stop capture safely", async (t) => {
  const s = setup(t);
  await s.adapter.connect({ activatedByUser: true, payload });
  s.pcs[0].channel.onmessage({ data: "not json" });
  assert.equal(s.states.at(-1).phase, "error");
  assert.equal(s.track.stops, 1);
});
test("transcript events carry actual received text and interrupted output is marked", async (t) => {
  const s = setup(t);
  await s.adapter.connect({ activatedByUser: true, payload });
  s.event({ type: "session.created" });
  s.event({
    type: "conversation.item.input_audio_transcription.completed",
    item_id: "u",
    transcript: "TEST USER AUDIO",
  });
  s.event({
    type: "response.output_audio_transcript.delta",
    item_id: "a",
    delta: "TEST AUDIO REPLY",
  });
  s.event({ type: "output_audio_buffer.cleared" });
  assert.equal(s.messages[0].text, "TEST USER AUDIO");
  assert.equal(s.messages.at(-1).interrupted, true);
});
test("voice event state cannot unmute a muted microphone", () => {
  assert.deepEqual(
    voiceEventState(
      { phase: "muted", microphone: "muted" },
      "response.created",
    ),
    { phase: "muted", microphone: "muted" },
  );
  assert.match(
    microphoneError(new DOMException("TEST", "NotFoundError")),
    /No available microphone/,
  );
});

test("malformed response output cleans up without throwing", async (t) => {
  const s = setup(t);
  await s.adapter.connect({ activatedByUser: true, payload });
  s.event({ type: "session.created" });
  assert.doesNotThrow(() => s.event({ type: "response.done", response: { output: {} } }));
  assert.equal(s.states.at(-1).phase, "error");
  assert.equal(s.track.stops, 1);
});

test("audio playback failure stops the microphone and connection", async (t) => {
  const s = setup(t);
  t.mock.method(Audio.prototype, "play", async () => { throw Error("TEST PLAYBACK FAILURE"); });
  await s.adapter.connect({ activatedByUser: true, payload });
  s.pcs[0].ontrack({ streams: [s.stream] });
  await Promise.resolve();
  assert.equal(s.states.at(-1).phase, "error");
  assert.match(s.states.at(-1).error, /playback/);
  assert.equal(s.track.stops, 1);
  assert.equal(s.pcs[0].closed, true);
});

test("setup timeout stops a late permission stream", async (t) => {
  let resolve;
  const s = setup(t, () => new Promise((r) => { resolve = r; }));
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const connecting = s.adapter.connect({ activatedByUser: true, payload });
  t.mock.timers.tick(30001);
  assert.match(s.states.at(-1).error, /timed out/);
  resolve(s.stream);
  await connecting;
  assert.equal(s.track.stops, 1);
  assert.equal(s.pcs.length, 0);
});

test("ending during session fetch ignores a late SDP answer", async (t) => {
  const s = setup(t);
  let resolve;
  t.mock.method(globalThis, "fetch", () => new Promise((r) => { resolve = r; }));
  const connecting = s.adapter.connect({ activatedByUser: true, payload });
  while (!resolve) await Promise.resolve();
  s.adapter.end();
  resolve(Response.json({ sdp: "v=0\r\nTEST ANSWER" }));
  await connecting;
  assert.equal(s.pcs[0].remoteSet, undefined);
  assert.equal(s.track.stops, 1);
  assert.equal(s.states.at(-1).phase, "ended");
});

test("user turn is reserved before a delayed transcript arrives", async (t) => {
  const s = setup(t);
  await s.adapter.connect({ activatedByUser: true, payload });
  s.event({ type: "session.created" });
  s.event({ type: "input_audio_buffer.committed", item_id: "u" });
  s.event({ type: "response.output_audio_transcript.delta", item_id: "a", delta: "TEST" });
  s.event({ type: "conversation.item.input_audio_transcription.completed", item_id: "u", transcript: "TEST USER" });
  assert.equal(s.messages[0].text, "");
  assert.equal(s.messages[0].id, s.messages[2].id);
});
