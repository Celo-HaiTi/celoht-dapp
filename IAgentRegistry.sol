// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.27;

/// @title IAgentRegistry
/// @notice Interface for the on-chain registry of CeloHT community agents.
interface IAgentRegistry {
    enum AgentStatus {
        Unregistered,
        Pending,
        Active,
        Suspended
    }

    struct Agent {
        address wallet;
        string metadataURI; // off-chain profile: name, region, contact, services
        AgentStatus status;
        uint64 registeredAt;
        uint64 updatedAt;
    }

    event AgentRegistered(address indexed wallet, string metadataURI);
    event AgentApproved(address indexed wallet, address indexed approvedBy);
    event AgentSuspended(address indexed wallet, address indexed suspendedBy, string reason);
    event AgentReinstated(address indexed wallet, address indexed reinstatedBy);
    event AgentMetadataUpdated(address indexed wallet, string metadataURI);

    function registerAgent(string calldata metadataURI) external;

    function approveAgent(address wallet) external;

    function suspendAgent(address wallet, string calldata reason) external;

    function reinstateAgent(address wallet) external;

    function updateMetadata(string calldata metadataURI) external;

    function getAgent(address wallet) external view returns (Agent memory);

    function isActiveAgent(address wallet) external view returns (bool);

    function totalAgents() external view returns (uint256);
}
