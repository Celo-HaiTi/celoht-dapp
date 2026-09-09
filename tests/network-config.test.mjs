import assert from "node:assert/strict";
import test from "node:test";

import {
  getNetworkConfig,
  getSupportedChainIds,
  getTokenConfig,
  isSupportedWalletNetwork,
  resolveEnvironmentMode,
} from "../lib/network/config.ts";

test("network layer exposes a supported testnet configuration without fake mainnet assumptions", () => {
  const config = getNetworkConfig(11142220);
  assert.ok(config, "Celo Sepolia config should exist");
  assert.equal(config.name, "Celo Sepolia");
  assert.equal(config.network, "testnet");
  assert.equal(config.tokens.usdm.symbol, "USDm");
  assert.equal(config.tokens.usdm.decimals, 18);
  assert.deepEqual(getSupportedChainIds(), [11142220]);
  assert.equal(isSupportedWalletNetwork(11142220), true);
  assert.equal(isSupportedWalletNetwork(42220), false);
  assert.equal(getTokenConfig(11142220, "USDm")?.symbol, "USDm");
});

test("environment mode resolves safely even before mainnet activation", () => {
  const mode = resolveEnvironmentMode();
  assert.ok(["testnet", "mainnet"].includes(mode));
  assert.equal(mode, "testnet");
});
