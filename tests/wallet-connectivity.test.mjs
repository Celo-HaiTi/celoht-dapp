import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { getWalletConnectionStatus } from "../lib/web3/wallet-status.ts";
import { isMiniPayProvider } from "../lib/web3/minipay.ts";
import { resolveWalletConnectProjectId } from "../lib/web3/walletconnect-project-id.ts";

test("wallet connection status represents the complete lifecycle", () => {
  const supportedChainId = 11142220;
  assert.equal(getWalletConnectionStatus({ accountStatus: "disconnected", isConnected: false, supportedChainId }), "disconnected");
  assert.equal(getWalletConnectionStatus({ accountStatus: "connecting", isConnected: false, supportedChainId }), "connecting");
  assert.equal(getWalletConnectionStatus({ accountStatus: "reconnecting", isConnected: false, supportedChainId }), "reconnecting");
  assert.equal(getWalletConnectionStatus({ isDisconnecting: true, isConnected: true, supportedChainId }), "disconnecting");
  assert.equal(getWalletConnectionStatus({ hasError: true, isConnected: false, supportedChainId }), "error");
  assert.equal(getWalletConnectionStatus({ accountStatus: "connected", isConnected: true, chainId: supportedChainId, supportedChainId }), "connected");
  assert.equal(getWalletConnectionStatus({ accountStatus: "connected", isConnected: true, chainId: 1, supportedChainId }), "wrong_network");
});

test("WalletConnect validates both supported project ID variables", () => {
  const config = readFileSync(new URL("../config.ts", import.meta.url), "utf8");
  const workflow = readFileSync(new URL("../.github/workflows/deploy-pages.yml", import.meta.url), "utf8");
  const validProjectId = "a1b2c3d4e5f60718293a4b5c6d7e8f90";
  assert.deepEqual(resolveWalletConnectProjectId(validProjectId), { projectId: validProjectId });
  assert.deepEqual(resolveWalletConnectProjectId("", validProjectId), { projectId: validProjectId });
  assert.deepEqual(resolveWalletConnectProjectId(""), { error: "missing" });
  assert.deepEqual(resolveWalletConnectProjectId("invalid"), { error: "invalid" });
  assert.deepEqual(resolveWalletConnectProjectId(validProjectId, "00000000000000000000000000000000"), { error: "conflict" });
  assert.match(config, /NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID/);
  assert.match(config, /NEXT_PUBLIC_REOWN_PROJECT_ID/);
  assert.match(config, /walletConnectProjectIdConfig\.projectId/);
  assert.match(workflow, /NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: \$\{\{ vars\.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID \|\| vars\.NEXT_PUBLIC_REOWN_PROJECT_ID \}\}/);
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

test("MiniPay detection requires the documented provider marker and request interface", () => {
  const helper = readFileSync(new URL("../lib/web3/minipay.ts", import.meta.url), "utf8");
  const request = async () => [];
  assert.equal(isMiniPayProvider({ isMiniPay: true, request }), true);
  assert.equal(isMiniPayProvider({ isMiniPay: false, request }), false);
  assert.equal(isMiniPayProvider({ request }), false);
  assert.equal(isMiniPayProvider(null), false);
  assert.match(helper, /Array\.isArray\(ethereum\.providers\)/);
  assert.match(helper, /ethereum\.providers\.find\(isMiniPayProvider\)/);
});

test("contract writes stay on Sepolia and never auto-submit after approval", () => {
  const agents = readFileSync(new URL("../app/agents/page.tsx", import.meta.url), "utf8");
  const donations = readFileSync(new URL("../app/donations/page.tsx", import.meta.url), "utf8");
  const wallet = readFileSync(new URL("../app/wallet/page.tsx", import.meta.url), "utf8");
  assert.match(agents, /chainId !== celoSepolia\.id/);
  assert.match(agents, /chainId: celoSepolia\.id/);
  assert.match(agents, /Continue registration/);
  assert.doesNotMatch(agents, /useEffect/);
  assert.match(donations, /chainId !== celoSepolia\.id/);
  assert.match(donations, /chainId: celoSepolia\.id/);
  assert.match(donations, /Continue donation/);
  assert.doesNotMatch(donations, /useEffect/);
  assert.match(wallet, /chainId !== celoSepolia\.id/);
  assert.match(wallet, /chainId: celoSepolia\.id/);
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
