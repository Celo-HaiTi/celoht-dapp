"use client";

import { useState } from "react";
import { useAccount, useBalance, useChainId, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { Wallet, LogOut, ShieldAlert, Copy, ExternalLink, Check, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/Dialog";
import { formatTokenAmount, shortenAddress } from "@/lib/utils";
import { getUsdmAddress } from "@/lib/contracts";
import { celo, celoSepolia } from "wagmi/chains";

export function ConnectWalletButton() {
  const { address, isConnected, chain, connector } = useAccount();
  const chainId = useChainId();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching, error: switchError } = useSwitchChain();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const isMiniPay =
    typeof window !== "undefined" &&
    (window as Window & { ethereum?: { isMiniPay?: boolean } }).ethereum?.isMiniPay === true;
  const [connectorError, setConnectorError] = useState<string | null>(null);
  const usdmAddress = getUsdmAddress(chainId);
  const celoBalance = useBalance({ address, query: { enabled: Boolean(address) } });
  const usdmBalance = useBalance({ address, token: usdmAddress, query: { enabled: Boolean(address && usdmAddress) } });

  function describeConnectionError(message: string, connectorName: string) {
    const normalized = message.toLowerCase();
    if (normalized.includes("user rejected") || normalized.includes("user denied") || normalized.includes("rejected")) {
      return `${connectorName} connection was cancelled.`;
    }
    if (normalized.includes("provider not found") || normalized.includes("provider unavailable")) {
      return connectorName === "Browser wallet" || connectorName === "MiniPay"
        ? "This browser does not have an injected wallet available."
        : `Unable to connect to ${connectorName}. Please try again.`;
    }
    return `Unable to connect to ${connectorName}. Please try again.`;
  }

  function connectWallet(connector: (typeof connectors)[number], connectorName: string) {
    setConnectorError(null);
    connect(
      { connector },
      {
        onSuccess: () => {
          setConnectorError(null);
          setOpen(false);
        },
        onError: (connectionError) => setConnectorError(describeConnectionError(connectionError.message, connectorName)),
      },
    );
  }

  async function copyAddress() {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  const walletName = isMiniPay || connector?.id === "injected" && typeof window !== "undefined" && (window as Window & { ethereum?: { isMiniPay?: boolean } }).ethereum?.isMiniPay
    ? "MiniPay"
    : connector?.name === "WalletConnect"
      ? "WalletConnect"
      : connector?.name ?? "Connected wallet";
  const explorer = chain?.id === celo.id ? "https://celoscan.io" : chain?.id === celoSepolia.id ? "https://sepolia.celoscan.io" : undefined;

  if (isConnected && address) {
    return <div className="flex items-center gap-2"><button type="button" onClick={() => setOpen(true)} className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-left sm:flex" aria-label="Open wallet details"><span className={`h-2 w-2 rounded-full ${chain?.id === celo.id || chain?.id === celoSepolia.id ? "bg-emerald-400" : "bg-amber-400"}`} /><span><span className="block text-[10px] uppercase tracking-[0.14em] text-parchment-100/45">{walletName}</span><span className="font-mono text-xs text-white">{shortenAddress(address)}</span></span></button><Button variant="secondary" size="sm" onClick={() => disconnect()}><span className="font-mono sm:hidden">{shortenAddress(address)}</span><LogOut size={14} aria-hidden="true" /><span className="sr-only">Disconnect wallet</span></Button><Dialog open={open} onOpenChange={setOpen}><DialogContent aria-describedby="wallet-details-description"><DialogTitle className="font-display text-xl font-semibold">{walletName}</DialogTitle><DialogDescription id="wallet-details-description" className="mt-1 text-sm text-parchment-100/65">Connected through {connector?.name ?? "your wallet provider"} on {chain?.name ?? "an unknown network"}.</DialogDescription>{chain?.id !== celo.id && chain?.id !== celoSepolia.id && <div className="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-100"><p>This wallet is on an unsupported network.</p><Button size="sm" className="mt-3" onClick={() => switchChain({ chainId: celo.id })} disabled={isSwitching}>{isSwitching ? "Switching..." : "Switch to Celo"}</Button>{switchError && <p role="alert" className="mt-2 text-xs text-amber-100/80">Network switch was rejected. Change networks in your wallet to continue.</p>}</div>}<div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl border border-white/10 bg-white/[0.05] p-3"><p className="text-xs text-parchment-100/45">CELO</p><p className="mt-2 font-mono text-sm text-white">{celoBalance.data ? formatTokenAmount(celoBalance.data.value, celoBalance.data.decimals) : celoBalance.isLoading ? "Loading" : "Unavailable"}</p></div><div className="rounded-xl border border-white/10 bg-white/[0.05] p-3"><p className="text-xs text-parchment-100/45">USDm</p><p className="mt-2 font-mono text-sm text-white">{usdmAddress ? usdmBalance.data ? formatTokenAmount(usdmBalance.data.value, usdmBalance.data.decimals) : usdmBalance.isLoading ? "Loading" : "Unavailable" : "Unavailable"}</p></div></div><p className="mt-5 break-all rounded-xl border border-white/10 bg-black/10 p-3 font-mono text-xs text-parchment-100/65">{address}</p><div className="mt-4 flex flex-wrap gap-2"><Button size="sm" variant="secondary" onClick={copyAddress}>{copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}{copied ? "Copied" : "Copy address"}</Button>{explorer && <Button asChild size="sm" variant="secondary"><a href={`${explorer}/address/${address}`} target="_blank" rel="noreferrer">Explorer <ExternalLink size={14} aria-hidden="true" /></a></Button>}<Button size="sm" variant="destructive" onClick={() => { disconnect(); setOpen(false); }}><LogOut size={14} aria-hidden="true" />Disconnect</Button></div></DialogContent></Dialog></div>;
  }

  if (isMiniPay) {
    return (
      <Button size="sm" disabled={isPending} onClick={() => {
        const injectedConnector = connectors.find((connector) => connector.id === "injected");
        if (injectedConnector) connectWallet(injectedConnector, "MiniPay");
      }}>
        <Smartphone size={16} aria-hidden="true" />
        {isPending ? "Connecting to MiniPay" : "Connect MiniPay"}
      </Button>
    );
  }

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Wallet size={16} aria-hidden="true" />
        Connect Wallet
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent aria-describedby="connect-wallet-description">
          <DialogTitle className="font-display text-xl font-semibold">Connect a wallet</DialogTitle>
          <DialogDescription
            id="connect-wallet-description"
            className="text-ink-soft dark:text-parchment-100/70 mt-1 text-sm"
          >
            Connect a Valora-compatible wallet, MiniPay, or browser wallet. This app never requests
            your private keys or seed phrase.
          </DialogDescription>

          <div className="mt-6 flex flex-col gap-2">
            {connectors.length > 0 ? connectors.map((connector) => {
              const connectorName = connector.id === "walletConnect" ? "Valora / WalletConnect" : isMiniPay && connector.id === "injected" ? "MiniPay" : "Browser wallet";
              return (
              <Button
                key={connector.uid}
                variant="secondary"
                className="justify-start"
                disabled={isPending}
                onClick={() => connectWallet(connector, connectorName)}
              >
                {connectorName}
              </Button>
              );
            }) : <p className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-sm text-amber-100">Choose a compatible wallet to connect.</p>}
          </div>

          {connectorError && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-xs text-red-700 dark:text-red-300">
              <ShieldAlert size={14} aria-hidden="true" className="mt-0.5" />
              <p role="alert">{connectorError}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
