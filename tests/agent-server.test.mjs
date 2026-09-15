import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { POST as textPost } from "../app/api/assistant/text/route.ts";
import { POST as voicePost } from "../app/api/assistant/realtime/route.ts";
import { assertLocalRequest } from "../app/agent/server.ts";
import { emptyQualification } from "../app/agent/qualification.ts";
const request = (body) =>
  new Request("http://localhost:3100/api/assistant/text", {
    method: "POST",
    headers: {
      origin: "http://localhost:3100",
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
const input = {
  messages: [{ role: "user", text: "TEST fixture question" }],
  context: { pathname: "/projects/rose-cottage" },
  language: "en-GB",
  qualification: emptyQualification,
};

test("normalised Next URL accepts matching local Host and Origin only", () => {
  assert.doesNotThrow(() => assertLocalRequest(new Request("http://localhost:3100/api/assistant/text", {
    method: "POST", headers: { host: "127.0.0.1:3100", origin: "http://127.0.0.1:3100" },
  })));
  assert.throws(() => assertLocalRequest(new Request("http://localhost:3100/api/assistant/text", {
    method: "POST", headers: { host: "localhost:3100", origin: "http://127.0.0.1:3100" },
  })));
});
test("missing configuration and origin failures never call OpenAI", async () => {
  const old = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;
  try {
    const r = await textPost(request(input));
    assert.equal(r.status, 503);
    assert.ok(!(await r.text()).includes("OPENAI_API_KEY"));
    assert.throws(() =>
      assertLocalRequest(
        new Request("http://localhost:3100", {
          method: "POST",
          headers: { origin: "https://other.example" },
        }),
      ),
    );
    assert.throws(() =>
      assertLocalRequest(new Request("https://public.example")),
    );
  } finally {
    if (old !== undefined) process.env.OPENAI_API_KEY = old;
  }
});
test("server owns instructions/models; key never enters returned data", async (t) => {
  const old = process.env.OPENAI_API_KEY;
  process.env.OPENAI_API_KEY = "TEST_ONLY_NOT_A_REAL_KEY";
  t.after(() => {
    if (old === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = old;
  });
  t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(url, "https://api.openai.com/v1/responses");
    const b = JSON.parse(options.body);
    assert.equal(b.store, false);
    assert.ok(b.instructions.includes("Rose Cottage"));
    assert.ok(b.instructions.includes("Never fabricate"));
    assert.equal(b.text.format.type, "json_schema");
    assert.equal(b.instructions.includes("OVERRIDE_MODEL"), false);
    return Response.json({
      status: "completed",
      output: [
        {
          content: [
            {
              type: "output_text",
              text: JSON.stringify({
                reply: "TEST FIXTURE ONLY",
                qualification: {
                  changes: { location: "Farnham" },
                  summaryOffered: false,
                  confirmationEvidence: null,
                },
              }),
            },
          ],
        },
      ],
    });
  });
  const r = await textPost(request({ ...input, model: "OVERRIDE_MODEL" }));
  assert.equal(r.status, 200);
  const body = await r.json();
  assert.equal(body.qualification.brief.location, "Farnham");
  assert.ok(!JSON.stringify(body).includes("TEST_ONLY_NOT_A_REAL_KEY"));
});
test("upstream errors and malformed responses are sanitised", async (t) => {
  const old = process.env.OPENAI_API_KEY;
  process.env.OPENAI_API_KEY = "TEST_ONLY_NOT_A_REAL_KEY";
  t.after(() => {
    if (old === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = old;
  });
  let status = 401;
  t.mock.method(globalThis, "fetch", async () =>
    status === 401
      ? new Response("SECRET PROVIDER DETAIL", { status: 401 })
      : Response.json({
          status: "completed",
          output: [{ content: [{ type: "output_text", text: "bad json" }] }],
        }),
  );
  let r = await textPost(request(input));
  assert.equal(r.status, 502);
  assert.ok(!(await r.text()).includes("SECRET"));
  status = 200;
  r = await textPost(request(input));
  assert.equal(r.status, 502);
});
test("Realtime uses multipart unified call and returns only SDP", async (t) => {
  const old = process.env.OPENAI_API_KEY;
  process.env.OPENAI_API_KEY = "TEST_ONLY_NOT_A_REAL_KEY";
  t.after(() => {
    if (old === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = old;
  });
  t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(url, "https://api.openai.com/v1/realtime/calls");
    assert.equal(options.body.get("sdp"), "v=0\r\nTEST OFFER");
    const s = JSON.parse(options.body.get("session"));
    assert.equal(s.type, "realtime");
    assert.equal(s.model, "gpt-realtime-2.1");
    assert.equal(s.tools[0].name, "update_project_brief");
    assert.equal(s.audio.output.voice, "marin");
    return new Response("v=0\r\nTEST ANSWER");
  });
  const r = await voicePost(request({ ...input, sdp: "v=0\r\nTEST OFFER" }));
  assert.deepEqual(await r.json(), { sdp: "v=0\r\nTEST ANSWER" });
});
test("client source does not reference permanent API credentials", () => {
  for (const dir of ["app/voice", "app/components"])
    for (const file of readdirSync(dir)) {
      if (!/\.tsx?$/.test(file)) continue;
      assert.ok(
        !readFileSync(dir + "/" + file, "utf8").includes(
          "process.env.OPENAI_API_KEY",
        ),
        file,
      );
    }
  const ignore = readFileSync(".gitignore", "utf8");
  assert.ok(ignore.includes(".env*"));
  assert.ok(!readFileSync("next.config.ts", "utf8").includes("OPENAI_API_KEY"));
});
