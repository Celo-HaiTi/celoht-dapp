import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createConfig, http } from "wagmi";
import { celoSepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { connect, disconnect, watchAccount } from "wagmi/actions";
import { getWalletConnectionStatus } from "../lib/web3/wallet-status.ts";
import { getMiniPayProvider, isMiniPayProvider } from "../lib/web3/minipay.ts";
import { resolveWalletConnectProjectId } from "../lib/web3/walletconnect-project-id.ts";
import { getTransactionStatus } from "../lib/web3/transaction-status.ts";
import { getWalletChainId } from "../lib/web3/useWalletChainId.ts";

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

test("active wallet chain overrides the configured default and falls back when disconnected", () => {
  assert.equal(getWalletChainId(1), 1);
  assert.equal(getWalletChainId(11142220), 11142220);
  assert.equal(getWalletChainId(), 11142220);
});

test("transaction status distinguishes approval, submission, pending, confirmation, failure, and rejection", () => {
  assert.equal(getTransactionStatus({ isAwaitingApproval: true }), "awaiting_approval");
  assert.equal(getTransactionStatus({ transactionHash: "0xabc" }), "submitted");
  assert.equal(getTransactionStatus({ transactionHash: "0xabc", isReceiptPending: true }), "pending");
  assert.equal(getTransactionStatus({ transactionHash: "0xabc", receiptStatus: "success" }), "confirmed");
  assert.equal(getTransactionStatus({ transactionHash: "0xabc", receiptStatus: "reverted" }), "failed");
  assert.equal(getTransactionStatus({ error: new Error("RPC unavailable") }), "failed");
  assert.equal(getTransactionStatus({ error: Object.assign(new Error("User rejected request"), { code: 4001 }) }), "rejected");
  assert.equal(getTransactionStatus({ error: new Error("Connector error", { cause: Object.assign(new Error("User denied"), { code: 4001 }) }) }), "rejected");
});

test("Wagmi injected connector tracks account and chain events and disconnects", async (context) => {
  let accounts = ["0x1111111111111111111111111111111111111111"];
  let chainId = "0xaa044c";
  const listeners = new Map();
  const provider = {
    async request({ method }) {
      if (method === "eth_requestAccounts" || method === "eth_accounts") return accounts;
      if (method === "eth_chainId") return chainId;
      throw new Error(`Unsupported provider request: ${method}`);
    },
    on(event, listener) {
      const callbacks = listeners.get(event) ?? new Set();
      callbacks.add(listener);
      listeners.set(event, callbacks);
    },
    removeListener(event, listener) {
      listeners.get(event)?.delete(listener);
    },
    emit(event, value) {
      for (const listener of listeners.get(event) ?? []) listener(value);
    },
  };
  const previousWindow = globalThis.window;
  context.after(() => {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  });
  globalThis.window = { ethereum: provider, addEventListener() {}, removeEventListener() {}, dispatchEvent() {} };
  const config = createConfig({
    chains: [celoSepolia],
    connectors: [injected({ target: () => ({ id: "test-injected", name: "Test injected wallet", provider }), shimDisconnect: false })],
    transports: { [celoSepolia.id]: http() },
    ssr: true,
  });
  const connector = config.connectors[0];
  const accountStates = [];
  const unwatchAccount = watchAccount(config, { onChange: (state) => accountStates.push(state) });

  await connect(config, { connector });
  assert.equal(accountStates.at(-1).status, "connected");
  assert.equal(accountStates.at(-1).address, accounts[0]);

  accounts = ["0x2222222222222222222222222222222222222222"];
  provider.emit("accountsChanged", accounts);
  await new Promise(setImmediate);
  assert.equal(accountStates.at(-1).address, accounts[0]);

  chainId = "0x1";
  provider.emit("chainChanged", chainId);
  await new Promise(setImmediate);
  assert.equal(accountStates.at(-1).chainId, 1);
  assert.equal(getWalletConnectionStatus({ isConnected: true, accountStatus: "connected", chainId: getWalletChainId(accountStates.at(-1).chainId), supportedChainId: celoSepolia.id }), "wrong_network");

  provider.emit("disconnect", { code: 4900, message: "Provider disconnected" });
  await new Promise(setImmediate);
  assert.equal(accountStates.at(-1).status, "disconnected");

  await connect(config, { connector });
  await disconnect(config, { connector });
  assert.equal(accountStates.at(-1).status, "disconnected");
  unwatchAccount();
});

test("WalletConnect validates both supported project ID variables", () => {
  const config = readFileSync(new URL("../config.ts", import.meta.url), "utf8");
  const workflow = readFileSync(new URL("../.github/workflows/deploy-pages.yml", import.meta.url), "utf8");
  const validProjectId = "a1b2c3d4e5f60718293a4b5c6d7e8f90";
  assert.deepEqual(resolveWalletConnectProjectId(validProjectId), { projectId: validProjectId });
  assert.deepEqual(resolveWalletConnectProjectId("", validProjectId), { projectId: validProjectId });
  assert.deepEqual(resolveWalletConnectProjectId(validProjectId, validProjectId), { projectId: validProjectId });
  assert.deepEqual(resolveWalletConnectProjectId(""), { error: "missing" });
  assert.deepEqual(resolveWalletConnectProjectId("invalid"), { error: "invalid" });
  assert.deepEqual(resolveWalletConnectProjectId(validProjectId, "00000000000000000000000000000000"), { error: "conflict" });
  assert.match(config, /NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID/);
  assert.match(config, /NEXT_PUBLIC_REOWN_PROJECT_ID/);
  assert.match(config, /walletConnectProjectIdConfig\.projectId/);
  assert.match(workflow, /NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: \$\{\{ vars\.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID \|\| vars\.NEXT_PUBLIC_REOWN_PROJECT_ID \}\}/);
  assert.doesNotMatch(config, /02d9a7daa098b201a99a7da3769392b2/);
});

test("Wagmi WalletConnect initialization is conditional and Sepolia-only", () => {
  const config = readFileSync(new URL("../config.ts", import.meta.url), "utf8");
  assert.match(config, /walletConnectProjectIdConfig\.projectId/);
  assert.match(config, /\.\.\.\(walletConnectProjectId\s*\?/);
  assert.match(config, /walletConnect\(\{\s*projectId: walletConnectProjectId/);
  assert.match(config, /from "wagmi\/connectors\/injected"/);
  assert.match(config, /from "wagmi\/connectors\/walletConnect"/);
  assert.doesNotMatch(config, /from "wagmi\/connectors"/);
  assert.match(config, /chains: \[celoSepolia\]/);
  assert.doesNotMatch(config, /chains:\s*\[[^\]]*celo\s*,/);
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

  const previousWindow = globalThis.window;
  const directProvider = { isMiniPay: true, request };
  try {
    globalThis.window = { ethereum: directProvider };
    assert.equal(getMiniPayProvider(), directProvider);
    globalThis.window = { ethereum: { providers: [{ request }, directProvider] } };
    assert.equal(getMiniPayProvider(), directProvider);
    globalThis.window = { ethereum: { request } };
    assert.equal(getMiniPayProvider(), null);
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
});

test("contract writes stay on Sepolia and never auto-submit after approval", () => {
  const agents = readFileSync(new URL("../app/agents/page.tsx", import.meta.url), "utf8");
  const donations = readFileSync(new URL("../app/donations/page.tsx", import.meta.url), "utf8");
  const wallet = readFileSync(new URL("../app/wallet/page.tsx", import.meta.url), "utf8");
  const connectButton = readFileSync(new URL("../ConnectWalletButton.tsx", import.meta.url), "utf8");
  for (const source of [agents, donations, wallet, connectButton]) {
    assert.match(source, /useWalletChainId/);
    assert.doesNotMatch(source, /useChainId/);
  }
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
  assert.match(wallet, /receiptStatus: txReceipt\.data\?\.status/);
  assert.match(wallet, /txState === "confirmed"/);
  assert.match(wallet, /Wallet approval rejected/);
  assert.doesNotMatch(wallet, /getExplorerUrlForChain\(chainId\) \?\? "https:\/\/celoscan\.io"/);
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
