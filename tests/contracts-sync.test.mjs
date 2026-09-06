import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const config = JSON.parse(readFileSync(resolve(root, "deployments/dapp-config.json"), "utf8")).celoSepolia;
const expectedAddresses = {
  agentRegistry: "0x7C5bF20191f6b467aAcd2DD7693110cc4c17Cc2e",
  servicePayments: "0xe91b8A6302FCf5a64A84c671C61B0F1DdA5F0ad2",
  education: "0x7422F20F025aCaad86c4de5E6Fa0F3a7B55ac09a",
  reforestation: "0xc1eEd81Aa989D818897CCffc755dC2a9B37F9e2A",
  governance: "0x7D384851FAbB912287206556479Dd30c740CAdA5",
};
const abiFiles = {
  agentRegistry: "CeloHTAgentRegistry.json",
  servicePayments: "CeloHTServicePayments.json",
  education: "CeloHTEducation.json",
  reforestation: "CeloHTReforestation.json",
  governance: "CeloHTGovernance.json",
};

test("Celo Sepolia deployment is official and complete", () => {
  assert.equal(config.chainId, 11142220);
  assert.equal(config.usdm, "0xdE9e4C3ce781b4bA68120d6261cbad65ce0aB00b");
  for (const treasury of ["generalTreasury", "educationTreasury", "reforestationTreasury", "governanceTreasury"]) {
    assert.equal(config[treasury], "0xd856e0599cc49C9cef6C358d2c2f064112A6b384");
  }
  for (const [name, address] of Object.entries(expectedAddresses)) {
    assert.equal(config.contracts[name].address, address);
    assert.match(address, /^0x[0-9a-fA-F]{40}$/);
    assert.notEqual(address.toLowerCase(), "0x0000000000000000000000000000000000000000");
  }
});

test("Mainnet has no unverified CeloHT or USDm deployment", () => {
  const addressesSource = readFileSync(resolve(root, "addresses.ts"), "utf8");
  assert.doesNotMatch(addressesSource, /\[celo\.id\]:\s*"0x[0-9a-fA-F]{40}"/);
});

test("every deployed contract has a synchronized ABI", () => {
  for (const [name, file] of Object.entries(abiFiles)) {
    const abiPath = resolve(root, "abis", file);
    assert.equal(existsSync(abiPath), true, `${file} is missing`);
    const abi = JSON.parse(readFileSync(abiPath, "utf8"));
    assert.ok(abi.length > 0, `${name} ABI is empty`);
    assert.deepEqual(abi, config.contracts[name].abi);
  }
});
