import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

test("static frontend configuration uses the public backend URL without server credentials", () => {
  const env = read("../.env.example");
  assert.match(env, /NEXT_PUBLIC_BACKEND_URL=/);
  assert.doesNotMatch(env, /NEXT_PUBLIC_SUPABASE_(?:URL|ANON_KEY)=/);
  assert.doesNotMatch(env, /(?:^|\n)(?:SUPABASE_SERVICE_ROLE_KEY|PILOT_SESSION_SECRET|AUTH_SESSION_SECRET)=/);
});

test("Pilot Center uses supported official API helpers without local browser fetch", () => {
  const page = read("../app/pilot/page.tsx");
  for (const helper of ["getBackendCourses", "getBackendReforestation", "getBackendTransactions", "submitBackendAgentApplication"]) {
    assert.match(page, new RegExp(helper));
  }
  assert.doesNotMatch(page, /\/api\/pilot/);
  assert.doesNotMatch(page, /fetch\(/);
  assert.match(page, /Lesson details, enrollment, and quizzes are not exposed/);
  assert.match(page, /Cash-in\/cash-out simulation endpoints are not available/);
  assert.match(page, /Planting submissions are unavailable/);
});

test("pilot does not ship a second local API or Supabase client", () => {
  assert.equal(existsSync(new URL("../app/api/pilot/education/route.ts", import.meta.url)), false);
  assert.equal(existsSync(new URL("../app/api/pilot/agents/route.ts", import.meta.url)), false);
  assert.equal(existsSync(new URL("../lib/server/pilot.ts", import.meta.url)), false);
  assert.equal(existsSync(new URL("../client.ts", import.meta.url)), false);
});

test("static build does not move server routes or leave temporary directories", () => {
  const build = read("../scripts/build-static.mjs");
  assert.match(build, /STATIC_EXPORT: "true"/);
  assert.doesNotMatch(build, /renameSync|hiddenApiDir|apiDir/);
  assert.match(build, /process\.exitCode/);
});
