import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const source = readFileSync(new URL("../lib/backend.ts", import.meta.url), "utf8");
const javascript = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const backend = await import(`data:text/javascript;base64,${Buffer.from(javascript).toString("base64")}`);

async function withBackend(fetchMock, run) {
  const previousFetch = globalThis.fetch;
  const previousApiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  const previousBackendBase = process.env.NEXT_PUBLIC_BACKEND_URL;
  process.env.NEXT_PUBLIC_API_BASE_URL = "";
  process.env.NEXT_PUBLIC_BACKEND_URL = "https://api.example.test";
  globalThis.fetch = fetchMock;
  try {
    await run();
  } finally {
    globalThis.fetch = previousFetch;
    if (previousApiBase === undefined) delete process.env.NEXT_PUBLIC_API_BASE_URL;
    else process.env.NEXT_PUBLIC_API_BASE_URL = previousApiBase;
    if (previousBackendBase === undefined) delete process.env.NEXT_PUBLIC_BACKEND_URL;
    else process.env.NEXT_PUBLIC_BACKEND_URL = previousBackendBase;
  }
}

test("retries a transient GET once and includes a timeout signal", async () => {
  await withBackend(async (_url, init) => {
    calls += 1;
    assert.equal(init.credentials, "include");
    assert.ok(init.signal instanceof AbortSignal);
    return calls === 1
      ? new Response(JSON.stringify({ error: { code: "maintenance" } }), { status: 503 })
      : new Response(JSON.stringify({ data: [] }), { status: 200 });
  }, async () => {
    calls = 0;
    assert.deepEqual(await backend.getBackendCourses(), []);
    assert.equal(calls, 2);
  });
});

test("does not retry a write after a server error", async () => {
  await withBackend(async (_url, init) => {
    calls += 1;
    assert.equal(init.method, "POST");
    return new Response(JSON.stringify({ error: { code: "maintenance" } }), { status: 503 });
  }, async () => {
    calls = 0;
    await assert.rejects(backend.submitBackendAgentApplication({}), (error) => {
      assert.equal(error.status, 503);
      assert.equal(error.details.message, "The backend is temporarily unavailable.");
      return true;
    });
    assert.equal(calls, 1);
  });
});

test("uses status-aware fallback messaging and rejects invalid envelopes", async () => {
  for (const [status, message] of [
    [403, "You are not authorized to perform this action."],
    [404, "The requested backend resource is unavailable."],
    [429, "Too many requests. Please try again shortly."],
  ]) {
    await withBackend(async (_url, init) => {
      assert.equal(init.method, "POST");
      return new Response("{}", { status });
    }, async () => {
      await assert.rejects(backend.submitBackendAgentApplication({}), (error) => {
        assert.equal(error.status, status);
        assert.equal(error.details.message, message);
        return true;
      });
    });
  }

  await withBackend(async () => new Response("{}", { status: 401 }), async () => {
    await assert.rejects(backend.getBackendProfile(), (error) => {
      assert.equal(error.status, 401);
      assert.equal(error.details.message, "Your session has expired. Sign in again.");
      return true;
    });
  });

  await withBackend(async () => new Response(JSON.stringify({ success: true }), { status: 200 }), async () => {
    await assert.rejects(backend.getBackendCourses(), (error) => {
      assert.equal(error.status, 200);
      assert.equal(error.details.code, "invalid_response");
      return true;
    });
  });
});

test("validates documented profile and governance payloads and rejects malformed records", async () => {
  await withBackend(async (url) => {
    const path = new URL(url).pathname;
    const data = path.endsWith("/profile")
      ? { profileId: "profile-1", walletAddress: `0x${"a".repeat(40)}`, role: "user", displayName: null, avatarUrl: null }
      : {
          contract: {
            chainId: 11142220,
            address: `0x${"b".repeat(40)}`,
            usdmAddress: `0x${"c".repeat(40)}`,
            usdmDecimals: 18,
            participationFee: "10000000000000000",
            treasury: `0x${"d".repeat(40)}`,
            votingRequiresRole: false,
            walletIsAuthorizedProposer: null,
          },
          proposals: [],
        };
    return new Response(JSON.stringify({ data }), { status: 200 });
  }, async () => {
    const profile = await backend.getBackendProfile();
    assert.equal(profile.profileId, "profile-1");
    const governance = await backend.getBackendGovernance();
    assert.equal(governance.contract.chainId, 11142220);
    assert.deepEqual(governance.proposals, []);
  });

  await withBackend(async () => new Response(JSON.stringify({ data: [{ id: 4, title: "Bad row" }] }), { status: 200 }), async () => {
    await assert.rejects(backend.getBackendCourses(), (error) => {
      assert.equal(error.status, 200);
      assert.equal(error.details.code, "invalid_response");
      return true;
    });
  });
});

let calls = 0;
