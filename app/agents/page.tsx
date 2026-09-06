"use client";

import { useEffect, useRef, useState } from "react";
import { CircleAlert, UserRound, Users } from "lucide-react";
import { formatUnits } from "viem";
import { useAccount, useChainId, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { ConnectWalletButton } from "@/ConnectWalletButton";
import { abis, erc20Abi, getContractAddress, getUsdmAddress, isContractDeployed } from "@/lib/contracts";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export default function AgentsPage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const registryAddress = getContractAddress(chainId, "CeloHTAgentRegistry");
  const usdmAddress = getUsdmAddress(chainId);
  const configured = isContractDeployed(chainId, "CeloHTAgentRegistry") && Boolean(usdmAddress);
  const agentId = useReadContract({ address: registryAddress, abi: abis.CeloHTAgentRegistry, functionName: "agentIdOf", args: address ? [address] : undefined, query: { enabled: Boolean(address && registryAddress) } });
  const registrationFee = useReadContract({ address: registryAddress, abi: abis.CeloHTAgentRegistry, functionName: "registrationFee", query: { enabled: Boolean(registryAddress) } });
  const agent = useReadContract({ address: registryAddress, abi: abis.CeloHTAgentRegistry, functionName: "getAgent", args: typeof agentId.data === "bigint" && agentId.data > 0n ? [agentId.data] : undefined, query: { enabled: typeof agentId.data === "bigint" && agentId.data > 0n } });
  const allowance = useReadContract({ address: usdmAddress, abi: erc20Abi, functionName: "allowance", args: address && registryAddress ? [address, registryAddress] : undefined, query: { enabled: Boolean(address && usdmAddress && registryAddress) } });
  const [approvalHash, setApprovalHash] = useState<`0x${string}`>();
  const [registrationHash, setRegistrationHash] = useState<`0x${string}`>();
  const [error, setError] = useState<string>();
  const approvalStarted = useRef(false);
  const { writeContractAsync, isPending } = useWriteContract();
  const approvalReceipt = useWaitForTransactionReceipt({ hash: approvalHash });
  const registrationReceipt = useWaitForTransactionReceipt({ hash: registrationHash });

  async function register() {
    if (!configured || !registryAddress || !usdmAddress || typeof registrationFee.data !== "bigint" || !isConnected) return;
    setError(undefined);
    try {
      if (allowance.data === undefined || allowance.data < registrationFee.data) setApprovalHash(await writeContractAsync({ address: usdmAddress, abi: erc20Abi, functionName: "approve", args: [registryAddress, registrationFee.data] }));
      else setRegistrationHash(await writeContractAsync({ address: registryAddress, abi: abis.CeloHTAgentRegistry, functionName: "registerAgent" }));
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Agent registration failed."); }
  }

  useEffect(() => {
    if (!approvalReceipt.isSuccess || registrationHash || approvalStarted.current || !registryAddress) return;
    approvalStarted.current = true;
    void writeContractAsync({ address: registryAddress, abi: abis.CeloHTAgentRegistry, functionName: "registerAgent" }).then(setRegistrationHash).catch((cause: unknown) => setError(cause instanceof Error ? cause.message : "Agent registration failed."));
  }, [approvalReceipt.isSuccess, registrationHash, registryAddress, writeContractAsync]);

  const id = typeof agentId.data === "bigint" && agentId.data > 0n ? agentId.data.toString() : undefined;
  const record = agent.data as readonly [bigint, `0x${string}`, bigint, boolean, boolean] | undefined;

  return <><PageHero eyebrow="CeloHT · Agent Network" title="A registry, not a fabricated directory" lead="The deployed registry exposes wallet, status, and verification state. Profile metadata and a searchable directory require a separate indexed backend." /><Section><Card className="max-w-2xl"><CardHeader><Users size={18} aria-hidden="true" /><CardTitle>My registry status</CardTitle></CardHeader><CardDescription>{!isConnected ? "Connect your wallet to inspect the official agent registry." : !configured ? "CeloHTAgentRegistry or USDm is unavailable on this network." : agentId.isLoading ? "Loading registry state…" : id ? `Agent ID ${id}. Active: ${record ? String(record[3]) : "Unavailable"}. Verified: ${record ? String(record[4]) : "Unavailable"}.` : "This wallet is not registered as an agent."}</CardDescription></Card></Section><Section eyebrow="Registration" title="Become an agent"><Card className="max-w-2xl"><CardHeader><UserRound size={18} aria-hidden="true" /><CardTitle>Register on Celo Sepolia</CardTitle></CardHeader><CardDescription>Registration charges the official USDm fee and creates an active, unverified registry record. Coordinator verification is a separate role-controlled operation.</CardDescription>{configured && <p className="mt-4 text-sm">Fee: {typeof registrationFee.data === "bigint" ? `${formatUnits(registrationFee.data, 18)} USDm` : "Unavailable"}</p>}{!isConnected ? <ConnectWalletButton /> : id ? <p className="mt-4 text-sm text-cyan-200">This wallet already has an agent record.</p> : <Button className="mt-5" onClick={register} disabled={!configured || isPending || Boolean(approvalHash || registrationHash)}>{isPending ? "Confirm in wallet…" : "Register agent"}</Button>}{approvalHash && !approvalReceipt.isSuccess && <p className="mt-3 text-sm">USDm approval pending confirmation.</p>}{registrationHash && !registrationReceipt.isSuccess && <p className="mt-3 text-sm">Registration submitted, waiting for confirmation.</p>}{registrationReceipt.isSuccess && <p className="mt-3 text-sm text-cyan-200">Registration confirmed on-chain.</p>}{error && <p role="alert" className="mt-3 flex items-center gap-2 text-sm text-red-300"><CircleAlert size={15} aria-hidden="true" />{error}</p>}</Card></Section><Section eyebrow="Data boundary" title="Identity is off-chain"><p className="max-w-2xl text-sm text-ink-soft dark:text-parchment-100/70">The contract does not store KYC documents or profile records. Sensitive identity data must remain in an authenticated backend and is not exposed by this page.</p></Section></>;
}
