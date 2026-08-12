// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.27;

/// @title IDonationManager
/// @notice Interface for accepting ERC-20 donations (e.g. cUSD) earmarked
///         to a specific CeloHT project, such as a reforestation campaign.
interface IDonationManager {
    event Donated(
        address indexed donor,
        bytes32 indexed projectId,
        uint256 amount,
        uint256 fee,
        string memoURI
    );
    event Withdrawn(bytes32 indexed projectId, address indexed to, uint256 amount);
    event ProjectRegistered(bytes32 indexed projectId, string metadataURI);
    event PlatformFeeUpdated(uint256 previousBps, uint256 newBps);

    function registerProject(bytes32 projectId, string calldata metadataURI) external;

    function donate(bytes32 projectId, uint256 amount, string calldata memoURI) external;

    function withdraw(bytes32 projectId, address to, uint256 amount) external;

    function totalDonatedTo(bytes32 projectId) external view returns (uint256);

    function totalDonatedBy(address donor) external view returns (uint256);

    function availableBalance(bytes32 projectId) external view returns (uint256);
}
