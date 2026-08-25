"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ExternalLink, LoaderCircle, ShieldAlert, Sprout, Wallet } from "lucide-react";
import { keccak256, parseUnits, toBytes, type Address } from "viem";
import { useAccount, useBalance, useChainId, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { abis, erc20Abi, getContractAddress, getUsdmAddress } from "@/lib/contracts";
import { donationProjects } from "@/lib/data/projects";
import { celo, celoSepolia } from "wagmi/chains";

const supportedChainIds = new Set([celo.id, celoSepolia.id]);

function explorerUrl(chainId: number, hash: string) {
	const host = chainId === celoSepolia.id ? "https://sepolia.celoscan.io" : "https://celoscan.io";
	return `${host}/tx/${hash}`;
}

export default function DonationsPage() {
	const { address, isConnected } = useAccount();
	const chainId = useChainId();
	const [amount, setAmount] = useState("");
	const [approvedAmount, setApprovedAmount] = useState<bigint>();
	const [approvalHash, setApprovalHash] = useState<`0x${string}`>();
	const [donationHash, setDonationHash] = useState<`0x${string}`>();
	const [actionError, setActionError] = useState<string>();
	const managerAddress = getContractAddress(chainId, "DonationManager");
	const usdmAddress = getUsdmAddress(chainId);
	const project = donationProjects[0];
	const projectId = keccak256(toBytes(project.id));
	const tokenResult = useReadContract({ address: managerAddress, abi: abis.DonationManager, functionName: "donationToken", query: { enabled: Boolean(managerAddress) } });
	const tokenAddress = tokenResult.data as Address | undefined;
	const tokenBalance = useBalance({ address, token: tokenAddress, query: { enabled: Boolean(address && tokenAddress) } });
	const tokenDecimals = useReadContract({ address: tokenAddress, abi: erc20Abi, functionName: "decimals", query: { enabled: Boolean(tokenAddress) } });
	const projectExists = useReadContract({ address: managerAddress, abi: abis.DonationManager, functionName: "projectExists", args: [projectId], query: { enabled: Boolean(managerAddress) } });
	const { writeContractAsync, isPending: isWriting } = useWriteContract();
	const approvalReceipt = useWaitForTransactionReceipt({ hash: approvalHash });
	const donationReceipt = useWaitForTransactionReceipt({ hash: donationHash });
	const wrongNetwork = isConnected && !supportedChainIds.has(chainId);
	const decimals = typeof tokenDecimals.data === "number" ? tokenDecimals.data : 18;
	let parsedAmount: bigint | undefined;
	try {
		parsedAmount = amount ? parseUnits(amount, decimals) : undefined;
	} catch {
		parsedAmount = undefined;
	}
	const amountValid = parsedAmount !== undefined && parsedAmount > 0n;
	const hasSufficientBalance = Boolean(parsedAmount !== undefined && tokenBalance.data && parsedAmount <= tokenBalance.data.value);
	const configuredForUsdM = Boolean(tokenAddress && usdmAddress && tokenAddress.toLowerCase() === usdmAddress.toLowerCase());
	const canApprove = Boolean(isConnected && !wrongNetwork && managerAddress && projectExists.data === true && configuredForUsdM && amountValid && hasSufficientBalance && !isWriting && !approvalHash);

	useEffect(() => {
		if (!approvalReceipt.isSuccess || !approvalHash || !managerAddress || !tokenAddress || !approvedAmount || !address || donationHash) return;
		void writeContractAsync({ address: managerAddress, abi: abis.DonationManager, functionName: "donate", args: [projectId, approvedAmount, "celoht-web-donation"] })
			.then(setDonationHash)
			.catch(() => setActionError("The donation was not submitted. Check your wallet and try again."));
	}, [approvalHash, approvalReceipt.isSuccess, address, approvedAmount, donationHash, managerAddress, projectId, tokenAddress, writeContractAsync]);

	async function approveDonation() {
		if (!canApprove || !parsedAmount || !managerAddress || !tokenAddress) return;
		setActionError(undefined);
		try {
			const hash = await writeContractAsync({ address: tokenAddress, abi: erc20Abi, functionName: "approve", args: [managerAddress, parsedAmount] });
			setApprovedAmount(parsedAmount);
			setApprovalHash(hash);
		} catch {
			setActionError("The approval was cancelled or failed. Your funds were not donated.");
		}
	}

	const unavailable = !managerAddress || !configuredForUsdM;

	return (
		<>
			<Breadcrumbs items={[{ label: "Impact" }, { label: "Support reforestation" }]} />
			<PageHero eyebrow="Impact · Reforestation" title="Support trees in Haiti" lead="Your contribution supports a registered reforestation project. CeloHT only reports a donation after the blockchain confirms it." />
			<Section eyebrow="Donation" title="Choose your contribution">
				{unavailable ? (
					<Card><CardHeader><ShieldAlert size={18} aria-hidden="true" /><CardTitle>Donations are not live yet</CardTitle></CardHeader><CardDescription>The official DonationManager address is not configured for this network. No transaction can be submitted from this page until the production contract and USDm token are connected.</CardDescription></Card>
				) : wrongNetwork ? (
					<Card><CardHeader><ShieldAlert size={18} aria-hidden="true" /><CardTitle>Switch to Celo</CardTitle></CardHeader><CardDescription>Connect to Celo Mainnet or Celo Sepolia in your wallet before donating.</CardDescription></Card>
				) : !isConnected ? (
					<Card><CardHeader><Wallet size={18} aria-hidden="true" /><CardTitle>Connect your wallet to donate</CardTitle></CardHeader><CardDescription>Use the wallet button above. You will review every approval and donation in your wallet.</CardDescription></Card>
				) : projectExists.data !== true ? (
					<Card><CardHeader><Sprout size={18} aria-hidden="true" /><CardTitle>Project registration is unavailable</CardTitle></CardHeader><CardDescription>This project is not registered on the configured DonationManager, so a donation is safely disabled.</CardDescription></Card>
				) : (
					<div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
						<Card><CardHeader><Sprout size={18} aria-hidden="true" /><CardTitle>{project.name}</CardTitle></CardHeader><CardDescription>{project.summary}</CardDescription><label htmlFor="donation-amount" className="mt-6 block text-sm font-medium">Donation amount in USDm</label><input id="donation-amount" type="number" min="0" step="any" value={amount} onChange={(event) => setAmount(event.target.value)} disabled={Boolean(approvalHash)} placeholder="0.00" className="mt-2 w-full rounded-xl border border-navy-700/15 bg-transparent px-3 py-3 text-sm disabled:opacity-60 dark:border-parchment-100/10" />{amount && !amountValid && <p role="alert" className="mt-2 text-sm text-red-700 dark:text-red-300">Enter an amount greater than zero.</p>}{amountValid && !hasSufficientBalance && <p role="alert" className="mt-2 text-sm text-red-700 dark:text-red-300">Your USDm balance is not enough for this donation.</p>}<Button className="mt-5 w-full" onClick={approveDonation} disabled={!canApprove}>{isWriting ? <><LoaderCircle size={16} className="animate-spin" aria-hidden="true" />Confirm in wallet</> : "Review donation in wallet"}</Button>{actionError && <p role="alert" className="mt-3 rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-700 dark:text-red-300">{actionError}</p>}</Card>
						<Card><CardHeader><CheckCircle2 size={18} aria-hidden="true" /><CardTitle>Donation status</CardTitle></CardHeader>{!approvalHash && <CardDescription>Your wallet will first approve USDm for this donation, then submit the donation itself.</CardDescription>}{approvalHash && !approvalReceipt.isSuccess && <CardDescription>Approval pending. Confirm it in your wallet and wait for Celo.</CardDescription>}{approvalReceipt.isSuccess && !donationHash && <CardDescription>Approval confirmed. Submitting the donation now.</CardDescription>}{donationHash && !donationReceipt.isSuccess && <CardDescription>Donation submitted. Waiting for blockchain confirmation.</CardDescription>}{donationReceipt.isSuccess && donationHash && <div className="space-y-3 text-sm"><p className="font-semibold text-forest-600">Donation confirmed on-chain.</p><p>{amount} USDm to {project.name}</p><a className="inline-flex items-center gap-1 underline" href={explorerUrl(chainId, donationHash)} target="_blank" rel="noreferrer">View transaction <ExternalLink size={14} aria-hidden="true" /></a></div>}</Card>
					</div>
				)}
			</Section>
		</>
	);
}
