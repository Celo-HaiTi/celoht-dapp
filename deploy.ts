import { ethers, network } from "hardhat";
import * as fs from "fs";
import * as path from "path";

/**
 * Deploys the full CeloHT contract suite in dependency order and writes
 * the resulting addresses to `deployments/<network>.json`, which
 * `scripts/sync-abis.mjs` (at the repo root) reads to wire the frontend.
 *
 * On Celo mainnet, pass the real cUSD address via CUSD_ADDRESS. On
 * Alfajores or a local network, this script deploys a MockERC20 to stand
 * in for cUSD so the full flow can be exercised end to end.
 */
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying to network "${network.name}" as ${deployer.address}`);

  // --- Donation asset (cUSD) ---------------------------------------
  let donationTokenAddress = process.env.CUSD_ADDRESS;
  if (!donationTokenAddress) {
    if (network.name === "celo") {
      throw new Error("CUSD_ADDRESS must be set for a mainnet deployment. See docs/DEPLOYMENT.md.");
    }
    console.log("No CUSD_ADDRESS set — deploying MockERC20 to stand in for cUSD (test only).");
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const mock = await MockERC20.deploy("Mock cUSD", "mcUSD");
    await mock.waitForDeployment();
    donationTokenAddress = await mock.getAddress();
  }

  const feeRecipient = process.env.FEE_RECIPIENT_ADDRESS ?? deployer.address;

  // --- Core registries -----------------------------------------------
  const AgentRegistry = await ethers.getContractFactory("AgentRegistry");
  const agentRegistry = await AgentRegistry.deploy(deployer.address);
  await agentRegistry.waitForDeployment();

  const CertificateRegistry = await ethers.getContractFactory("CertificateRegistry");
  const certificateRegistry = await CertificateRegistry.deploy(deployer.address);
  await certificateRegistry.waitForDeployment();

  const ImpactRegistry = await ethers.getContractFactory("ImpactRegistry");
  const impactRegistry = await ImpactRegistry.deploy(deployer.address);
  await impactRegistry.waitForDeployment();

  const DonationManager = await ethers.getContractFactory("DonationManager");
  const donationManager = await DonationManager.deploy(
    deployer.address,
    donationTokenAddress,
    feeRecipient,
  );
  await donationManager.waitForDeployment();

  const GovernanceVoting = await ethers.getContractFactory("GovernanceVoting");
  const governanceVoting = await GovernanceVoting.deploy(deployer.address);
  await governanceVoting.waitForDeployment();

  const addresses = {
    network: network.name,
    chainId: network.config.chainId,
    deployer: deployer.address,
    donationToken: donationTokenAddress,
    contracts: {
      AgentRegistry: await agentRegistry.getAddress(),
      CertificateRegistry: await certificateRegistry.getAddress(),
      ImpactRegistry: await impactRegistry.getAddress(),
      DonationManager: await donationManager.getAddress(),
      GovernanceVoting: await governanceVoting.getAddress(),
    },
    deployedAt: new Date().toISOString(),
  };

  const outDir = path.join(__dirname, "..", "deployments");
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `${network.name}.json`);
  fs.writeFileSync(outFile, JSON.stringify(addresses, null, 2));

  console.log("\nDeployed contracts:");
  console.table(addresses.contracts);
  console.log(`\nAddresses written to ${outFile}`);
  console.log("Run `npm run contracts:sync-abis` from the repo root to update the frontend.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
