import { existsSync, renameSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const apiDir = path.join(root, "app", "api");
const hiddenApiDir = path.join(root, ".api-pages-build");

if (!existsSync(apiDir)) {
  throw new Error("Static build could not find app/api.");
}

renameSync(apiDir, hiddenApiDir);
const command = process.platform === "win32" ? "npm.cmd" : "npm";
let exitCode = 0;
try {
  const result = spawnSync(command, ["run", "build"], {
    cwd: root,
    env: { ...process.env, STATIC_EXPORT: "true" },
    stdio: "inherit",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) exitCode = result.status ?? 1;
} finally {
  if (existsSync(hiddenApiDir)) renameSync(hiddenApiDir, apiDir);
}
if (exitCode !== 0) process.exitCode = exitCode;
