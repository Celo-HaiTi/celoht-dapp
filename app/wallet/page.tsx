"use client";

import { useState } from "react";
import { CheckCircle2, ExternalLink, Send, ShieldAlert, Wallet } from "lucide-react";
import { isAddress, parseEther } from "viem";
import { useAccount, useBalance, useChainId, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { celo, celoAlfajores } from "wagmi/chains";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatTokenAmount } from "@/lib/utils";

const supportedChainIds = new Set([celo.id, celoAlfajores.id]);

export default function WalletPage() {
  const { address, isConnected, chain } = useAccount();
  const chainId = useChainId();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { data: balance, isLoading: balanceLoading } = useBalance({ address, query: { enabled: Boolean(address) } });
  const { data: hash, error: sendError, isPending: isSending, sendTransaction } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
  const wrongNetwork = isConnected && !supportedChainIds.has(chainId);
  const amountValid = amount !== "" && Number(amount) > 0;
  const recipientValid = isAddress(recipient);
  const canSubmit = isConnected && !wrongNetwork && amountValid && recipientValid && !isSending;

  function handleSend() {
    if (!canSubmit) return;
    setSubmitted(true);
    sendTransaction({ to: recipient, value: parseEther(amount) });
  }

  return (
    <>
      <Breadcrumbs items={[{ label: "Wallet" }]} />
      <PageHero eyebrow="Wallet" title="Your Celo account, clearly presented" lead="Connect a wallet to read its live CELO balance and submit transactions directly through your wallet provider. CeloHT never invents balances or transaction results." />

      <Section eyebrow="Portfolio" title="Live account overview">
        {!isConnected ? (
          <Card><CardHeader><Wallet size={18} aria-hidden="true" /><CardTitle>Connect your wallet</CardTitle></CardHeader><CardDescription>Use the Connect Wallet button above to load live account data from Celo.</CardDescription></Card>
        ) : wrongNetwork ? (
          <Card><CardHeader><ShieldAlert size={18} aria-hidden="true" /><CardTitle>Unsupported network</CardTitle></CardHeader><CardDescription>Switch your wallet to Celo Mainnet or Alfajores before sending funds.</CardDescription></Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            <Card><CardHeader><Wallet size={18} aria-hidden="true" /><CardTitle>CELO</CardTitle></CardHeader><p className="font-display text-3xl font-semibold">{balanceLoading ? "Loading..." : balance ? formatTokenAmount(balance.value, balance.decimals) : "Unavailable"}</p><CardDescription className="mt-2">Live native balance from {chain?.name ?? "Celo"}</CardDescription></Card>
            <Card><CardHeader><ShieldAlert size={18} aria-hidden="true" /><CardTitle>Account</CardTitle></CardHeader><p className="break-all font-mono text-sm">{address}</p><CardDescription className="mt-2">Connected through your wallet provider</CardDescription></Card>
            <Card><CardHeader><CheckCircle2 size={18} aria-hidden="true" /><CardTitle>USDm</CardTitle></CardHeader><p className="font-display text-3xl font-semibold">Not configured</p><CardDescription className="mt-2">A verified USDm contract address is required before reading this token.</CardDescription></Card>
          </div>
        )}
      </Section>

      <Section eyebrow="Send" title="Transfer CELO">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card><div className="space-y-4">
            <div><label htmlFor="recipient" className="text-xs font-medium uppercase tracking-[0.16em] text-ink-soft dark:text-parchment-100/60">Recipient address</label><input id="recipient" value={recipient} onChange={(event) => setRecipient(event.target.value)} placeholder="0x..." className="mt-2 w-full rounded-xl border border-navy-700/15 bg-transparent px-3 py-2.5 text-sm dark:border-parchment-100/10" />{recipient !== "" && !recipientValid && <p className="mt-2 text-sm text-red-700 dark:text-red-300">Enter a valid EVM address.</p>}</div>
            <div><label htmlFor="amount" className="text-xs font-medium uppercase tracking-[0.16em] text-ink-soft dark:text-parchment-100/60">Amount in CELO</label><input id="amount" type="number" min="0" step="any" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" className="mt-2 w-full rounded-xl border border-navy-700/15 bg-transparent px-3 py-2.5 text-sm dark:border-parchment-100/10" /></div>
            <Button onClick={handleSend} className="w-full" disabled={!canSubmit}><Send size={16} aria-hidden="true" />{isSending ? "Confirm in wallet" : "Send CELO"}</Button>
            {!isConnected && <p className="text-sm text-ink-soft dark:text-parchment-100/65">Connect a wallet before preparing a transaction.</p>}
            {sendError && <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-700 dark:text-red-300">Transaction failed or was rejected: {sendError.message}</p>}
          </div></Card>
          <Card><CardHeader><Send size={18} aria-hidden="true" /><CardTitle>Transaction status</CardTitle></CardHeader>
            {!submitted ? <CardDescription>No transaction submitted.</CardDescription> : isSending ? <CardDescription>Waiting for wallet approval.</CardDescription> : isConfirming ? <CardDescription>Transaction submitted. Waiting for Celo confirmation.</CardDescription> : isConfirmed && hash ? <div className="space-y-3 text-sm"><p className="flex items-center gap-2 text-forest-600"><CheckCircle2 size={16} aria-hidden="true" />Confirmed on-chain</p><a className="inline-flex items-center gap-1 underline" href={`https://celoscan.io/tx/${hash}`} target="_blank" rel="noreferrer">View transaction <ExternalLink size={14} aria-hidden="true" /></a></div> : hash ? <CardDescription>Transaction submitted. Check your wallet or explorer for its status.</CardDescription> : <CardDescription>Waiting for a wallet response.</CardDescription>}
          </Card>
        </div>
      </Section>
    </>
  );
}
