// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.27;

/// @title BasisPoints
/// @notice Minimal fixed-point helper for basis-point (1/100th of a
///         percent) calculations, used by DonationManager to compute an
///         optional, capped platform fee.
library BasisPoints {
    uint256 internal constant MAX_BPS = 10_000; // 100.00%

    error BasisPointsOverflow(uint256 value);

    /// @notice Returns `amount * bps / 10_000`, rounded down.
    function applyBps(uint256 amount, uint256 bps) internal pure returns (uint256) {
        if (bps > MAX_BPS) revert BasisPointsOverflow(bps);
        return (amount * bps) / MAX_BPS;
    }
}
