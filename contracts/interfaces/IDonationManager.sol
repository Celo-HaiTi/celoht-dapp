// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.27;

/// @title IDonationManager
/// @notice Interface for accepting CELO and ERC-20 donations earmarked to a
///         specific CeloHT project, such as a reforestation campaign.
interface IDonationManager {
    event Donated(
        address indexed donor,
        bytes32 indexed projectId,
        address indexed asset,
        uint256 amount,
        uint256 fee,
        address recipient,
        string memoURI
    );
    event Withdrawn(bytes32 indexed projectId, address indexed asset, address indexed to, uint256 amount);
    event ProjectRegistered(bytes32 indexed projectId, address indexed recipient, string metadataURI);
    event ProjectRecipientUpdated(bytes32 indexed projectId, address indexed previousRecipient, address indexed newRecipient);
    event PlatformFeeUpdated(uint256 previousBps, uint256 newBps);

    function registerProject(bytes32 projectId, address recipient, string calldata metadataURI) external;

    function donate(bytes32 projectId, uint256 amount, string calldata memoURI) external;

    function donateCelo(bytes32 projectId, string calldata memoURI) external payable;

    function withdraw(bytes32 projectId, address to, uint256 amount) external;

    function withdrawCelo(bytes32 projectId, uint256 amount) external;

    function setProjectRecipient(bytes32 projectId, address newRecipient) external;

    function totalDonatedTo(bytes32 projectId) external view returns (uint256);

    function totalDonatedBy(address donor) external view returns (uint256);

    function totalCeloDonatedTo(bytes32 projectId) external view returns (uint256);

    function totalCeloDonatedBy(address donor) external view returns (uint256);

    function availableBalance(bytes32 projectId) external view returns (uint256);

    function availableCeloBalance(bytes32 projectId) external view returns (uint256);

    function projectRecipient(bytes32 projectId) external view returns (address);
}
