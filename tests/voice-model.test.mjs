import test from "node:test";
import assert from "node:assert/strict";
import {getPageContext,resolveLanguage} from "../app/voice/model.ts";

test("page context keeps verified project and service identifiers separate from topics",()=>{
  assert.deepEqual(getPageContext("/projects/rose-cottage/","surveys"),{pathname:"/projects/rose-cottage",pageType:"project",identifier:"rose-cottage",selectedStarter:"surveys"});
  assert.equal(getPageContext("/expertise/new-homes").identifier,"new-homes");
  assert.equal(getPageContext("/heritage").pageType,"heritage");
  assert.equal(getPageContext("/projects").pageType,"portfolio");
  assert.equal(getPageContext("/start-project").pageType,"enquiry");
  assert.equal(getPageContext("/").pageType,"home");
});
test("unsupported browser preferences and empty preferences fall back to English",()=>{
  assert.equal(resolveLanguage(["ur-PK","fr-FR"]).resolvedLanguage,"en-GB");
  assert.equal(resolveLanguage([]).resolvedLanguage,"en-GB");
  assert.equal(resolveLanguage(["en-US"]).resolvedLanguage,"en-GB");
});
test("future supported languages respect preference order and manual override",()=>{
  const supported=["en-GB","fr-FR","ur-PK"];
  assert.equal(resolveLanguage(["fr-CA","ur-PK"],undefined,supported).resolvedLanguage,"fr-FR");
  const preference=resolveLanguage(["fr-FR"],"ur-PK",supported);
  assert.equal(preference.resolvedLanguage,"ur-PK");
  assert.equal(preference.mode,"manual");
  assert.deepEqual(preference.browserLanguages,["fr-FR"]);
  assert.equal(resolveLanguage(["fr-FR"],"zz-ZZ",supported).resolvedLanguage,"en-GB");
});
