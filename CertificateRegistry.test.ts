import { expect } from "chai";
import hre from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers.js";

const { ethers } = hre;

describe("CertificateRegistry", function () {
  async function deployFixture() {
    const [admin, issuer, learner1, learner2, stranger] = await ethers.getSigners();
    const CertificateRegistry = await ethers.getContractFactory("CertificateRegistry");
    const registry = await CertificateRegistry.deploy(admin.address);

    const ISSUER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("ISSUER_ROLE"));
    await registry.connect(admin).grantRole(ISSUER_ROLE, issuer.address);

    return { registry, admin, issuer, learner1, learner2, stranger };
  }

  it("issues a certificate and records course + owner", async function () {
    const { registry, issuer, learner1 } = await loadFixture(deployFixture);

    await expect(
      registry
        .connect(issuer)
        .issueCertificate(learner1.address, "financial-literacy-101", "ipfs://cert-1"),
    ).to.emit(registry, "CertificateIssued");

    expect(await registry.ownerOf(1)).to.equal(learner1.address);
    expect(await registry.courseIdOf(1)).to.equal("financial-literacy-101");
    expect(await registry.tokenURI(1)).to.equal("ipfs://cert-1");
    expect(await registry.certificatesOf(learner1.address)).to.deep.equal([1n]);
  });

  it("rejects issuance from a non-issuer", async function () {
    const { registry, stranger, learner1 } = await loadFixture(deployFixture);
    await expect(
      registry.connect(stranger).issueCertificate(learner1.address, "course", "ipfs://x"),
    ).to.be.reverted;
  });

  it("is soulbound: certificates cannot be transferred", async function () {
    const { registry, issuer, learner1, learner2 } = await loadFixture(deployFixture);
    await registry.connect(issuer).issueCertificate(learner1.address, "course", "ipfs://x");

    await expect(
      registry.connect(learner1).transferFrom(learner1.address, learner2.address, 1),
    ).to.be.revertedWith("CertificateRegistry: certificates are non-transferable");
  });

  it("lets an issuer revoke a certificate without burning it", async function () {
    const { registry, issuer, learner1 } = await loadFixture(deployFixture);
    await registry.connect(issuer).issueCertificate(learner1.address, "course", "ipfs://x");

    await expect(registry.connect(issuer).revokeCertificate(1, "fraudulent submission"))
      .to.emit(registry, "CertificateRevoked")
      .withArgs(1, "fraudulent submission");

    expect(await registry.isRevoked(1)).to.equal(true);
    // Ownership record is preserved for transparency, even once revoked.
    expect(await registry.ownerOf(1)).to.equal(learner1.address);
  });

  it("supports ERC-165 and ERC-721 interface detection", async function () {
    const { registry } = await loadFixture(deployFixture);
    const ERC721_INTERFACE_ID = "0x80ac58cd";
    expect(await registry.supportsInterface(ERC721_INTERFACE_ID)).to.equal(true);
  });
});
