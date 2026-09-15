import assert from "node:assert/strict";
import test from "node:test";

import { detectForbiddenMockImports } from "../scripts/check-no-mock-data.mjs";

test("detects forbidden demo/mock imports without blocking valid app data modules", () => {
  const findings = detectForbiddenMockImports([
    "import { thing } from '@/lib/demo-wallet';",
    "import { courses } from '@/lib/data/courses';",
    "import { mockForTest } from './mock-provider';",
    "import { format } from './utils';",
  ]);

  assert.deepEqual(
    findings.map((entry) => entry.importPath),
    ["@/lib/demo-wallet", "./mock-provider"],
  );
});
