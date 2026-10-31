import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("wallet connection status covers disconnected, network, and provider states", () => {
  const status = readFileSync(new URL("../lib/web3/wallet-status.ts", import.meta.url), "utf8");
  assert.match(status, /Wrong Network/);
  assert.match(status, /Network Offline/);
  assert.match(status, /Provider Unavailable/);
  assert.match(status, /Connection Error/);
});

test("WalletConnect is disabled without an explicitly configured project ID", () => {
  const config = readFileSync(new URL("../config.ts", import.meta.url), "utf8");
  assert.match(config, /NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID\?\.trim\(\) \|\| ""/);
  assert.doesNotMatch(config, /02d9a7daa098b201a99a7da3769392b2/);
});

test("wallet UI exposes three provider choices and Sepolia-only switching", () => {
  const modal = readFileSync(new URL("../ConnectWalletButton.tsx", import.meta.url), "utf8");
  assert.match(modal, />WalletConnect</);
  assert.match(modal, />Valora App</);
  assert.match(modal, />MiniPay</);
  assert.match(modal, /chainId: celoSepolia\.id/);
  assert.match(modal, /NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID/);
  assert.doesNotMatch(modal, /Switch to Celo\"/);
});

test("MiniPay uses real provider permissions and chain verification", () => {
  const helper = readFileSync(new URL("../lib/web3/minipay.ts", import.meta.url), "utf8");
  assert.match(helper, /eth_requestAccounts/);
  assert.match(helper, /eth_chainId/);
  assert.match(helper, /wallet_switchEthereumChain/);
  assert.match(helper, /wallet_addEthereumChain/);
  assert.match(helper, /0xaa044c/);
});

test("wallet balances and activity do not present invented fiat or history", () => {
  const wallet = readFileSync(new URL("../app/wallet/page.tsx", import.meta.url), "utf8");
  assert.match(wallet, /useEstimateGas/);
  assert.match(wallet, /useGasPrice/);
  assert.match(wallet, /Confirm transfer details/);
  assert.match(wallet, /No fiat price feed is configured/);
  assert.match(wallet, /An indexed history service is not configured/);
  assert.doesNotMatch(wallet, /Jean|\$250\.00|\$1,280\.50|640/);
  assert.doesNotMatch(wallet, /\$\{usdmDisplay\}/);
});
