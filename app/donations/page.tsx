"use client";

import { useEffect, useRef, useState } from "react";
import { LoaderCircle, ShieldAlert, Sprout, Wallet } from "lucide-react";
import { parseUnits } from "viem";
import { useAccount, useChainId, useReadContract, useReadContracts, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { abis, erc20Abi, getContractAddress, getUsdmAddress } from "@/lib/contracts";
import { celoSepolia } from "wagmi/chains";

const explorerUrl = (hash: string) => `https://celo-sepolia.blockscout.com/tx/${hash}`;

export default function DonationsPage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [amount, setAmount] = useState("10");
  const [approvalHash, setApprovalHash] = useState<`0x${string}`>();
  const [donationHash, setDonationHash] = useState<`0x${string}`>();
  const [error, setError] = useState<string>();
  const approvalStarted = useRef(false);
  const reforestationAddress = getContractAddress(chainId, "CeloHTReforestation");
  const usdmAddress = getUsdmAddress(chainId);
  const { writeContractAsync, isPending } = useWriteContract();
  const approvalReceipt = useWaitForTransactionReceipt({ hash: approvalHash });
  const donationReceipt = useWaitForTransactionReceipt({ hash: donationHash });
  const tokenReads = useReadContracts({
    contracts: usdmAddress && address ? [
      { address: usdmAddress, abi: erc20Abi, functionName: "balanceOf", args: [address] },
      { address: usdmAddress, abi: erc20Abi, functionName: "allowance", args: [address, reforestationAddress ?? usdmAddress] },
      { address: usdmAddress, abi: erc20Abi, functionName: "decimals" },
    ] : [],
    query: { enabled: Boolean(usdmAddress && address && reforestationAddress) },
  });
  const totalDonated = useReadContract({ address: reforestationAddress, abi: abis.CeloHTReforestation, functionName: "totalDonated", query: { enabled: Boolean(reforestationAddress) } });
  const decimals = typeof tokenReads.data?.[2]?.result === "number" ? tokenReads.data[2].result : 18;
  let parsedAmount: bigint | undefined;
  try { parsedAmount = amount ? parseUnits(amount, decimals) : undefined; } catch { parsedAmount = undefined; }
  const balance = tokenReads.data?.[0]?.result as bigint | undefined;
  const allowance = tokenReads.data?.[1]?.result as bigint | undefined;
  const validAmount = parsedAmount !== undefined && parsedAmount > 0n;
  const sufficient = parsedAmount !== undefined && parsedAmount > 0n && balance !== undefined && parsedAmount <= balance;
  const wrongNetwork = isConnected && chainId !== celoSepolia.id;
  const canDonate = Boolean(isConnected && !wrongNetwork && reforestationAddress && usdmAddress && validAmount && sufficient && !isPending && !approvalHash && !donationHash);

  async function donate() {
    if (!canDonate || !parsedAmount || !usdmAddress || !reforestationAddress) return;
    setError(undefined);
    try {
      if (allowance === undefined || allowance < parsedAmount) {
        setApprovalHash(await writeContractAsync({ address: usdmAddress, abi: erc20Abi, functionName: "approve", args: [reforestationAddress, parsedAmount] }));
        return;
      }
      setDonationHash(await writeContractAsync({ address: reforestationAddress, abi: abis.CeloHTReforestation, functionName: "donate", args: [parsedAmount] }));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The transaction was rejected or failed.");
    }
  }

  function resetTransaction() {
    setApprovalHash(undefined);
    setDonationHash(undefined);
    approvalStarted.current = false;
    setError(undefined);
  }

  useEffect(() => {
    if (!approvalReceipt.isSuccess || donationHash || approvalStarted.current || !parsedAmount || !reforestationAddress) return;
    approvalStarted.current = true;
    void writeContractAsync({ address: reforestationAddress, abi: abis.CeloHTReforestation, functionName: "donate", args: [parsedAmount] })
      .then(setDonationHash)
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : "The donation transaction failed."));
  }, [approvalReceipt.isError, approvalReceipt.isSuccess, donationHash, parsedAmount, reforestationAddress, writeContractAsync]);

  return <>
    <Breadcrumbs items={[{ label: "Impact" }, { label: "Support reforestation" }]} />
    <PageHero eyebrow="Impact · Reforestation" title="Support trees in Haiti" lead="CeloHTReforestation accepts USDm contributions and records confirmed donations on-chain. It does not claim a fixed tree conversion rate." />
    <Section eyebrow="Donation" title="Choose your contribution">
      {!reforestationAddress || !usdmAddress ? <Card><CardHeader><ShieldAlert size={18} aria-hidden="true" /><CardTitle>Donations unavailable</CardTitle></CardHeader><CardDescription>The official reforestation contract is not configured for this network.</CardDescription></Card> : wrongNetwork ? <Card><CardHeader><ShieldAlert size={18} aria-hidden="true" /><CardTitle>Switch to Celo Sepolia</CardTitle></CardHeader><CardDescription>This deployed CeloHT integration is available on Celo Sepolia.</CardDescription></Card> : !isConnected ? <Card><CardHeader><Wallet size={18} aria-hidden="true" /><CardTitle>Connect your wallet to donate</CardTitle></CardHeader><CardDescription>USDm approval and donation transactions are signed by your wallet.</CardDescription></Card> : <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card><CardHeader><Sprout size={18} aria-hidden="true" /><CardTitle>Reforestation contribution</CardTitle></CardHeader><CardDescription>Funds transfer directly to the configured CeloHT treasury after the contract confirms your donation.</CardDescription><label htmlFor="donation-amount" className="mt-6 block text-sm font-medium">Amount in USDm</label><input id="donation-amount" type="number" min="0" step="any" value={amount} onChange={(event) => setAmount(event.target.value)} disabled={Boolean(approvalHash || donationHash)} className="mt-2 w-full rounded-xl border border-navy-700/15 bg-transparent px-3 py-3 text-sm" /><p className="mt-2 text-xs">Available: {balance === undefined ? "Loading" : `${Number(balance) / 10 ** decimals} USDm`}</p>{amount && !validAmount && <p role="alert" className="mt-2 text-sm text-red-700">Enter an amount greater than zero.</p>}{validAmount && !sufficient && <p role="alert" className="mt-2 text-sm text-red-700">Your USDm balance is not enough.</p>}<Button className="mt-5 w-full" onClick={donate} disabled={!canDonate}>{isPending ? <><LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> Confirm in wallet</> : "Donate USDm"}</Button>{error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}</Card>
        <Card><CardHeader><CardTitle>Donation status</CardTitle></CardHeader><CardDescription>{approvalReceipt.isError ? "USDm approval failed." : donationReceipt.isError ? "Donation failed on-chain." : approvalHash && !approvalReceipt.isSuccess ? "USDm approval submitted, waiting for confirmation." : donationHash && !donationReceipt.isSuccess ? "Donation submitted, waiting for confirmation." : donationReceipt.isSuccess && donationHash ? <><span className="font-semibold">Donation confirmed on-chain.</span> <a className="underline" href={explorerUrl(donationHash)} target="_blank" rel="noreferrer">View transaction</a></> : `Total recorded: ${totalDonated.data === undefined ? "Loading" : `${Number(totalDonated.data) / 10 ** decimals} USDm`}`}</CardDescription>{(approvalReceipt.isError || donationReceipt.isError) && <Button className="mt-4" onClick={resetTransaction}>Try again</Button>}</Card>
      </div>}
    </Section>
  </>;
}
