import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture, time } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("GovernanceVoting", function () {
  async function deployFixture() {
    const [admin, proposer, voter1, voter2, nonVoter] = await ethers.getSigners();
    const GovernanceVoting = await ethers.getContractFactory("GovernanceVoting");
    const voting = await GovernanceVoting.deploy(admin.address);

    const PROPOSER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("PROPOSER_ROLE"));
    const VOTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("VOTER_ROLE"));
    await voting.connect(admin).grantRole(PROPOSER_ROLE, proposer.address);
    await voting.connect(admin).grantRole(VOTER_ROLE, voter1.address);
    await voting.connect(admin).grantRole(VOTER_ROLE, voter2.address);

    return { voting, admin, proposer, voter1, voter2, nonVoter };
  }

  const ONE_DAY = 24 * 60 * 60;

  it("lets a proposer create a proposal with a minimum voting period", async function () {
    const { voting, proposer } = await loadFixture(deployFixture);

    await expect(voting.connect(proposer).createProposal("ipfs://proposal-1", ONE_DAY)).to.emit(
      voting,
      "ProposalCreated",
    );
    expect(await voting.proposalCount()).to.equal(1n);

    await expect(
      voting.connect(proposer).createProposal("ipfs://too-short", 60),
    ).to.be.revertedWith("GovernanceVoting: period too short");
  });

  it("is one-address-one-vote: a voter cannot vote twice", async function () {
    const { voting, proposer, voter1 } = await loadFixture(deployFixture);
    await voting.connect(proposer).createProposal("ipfs://proposal-1", ONE_DAY);

    await voting.connect(voter1).castVote(0, true);
    await expect(voting.connect(voter1).castVote(0, true)).to.be.revertedWith(
      "GovernanceVoting: already voted",
    );
  });

  it("rejects votes from an address without VOTER_ROLE", async function () {
    const { voting, proposer, nonVoter } = await loadFixture(deployFixture);
    await voting.connect(proposer).createProposal("ipfs://proposal-1", ONE_DAY);
    await expect(voting.connect(nonVoter).castVote(0, true)).to.be.reverted;
  });

  it("tallies votes for and against correctly", async function () {
    const { voting, proposer, voter1, voter2 } = await loadFixture(deployFixture);
    await voting.connect(proposer).createProposal("ipfs://proposal-1", ONE_DAY);

    await voting.connect(voter1).castVote(0, true);
    await voting.connect(voter2).castVote(0, false);

    const proposal = await voting.getProposal(0);
    expect(proposal.votesFor).to.equal(1n);
    expect(proposal.votesAgainst).to.equal(1n);
  });

  it("rejects votes cast after the voting period ends", async function () {
    const { voting, proposer, voter1 } = await loadFixture(deployFixture);
    await voting.connect(proposer).createProposal("ipfs://proposal-1", ONE_DAY);
    await time.increase(ONE_DAY + 1);

    await expect(voting.connect(voter1).castVote(0, true)).to.be.revertedWith(
      "GovernanceVoting: voting ended",
    );
  });

  it("can only be closed after the voting period ends, by anyone", async function () {
    const { voting, proposer, nonVoter } = await loadFixture(deployFixture);
    await voting.connect(proposer).createProposal("ipfs://proposal-1", ONE_DAY);

    await expect(voting.connect(nonVoter).closeProposal(0)).to.be.revertedWith(
      "GovernanceVoting: voting still open",
    );

    await time.increase(ONE_DAY + 1);
    await expect(voting.connect(nonVoter).closeProposal(0)).to.emit(voting, "ProposalClosed");
  });
});
