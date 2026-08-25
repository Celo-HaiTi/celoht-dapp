import { expect } from "chai";
import hre from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers.js";

const { ethers } = hre;

describe("ImpactRegistry", function () {
  const PROJECT_A = ethers.encodeBytes32String("reforest-leogane-01");

  it("rejects a zero admin", async function () {
    const ImpactRegistry = await ethers.getContractFactory("ImpactRegistry");
    await expect(ImpactRegistry.deploy(ethers.ZeroAddress)).to.be.revertedWith(
      "ImpactRegistry: zero admin",
    );
  });

  async function deployFixture() {
    const [admin, verifier, stranger] = await ethers.getSigners();
    const ImpactRegistry = await ethers.getContractFactory("ImpactRegistry");
    const registry = await ImpactRegistry.deploy(admin.address);

    const VERIFIER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("VERIFIER_ROLE"));
    await registry.connect(admin).grantRole(VERIFIER_ROLE, verifier.address);
    await registry.connect(admin).createProject(PROJECT_A, "ipfs://project-a");

    return { registry, admin, verifier, stranger };
  }

  it("only a verifier can record a planting", async function () {
    const { registry, verifier, stranger } = await loadFixture(deployFixture);

    await expect(registry.connect(stranger).recordPlanting(PROJECT_A, 25, "ipfs://evidence-1")).to
      .be.reverted;

    await expect(registry.connect(verifier).recordPlanting(PROJECT_A, 25, "ipfs://evidence-1"))
      .to.emit(registry, "PlantingRecorded")
      .withArgs(PROJECT_A, 0, verifier.address, 25);
  });

  it("accumulates tree totals per project across multiple records", async function () {
    const { registry, verifier } = await loadFixture(deployFixture);
    await registry.connect(verifier).recordPlanting(PROJECT_A, 25, "ipfs://evidence-1");
    await registry.connect(verifier).recordPlanting(PROJECT_A, 40, "ipfs://evidence-2");

    expect(await registry.totalTreesFor(PROJECT_A)).to.equal(65n);
    expect(await registry.recordCount()).to.equal(2n);
  });

  it("stores full record detail retrievable by id", async function () {
    const { registry, verifier } = await loadFixture(deployFixture);
    await registry.connect(verifier).recordPlanting(PROJECT_A, 10, "ipfs://evidence-1");

    const record = await registry.getRecord(0);
    expect(record.projectId).to.equal(PROJECT_A);
    expect(record.treeCount).to.equal(10);
    expect(record.evidenceURI).to.equal("ipfs://evidence-1");
    expect(record.reportedBy).to.equal(verifier.address);
  });

  it("rejects a zero tree count or missing evidence", async function () {
    const { registry, verifier } = await loadFixture(deployFixture);
    await expect(
      registry.connect(verifier).recordPlanting(PROJECT_A, 0, "ipfs://evidence-1"),
    ).to.be.revertedWith("ImpactRegistry: zero trees");
    await expect(registry.connect(verifier).recordPlanting(PROJECT_A, 5, "")).to.be.revertedWith(
      "ImpactRegistry: missing evidence",
    );
  });

  it("rejects recording against an unknown project", async function () {
    const { registry, verifier } = await loadFixture(deployFixture);
    const unknown = ethers.encodeBytes32String("unknown");
    await expect(
      registry.connect(verifier).recordPlanting(unknown, 5, "ipfs://evidence-1"),
    ).to.be.revertedWith("ImpactRegistry: unknown project");
  });
});
