// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.27;

/// @title IImpactRegistry
/// @notice Interface for recording verified reforestation activity.
interface IImpactRegistry {
    struct PlantingRecord {
        bytes32 projectId;
        address reportedBy;
        uint32 treeCount;
        string evidenceURI; // IPFS URI: photos + geolocation metadata
        uint64 recordedAt;
    }

    event ProjectCreated(bytes32 indexed projectId, string metadataURI);
    event PlantingRecorded(
        bytes32 indexed projectId,
        uint256 indexed recordId,
        address indexed reportedBy,
        uint32 treeCount
    );

    function createProject(bytes32 projectId, string calldata metadataURI) external;

    function recordPlanting(
        bytes32 projectId,
        uint32 treeCount,
        string calldata evidenceURI
    ) external returns (uint256 recordId);

    function totalTreesFor(bytes32 projectId) external view returns (uint256);

    function recordCount() external view returns (uint256);

    function getRecord(uint256 recordId) external view returns (PlantingRecord memory);
}
