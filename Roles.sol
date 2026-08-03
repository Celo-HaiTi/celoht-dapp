// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.27;

/// @title Roles
/// @notice Shared AccessControl role identifiers used across the CeloHT
///         contract suite, so the same role (e.g. an operations admin)
///         resolves to the same identifier in every contract.
/// @dev None of these roles are, or grant control over, a token. CeloHT
///      does not issue a token; these roles gate administrative and
///      verification actions on registries and the donation manager only.
library Roles {
    /// @notice Can pause/unpause a contract and manage other roles.
    bytes32 internal constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    /// @notice Can approve, suspend, or reinstate community agents.
    bytes32 internal constant COORDINATOR_ROLE = keccak256("COORDINATOR_ROLE");

    /// @notice Can issue learning certificates to participants.
    bytes32 internal constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    /// @notice Can record verified reforestation activity.
    bytes32 internal constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    /// @notice Can withdraw donated funds to an approved beneficiary.
    bytes32 internal constant WITHDRAWER_ROLE = keccak256("WITHDRAWER_ROLE");

    /// @notice Can create governance proposals.
    bytes32 internal constant PROPOSER_ROLE = keccak256("PROPOSER_ROLE");

    /// @notice Can cast votes on governance proposals.
    bytes32 internal constant VOTER_ROLE = keccak256("VOTER_ROLE");
}
