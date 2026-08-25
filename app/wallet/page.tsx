"use client";

import { useState } from "react";
import { Check, CheckCircle2, ExternalLink, QrCode, Send, ShieldAlert, Wallet } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { isAddress, parseEther, parseUnits } from "viem";
import { useAccount, useBalance, useChainId, useSendTransaction, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { celo, celoSepolia } from "wagmi/chains";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatTokenAmount } from "@/lib/utils";
import { erc20Abi, getUsdmAddress } from "@/lib/contracts";

const supportedChainIds = new Set([celo.id, celoSepolia.id]);

export default function WalletPage() {
  const { address, isConnected, chain } = useAccount();
  const chainId = useChainId();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [asset, setAsset] = useState<"CELO" | "USDm">("CELO");
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { data: balance, isLoading: balanceLoading } = useBalance({ address, query: { enabled: Boolean(address) } });
  const { data: celoHash, error: celoError, isPending: isSendingCelo, sendTransaction } = useSendTransaction();
  const { data: usdmHash, error: usdmError, isPending: isSendingUsdm, writeContract } = useWriteContract();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const hash = celoHash ?? usdmHash;
  const sendError = celoError ?? usdmError;
  const isSending = isSendingCelo || isSendingUsdm;
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
  const wrongNetwork = isConnected && !supportedChainIds.has(chainId);
  const usdmAddress = getUsdmAddress(chainId);
  const { data: usdmBalance, isLoading: usdmLoading, error: usdmBalanceError } = useBalance({ address, token: usdmAddress, query: { enabled: Boolean(address && usdmAddress) } });
  const recipientValid = isAddress(recipient) && recipient.toLowerCase() !== "0x0000000000000000000000000000000000000000";
  const selectedBalance = asset === "CELO" ? balance : usdmBalance;
  const selectedDecimals = selectedBalance?.decimals ?? 18;
  let parsedAmount;
  try {
    parsedAmount = amount === "" ? undefined : parseUnits(amount, selectedDecimals);
  } catch {
    parsedAmount = undefined;
  }
  const amountValid = parsedAmount !== undefined && parsedAmount > 0n;
  const hasSufficientBalance = parsedAmount !== undefined && selectedBalance?.value !== undefined && parsedAmount <= selectedBalance.value;
  const canSubmit = isConnected && !wrongNetwork && amountValid && hasSufficientBalance && recipientValid && !isSending && (asset === "CELO" || Boolean(usdmAddress));
  const amountError = amount !== "" && (!amountValid ? `Enter a valid ${asset} amount.` : !hasSufficientBalance ? `Insufficient ${asset} balance.` : undefined);

  function describeTransactionError() {
    const message = sendError?.message.toLowerCase() ?? "";
    if (message.includes("user rejected") || message.includes("user denied")) return "The transaction was cancelled in your wallet. No funds moved.";
    if (message.includes("insufficient funds")) return "Your wallet does not have enough CELO for this amount and the network fee.";
    return "The transaction could not be completed. Check your wallet, network, and balance, then try again.";
  }

  function handleSend() {
    if (!canSubmit) return;
    setSubmitted(true);
    if (asset === "CELO") {
      sendTransaction({ to: recipient, value: parseEther(amount) });
    } else if (usdmAddress) {
      writeContract({ address: usdmAddress, abi: erc20Abi, functionName: "transfer", args: [recipient, parseUnits(amount, usdmBalance?.decimals ?? 18)] });
    }
  }

  async function copyAddress() {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <>
      <Breadcrumbs items={[{ label: "Wallet" }]} />
      <PageHero eyebrow="Wallet" title="Your Celo account, clearly presented" lead="Connect a wallet to read its live CELO balance and submit transactions directly through your wallet provider. CeloHT never invents balances or transaction results." />

      <Section eyebrow="Portfolio" title="Live account overview">
        {!isConnected ? (
          <Card><CardHeader><Wallet size={18} aria-hidden="true" /><CardTitle>Connect your wallet</CardTitle></CardHeader><CardDescription>Use the Connect Wallet button above to load live account data from Celo.</CardDescription></Card>
          ) : wrongNetwork ? (
            <Card><CardHeader><ShieldAlert size={18} aria-hidden="true" /><CardTitle>Unsupported network</CardTitle></CardHeader><CardDescription>Switch your wallet to Celo Mainnet or Celo Sepolia before sending funds.</CardDescription><Button className="mt-4" onClick={() => switchChain({ chainId: celo.id })} disabled={isSwitching}>{isSwitching ? "Switching network" : "Switch to Celo"}</Button></Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            <Card><CardHeader><Wallet size={18} aria-hidden="true" /><CardTitle>CELO</CardTitle></CardHeader><p className="font-display text-3xl font-semibold">{balanceLoading ? "Loading..." : balance ? formatTokenAmount(balance.value, balance.decimals) : "—"}</p><CardDescription className="mt-2">Live native balance from {chain?.name ?? "Celo"}</CardDescription></Card>
            <Card><CardHeader><ShieldAlert size={18} aria-hidden="true" /><CardTitle>Account</CardTitle></CardHeader><p className="break-all font-mono text-sm">{address}</p><CardDescription className="mt-2">Connected through your wallet provider</CardDescription></Card>
            <Card><CardHeader><CheckCircle2 size={18} aria-hidden="true" /><CardTitle>USDm</CardTitle></CardHeader><p className="font-display text-3xl font-semibold">{usdmLoading ? "Loading..." : usdmBalance ? formatTokenAmount(usdmBalance.value, usdmBalance.decimals) : "—"}</p><CardDescription className="mt-2">Live USDm balance from {chain?.name ?? "Celo"}</CardDescription></Card>
          </div>
        )}
      </Section>

      <Section eyebrow="Receive" title="Receive funds">
        <Card><div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left"><div className="rounded-xl bg-white p-3"><QRCodeSVG value={address ?? "https://celo-haiti.github.io/celoht-dapp/wallet"} size={156} includeMargin /></div><div className="min-w-0"><div className="flex items-center gap-2"><QrCode size={18} aria-hidden="true" /><p className="font-medium">Your wallet address</p></div><p className="mt-2 break-all font-mono text-sm text-ink-soft dark:text-parchment-100/70">{address ?? "Connect your wallet to display an address."}</p>{address && <Button variant="secondary" size="sm" className="mt-4" onClick={copyAddress}>{copied ? <Check size={15} aria-hidden="true" /> : null}{copied ? "Copied" : "Copy address"}</Button>}<p className="mt-3 text-xs text-ink-soft dark:text-parchment-100/60">Only share this public address. Never share a recovery phrase or private key.</p></div></div></Card>
      </Section>

      <Section eyebrow="Send" title="Transfer funds">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card><div className="space-y-4">
            <div><label htmlFor="asset" className="text-xs font-medium uppercase tracking-[0.16em] text-ink-soft dark:text-parchment-100/60">Asset</label><select id="asset" value={asset} onChange={(event) => setAsset(event.target.value as "CELO" | "USDm")} className="mt-2 w-full rounded-xl border border-navy-700/15 bg-transparent px-3 py-2.5 text-sm dark:border-parchment-100/10"><option value="CELO">CELO</option><option value="USDm">USDm</option></select></div>
            <div><label htmlFor="recipient" className="text-xs font-medium uppercase tracking-[0.16em] text-ink-soft dark:text-parchment-100/60">Recipient address</label><input id="recipient" value={recipient} onChange={(event) => setRecipient(event.target.value)} placeholder="0x..." aria-invalid={recipient !== "" && !recipientValid} className="mt-2 w-full rounded-xl border border-navy-700/15 bg-transparent px-3 py-2.5 text-sm dark:border-parchment-100/10" />{recipient !== "" && !recipientValid && <p role="alert" className="mt-2 text-sm text-red-700 dark:text-red-300">Enter a valid non-zero EVM address.</p>}</div>
            <div><div className="flex items-center justify-between"><label htmlFor="amount" className="text-xs font-medium uppercase tracking-[0.16em] text-ink-soft dark:text-parchment-100/60">Amount in {asset}</label><span className="text-xs text-ink-soft/70 dark:text-parchment-100/50">Available: {selectedBalance ? formatTokenAmount(selectedBalance.value, selectedBalance.decimals) : "Connect wallet"}</span></div><input id="amount" type="number" min="0" step="any" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" aria-invalid={Boolean(amountError)} className="mt-2 w-full rounded-xl border border-navy-700/15 bg-transparent px-3 py-2.5 text-sm dark:border-parchment-100/10" />{amountError && <p role="alert" className="mt-2 text-sm text-red-700 dark:text-red-300">{amountError}</p>}</div>
            {asset === "USDm" && usdmBalanceError && <p className="text-sm text-amber-200">USDm balance is temporarily unavailable. Verify the wallet network and try again.</p>}
            <Button onClick={handleSend} className="w-full" disabled={!canSubmit}><Send size={16} aria-hidden="true" />{isSending ? "Confirm in wallet" : `Send ${asset}`}</Button>
            {!isConnected && <p className="text-sm text-ink-soft dark:text-parchment-100/65">Connect a wallet before preparing a transaction.</p>}
            {sendError && <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-700 dark:text-red-300">{describeTransactionError()}</p>}
          </div></Card>
          <Card><CardHeader><Send size={18} aria-hidden="true" /><CardTitle>Transaction status</CardTitle></CardHeader>
            {!submitted ? <CardDescription>No transaction submitted.</CardDescription> : isSending ? <CardDescription>Waiting for wallet approval.</CardDescription> : isConfirming ? <CardDescription>Transaction submitted. Waiting for Celo confirmation.</CardDescription> : isConfirmed && hash ? <div className="space-y-3 text-sm"><p className="flex items-center gap-2 text-forest-600"><CheckCircle2 size={16} aria-hidden="true" />Confirmed on-chain</p><a className="inline-flex items-center gap-1 underline" href={`https://celoscan.io/tx/${hash}`} target="_blank" rel="noreferrer">View transaction <ExternalLink size={14} aria-hidden="true" /></a></div> : hash ? <CardDescription>Transaction submitted. Check your wallet or explorer for its status.</CardDescription> : <CardDescription>Waiting for a wallet response.</CardDescription>}
          </Card>
        </div>
      </Section>
    </>
  );
}
