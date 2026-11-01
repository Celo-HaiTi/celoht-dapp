"use client";

import { useState } from "react";
import { useAccount, useBalance, useChainId, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { celoSepolia } from "wagmi/chains";
import { Check, Copy, ExternalLink, LoaderCircle, LogOut, ShieldAlert, Smartphone, Wallet } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/Dialog";
import { formatTokenAmount, shortenAddress } from "@/lib/utils";
import { getExplorerUrlForChain } from "@/lib/network/config";
import { useI18n } from "@/lib/i18n/context";
import { useUsdmBalance } from "@/lib/web3/useUsdmBalance";
import { getWalletConnectionStatus } from "@/lib/web3/wallet-status";
import { getMiniPayProvider } from "@/lib/web3/minipay";
import { isWalletConnectConfigured, walletConnectProjectIdConfig } from "@/config";

export function ConnectWalletButton() {
  const { address, chain, connector, isConnected, status: accountStatus } = useAccount();
  const chainId = useChainId();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnectAsync, isPending: isDisconnecting } = useDisconnect();
  const { switchChain, isPending: isSwitching, error: switchError } = useSwitchChain();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const celoBalance = useBalance({ address, query: { enabled: Boolean(address) } });
  const usdmBalance = useUsdmBalance(address, chainId);
  const connectionStatus = getWalletConnectionStatus({
    accountStatus: isConnecting ? "connecting" : accountStatus,
    isDisconnecting,
    hasError: Boolean(connectionError),
    isConnected,
    chainId,
    supportedChainId: celoSepolia.id,
  });
  const explorerUrl = getExplorerUrlForChain(chain?.id);
  const isMiniPay = typeof window !== "undefined" && Boolean(getMiniPayProvider());

  function describeError(error: Error, providerName: string) {
    const code = "code" in error ? Number(error.code) : undefined;
    const message = error.message.toLowerCase();
    if (code === 4001 || message.includes("user rejected") || message.includes("user denied") || message.includes("rejected")) {
      return `${providerName}: ${t("errors.connectionCancelled")}`;
    }
    if (message.includes("expired") || message.includes("timeout")) {
      return `${providerName}: The connection request expired. Reopen the wallet prompt and try again.`;
    }
    if (message.includes("project id") || message.includes("unauthorized domain") || message.includes("origin")) {
      return `${providerName}: Check that the Reown project ID is valid and allows this site origin.`;
    }
    if (message.includes("provider not found") || message.includes("provider unavailable")) {
      return providerName === "MiniPay"
        ? "MiniPay is unavailable. Open CeloHT inside the MiniPay app to connect."
        : `${providerName}: ${t("errors.providerUnavailable")}`;
    }
    if (message.includes("session") || message.includes("pairing") || message.includes("qr")) {
      return `${providerName}: The wallet session was not approved. Reopen the QR or wallet link and try again.`;
    }
    return `${providerName}: ${t("errors.tryAgain")}`;
  }

  function connectWith(walletConnector: (typeof connectors)[number], providerName: string) {
    setConnectionError(null);
    connect(
      { connector: walletConnector },
      {
        onSuccess: () => {
          setConnectionError(null);
          setOpen(false);
        },
        onError: (error) => setConnectionError(describeError(error, providerName)),
      },
    );
  }

  function connectMiniPay() {
    setConnectionError(null);
    if (!getMiniPayProvider()) {
      setConnectionError("MiniPay is not available in this browser. Open CeloHT inside MiniPay to connect.");
      return;
    }
    const miniPayConnector = connectors.find((item) => item.id === "minipay");
    if (!miniPayConnector) {
      setConnectionError("MiniPay's verified wallet connector is unavailable. Reload CeloHT inside MiniPay and try again.");
      return;
    }
    connectWith(miniPayConnector, "MiniPay");
  }

  function connectBrowserWallet() {
    const injectedConnector = connectors.find((item) => item.id === "injected");
    if (!injectedConnector) {
      setConnectionError("No injected browser wallet connector is available.");
      return;
    }
    connectWith(injectedConnector, "Browser wallet");
  }

  function disconnectWallet() {
    setConnectionError(null);
    void disconnectAsync().catch((error: unknown) => {
      setConnectionError(describeError(error instanceof Error ? error : new Error("Wallet disconnection failed."), connector?.name ?? "Wallet"));
    });
  }

  async function copyAddress() {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setConnectionError("Unable to copy the address from this browser.");
    }
  }

  const walletName = connector?.id === "minipay" ? "MiniPay" : connector?.name ?? "Connected wallet";

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-left sm:flex"
          aria-label="Open wallet details"
        >
          <span className={`h-2 w-2 rounded-full ${connectionStatus === "connected" ? "bg-emerald-400" : "bg-amber-400"}`} />
          <span>
            <span className="block text-[10px] uppercase tracking-[0.14em] text-parchment-100/45">{walletName}</span>
            <span className="font-mono text-xs text-white">{shortenAddress(address)}</span>
          </span>
        </button>
        <Button variant="secondary" size="sm" onClick={disconnectWallet} disabled={isDisconnecting}>
          <span className="font-mono sm:hidden">{shortenAddress(address)}</span>
          {isDisconnecting ? <LoaderCircle size={14} className="animate-spin" aria-label="Disconnecting" /> : <LogOut size={14} aria-hidden="true" />}
          <span className="sr-only">Disconnect wallet</span>
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent aria-describedby="wallet-details-description">
            <DialogTitle className="font-display text-xl font-semibold">{walletName}</DialogTitle>
            <DialogDescription id="wallet-details-description" className="mt-1 text-sm text-parchment-100/65">
              Connected through {connector?.name ?? "your wallet provider"} on {chain?.name ?? "an unknown network"}. Chain ID: {chainId || "unavailable"}. CeloHT supports Celo Sepolia (11142220) only.
            </DialogDescription>
            {connectionStatus === "wrong_network" && (
              <div className="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-100">
                <p>This wallet is on an unsupported network.</p>
                <Button size="sm" className="mt-3" onClick={() => switchChain({ chainId: celoSepolia.id })} disabled={isSwitching}>
                  {isSwitching ? "Switching..." : "Switch to Celo Sepolia"}
                </Button>
                {switchError && <p role="alert" className="mt-2 text-xs text-amber-100/80">Network switch was not supported or was rejected. Change networks in your wallet, then return here.</p>}
              </div>
            )}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.05] p-3">
                <p className="text-xs text-parchment-100/45">CELO</p>
                <p className="mt-2 font-mono text-sm text-white">{celoBalance.data ? formatTokenAmount(celoBalance.data.value, celoBalance.data.decimals) : celoBalance.isLoading ? "Loading" : "Unavailable"}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.05] p-3">
                <p className="text-xs text-parchment-100/45">USDm</p>
                <p className="mt-2 font-mono text-sm text-white">{usdmBalance.data ? formatTokenAmount(usdmBalance.data.value, usdmBalance.data.decimals) : usdmBalance.isLoading ? "Loading" : "Unavailable"}</p>
              </div>
            </div>
            <p className="mt-5 break-all rounded-xl border border-white/10 bg-black/10 p-3 font-mono text-xs text-parchment-100/65">{address}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={copyAddress}>
                {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
                {copied ? "Copied" : "Copy address"}
              </Button>
              {explorerUrl && <Button asChild size="sm" variant="secondary"><a href={`${explorerUrl}/address/${address}`} target="_blank" rel="noreferrer">Explorer <ExternalLink size={14} aria-hidden="true" /></a></Button>}
              <Button size="sm" variant="destructive" onClick={() => { disconnectWallet(); setOpen(false); }} disabled={isDisconnecting}>
                <LogOut size={14} aria-hidden="true" />{isDisconnecting ? "Disconnecting" : "Disconnect"}
              </Button>
            </div>
            {connectionError && <p className="mt-3 text-xs text-red-300" role="alert">{connectionError}</p>}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)} disabled={isConnecting}>
        {isConnecting ? <LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> : <Wallet size={16} aria-hidden="true" />}
        {isConnecting ? "Connecting" : t("wallet.connect")}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent aria-describedby="connect-wallet-description">
          <DialogTitle className="font-display text-xl font-semibold">{t("wallet.connect")}</DialogTitle>
          <DialogDescription id="connect-wallet-description" className="mt-1 text-sm text-parchment-100/70">
            Wallet approvals happen in your selected wallet. Never share a recovery phrase or private key. {t("settings.walletSafety")}
          </DialogDescription>
          <div className="mt-6 grid gap-3">
            <Button variant="secondary" className="min-h-14 justify-start" disabled={isConnecting || !isWalletConnectConfigured} onClick={() => {
              const walletConnectConnector = connectors.find((item) => item.id === "walletConnect");
              if (!walletConnectConnector) { setConnectionError("WalletConnect is unavailable. Configure a valid Reown project ID."); return; }
              connectWith(walletConnectConnector, "WalletConnect");
            }}>
              <Wallet size={18} aria-hidden="true" />
              <span className="flex flex-col items-start"><span>WalletConnect</span><span className="text-xs font-normal text-parchment-100/55">Scan a QR code or choose a compatible mobile wallet.</span></span>
            </Button>
            {!isWalletConnectConfigured && <p className="text-xs text-amber-200" role="alert">{walletConnectProjectIdConfig.error === "invalid" ? "The Reown project ID is invalid. Use the 32-character ID from cloud.reown.com." : walletConnectProjectIdConfig.error === "conflict" ? "The WalletConnect and Reown project ID variables differ. Set them to the same ID or configure only one." : "WalletConnect and Valora require NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID or NEXT_PUBLIC_REOWN_PROJECT_ID."}</p>}
            <Button variant="secondary" className="min-h-14 justify-start" disabled={isConnecting || !isWalletConnectConfigured} onClick={() => {
              const walletConnectConnector = connectors.find((item) => item.id === "walletConnect");
              if (!walletConnectConnector) { setConnectionError("Valora connects through WalletConnect; configure a valid Reown project ID first."); return; }
              connectWith(walletConnectConnector, "WalletConnect");
            }}>
              <Smartphone size={18} aria-hidden="true" />
              <span className="flex flex-col items-start"><span>Valora App</span><span className="text-xs font-normal text-parchment-100/55">Choose Valora from the WalletConnect wallet chooser. Not affiliated with CeloHT.</span></span>
            </Button>
            <Button variant="secondary" className="min-h-14 justify-start" disabled={isConnecting} onClick={connectMiniPay}>
              <Smartphone size={18} aria-hidden="true" />
              <span className="flex flex-col items-start"><span>MiniPay</span><span className="text-xs font-normal text-parchment-100/55">{isMiniPay ? "Connect MiniPay's in-app wallet provider." : "Open CeloHT inside MiniPay to connect."}</span></span>
            </Button>
            <Button variant="secondary" className="min-h-14 justify-start" disabled={isConnecting} onClick={connectBrowserWallet}>
              <Wallet size={18} aria-hidden="true" />
              <span className="flex flex-col items-start"><span>Browser wallet</span><span className="text-xs font-normal text-parchment-100/55">Connect an installed EIP-1193 wallet.</span></span>
            </Button>
          </div>
          <p className="mt-3 text-xs text-parchment-100/55" aria-live="polite">Connection status: {connectionStatus.replaceAll("_", " ")}</p>
          {connectionError && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-xs text-red-700 dark:text-red-300">
              <ShieldAlert size={14} aria-hidden="true" className="mt-0.5" />
              <p role="alert">{connectionError}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}