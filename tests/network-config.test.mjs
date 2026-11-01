import assert from "node:assert/strict";
import test from "node:test";

import {
  getNetworkConfig,
  getSupportedChainIds,
  getTokenConfig,
  isSupportedWalletNetwork,
  resolveEnvironmentMode,
} from "../lib/network/config.mjs";

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

test("environment variables cannot enable another chain", () => {
  process.env.NEXT_PUBLIC_APP_ENV = "mainnet";
  process.env.NEXT_PUBLIC_CELO_NETWORK = "celo";
  process.env.NEXT_PUBLIC_CELO_CHAIN_ID = "42220";
  process.env.NEXT_PUBLIC_CELO_RPC_URL = "https://forno.celo.org";
  process.env.NEXT_PUBLIC_USDM_ADDRESS = "0x0000000000000000000000000000000000000001";

  assert.equal(resolveEnvironmentMode(), "testnet");
  assert.deepEqual(getSupportedChainIds(), [11142220]);
  assert.equal(getNetworkConfig(42220), undefined);
  assert.equal(isSupportedWalletNetwork(42220), false);
});
