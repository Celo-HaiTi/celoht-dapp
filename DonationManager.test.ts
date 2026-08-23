import { expect } from "chai";
import hre from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers.js";

const { ethers } = hre;

describe("DonationManager", function () {
  const PROJECT_A = ethers.encodeBytes32String("reforest-leogane-01");

  async function deployFixture() {
    const [admin, feeRecipient, donor1, donor2, beneficiary] = await ethers.getSigners();

    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const token = await MockERC20.deploy("Mock USDm", "mUSDm");
    await token.mint(donor1.address, ethers.parseEther("1000"));
    await token.mint(donor2.address, ethers.parseEther("1000"));

    const DonationManager = await ethers.getContractFactory("DonationManager");
    const manager = await DonationManager.deploy(
      admin.address,
      await token.getAddress(),
      feeRecipient.address,
    );

    await manager.connect(admin).registerProject(PROJECT_A, "ipfs://project-a");

    return { manager, token, admin, feeRecipient, donor1, donor2, beneficiary };
  }

  it("accepts a donation with zero platform fee by default", async function () {
    const { manager, token, donor1 } = await loadFixture(deployFixture);
    const amount = ethers.parseEther("100");

    await token.connect(donor1).approve(await manager.getAddress(), amount);
    await expect(manager.connect(donor1).donate(PROJECT_A, amount, "ipfs://memo"))
      .to.emit(manager, "Donated")
      .withArgs(donor1.address, PROJECT_A, amount, 0n, "ipfs://memo");

    expect(await manager.totalDonatedTo(PROJECT_A)).to.equal(amount);
    expect(await manager.availableBalance(PROJECT_A)).to.equal(amount);
    expect(await manager.totalDonatedBy(donor1.address)).to.equal(amount);
  });

  it("routes the platform fee to the fee recipient when set", async function () {
    const { manager, token, admin, feeRecipient, donor1 } = await loadFixture(deployFixture);
    await manager.connect(admin).setPlatformFeeBps(250); // 2.5%

    const amount = ethers.parseEther("100");
    await token.connect(donor1).approve(await manager.getAddress(), amount);
    await manager.connect(donor1).donate(PROJECT_A, amount, "");

    const expectedFee = (amount * 250n) / 10_000n;
    expect(await token.balanceOf(feeRecipient.address)).to.equal(expectedFee);
    expect(await manager.availableBalance(PROJECT_A)).to.equal(amount - expectedFee);
  });

  it("hard-caps the platform fee at 5%", async function () {
    const { manager, admin } = await loadFixture(deployFixture);
    await expect(manager.connect(admin).setPlatformFeeBps(501)).to.be.revertedWith(
      "DonationManager: exceeds fee cap",
    );
    await expect(manager.connect(admin).setPlatformFeeBps(500)).not.to.be.reverted;
  });

  it("rejects donations to an unregistered project", async function () {
    const { manager, token, donor1 } = await loadFixture(deployFixture);
    const unknown = ethers.encodeBytes32String("unknown");
    await token.connect(donor1).approve(await manager.getAddress(), ethers.parseEther("10"));
    await expect(
      manager.connect(donor1).donate(unknown, ethers.parseEther("10"), ""),
    ).to.be.revertedWith("DonationManager: unknown project");
  });

  it("lets a withdrawer move available funds to a beneficiary", async function () {
    const { manager, token, admin, donor1, beneficiary } = await loadFixture(deployFixture);
    const amount = ethers.parseEther("50");
    await token.connect(donor1).approve(await manager.getAddress(), amount);
    await manager.connect(donor1).donate(PROJECT_A, amount, "");

    await expect(manager.connect(admin).withdraw(PROJECT_A, beneficiary.address, amount))
      .to.emit(manager, "Withdrawn")
      .withArgs(PROJECT_A, beneficiary.address, amount);

    expect(await token.balanceOf(beneficiary.address)).to.equal(amount);
    expect(await manager.availableBalance(PROJECT_A)).to.equal(0n);
  });

  it("rejects a withdrawal larger than the available balance", async function () {
    const { manager, admin, beneficiary } = await loadFixture(deployFixture);
    await expect(
      manager.connect(admin).withdraw(PROJECT_A, beneficiary.address, ethers.parseEther("1")),
    ).to.be.revertedWith("DonationManager: insufficient balance");
  });

  it("blocks donations while paused", async function () {
    const { manager, token, admin, donor1 } = await loadFixture(deployFixture);
    await manager.connect(admin).pause();
    await token.connect(donor1).approve(await manager.getAddress(), ethers.parseEther("1"));
    await expect(
      manager.connect(donor1).donate(PROJECT_A, ethers.parseEther("1"), ""),
    ).to.be.revertedWithCustomError(manager, "EnforcedPause");
  });
});
