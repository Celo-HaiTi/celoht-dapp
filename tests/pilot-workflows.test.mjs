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
  assert.match(agents, /Administrator role required/);
  assert.match(reforestation, /requireReviewer/);
  assert.match(reforestation, /Verified trees cannot exceed planted trees/);
});

test("pilot configuration separates service and session secrets from public env", () => {
  const env = readFileSync(new URL("../.env.example", import.meta.url), "utf8");
  assert.match(env, /SUPABASE_SERVICE_ROLE_KEY=/);
  assert.match(env, /PILOT_SESSION_SECRET=/);
  assert.doesNotMatch(env, /NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY/);
  assert.doesNotMatch(env, /NEXT_PUBLIC_PILOT_SESSION_SECRET/);
});
