// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.27;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {IAgentRegistry} from "./interfaces/IAgentRegistry.sol";
import {Roles} from "./libraries/Roles.sol";

/// @title AgentRegistry
/// @notice On-chain registry of CeloHT community agents. Agents self
///         register with an off-chain metadata URI (profile, region,
///         services offered) and are approved, suspended, or reinstated by
///         an account holding COORDINATOR_ROLE. This contract does not
///         move funds — it only tracks agent status, which the CeloHT
///         website and dApp read to display verified agents.
contract AgentRegistry is IAgentRegistry, AccessControl, Pausable {
    mapping(address => Agent) private _agents;
    address[] private _agentList;

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(Roles.ADMIN_ROLE, admin);
        _grantRole(Roles.COORDINATOR_ROLE, admin);
    }

    /// @inheritdoc IAgentRegistry
    function registerAgent(string calldata metadataURI) external whenNotPaused {
        require(bytes(metadataURI).length > 0, "AgentRegistry: empty metadata");
        Agent storage agent = _agents[msg.sender];
        require(agent.status == AgentStatus.Unregistered, "AgentRegistry: already registered");

        agent.wallet = msg.sender;
        agent.metadataURI = metadataURI;
        agent.status = AgentStatus.Pending;
        agent.registeredAt = uint64(block.timestamp);
        agent.updatedAt = uint64(block.timestamp);

        _agentList.push(msg.sender);
        emit AgentRegistered(msg.sender, metadataURI);
    }

    /// @inheritdoc IAgentRegistry
    function approveAgent(address wallet) external onlyRole(Roles.COORDINATOR_ROLE) {
        Agent storage agent = _agents[wallet];
        require(
            agent.status == AgentStatus.Pending || agent.status == AgentStatus.Suspended,
            "AgentRegistry: not eligible for approval"
        );
        agent.status = AgentStatus.Active;
        agent.updatedAt = uint64(block.timestamp);
        emit AgentApproved(wallet, msg.sender);
    }

    /// @inheritdoc IAgentRegistry
    function suspendAgent(
        address wallet,
        string calldata reason
    ) external onlyRole(Roles.COORDINATOR_ROLE) {
        Agent storage agent = _agents[wallet];
        require(agent.status == AgentStatus.Active, "AgentRegistry: not active");
        agent.status = AgentStatus.Suspended;
        agent.updatedAt = uint64(block.timestamp);
        emit AgentSuspended(wallet, msg.sender, reason);
    }

    /// @inheritdoc IAgentRegistry
    function reinstateAgent(address wallet) external onlyRole(Roles.COORDINATOR_ROLE) {
        Agent storage agent = _agents[wallet];
        require(agent.status == AgentStatus.Suspended, "AgentRegistry: not suspended");
        agent.status = AgentStatus.Active;
        agent.updatedAt = uint64(block.timestamp);
        emit AgentReinstated(wallet, msg.sender);
    }

    /// @inheritdoc IAgentRegistry
    function updateMetadata(string calldata metadataURI) external whenNotPaused {
        Agent storage agent = _agents[msg.sender];
        require(agent.status != AgentStatus.Unregistered, "AgentRegistry: not registered");
        require(bytes(metadataURI).length > 0, "AgentRegistry: empty metadata");
        agent.metadataURI = metadataURI;
        agent.updatedAt = uint64(block.timestamp);
        emit AgentMetadataUpdated(msg.sender, metadataURI);
    }

    /// @inheritdoc IAgentRegistry
    function getAgent(address wallet) external view returns (Agent memory) {
        return _agents[wallet];
    }

    /// @inheritdoc IAgentRegistry
    function isActiveAgent(address wallet) external view returns (bool) {
        return _agents[wallet].status == AgentStatus.Active;
    }

    /// @inheritdoc IAgentRegistry
    function totalAgents() external view returns (uint256) {
        return _agentList.length;
    }

    /// @notice Returns a page of registered agent addresses (all statuses).
    /// @dev For UI pagination; filter by status off-chain or via `getAgent`.
    function agentsPage(uint256 offset, uint256 limit) external view returns (address[] memory) {
        uint256 total = _agentList.length;
        if (offset >= total) return new address[](0);
        uint256 end = offset + limit;
        if (end > total) end = total;
        address[] memory page = new address[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            page[i - offset] = _agentList[i];
        }
        return page;
    }

    function pause() external onlyRole(Roles.ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(Roles.ADMIN_ROLE) {
        _unpause();
    }
}
