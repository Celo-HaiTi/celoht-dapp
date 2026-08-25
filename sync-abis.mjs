#!/usr/bin/env node
/**
 * Copies the ABI of each CeloHT contract from the Hardhat build artifacts
 * in artifacts/contracts into abis, so the
 * frontend always uses the exact ABI produced by the contracts that were
 * actually compiled and tested — never a hand-typed copy that could drift.
 *
 * Run after `npm run compile`.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = __dirname;

const CONTRACTS = [
  "AgentRegistry",
  "CertificateRegistry",
  "DonationManager",
  "ImpactRegistry",
  "GovernanceVoting",
];

const artifactsDir = path.join(repoRoot, "artifacts/contracts");
const outDir = path.join(repoRoot, "abis");

mkdirSync(outDir, { recursive: true });

let synced = 0;
for (const name of CONTRACTS) {
  const artifactPath = path.join(artifactsDir, `${name}.sol`, `${name}.json`);
  if (!existsSync(artifactPath)) {
    console.warn(
      `Skipping ${name}: no artifact found at ${artifactPath}. Run contracts:compile first.`,
    );
    continue;
  }
  const artifact = JSON.parse(readFileSync(artifactPath, "utf8"));
  const outPath = path.join(outDir, `${name}.json`);
  writeFileSync(outPath, JSON.stringify(artifact.abi, null, 2) + "\n");
  synced += 1;
  console.log(`Synced ${name} ABI -> ${path.relative(repoRoot, outPath)}`);
}

console.log(`\nDone: ${synced}/${CONTRACTS.length} ABIs synced.`);
