"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  ExternalLink,
  Loader2,
  QrCode,
  Send,
  ShieldAlert,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { encodeFunctionData, isAddress, parseUnits, type Address } from "viem";
import { useAccount, useBalance, useEstimateGas, useGasPrice, useSendTransaction, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { celoSepolia } from "wagmi/chains";
import { ConnectWalletButton } from "@/ConnectWalletButton";
import { erc20Abi } from "@/lib/contracts";
import { getExplorerUrlForChain, getNetworkConfig, isSupportedWalletNetwork } from "@/lib/network/config";
import { formatTokenAmount, shortenAddress } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";
import { createNotification } from "@/lib/notifications/service";
import { transactionDeduplicationKey } from "@/lib/notifications/dedupe";
import { useUsdmBalance } from "@/lib/web3/useUsdmBalance";
import { getTransactionStatus } from "@/lib/web3/transaction-status";
import { useWalletChainId } from "@/lib/web3/useWalletChainId";

type Asset = "CELO" | "USDm";

export default function WalletPage() {
  const { address, connector, isConnected } = useAccount();
  const { t } = useI18n();
  const chainId = useWalletChainId();
  const networkConfig = isConnected ? getNetworkConfig(chainId) : getNetworkConfig();
  const usdmAddress = networkConfig?.tokens.usdm.address;
  const wrongNetwork = isConnected && !isSupportedWalletNetwork(chainId);
  const { switchChain, isPending: isSwitchingNetwork } = useSwitchChain();

  const [asset, setAsset] = useState<Asset>("USDm");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const [shareError, setShareError] = useState<string>();
  const [showReceive, setShowReceive] = useState(false);
  const [reviewing, setReviewing] = useState(false);

  const celoBalance = useBalance({ address, query: { enabled: Boolean(address) } });
  const usdmBalance = useUsdmBalance(address, chainId);

  const { data: celoHash, error: celoError, isPending: isSendingCelo, sendTransaction, reset: resetCeloSend } = useSendTransaction();
  const { data: usdmHash, error: usdmError, isPending: isSendingUsdm, writeContract, reset: resetUsdmSend } = useWriteContract();
  const txHash = celoHash ?? usdmHash;
  const txError = celoError ?? usdmError;
  const txReceipt = useWaitForTransactionReceipt({ hash: txHash, query: { enabled: Boolean(txHash) } });

  const recipientValid = isAddress(recipient) && recipient.toLowerCase() !== "0x0000000000000000000000000000000000000000";
  const selectedBalance = asset === "CELO" ? celoBalance.data : usdmBalance.data;

  const parsedAmount = useMemo(() => {
    if (!amount || !selectedBalance) return undefined;
    try {
      return parseUnits(amount, selectedBalance.decimals ?? 18);
    } catch {
      return undefined;
    }
  }, [amount, selectedBalance]);

  const amountValid = parsedAmount !== undefined && parsedAmount > 0n;
  const enoughBalance = Boolean(parsedAmount !== undefined && selectedBalance && parsedAmount <= selectedBalance.value);
  const estimateEnabled = Boolean(isConnected && !wrongNetwork && recipientValid && amountValid && parsedAmount && (asset === "CELO" || usdmAddress));
  const usdmTransferData = asset === "USDm" && usdmAddress && recipientValid && parsedAmount
    ? encodeFunctionData({ abi: erc20Abi, functionName: "transfer", args: [recipient as Address, parsedAmount] })
    : undefined;
  const gasEstimate = useEstimateGas({
    account: address,
    to: asset === "CELO" ? (recipientValid ? recipient as Address : undefined) : usdmAddress,
    value: asset === "CELO" ? parsedAmount : undefined,
    data: usdmTransferData,
    chainId: celoSepolia.id,
    query: { enabled: estimateEnabled },
  });
  const gasPrice = useGasPrice({ chainId: celoSepolia.id, query: { enabled: estimateEnabled } });
  const estimatedFee = gasEstimate.data !== undefined && gasPrice.data !== undefined ? gasEstimate.data * gasPrice.data : undefined;
  const hasEnoughGas = Boolean(estimatedFee !== undefined && celoBalance.data && (asset === "CELO" ? celoBalance.data.value >= (parsedAmount ?? 0n) + estimatedFee : celoBalance.data.value >= estimatedFee));
  const canSend = Boolean(
    isConnected && !wrongNetwork && recipientValid && amountValid && enoughBalance && hasEnoughGas && !isSendingCelo && !isSendingUsdm && !txHash && (asset === "CELO" || usdmAddress),
  );

  const txState = getTransactionStatus({
    isAwaitingApproval: isSendingCelo || isSendingUsdm,
    transactionHash: txHash,
    isReceiptPending: txReceipt.isPending,
    receiptStatus: txReceipt.data?.status,
    error: txError ?? txReceipt.error,
  });

  const amountError = amount && (!amountValid ? `Enter a valid ${asset} amount.` : !enoughBalance ? `Insufficient ${asset} balance.` : undefined);
  const feeDisplay = estimatedFee === undefined ? undefined : `${formatTokenAmount(estimatedFee, 18, 6)} CELO`;

  useEffect(() => {
    if (!address || !txHash || !isConnected) return;
    const confirmed = txReceipt.data?.status === "success";
    const failed = Boolean(txReceipt.isError || txError || txReceipt.data?.status === "reverted") && !confirmed;
    if (!failed && !confirmed) return;
    const state = confirmed ? "confirmed" : "failed";
    void createNotification({
      recipientWalletAddress: address,
      type: confirmed ? "transaction_confirmed" : "transaction_failed",
      title: confirmed ? t("notifications.transactionConfirmed") : t("notifications.transactionFailed"),
      message: confirmed ? `${amount || ""} ${asset} · ${t("wallet.confirmed")}` : `${asset} · ${t("wallet.failed")}`,
      metadata: { asset, amount, action: "transfer" },
      transactionHash: txHash,
      chainId,
      priority: confirmed ? "normal" : "high",
      deliveryStatus: "delivered",
      deduplicationKey: transactionDeduplicationKey(chainId, txHash, state),
      deepLink: `/wallet?tx=${txHash}`,
    });
  }, [address, amount, asset, chainId, isConnected, t, txError, txHash, txReceipt.data?.status, txReceipt.isError]);

  const handleCopy = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const handleShare = async () => {
    if (!address) return;
    setShareError(undefined);
    try {
      if (navigator.share) {
        await navigator.share({ title: "CeloHT wallet address", text: address });
      } else {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareError("Unable to share the address from this browser.");
    }
  };

  const handleSend = () => {
    if (!isConnected || chainId !== celoSepolia.id || !canSend || !parsedAmount) return;
    setReviewing(false);

    if (asset === "CELO") {
      sendTransaction({
        chainId: celoSepolia.id,
        to: recipient as Address,
        value: parsedAmount,
      });
      return;
    }

    if (!usdmAddress) return;

    writeContract({
      chainId: celoSepolia.id,
      address: usdmAddress,
      abi: erc20Abi,
      functionName: "transfer",
      args: [recipient as Address, parsedAmount],
    });
  };

  const clearTransaction = () => {
    resetCeloSend();
    resetUsdmSend();
    setAmount("");
    setRecipient("");
    setReviewing(false);
  };

  const statusLabel = !isConnected ? "Disconnected" : wrongNetwork ? "Wrong network" : networkConfig?.name ?? "Celo network";
  const assetBalanceDisplay = selectedBalance ? formatTokenAmount(selectedBalance.value, selectedBalance.decimals ?? 18, 2) : "—";
  const usdmDisplay = usdmBalance.data ? formatTokenAmount(usdmBalance.data.value, usdmBalance.data.decimals ?? 18, 2) : "—";
  const celoDisplay = celoBalance.data ? formatTokenAmount(celoBalance.data.value, celoBalance.data.decimals ?? 18, 2) : celoBalance.isLoading ? "Loading" : "Unavailable";
  const usdmBalanceDisplay = !usdmAddress ? "Not configured" : usdmBalance.data ? usdmDisplay : usdmBalance.isLoading ? "Loading" : "Unavailable";
  const balanceStatus = !isConnected ? "Connect wallet" : celoBalance.isError || (Boolean(usdmAddress) && usdmBalance.isError) ? "Unavailable" : celoBalance.isLoading || (Boolean(usdmAddress) && usdmBalance.isLoading) ? "Loading" : "On-chain";

  return (
    <div className="wallet-shell min-h-screen text-white">
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#f8dc8f]">CeloHT · {t("common.finance")}</p>
            <h1 className="mt-3 font-['Iowan_Old_Style','Georgia',serif] text-3xl font-semibold tracking-tight text-white sm:text-4xl">{t("common.wallet")}</h1>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2">
            <span className={`h-2.5 w-2.5 rounded-full ${isConnected && !wrongNetwork ? "bg-[#4dd39b]" : wrongNetwork ? "bg-[#f5c842]" : "bg-white/40"}`} />
            <div className="text-left">
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">{t("common.network")}</div>
              <div className="font-mono text-xs text-white">{statusLabel}</div>
            </div>
          </div>
        </header>

        <main className="mt-6 space-y-6">
          <section className="portfolio-panel overflow-hidden p-4 sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#f8dc8f]/85">Celo Sepolia</p>
                <h2 className="mt-2 font-['Iowan_Old_Style','Georgia',serif] text-2xl text-white sm:text-3xl">Testnet wallet</h2>
                <p className="mt-2 text-sm text-white/55">Balances are shown in token units. No fiat price feed is configured.</p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-[#4dd39b]/25 bg-[#4dd39b]/10 px-3 py-1.5 text-xs text-[#abefc8]">
                <span className="h-2 w-2 rounded-full bg-[#4dd39b]" />
                {networkConfig?.name ?? "Celo network"}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-end">
              <div className="wallet-panel w-full max-w-md p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-white/40">
                  <span>{t("common.wallet")}</span>
                  <span>{networkConfig?.network === "mainnet" ? "Mainnet" : "Testnet"}</span>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/[0.02] p-3">
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-white/35">{t("wallet.address")}</div>
                    <div className="mt-1 truncate font-mono text-sm text-white">{address ? shortenAddress(address, 8) : "Not connected"}</div>
                  </div>
                  {address ? (
                    <button type="button" onClick={handleCopy} className="profile-icon-button h-9 w-9" aria-label="Copy wallet address">
                      <Copy size={15} aria-hidden="true" />
                    </button>
                  ) : null}
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-white/55">
                  <span>{t("wallet.provider")}</span>
                  <span>{isConnected ? connector?.name ?? "Connected wallet" : "Disconnected"}</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-white/55">
                  <span>{t("wallet.networkStatus")}</span>
                  <span>{wrongNetwork ? "Unsupported" : balanceStatus}</span>
                </div>
                <div className="mt-4 flex gap-3">
                  <button type="button" disabled={!isConnected || wrongNetwork} className="wallet-primary" onClick={() => setShowReceive(false)}>
                    {t("wallet.send")}
                  </button>
                  <button type="button" disabled={!isConnected} className="wallet-secondary flex-1" onClick={() => setShowReceive(true)}>
                    {t("wallet.receive")}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {!isConnected ? (
            <section className="wallet-panel p-6">
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#f8dc8f]">Disconnected</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Connect your wallet to continue</h2>
                </div>
                <ConnectWalletButton />
              </div>
              <p className="mt-3 max-w-2xl text-sm text-white/60">CeloHT never requests private keys or recovery phrases. Transaction approval happens inside your wallet provider.</p>
            </section>
          ) : wrongNetwork ? (
            <section className="wallet-warning p-6" role="alert">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl border border-[#f5c842]/50 bg-[#f5c842]/10 p-2 text-[#f5c842]">
                    <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#f8dc8f]">Wrong network</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Please switch to the supported Celo network to continue.</h2>
                  </div>
                </div>
                <button type="button" onClick={() => switchChain({ chainId: celoSepolia.id })} className="wallet-primary w-auto px-4" disabled={isSwitchingNetwork}>
                  {isSwitchingNetwork ? "Switching…" : "Switch to Celo Sepolia"}
                </button>
              </div>
            </section>
          ) : (
            <>
              <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
                <div className="wallet-panel p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#f8dc8f]">Balance stack</p>
                      <h2 className="mt-2 text-xl font-semibold text-white">Assets</h2>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white/50">{balanceStatus}</span>
                  </div>

                  <div className="mt-5 space-y-3">
                    <AssetRow label="CELO" value={celoDisplay} hint="Native testnet token and gas" tone="gold" />
                    <AssetRow label="USDm" value={usdmBalanceDisplay} hint={usdmAddress ? "Configured token balance" : "Token contract unavailable"} tone="green" />
                  </div>
                </div>

                <div className="wallet-panel p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#f8dc8f]">Action</p>
                      <h2 className="mt-2 text-xl font-semibold text-white">{showReceive ? "Receive" : "Send"}</h2>
                    </div>
                    {showReceive ? <QrCode className="text-[#f8dc8f]" size={18} aria-hidden="true" /> : <Send className="text-[#f8dc8f]" size={18} aria-hidden="true" />}
                  </div>

                  {showReceive ? (
                    <div className="mt-5 space-y-4">
                      <div className="rounded-[24px] border border-white/10 bg-black/10 p-3">
                        <div className="mx-auto flex w-fit rounded-2xl border border-white/10 bg-white/5 p-3">
                          {address ? <QRCodeSVG value={address} size={160} includeMargin /> : null}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                        <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">Wallet address</div>
                        <div className="mt-2 break-all font-mono text-sm text-white">{address ?? "Unavailable"}</div>
                      </div>
                      <div className="flex gap-3">
                        <button type="button" onClick={handleCopy} className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-[#f8dc8f]/35 hover:bg-white/10" disabled={!address}>
                          {copied ? "Copied" : "Copy address"}
                        </button>
                        <button type="button" onClick={() => void handleShare()} className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-[#f8dc8f]/35 hover:bg-white/10" disabled={!address}>
                          Share address
                        </button>
                      </div>
                      {shareError ? <p className="text-xs text-[#f9d77d]" role="alert">{shareError}</p> : null}
                    </div>
                  ) : (
                    <div className="mt-5 space-y-4">
                      <div>
                        <label htmlFor="asset" className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">Asset</label>
                        <select id="asset" value={asset} onChange={(event) => setAsset(event.target.value as Asset)} className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none transition focus:border-[#f8dc8f]/50">
                          <option value="USDm">USDm</option>
                          <option value="CELO">CELO</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="recipient" className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">Recipient</label>
                        <input id="recipient" value={recipient} onChange={(event) => setRecipient(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none transition focus:border-[#f8dc8f]/50" placeholder="0x..." aria-invalid={Boolean(recipient) && !recipientValid} />
                        {recipient && !recipientValid ? <p className="mt-2 text-xs text-[#f9d77d]" role="alert">Enter a valid non-zero wallet address.</p> : null}
                      </div>

                      <div>
                        <div className="mb-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
                          <label htmlFor="amount">Amount</label>
                          <span>Available: {assetBalanceDisplay}</span>
                        </div>
                        <input id="amount" type="number" min="0" step="any" value={amount} onChange={(event) => setAmount(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none transition focus:border-[#f8dc8f]/50" placeholder="0.00" aria-invalid={Boolean(amountError)} />
                        {amountError ? <p className="mt-2 text-xs text-[#f9d77d]" role="alert">{amountError}</p> : null}
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-[#0d1728] p-3">
                        <div className="flex items-center justify-between text-xs text-white/55">
                          <span>Network fee</span>
                          <span>{feeDisplay ?? (gasEstimate.isLoading || gasPrice.isLoading ? "Estimating…" : gasEstimate.isError || gasPrice.isError ? "Unavailable" : "Enter recipient and amount")}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-xs text-white/55">
                          <span>Network</span>
                          <span>{networkConfig?.name ?? "Celo"}</span>
                        </div>
                      </div>

                      {amountValid && enoughBalance && estimatedFee !== undefined && !hasEnoughGas ? <p className="text-xs text-[#f9d77d]" role="alert">Insufficient CELO to cover the estimated network fee.</p> : null}
                      {txError ? <p className="text-xs text-[#f9d77d]" role="alert">{txError.message}</p> : null}
                      <button type="button" disabled={!canSend} onClick={() => setReviewing(true)} className="w-full rounded-2xl bg-[#f5c842] px-4 py-3 text-sm font-semibold text-[#08131f] transition hover:bg-[#f8dc8f] disabled:cursor-not-allowed disabled:opacity-40">
                        {isSendingCelo || isSendingUsdm ? "Awaiting wallet approval" : "Review and send"}
                      </button>
                      {reviewing ? <div className="rounded-2xl border border-[#f8dc8f]/30 bg-black/20 p-4" role="group" aria-label="Review transfer">
                        <h3 className="text-sm font-semibold text-white">Confirm transfer details</h3>
                        <p className="mt-3 break-all text-xs text-white/65">{amount} {asset} to {recipient}</p>
                        <p className="mt-2 text-xs text-white/65">Estimated network fee: {feeDisplay ?? "Unavailable"}</p>
                        <div className="mt-4 flex gap-3">
                          <button type="button" className="wallet-secondary flex-1" onClick={() => setReviewing(false)}>Cancel</button>
                          <button type="button" disabled={!canSend} className="wallet-primary flex-1" onClick={handleSend}>Confirm in wallet</button>
                        </div>
                      </div> : null}
                    </div>
                  )}
                </div>
              </section>

              <section className="wallet-panel p-5 sm:p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#f8dc8f]">Activity</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Transaction history</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">An indexed history service is not configured. This page does not display sample transactions or estimated impact.</p>
                <Link href="/wallet/activity" className="mt-4 inline-flex text-sm font-semibold text-[#f8dc8f] hover:text-white">Open activity history</Link>
              </section>
            </>
          )}

          {(txHash || txState === "awaiting_approval" || txState === "failed" || txState === "rejected") && (
            <section className={`celoht-state-panel ${txState === "confirmed" ? "success" : txState === "failed" || txState === "rejected" ? "error" : txState === "pending" || txState === "submitted" ? "loading" : "idle"}`}>
              <div className="celoht-state-header">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#f8dc8f]">Transaction status</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">
                    {txState === "awaiting_approval" && "Awaiting wallet approval"}
                    {txState === "submitted" && "Transaction submitted"}
                    {txState === "pending" && "Transaction pending"}
                    {txState === "confirmed" && "Payment confirmed"}
                    {txState === "failed" && "Transaction failed"}
                    {txState === "rejected" && "Wallet approval rejected"}
                  </h2>
                </div>
                <div className="celoht-state-badge">
                  {txState === "confirmed" ? <CheckCircle2 className="h-4 w-4 text-[#4dd39b]" aria-hidden="true" /> : txState === "failed" || txState === "rejected" ? <ShieldAlert className="h-4 w-4 text-[#f7b267]" aria-hidden="true" /> : txState === "pending" || txState === "submitted" || txState === "awaiting_approval" ? <Loader2 className="h-4 w-4 animate-spin text-[#f8dc8f]" aria-hidden="true" /> : <Clock3 className="h-4 w-4 text-white/60" aria-hidden="true" />}
                  {txState === "confirmed" ? "Confirmed" : txState === "failed" ? "Failed" : txState === "rejected" ? "Rejected" : txState === "pending" ? "Pending" : txState === "submitted" ? "Submitted" : "Awaiting approval"}
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/10 p-3">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">Amount</div>
                  <div className="mt-2 text-xl font-semibold text-white">{amount || "—"} {asset}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/10 p-3">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">Recipient</div>
                  <div className="mt-2 break-all font-mono text-sm text-white">{shortenAddress(recipient || address || "0x0000000000000000000000000000000000000000", 6)}</div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                {txHash && <a href={`${getExplorerUrlForChain(chainId) ?? "https://celo-sepolia.blockscout.com"}/tx/${txHash}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition hover:border-[#f8dc8f]/30 hover:bg-white/10">
                  View transaction <ExternalLink size={14} aria-hidden="true" />
                </a>}
                {txState === "confirmed" ? (
                    <button type="button" onClick={clearTransaction} className="inline-flex items-center gap-2 rounded-2xl bg-[#f5c842] px-4 py-3 text-sm font-semibold text-[#08131f] transition hover:bg-[#f8dc8f]">
                    <Check size={14} aria-hidden="true" />
                    Payment sent
                  </button>
                ) : null}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
function AssetRow({ label, value, hint, tone }: { label: string; value: string; hint: string; tone: "gold" | "green" }) {
  return (
    <div className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-black/10 p-3.5">
      <div className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold ${tone === "gold" ? "bg-[#f8dc8f]/15 text-[#f8dc8f]" : "bg-[#4dd39b]/15 text-[#9ae0bd]"}`}>
        {label === "CELO" ? "C" : "U"}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-white">{label}</div>
        <div className="text-[11px] text-white/45">{hint}</div>
      </div>
      <div className="font-mono text-sm text-white">{value}</div>
    </div>
  );
}

