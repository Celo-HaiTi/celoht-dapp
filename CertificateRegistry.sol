// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.27;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ICertificateRegistry} from "./interfaces/ICertificateRegistry.sol";
import {Roles} from "./libraries/Roles.sol";

/// @title CertificateRegistry
/// @notice Soulbound (non-transferable) ERC-721 certificates issued to
///         participants who complete a CeloHT education module. Certificates
///         cannot be sold or transferred — they exist purely as a portable,
///         verifiable record of completed learning, not as a collectible
///         or financial asset.
contract CertificateRegistry is ICertificateRegistry, ERC721, AccessControl, Pausable {
    uint256 private _nextTokenId = 1;

    mapping(uint256 => string) private _courseIdOf;
    mapping(address => uint256[]) private _certificatesOf;
    mapping(uint256 => bool) private _revoked;
    mapping(uint256 => string) private _tokenURIs;

    constructor(address admin) ERC721("CeloHT Certificate", "CELOHT-CERT") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(Roles.ADMIN_ROLE, admin);
        _grantRole(Roles.ISSUER_ROLE, admin);
    }

    /// @inheritdoc ICertificateRegistry
    function issueCertificate(
        address recipient,
        string calldata courseId,
        string calldata tokenURI_
    ) external onlyRole(Roles.ISSUER_ROLE) whenNotPaused returns (uint256 tokenId) {
        require(recipient != address(0), "CertificateRegistry: zero recipient");
        require(bytes(courseId).length > 0, "CertificateRegistry: empty courseId");

        tokenId = _nextTokenId++;
        _safeMint(recipient, tokenId);
        _courseIdOf[tokenId] = courseId;
        _tokenURIs[tokenId] = tokenURI_;
        _certificatesOf[recipient].push(tokenId);

        emit CertificateIssued(tokenId, recipient, courseId, tokenURI_);
    }

    /// @inheritdoc ICertificateRegistry
    function revokeCertificate(
        uint256 tokenId,
        string calldata reason
    ) external onlyRole(Roles.ISSUER_ROLE) {
        require(_ownerOf(tokenId) != address(0), "CertificateRegistry: nonexistent token");
        require(!_revoked[tokenId], "CertificateRegistry: already revoked");
        _revoked[tokenId] = true;
        emit CertificateRevoked(tokenId, reason);
    }

    /// @inheritdoc ICertificateRegistry
    function certificatesOf(address recipient) external view returns (uint256[] memory) {
        return _certificatesOf[recipient];
    }

    /// @inheritdoc ICertificateRegistry
    function courseIdOf(uint256 tokenId) external view returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "CertificateRegistry: nonexistent token");
        return _courseIdOf[tokenId];
    }

    function isRevoked(uint256 tokenId) external view returns (bool) {
        return _revoked[tokenId];
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return _tokenURIs[tokenId];
    }

    /// @dev Soulbound enforcement: block every transfer except minting
    ///      (`from == address(0)`) and burning (`to == address(0)`).
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override whenNotPaused returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert("CertificateRegistry: certificates are non-transferable");
        }
        return super._update(to, tokenId, auth);
    }

    function pause() external onlyRole(Roles.ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(Roles.ADMIN_ROLE) {
        _unpause();
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
