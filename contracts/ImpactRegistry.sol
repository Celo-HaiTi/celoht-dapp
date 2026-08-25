// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.27;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {IImpactRegistry} from "./interfaces/IImpactRegistry.sol";
import {Roles} from "./libraries/Roles.sol";

/// @title ImpactRegistry
/// @notice Records verified tree-planting activity for CeloHT reforestation
///         projects. Only accounts holding VERIFIER_ROLE may log a planting
///         record, keeping the on-chain count tied to activity that has
///         actually been reviewed (e.g. against submitted photo and
///         geolocation evidence pinned to IPFS), rather than self-reported
///         numbers.
contract ImpactRegistry is IImpactRegistry, AccessControl, Pausable {
    mapping(bytes32 => bool) public projectExists;
    mapping(bytes32 => uint256) private _totalTreesFor;

    PlantingRecord[] private _records;

    constructor(address admin) {
        require(admin != address(0), "ImpactRegistry: zero admin");
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(Roles.ADMIN_ROLE, admin);
        _grantRole(Roles.VERIFIER_ROLE, admin);
    }

    /// @inheritdoc IImpactRegistry
    function createProject(
        bytes32 projectId,
        string calldata metadataURI
    ) external onlyRole(Roles.ADMIN_ROLE) {
        require(!projectExists[projectId], "ImpactRegistry: project exists");
        projectExists[projectId] = true;
        emit ProjectCreated(projectId, metadataURI);
    }

    /// @inheritdoc IImpactRegistry
    function recordPlanting(
        bytes32 projectId,
        uint32 treeCount,
        string calldata evidenceURI
    ) external onlyRole(Roles.VERIFIER_ROLE) whenNotPaused returns (uint256 recordId) {
        require(projectExists[projectId], "ImpactRegistry: unknown project");
        require(treeCount > 0, "ImpactRegistry: zero trees");
        require(bytes(evidenceURI).length > 0, "ImpactRegistry: missing evidence");

        recordId = _records.length;
        _records.push(
            PlantingRecord({
                projectId: projectId,
                reportedBy: msg.sender,
                treeCount: treeCount,
                evidenceURI: evidenceURI,
                recordedAt: uint64(block.timestamp)
            })
        );

        _totalTreesFor[projectId] += treeCount;

        emit PlantingRecorded(projectId, recordId, msg.sender, treeCount);
    }

    /// @inheritdoc IImpactRegistry
    function totalTreesFor(bytes32 projectId) external view returns (uint256) {
        return _totalTreesFor[projectId];
    }

    /// @inheritdoc IImpactRegistry
    function recordCount() external view returns (uint256) {
        return _records.length;
    }

    /// @inheritdoc IImpactRegistry
    function getRecord(uint256 recordId) external view returns (PlantingRecord memory) {
        require(recordId < _records.length, "ImpactRegistry: invalid recordId");
        return _records[recordId];
    }

    function pause() external onlyRole(Roles.ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(Roles.ADMIN_ROLE) {
        _unpause();
    }
}
