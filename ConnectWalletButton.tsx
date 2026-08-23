"use client";

import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Wallet, LogOut, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/Dialog";
import { shortenAddress } from "@/lib/utils";
import { isWalletConnectConfigured } from "@/lib/web3/config";

export function ConnectWalletButton() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const [open, setOpen] = useState(false);
  const isMiniPay =
    typeof window !== "undefined" &&
    (window as Window & { ethereum?: { isMiniPay?: boolean } }).ethereum?.isMiniPay === true;

  useEffect(() => {
    const ethereum = (window as Window & { ethereum?: { isMiniPay?: boolean } }).ethereum;
    const detected = ethereum?.isMiniPay === true;

    if (detected && !isConnected) {
      const injectedConnector = connectors.find((connector) => connector.id === "injected");
      if (injectedConnector) connect({ connector: injectedConnector });
    }
  }, [connect, connectors, isConnected]);

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <span className="border-navy-700/20 text-ink-soft dark:border-parchment-100/20 dark:text-parchment-100/70 hidden rounded-full border px-3 py-1.5 text-xs sm:inline">
          {chain?.name ?? "Unknown network"}
        </span>
        <Button variant="secondary" size="sm" onClick={() => disconnect()}>
          <span className="font-mono">{shortenAddress(address)}</span>
          <LogOut size={14} aria-hidden="true" />
          <span className="sr-only">Disconnect wallet</span>
        </Button>
      </div>
    );
  }

  if (isMiniPay) {
    return (
      <Button size="sm" disabled={isPending} onClick={() => {
        const injectedConnector = connectors.find((connector) => connector.id === "injected");
        if (injectedConnector) connect({ connector: injectedConnector });
      }}>
        <Wallet size={16} aria-hidden="true" />
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
            {connectors.map((connector) => (
              <Button
                key={connector.uid}
                variant="secondary"
                className="justify-start"
                disabled={isPending}
                onClick={() => {
                  connect(
                    { connector },
                    {
                      onSuccess: () => setOpen(false),
                    },
                  );
                }}
              >
                {connector.name}
              </Button>
            ))}
          </div>

          {!isWalletConnectConfigured && (
            <p className="text-ink-soft dark:text-parchment-100/60 mt-4 text-xs">
              WalletConnect is not configured in this environment, so mobile wallet QR flows are
              temporarily unavailable. Demo mode remains available for product review.
            </p>
          )}

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-xs text-red-700 dark:text-red-300">
              <ShieldAlert size={14} aria-hidden="true" className="mt-0.5" />
              <p role="alert">{error.message}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
