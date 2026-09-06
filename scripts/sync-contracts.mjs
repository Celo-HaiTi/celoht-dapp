#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const sourceRoot = process.env.OFFICIAL_CONTRACTS_PATH
  ? path.resolve(process.env.OFFICIAL_CONTRACTS_PATH)
  : repoRoot;
const sourceConfigPath = path.join(sourceRoot, "deployments", "dapp-config.json");
const sourceDeploymentPath = path.join(sourceRoot, "deployments", "celoSepolia.json");
const localConfigPath = path.join(repoRoot, "deployments", "dapp-config.json");
const localDeploymentPath = path.join(repoRoot, "deployments", "celoSepolia.json");
const abiDirectory = path.join(repoRoot, "abis");
const contractNames = [
  ["agentRegistry", "CeloHTAgentRegistry"],
  ["servicePayments", "CeloHTServicePayments"],
  ["education", "CeloHTEducation"],
  ["reforestation", "CeloHTReforestation"],
  ["governance", "CeloHTGovernance"],
];
const checkOnly = process.argv.includes("--check");
const addressPattern = /^0x[0-9a-fA-F]{40}$/;

function readJson(filePath) {
  if (!existsSync(filePath)) throw new Error(`Missing synchronization source: ${filePath}`);
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function stableJson(value) {
  return JSON.stringify(value, null, 2) + "\n";
}

const sourceConfig = readJson(sourceConfigPath);
const sourceDeployment = readJson(sourceDeploymentPath);
const sourceNetwork = sourceConfig.celoSepolia;
if (Object.keys(sourceConfig).some((network) => network !== "celoSepolia")) {
  throw new Error("Official deployment config contains an unsupported network.");
}
if (!sourceNetwork || sourceNetwork.chainId !== 11142220 || sourceDeployment.chainId !== 11142220) {
  throw new Error("Official dapp-config.json does not contain Celo Sepolia chain ID 11142220.");
}
if (sourceDeployment.network !== "celoSepolia" || sourceDeployment.usdm !== sourceNetwork.usdm) {
  throw new Error("Official Celo Sepolia deployment metadata is inconsistent.");
}
for (const [label, value] of Object.entries(sourceNetwork)) {
  if ((label === "usdm" || label.endsWith("Treasury")) && (!addressPattern.test(value) || /^0x0{40}$/i.test(value))) {
    throw new Error(`Official deployment contains an invalid ${label} address.`);
  }
}
for (const [key, contractName] of contractNames) {
  const contract = sourceNetwork.contracts?.[key];
  if (!contract?.address || !addressPattern.test(contract.address) || /^0x0{40}$/i.test(contract.address) || !Array.isArray(contract.abi) || contract.abi.length === 0) {
    throw new Error(`Official deployment is missing address or ABI for ${contractName}.`);
  }
}

const expectedConfig = stableJson(sourceConfig);
const expectedDeployment = stableJson(sourceDeployment);
if (checkOnly) {
  const localConfig = readFileSync(localConfigPath, "utf8");
  if (localConfig !== expectedConfig) throw new Error("deployments/dapp-config.json is stale.");
  const localDeployment = readFileSync(localDeploymentPath, "utf8");
  if (localDeployment !== expectedDeployment) throw new Error("deployments/celoSepolia.json is stale.");
} else {
  mkdirSync(path.dirname(localConfigPath), { recursive: true });
  writeFileSync(localConfigPath, expectedConfig);
  writeFileSync(localDeploymentPath, expectedDeployment);
}

mkdirSync(abiDirectory, { recursive: true });
for (const [key, contractName] of contractNames) {
  const outputPath = path.join(abiDirectory, `${contractName}.json`);
  const expectedAbi = stableJson(sourceNetwork.contracts[key].abi);
  if (checkOnly) {
    if (!existsSync(outputPath) || readFileSync(outputPath, "utf8") !== expectedAbi) {
      throw new Error(`${path.relative(repoRoot, outputPath)} is stale.`);
    }
  } else {
    writeFileSync(outputPath, expectedAbi);
  }
}

console.log(`${checkOnly ? "Verified" : "Synchronized"} Celo Sepolia deployment and ${contractNames.length} official ABIs.`);
