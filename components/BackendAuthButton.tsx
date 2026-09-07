"use client";

import { useState } from "react";
import { CircleAlert, LoaderCircle, ShieldCheck } from "lucide-react";
import { useAccount, useSignMessage } from "wagmi";
import { BackendRequestError, isBackendConfigured, requestWalletNonce, verifyWalletSignature } from "@/lib/backend";
import { Button } from "@/components/ui/Button";

export function BackendAuthButton() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [signedIn, setSignedIn] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();
  const configured = isBackendConfigured();

  async function signIn() {
    if (!configured || !address || !isConnected || pending) return;
    setPending(true);
    setError(undefined);
    try {
      const challenge = await requestWalletNonce(address);
      const signature = await signMessageAsync({ message: challenge.message });
      await verifyWalletSignature(address, challenge.nonce, signature);
      setSignedIn(true);
    } catch (cause) {
      setSignedIn(false);
      setError(cause instanceof BackendRequestError ? cause.details.message : "Wallet sign-in was cancelled or failed.");
    } finally {
      setPending(false);
    }
  }

  if (!configured) return <span className="text-xs text-parchment-100/45">Backend unavailable</span>;
  if (!isConnected) return <span className="text-xs text-parchment-100/45">Connect wallet to sign in</span>;
  if (signedIn) return <span className="inline-flex items-center gap-1.5 text-xs text-emerald-300"><ShieldCheck size={14} aria-hidden="true" /> Signed in</span>;

  return <div className="flex flex-col items-end gap-1.5"><Button type="button" variant="secondary" onClick={signIn} disabled={pending}>{pending ? <><LoaderCircle size={14} className="animate-spin" aria-hidden="true" /> Signing in...</> : "Sign in securely"}</Button>{error && <p role="alert" className="flex max-w-56 items-center gap-1 text-right text-[11px] text-red-300"><CircleAlert size={12} aria-hidden="true" />{error}</p>}</div>;
}
