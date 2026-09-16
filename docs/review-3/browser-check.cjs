/* eslint-disable @typescript-eslint/no-require-imports -- standalone CommonJS review runner */
const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE ||
    "C:/Users/Falco Gears/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules/playwright",
);
const { AxeBuilder } = require(
  process.env.AXE_MODULE ||
    "C:/Users/Falco Gears/AppData/Local/npm-cache/_npx/45ade96657b89d26/node_modules/@axe-core/playwright",
);
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const base = "http://127.0.0.1:3100";
(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const results = [];
  try {
    for (const width of process.env.ONLY_AI
      ? []
      : [1920, 1440, 1366, 768, 390, 320]) {
      const context = await browser.newContext({
        viewport: { width, height: 1000 },
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      // Prevent any paid AI/provider request; status only is read-only.
      await page.route("**/api/assistant/text", (r) =>
        r.fulfill({
          status: 503,
          contentType: "application/json",
          body: JSON.stringify({
            error: "AI is unavailable in this local test.",
          }),
        }),
      );
      await page.route("**/api/assistant/realtime", (r) => r.abort());
      await page.goto(base + "/start-project");
      await page.evaluate(() => document.fonts.ready);
      const overflow = () =>
        page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      assert.equal(await overflow(), false, `page overflow ${width}`);
      const f = page.locator(".brief-form");
      await f.getByRole("button", { name: "Continue", exact: true }).click();
      assert.equal(
        await f.locator("h2").innerText(),
        "A little about your project.",
      );
      await page
        .locator("footer")
        .screenshot({
          style:
            ".site-header,.skip-link,.voice-launcher{visibility:hidden!important}",
          path: path.join(__dirname, `footer-${width}.png`),
        });
      await page
        .locator(".brief-workspace")
        .screenshot({
          style:
            ".site-header,.skip-link,.voice-launcher{visibility:hidden!important}",
          path: path.join(__dirname, `form-${width}.png`),
        });
      await f.getByLabel("Project type").selectOption("Renovation");
      await f
        .getByRole("textbox", { name: /^Project location/ })
        .fill("Farnham");
      await f.getByLabel("Heritage status").selectOption("Unsure");
      const next = () =>
        f.getByRole("button", { name: "Continue", exact: true }).click();
      await next();
      await f
        .getByLabel("What are you planning?", { exact: false })
        .fill(
          "Repair and renovate a period home. This is a local test enquiry.",
        );
      await f.getByRole("button", { name: "Back", exact: false }).click();
      assert.equal(
        await f
          .getByRole("textbox", { name: /^Project location/ })
          .inputValue(),
        "Farnham",
      );
      await next();
      assert.match(
        await f
          .getByLabel("What are you planning?", { exact: false })
          .inputValue(),
        /period home/,
      );
      await next();
      await f.getByLabel("Listed Building Consent").selectOption("Not sure");
      await next();
      await f
        .getByLabel("Approximate budget range")
        .selectOption("Prefer to discuss");
      await next();
      await f.getByLabel("Full name").fill("Local Review");
      await f.getByLabel("Email address").fill("review@example.invalid");
      await next();
      assert.equal(await f.locator("input[type=radio]:checked").count(), 0);
      await page
        .locator(".brief-workspace")
        .screenshot({
          style:
            ".site-header,.skip-link,.voice-launcher{visibility:hidden!important}",
          path: path.join(__dirname, `consent-${width}.png`),
        });
      await f.getByLabel("No, contact me normally.").check();
      await f.getByRole("button", { name: "Review your enquiry" }).click();
      assert.match(await f.innerText(), /No AI call. Normal contact only/);
      await f
        .getByRole("button", { name: "Edit Your project", exact: true })
        .click();
      assert.equal(
        await f
          .getByRole("textbox", { name: /^Project location/ })
          .inputValue(),
        "Farnham",
      );
      await f
        .getByRole("textbox", { name: /^Project location/ })
        .fill("Farnham, Surrey");
      for (let i = 0; i < 5; i++) await next();
      assert.equal(
        await f.getByLabel("No, contact me normally.").isChecked(),
        true,
      );
      await f.getByRole("button", { name: "Review your enquiry" }).click();
      await page
        .locator(".brief-workspace")
        .screenshot({
          style:
            ".site-header,.skip-link,.voice-launcher{visibility:hidden!important}",
          path: path.join(__dirname, `review-${width}.png`),
        });
      assert.equal(await overflow(), false, `review overflow ${width}`);
      const axe = await new AxeBuilder({ page })
        .include(".brief-workspace")
        .include("footer")
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      if (axe.violations.length)
        console.log(JSON.stringify(axe.violations.map((v) => v.nodes)));
      assert.deepEqual(
        axe.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.length,
        })),
        [],
        `axe ${width}`,
      );
      await f.getByLabel("I have checked this summary").check();
      await f.getByLabel("I have read the").check();
      const response = page.waitForResponse(
        (r) =>
          r.url().endsWith("/api/enquiries") && r.request().method() === "POST",
      );
      await f.getByRole("button", { name: "Submit enquiry" }).click();
      const res = await response;
      assert.equal(res.status(), 201);
      const receipt = await res.json();
      assert.equal(receipt.status, "saved_locally");
      assert.equal(receipt.callStatus, "not_requested");
      await f.getByText("Local review receipt", { exact: true }).waitFor();
      await page
        .locator("footer")
        .getByRole("button", { name: "Talk to Buildtonic AI" })
        .click();
      await page.getByRole("dialog").waitFor();
      await page.keyboard.press("Escape");
      assert.equal(await page.getByRole("dialog").count(), 0);
      if (width === 1440) {
        const links = await page
          .locator('footer a[href^="/"]')
          .evaluateAll((es) => [
            ...new Set(es.map((e) => e.getAttribute("href").split("#")[0])),
          ]);
        for (const link of links)
          assert.equal(
            (await page.request.get(base + link)).status(),
            200,
            link,
          );
      }
      assert.deepEqual(errors, []);
      results.push({
        width,
        overflow: false,
        axeViolations: 0,
        sevenSteps: true,
        consentDefault: null,
        receipt: "saved_locally",
        assistantOpens: true,
        errors,
      });
      await context.close();
    }
    const context = await browser.newContext({
        viewport: { width: 1440, height: 1000 },
        reducedMotion: "reduce",
      }),
      page = await context.newPage();
    await page.route("**/api/assistant/status", (r) =>
      r.fulfill({
        status: 200,
        contentType: "application/json",
        body: '{"configured":true}',
      }),
    );
    await page.route("**/api/assistant/realtime", (r) => r.abort());
    await page.route("**/api/assistant/text", (r) =>
      r.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          reply: "These are fixture notes for the local browser test.",
          qualification: {
            brief: {
              location: "London",
              description: "AI fixture: repair the roof",
              service: "Renovation",
            },
            summaryOffered: false,
          },
        }),
      }),
    );
    await page.route("**/api/enquiries", (r) =>
      r.fulfill({
        status: 503,
        contentType: "application/json",
        body: '{"error":"Storage unavailable for this browser test."}',
      }),
    );
    await page.goto(base + "/start-project");
    const f = page.locator(".brief-form");
    await f.getByRole("textbox", { name: /^Project location/ }).fill("Farnham");
    await f.getByLabel("Heritage status").selectOption("Unsure");
    await f
      .getByRole("button", { name: "Talk to Buildtonic AI", exact: false })
      .click();
    const dialog = page.getByRole("dialog");
    await dialog.locator("textarea").fill("Prepare notes about my roof.");
    await dialog.locator("textarea").press("Enter");
    await dialog
      .getByText("These are fixture notes for the local browser test.")
      .waitFor();
    await dialog.getByRole("button", { name: "Close assistant" }).click();
    await f.getByRole("button", { name: "Use assistant notes" }).click();
    assert.equal(
      await f.getByRole("textbox", { name: /^Project location/ }).inputValue(),
      "Farnham",
    );
    assert.equal(await f.getByLabel("Project type").inputValue(), "Renovation");
    await f.locator(".intake-conflicts select").first().selectOption("confirm");
    const next = () =>
      f.getByRole("button", { name: "Continue", exact: true }).click();
    await next();
    assert.equal(
      await f.getByLabel("What are you planning?").inputValue(),
      "AI fixture: repair the roof",
    );
    await page
      .locator(".site-header")
      .getByRole("link", { name: "About", exact: true })
      .click();
    await page.waitForURL("**/about");
    await page
      .locator(".site-header")
      .getByRole("link", { name: "Start a project" })
      .click();
    await page.waitForURL("**/start-project");
    assert.equal(
      await f.getByLabel("What are you planning?").inputValue(),
      "AI fixture: repair the roof",
    );
    await next();
    await next();
    await next();
    await f.getByLabel("Full name").fill("Local AI Review");
    await f.getByLabel("Email address").fill("ai-review@example.invalid");
    await f.getByLabel("Telephone number").fill("07700 900123");
    await next();
    await f.getByLabel("Yes, an AI call is okay.").check();
    await f.getByRole("button", { name: "Review your enquiry" }).click();
    await f.getByRole("button", { name: "Edit Contact", exact: true }).click();
    await f.getByLabel("Telephone number").fill("07700 900124");
    await next();
    assert.equal(await f.locator("input[type=radio]:checked").count(), 0);
    await f.getByLabel("No, contact me normally.").check();
    await f.getByRole("button", { name: "Review your enquiry" }).click();
    await f.getByLabel("I have checked this summary").check();
    await f.getByLabel("I have read the").check();
    await f.getByRole("button", { name: "Submit enquiry" }).click();
    await f
      .getByText("Storage unavailable for this browser test.", { exact: true })
      .waitFor();
    assert.equal(await f.locator(".intake-success").count(), 0);
    assert.match(await f.innerText(), /AI fixture: repair the roof/);
    results.push({
      aiImport: "manual conflicts preserved",
      localNavigation: "draft retained",
      phoneChange: "consent reset",
      submissionFailure: "draft retained; no false receipt",
      providerRequests: "mocked, no paid calls",
    });
    await context.close();
    fs.writeFileSync(
      path.join(__dirname, "results.json"),
      JSON.stringify(results, null, 2),
    );
    console.log(JSON.stringify(results));
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
