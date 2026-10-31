import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const migration = readFileSync(new URL("../supabase/migrations/20261030000000_pilot_pillars.sql", import.meta.url), "utf8");

test("pilot migration covers all three pillars and audit controls", () => {
  for (const table of ["courses", "lessons", "lesson_progress", "quiz_attempts", "certificates", "agent_applications", "agent_services", "planting_events", "tree_survival_records", "audit_logs"]) {
    assert.match(migration, new RegExp(`create table if not exists public\\.${table}`));
  }
  assert.match(migration, /enable row level security/);
  assert.match(migration, /verified planting public/);
});

test("pilot API routes enforce authentication and role checks in source", () => {
  const education = readFileSync(new URL("../app/api/pilot/education/route.ts", import.meta.url), "utf8");
  const agents = readFileSync(new URL("../app/api/pilot/agents/route.ts", import.meta.url), "utf8");
  const reforestation = readFileSync(new URL("../app/api/pilot/reforestation/route.ts", import.meta.url), "utf8");
  assert.match(education, /Authentication required/);
  assert.match(education, /Complete every lesson before requesting a certificate/);
  assert.match(education, /correct_option/);
  assert.match(education, /Math\.round\(\(correctAnswers \/ questions\.length\) \* 100\)/);
  assert.match(education, /Enroll in this course before recording progress/);
  assert.match(education, /Enroll in this course before taking the assessment/);
  assert.doesNotMatch(education, /Number\(body\.score\)/);
  assert.match(agents, /Administrator role required/);
  assert.match(agents, /select\("id,wallet_address"\)/);
  assert.match(agents, /An agent application or verified agent role is required/);
  assert.match(agents, /PILOT_AGENT_MAX_SIMULATION_AMOUNT/);
  assert.match(agents, /amount: rawAmount/);
  assert.doesNotMatch(agents, /body\.walletAddress/);
  assert.match(reforestation, /requireReviewer/);
  assert.match(reforestation, /Verified trees cannot exceed planted trees/);
});

test("quiz answer keys are not publicly selectable", () => {
  const migration = readFileSync(new URL("../supabase/migrations/20261031000000_pilot_security_hardening.sql", import.meta.url), "utf8");
  assert.match(migration, /drop policy if exists "published quiz questions public"/);
});

test("pilot configuration separates service and session secrets from public env", () => {
  const env = readFileSync(new URL("../.env.example", import.meta.url), "utf8");
  assert.match(env, /SUPABASE_SERVICE_ROLE_KEY=/);
  assert.match(env, /PILOT_SESSION_SECRET=/);
  assert.doesNotMatch(env, /NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY/);
  assert.doesNotMatch(env, /NEXT_PUBLIC_PILOT_SESSION_SECRET/);
});

test("custom-domain deployment keeps server-backed pilot routes enabled", () => {
  const vercel = JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8"));
  assert.equal(vercel.buildCommand, "npm run build");
  assert.equal("outputDirectory" in vercel, false);
});

test("pilot authentication enforces a strong session secret", () => {
  const auth = readFileSync(new URL("../lib/server/pilot.ts", import.meta.url), "utf8");
  assert.match(auth, /Buffer\.byteLength\(secret, "utf8"\) >= 32/);
  assert.match(auth, /PILOT_SESSION_SECRET must contain at least 32 bytes/);
});
