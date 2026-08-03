import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("AgentRegistry", function () {
  async function deployFixture() {
    const [admin, coordinator, agent1, agent2, stranger] = await ethers.getSigners();
    const AgentRegistry = await ethers.getContractFactory("AgentRegistry");
    const registry = await AgentRegistry.deploy(admin.address);

    const COORDINATOR_ROLE = ethers.keccak256(ethers.toUtf8Bytes("COORDINATOR_ROLE"));
    await registry.connect(admin).grantRole(COORDINATOR_ROLE, coordinator.address);

    return { registry, admin, coordinator, agent1, agent2, stranger, COORDINATOR_ROLE };
  }

  it("lets a wallet self-register as a pending agent", async function () {
    const { registry, agent1 } = await loadFixture(deployFixture);

    await expect(registry.connect(agent1).registerAgent("ipfs://profile-1"))
      .to.emit(registry, "AgentRegistered")
      .withArgs(agent1.address, "ipfs://profile-1");

    const agent = await registry.getAgent(agent1.address);
    expect(agent.status).to.equal(1n); // Pending
    expect(agent.metadataURI).to.equal("ipfs://profile-1");
    expect(await registry.totalAgents()).to.equal(1n);
  });

  it("rejects duplicate registration from the same wallet", async function () {
    const { registry, agent1 } = await loadFixture(deployFixture);
    await registry.connect(agent1).registerAgent("ipfs://profile-1");
    await expect(
      registry.connect(agent1).registerAgent("ipfs://profile-1-again"),
    ).to.be.revertedWith("AgentRegistry: already registered");
  });

  it("only a coordinator can approve a pending agent", async function () {
    const { registry, coordinator, agent1, stranger } = await loadFixture(deployFixture);
    await registry.connect(agent1).registerAgent("ipfs://profile-1");

    await expect(registry.connect(stranger).approveAgent(agent1.address)).to.be.reverted;

    await expect(registry.connect(coordinator).approveAgent(agent1.address))
      .to.emit(registry, "AgentApproved")
      .withArgs(agent1.address, coordinator.address);

    expect(await registry.isActiveAgent(agent1.address)).to.equal(true);
  });

  it("supports suspend and reinstate for an active agent", async function () {
    const { registry, coordinator, agent1 } = await loadFixture(deployFixture);
    await registry.connect(agent1).registerAgent("ipfs://profile-1");
    await registry.connect(coordinator).approveAgent(agent1.address);

    await expect(registry.connect(coordinator).suspendAgent(agent1.address, "fraud report"))
      .to.emit(registry, "AgentSuspended")
      .withArgs(agent1.address, coordinator.address, "fraud report");
    expect(await registry.isActiveAgent(agent1.address)).to.equal(false);

    await registry.connect(coordinator).reinstateAgent(agent1.address);
    expect(await registry.isActiveAgent(agent1.address)).to.equal(true);
  });

  it("lets an agent update their own metadata but not someone else's", async function () {
    const { registry, agent1 } = await loadFixture(deployFixture);
    await registry.connect(agent1).registerAgent("ipfs://profile-1");

    await registry.connect(agent1).updateMetadata("ipfs://profile-1-updated");
    const agent = await registry.getAgent(agent1.address);
    expect(agent.metadataURI).to.equal("ipfs://profile-1-updated");
  });

  it("paginates the agent list", async function () {
    const { registry, agent1, agent2 } = await loadFixture(deployFixture);
    await registry.connect(agent1).registerAgent("ipfs://a1");
    await registry.connect(agent2).registerAgent("ipfs://a2");

    const page = await registry.agentsPage(0, 10);
    expect(page).to.deep.equal([agent1.address, agent2.address]);
  });

  it("blocks registration while paused", async function () {
    const { registry, admin, agent1 } = await loadFixture(deployFixture);
    await registry.connect(admin).pause();
    await expect(registry.connect(agent1).registerAgent("ipfs://x")).to.be.revertedWithCustomError(
      registry,
      "EnforcedPause",
    );
  });
});
