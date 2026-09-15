#!/usr/bin/env node
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const prohibited = [
  "demo-wallet",
  "demo",
  "mock",
  "fixture",
  "sample-data",
  "fake-data",
];
const excludedDirectories = new Set([".git", "node_modules", ".next", "out", "tests", "scripts", "test"]);

function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (excludedDirectories.has(entry.name)) return [];
      return walk(fullPath);
    }
    return [fullPath];
  });
}

export function detectForbiddenMockImports(lines) {
  const findings = [];
  const pattern = /(?:import|require)\s+(?:.*?from\s+)?["']([^"']+)["']/g;
  for (const raw of lines) {
    const matches = raw.matchAll(pattern);
    for (const match of matches) {
      const importPath = match[1];
      const normalized = importPath.replace(/^[./@]+/, "").replace(/[^a-zA-Z0-9/_-]/g, "");
      const isForbidden = prohibited.some((token) => normalized.toLowerCase().includes(token));
      if (isForbidden) {
        findings.push({ importPath, raw });
      }
    }
  }
  return findings;
}

function main() {
  const files = walk(root).filter((file) => /\.(mjs|js|ts|tsx)$/.test(file));
  const findings = [];

  for (const file of files) {
    const content = readFileSync(file, "utf8");
    const fileFindings = detectForbiddenMockImports(content.split(/\r?\n/));
    for (const finding of fileFindings) {
      findings.push({ file: path.relative(root, file), ...finding });
    }
  }

  if (findings.length > 0) {
    console.error("Prohibited mock/demo imports detected:");
    for (const entry of findings) {
      console.error(`- ${entry.file}: ${entry.importPath}`);
    }
    process.exit(1);
  }

  console.log("No prohibited mock/demo imports detected.");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
