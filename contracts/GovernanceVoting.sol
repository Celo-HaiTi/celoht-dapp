// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.27;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {Roles} from "./libraries/Roles.sol";

/// @title GovernanceVoting
/// @notice A deliberately simple, role-gated proposal-and-vote system.
///         CeloHT has no governance token: voting weight is one address,
///         one vote, and only addresses granted VOTER_ROLE (e.g. approved
///         community agents or verified contributors, at the Maintainer
///         Council's discretion) may vote. This trades permissionless
///         participation for resistance to plutocratic and Sybil attacks
///         that a token-weighted or fully open model would be exposed to
///         — see docs/governance.md for the tradeoffs and the intended
///         path toward broader participation over time.
contract GovernanceVoting is AccessControl, Pausable {
    enum ProposalState {
        Active,
        Closed
    }

    struct Proposal {
        address proposer;
        string metadataURI; // title, description, discussion link
        uint64 startTime;
        uint64 endTime;
        uint256 votesFor;
        uint256 votesAgainst;
        ProposalState state;
    }

    Proposal[] private _proposals;
    mapping(uint256 => mapping(address => bool)) private _hasVoted;

    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        string metadataURI,
        uint64 startTime,
        uint64 endTime
    );
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support);
    event ProposalClosed(uint256 indexed proposalId, uint256 votesFor, uint256 votesAgainst);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(Roles.ADMIN_ROLE, admin);
        _grantRole(Roles.PROPOSER_ROLE, admin);
        _grantRole(Roles.VOTER_ROLE, admin);
    }

    function createProposal(
        string calldata metadataURI,
        uint64 votingPeriodSeconds
    ) external onlyRole(Roles.PROPOSER_ROLE) whenNotPaused returns (uint256 proposalId) {
        require(bytes(metadataURI).length > 0, "GovernanceVoting: empty metadata");
        require(votingPeriodSeconds >= 1 days, "GovernanceVoting: period too short");

        proposalId = _proposals.length;
        uint64 startTime = uint64(block.timestamp);
        uint64 endTime = startTime + votingPeriodSeconds;

        _proposals.push(
            Proposal({
                proposer: msg.sender,
                metadataURI: metadataURI,
                startTime: startTime,
                endTime: endTime,
                votesFor: 0,
                votesAgainst: 0,
                state: ProposalState.Active
            })
        );

        emit ProposalCreated(proposalId, msg.sender, metadataURI, startTime, endTime);
    }

    function castVote(
        uint256 proposalId,
        bool support
    ) external onlyRole(Roles.VOTER_ROLE) whenNotPaused {
        Proposal storage proposal = _getProposal(proposalId);
        require(proposal.state == ProposalState.Active, "GovernanceVoting: not active");
        require(block.timestamp <= proposal.endTime, "GovernanceVoting: voting ended");
        require(!_hasVoted[proposalId][msg.sender], "GovernanceVoting: already voted");

        _hasVoted[proposalId][msg.sender] = true;
        if (support) {
            proposal.votesFor += 1;
        } else {
            proposal.votesAgainst += 1;
        }

        emit VoteCast(proposalId, msg.sender, support);
    }

    /// @notice Closes a proposal after its voting period ends. Anyone may
    ///         call this — it only finalizes state, it cannot change the
    ///         vote tally.
    function closeProposal(uint256 proposalId) external {
        Proposal storage proposal = _getProposal(proposalId);
        require(proposal.state == ProposalState.Active, "GovernanceVoting: already closed");
        require(block.timestamp > proposal.endTime, "GovernanceVoting: voting still open");

        proposal.state = ProposalState.Closed;
        emit ProposalClosed(proposalId, proposal.votesFor, proposal.votesAgainst);
    }

    function getProposal(uint256 proposalId) external view returns (Proposal memory) {
        return _getProposal(proposalId);
    }

    function proposalCount() external view returns (uint256) {
        return _proposals.length;
    }

    function hasVoted(uint256 proposalId, address voter) external view returns (bool) {
        return _hasVoted[proposalId][voter];
    }

    function _getProposal(uint256 proposalId) private view returns (Proposal storage) {
        require(proposalId < _proposals.length, "GovernanceVoting: invalid proposalId");
        return _proposals[proposalId];
    }

    function pause() external onlyRole(Roles.ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(Roles.ADMIN_ROLE) {
        _unpause();
    }
}
