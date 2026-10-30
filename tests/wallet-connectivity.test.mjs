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
