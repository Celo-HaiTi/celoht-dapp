// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.27;

/// @title ICertificateRegistry
/// @notice Interface for CeloHT's soulbound (non-transferable) education
///         certificates, issued as ERC-721 tokens.
interface ICertificateRegistry {
    event CertificateIssued(
        uint256 indexed tokenId,
        address indexed recipient,
        string courseId,
        string tokenURI
    );
    event CertificateRevoked(uint256 indexed tokenId, string reason);

    function issueCertificate(
        address recipient,
        string calldata courseId,
        string calldata tokenURI
    ) external returns (uint256 tokenId);

    function revokeCertificate(uint256 tokenId, string calldata reason) external;

    function certificatesOf(address recipient) external view returns (uint256[] memory);

    function courseIdOf(uint256 tokenId) external view returns (string memory);
}
