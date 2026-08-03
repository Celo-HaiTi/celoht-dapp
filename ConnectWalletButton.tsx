"use client";

import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Wallet, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/Dialog";
import { shortenAddress } from "@/lib/utils";
import { isWalletConnectConfigured } from "@/lib/web3/config";

export function ConnectWalletButton() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const [open, setOpen] = useState(false);

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
            Connect a Valora-compatible wallet to access your profile, certificates, and transaction
            history.
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
              WalletConnect (needed to connect Valora from a desktop browser via QR code)
              isn&rsquo;t configured in this build — set{" "}
              <code>NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID</code>. See{" "}
              <code>docs/DEVELOPMENT.md</code>.
            </p>
          )}

          {error && (
            <p role="alert" className="mt-4 text-xs text-red-600 dark:text-red-400">
              {error.message}
            </p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
