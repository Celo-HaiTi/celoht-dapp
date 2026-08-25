import hre from "hardhat";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "node:url";

async function deploymentRecord(contract: {
  getAddress(): Promise<string>;
  deploymentTransaction(): { hash: string; wait(): Promise<{ blockNumber: number } | null> } | null;
}) {
  const transaction = contract.deploymentTransaction();
  const receipt = transaction ? await transaction.wait() : null;
  return {
    address: await contract.getAddress(),
    deploymentTransaction: transaction?.hash ?? null,
    deploymentBlock: receipt?.blockNumber ?? null,
  };
}

/**
 * Deploys the full CeloHT contract suite in dependency order and writes
 * the resulting addresses to `deployments/<network>.json`, which
 * `scripts/sync-abis.mjs` (at the repo root) reads to wire the frontend.
 *
 * On Celo mainnet, pass the real USDm address via USDM_ADDRESS. On
 * A local network without USDM_ADDRESS may use MockERC20 for isolated tests;
 * Celo Sepolia and Celo Mainnet always require the real USDm address.
 */
async function main() {
  const { ethers, network } = hre;
  const [deployer] = await ethers.getSigners();
  const admin = process.env.ADMIN_ADDRESS;
  const feeRecipient = process.env.FEE_RECIPIENT_ADDRESS;
  const donationRecipient = process.env.DONATION_RECIPIENT_ADDRESS;
  if (!admin || !ethers.isAddress(admin)) throw new Error("ADMIN_ADDRESS must be an organization-controlled multisig address.");
  if (!feeRecipient || !ethers.isAddress(feeRecipient)) throw new Error("FEE_RECIPIENT_ADDRESS must be an explicit organization-controlled address.");
  if (!donationRecipient || !ethers.isAddress(donationRecipient)) throw new Error("DONATION_RECIPIENT_ADDRESS must be an explicit project recipient.");
  console.log(`Deploying to network "${network.name}" as ${deployer.address}; admin ${admin}`);

  // --- Donation asset (USDm) ---------------------------------------
  let donationTokenAddress = process.env.USDM_ADDRESS;
  if (!donationTokenAddress) {
    if (network.name === "celo" || network.name === "celoSepolia") {
      throw new Error("USDM_ADDRESS must be set for Celo Mainnet or Celo Sepolia deployment. See deployment.md.");
    }
    console.log("No USDM_ADDRESS set — deploying MockERC20 to stand in for USDm (test only).");
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const mock = await MockERC20.deploy("Mock USDm", "mUSDm");
    await mock.waitForDeployment();
    donationTokenAddress = await mock.getAddress();
  }

  // --- Core registries -----------------------------------------------
  const AgentRegistry = await ethers.getContractFactory("AgentRegistry");
  const agentRegistry = await AgentRegistry.deploy(admin);
  await agentRegistry.waitForDeployment();

  const CertificateRegistry = await ethers.getContractFactory("CertificateRegistry");
  const certificateRegistry = await CertificateRegistry.deploy(admin);
  await certificateRegistry.waitForDeployment();

  const ImpactRegistry = await ethers.getContractFactory("ImpactRegistry");
  const impactRegistry = await ImpactRegistry.deploy(admin);
  await impactRegistry.waitForDeployment();

  const DonationManager = await ethers.getContractFactory("DonationManager");
  const donationManager = await DonationManager.deploy(
    admin,
    donationTokenAddress,
    feeRecipient,
  );
  await donationManager.waitForDeployment();
  if (deployer.address.toLowerCase() === admin.toLowerCase()) {
    await donationManager.registerProject(
      ethers.keccak256(ethers.toUtf8Bytes("reforest-leogane-01")),
      donationRecipient,
      "project:reforest-leogane-01",
    );
  } else {
    console.log(
      "Register project reforest-leogane-01 from the configured ADMIN_ADDRESS multisig before accepting donations.",
    );
  }

  const GovernanceVoting = await ethers.getContractFactory("GovernanceVoting");
  const governanceVoting = await GovernanceVoting.deploy(admin);
  await governanceVoting.waitForDeployment();

  const addresses = {
    network: network.name,
    chainId: network.config.chainId,
    deployer: deployer.address,
    donationToken: donationTokenAddress,
    contracts: {
      AgentRegistry: await deploymentRecord(agentRegistry),
      CertificateRegistry: await deploymentRecord(certificateRegistry),
      ImpactRegistry: await deploymentRecord(impactRegistry),
      DonationManager: await deploymentRecord(donationManager),
      GovernanceVoting: await deploymentRecord(governanceVoting),
    },
    deployedAt: new Date().toISOString(),
  };

  const projectRoot = path.dirname(fileURLToPath(import.meta.url));
  const outDir = path.join(projectRoot, "deployments");
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
