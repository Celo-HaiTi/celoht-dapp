// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.27;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IDonationManager} from "./interfaces/IDonationManager.sol";
import {Roles} from "./libraries/Roles.sol";
import {BasisPoints} from "./libraries/BasisPoints.sol";

/// @title DonationManager
/// @notice Accepts ERC-20 donations (in practice, USDm on Celo) earmarked
///         to a specific CeloHT project — most commonly a reforestation
///         campaign — and lets an approved withdrawer route funds to that
///         project's beneficiary. This contract does not create, hold, or
///         distribute any token of its own; it only custodies an existing
///         ERC-20 (the donation asset) on behalf of registered projects.
/// @dev The platform fee defaults to 0 and is hard-capped at 5% (500 bps)
///      in code — it can only be raised by an ADMIN_ROLE holder, and only
///      up to that cap, so a compromised or malicious admin key cannot
///      redirect more than 5% of any donation.
contract DonationManager is IDonationManager, AccessControl, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    using BasisPoints for uint256;

    uint256 public constant MAX_PLATFORM_FEE_BPS = 500; // hard cap: 5%

    IERC20 public immutable donationToken;
    address public feeRecipient;
    uint256 public platformFeeBps;

    mapping(bytes32 => bool) public projectExists;
    mapping(bytes32 => uint256) private _totalDonatedTo;
    mapping(bytes32 => uint256) private _availableBalance;
    mapping(address => uint256) private _totalDonatedBy;

    constructor(address admin, address donationToken_, address feeRecipient_) {
        require(donationToken_ != address(0), "DonationManager: zero token");
        require(feeRecipient_ != address(0), "DonationManager: zero fee recipient");

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(Roles.ADMIN_ROLE, admin);
        _grantRole(Roles.WITHDRAWER_ROLE, admin);

        donationToken = IERC20(donationToken_);
        feeRecipient = feeRecipient_;
    }

    /// @inheritdoc IDonationManager
    function registerProject(
        bytes32 projectId,
        string calldata metadataURI
    ) external onlyRole(Roles.ADMIN_ROLE) {
        require(!projectExists[projectId], "DonationManager: project exists");
        projectExists[projectId] = true;
        emit ProjectRegistered(projectId, metadataURI);
    }

    /// @inheritdoc IDonationManager
    function donate(
        bytes32 projectId,
        uint256 amount,
        string calldata memoURI
    ) external whenNotPaused nonReentrant {
        require(projectExists[projectId], "DonationManager: unknown project");
        require(amount > 0, "DonationManager: zero amount");

        donationToken.safeTransferFrom(msg.sender, address(this), amount);

        uint256 fee = amount.applyBps(platformFeeBps);
        uint256 net = amount - fee;

        _availableBalance[projectId] += net;
        _totalDonatedTo[projectId] += amount;
        _totalDonatedBy[msg.sender] += amount;

        if (fee > 0) {
            donationToken.safeTransfer(feeRecipient, fee);
        }

        emit Donated(msg.sender, projectId, amount, fee, memoURI);
    }

    /// @inheritdoc IDonationManager
    function withdraw(
        bytes32 projectId,
        address to,
        uint256 amount
    ) external onlyRole(Roles.WITHDRAWER_ROLE) whenNotPaused nonReentrant {
        require(to != address(0), "DonationManager: zero recipient");
        require(
            amount > 0 && amount <= _availableBalance[projectId],
            "DonationManager: insufficient balance"
        );

        _availableBalance[projectId] -= amount;
        donationToken.safeTransfer(to, amount);

        emit Withdrawn(projectId, to, amount);
    }

    function setPlatformFeeBps(uint256 newBps) external onlyRole(Roles.ADMIN_ROLE) {
        require(newBps <= MAX_PLATFORM_FEE_BPS, "DonationManager: exceeds fee cap");
        emit PlatformFeeUpdated(platformFeeBps, newBps);
        platformFeeBps = newBps;
    }

    function setFeeRecipient(address newRecipient) external onlyRole(Roles.ADMIN_ROLE) {
        require(newRecipient != address(0), "DonationManager: zero fee recipient");
        feeRecipient = newRecipient;
    }

    /// @inheritdoc IDonationManager
    function totalDonatedTo(bytes32 projectId) external view returns (uint256) {
        return _totalDonatedTo[projectId];
    }

    /// @inheritdoc IDonationManager
    function totalDonatedBy(address donor) external view returns (uint256) {
        return _totalDonatedBy[donor];
    }

    /// @inheritdoc IDonationManager
    function availableBalance(bytes32 projectId) external view returns (uint256) {
        return _availableBalance[projectId];
    }

    function pause() external onlyRole(Roles.ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(Roles.ADMIN_ROLE) {
        _unpause();
    }
}
