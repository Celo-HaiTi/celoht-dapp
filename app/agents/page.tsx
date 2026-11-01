"use client";

import { useState } from "react";
import Link from "next/link";
import { CircleAlert, UserRound, Users } from "lucide-react";
import { formatUnits } from "viem";
import {
  useAccount,
  useChainId,
  useReadContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { ConnectWalletButton } from "@/ConnectWalletButton";
import {
  abis,
  erc20Abi,
  getContractAddress,
  getUsdmAddress,
  isContractDeployed,
} from "@/lib/contracts";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { celoSepolia } from "wagmi/chains";

export default function AgentsPage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const wrongNetwork = isConnected && chainId !== celoSepolia.id;
  const registryAddress = getContractAddress(chainId, "CeloHTAgentRegistry");
  const usdmAddress = getUsdmAddress(chainId);
  const configured =
    isContractDeployed(chainId, "CeloHTAgentRegistry") && Boolean(usdmAddress);
  const agentId = useReadContract({
    address: registryAddress,
    abi: abis.CeloHTAgentRegistry,
    functionName: "agentIdOf",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address && registryAddress) },
  });
  const registrationFee = useReadContract({
    address: registryAddress,
    abi: abis.CeloHTAgentRegistry,
    functionName: "registrationFee",
    query: { enabled: Boolean(registryAddress) },
  });
  const agent = useReadContract({
    address: registryAddress,
    abi: abis.CeloHTAgentRegistry,
    functionName: "getAgent",
    args:
      typeof agentId.data === "bigint" && agentId.data > 0n
        ? [agentId.data]
        : undefined,
    query: { enabled: typeof agentId.data === "bigint" && agentId.data > 0n },
  });
  const allowance = useReadContract({
    address: usdmAddress,
    abi: erc20Abi,
    functionName: "allowance",
    args: address && registryAddress ? [address, registryAddress] : undefined,
    query: { enabled: Boolean(address && usdmAddress && registryAddress) },
  });
  const [approvalHash, setApprovalHash] = useState<`0x${string}`>();
  const [registrationHash, setRegistrationHash] = useState<`0x${string}`>();
  const [error, setError] = useState<string>();
  const { writeContractAsync, isPending } = useWriteContract();
  const approvalReceipt = useWaitForTransactionReceipt({ hash: approvalHash });
  const registrationReceipt = useWaitForTransactionReceipt({
    hash: registrationHash,
  });

  async function register() {
    if (chainId !== celoSepolia.id) {
      setError(
        "Switch to Celo Sepolia (11142220) before submitting this transaction.",
      );
      return;
    }
    if (
      !configured ||
      !registryAddress ||
      !usdmAddress ||
      typeof registrationFee.data !== "bigint" ||
      !isConnected
    )
      return;
    setError(undefined);
    try {
      if (approvalHash) {
        if (!approvalReceipt.isSuccess) return;
        setRegistrationHash(
          await writeContractAsync({
            chainId: celoSepolia.id,
            address: registryAddress,
            abi: abis.CeloHTAgentRegistry,
            functionName: "registerAgent",
          }),
        );
      } else if (
        allowance.data === undefined ||
        allowance.data < registrationFee.data
      ) {
        setApprovalHash(
          await writeContractAsync({
            chainId: celoSepolia.id,
            address: usdmAddress,
            abi: erc20Abi,
            functionName: "approve",
            args: [registryAddress, registrationFee.data],
          }),
        );
      } else {
        setRegistrationHash(
          await writeContractAsync({
            chainId: celoSepolia.id,
            address: registryAddress,
            abi: abis.CeloHTAgentRegistry,
            functionName: "registerAgent",
          }),
        );
      }
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Agent registration failed.",
      );
    }
  }

  function resetRegistration() {
    setApprovalHash(undefined);
    setRegistrationHash(undefined);
    setError(undefined);
  }

  const id =
    typeof agentId.data === "bigint" && agentId.data > 0n
      ? agentId.data.toString()
      : undefined;
  const record = agent.data as
    readonly [bigint, `0x${string}`, bigint, boolean, boolean] | undefined;

  if (approvalReceipt.isError || registrationReceipt.isError) {
    return (
      <>
        <PageHero
          eyebrow="CeloHT · Agent Network"
          title="Agent registration failed"
          lead="The wallet transaction was submitted but the blockchain receipt did not confirm it. No agent registration is reported."
        />
        <Section>
          <Card className="max-w-2xl">
            <CardHeader>
              <CircleAlert size={18} aria-hidden="true" />
              <CardTitle>Transaction failed</CardTitle>
            </CardHeader>
            <CardDescription>
              {approvalReceipt.isError
                ? "USDm approval was rejected or reverted."
                : "Agent registration was rejected or reverted."}
            </CardDescription>
            <Button className="mt-5" onClick={resetRegistration}>
              Try again
            </Button>
          </Card>
        </Section>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="CeloHT · Agent Network"
        title="A registry, not a fabricated directory"
        lead="The deployed registry exposes wallet, status, and verification state. Profile metadata and a searchable directory require a separate indexed backend."
      />
      <Section>
        <Link
          href="/agents/pilot"
          className="mb-5 inline-flex min-h-11 items-center rounded-lg border border-gold-500/30 px-4 py-2 text-sm font-semibold text-gold-300 hover:border-gold-300"
        >
          Test the public agent application and service simulations →
        </Link>
        <Card className="max-w-2xl">
          <CardHeader>
            <Users size={18} aria-hidden="true" />
            <CardTitle>My registry status</CardTitle>
          </CardHeader>
          <CardDescription>
            {!isConnected
              ? "Connect your wallet to inspect the official agent registry."
              : !configured
                ? "CeloHTAgentRegistry or USDm is unavailable on this network."
                : agentId.isLoading
                  ? "Loading registry state…"
                  : id
                    ? `Agent ID ${id}. Active: ${record ? String(record[3]) : "Unavailable"}. Verified: ${record ? String(record[4]) : "Unavailable"}.`
                    : "This wallet is not registered as an agent."}
          </CardDescription>
        </Card>
      </Section>
      <Section eyebrow="Registration" title="Become an agent">
        <Card className="max-w-2xl">
          <CardHeader>
            <UserRound size={18} aria-hidden="true" />
            <CardTitle>Register on Celo Sepolia</CardTitle>
          </CardHeader>
          <CardDescription>
            Registration charges the official USDm fee and creates an active,
            unverified registry record. Coordinator verification is a separate
            role-controlled operation.
          </CardDescription>
          {configured && (
            <p className="mt-4 text-sm">
              Fee:{" "}
              {typeof registrationFee.data === "bigint"
                ? `${formatUnits(registrationFee.data, 18)} USDm`
                : "Unavailable"}
            </p>
          )}
          {!isConnected ? (
            <ConnectWalletButton />
          ) : wrongNetwork ? (
            <Button
              className="mt-5"
              onClick={() => switchChain({ chainId: celoSepolia.id })}
              disabled={isSwitching}
            >
              {isSwitching ? "Switching..." : "Switch to Celo Sepolia"}
            </Button>
          ) : id ? (
            <p className="mt-4 text-sm text-cyan-200">
              This wallet already has an agent record.
            </p>
          ) : (
            <Button
              className="mt-5"
              onClick={register}
              disabled={
                !configured ||
                isPending ||
                Boolean(registrationHash) ||
                Boolean(approvalHash && !approvalReceipt.isSuccess)
              }
            >
              {isPending
                ? "Confirm in wallet…"
                : approvalHash && approvalReceipt.isSuccess
                  ? "Continue registration"
                  : "Register agent"}
            </Button>
          )}
          {approvalHash && !approvalReceipt.isSuccess && (
            <p className="mt-3 text-sm">USDm approval pending confirmation.</p>
          )}
          {approvalHash && approvalReceipt.isSuccess && !registrationHash && (
            <p className="mt-3 text-sm">
              USDm approval confirmed. Continue registration when ready.
            </p>
          )}
          {registrationHash && !registrationReceipt.isSuccess && (
            <p className="mt-3 text-sm">
              Registration submitted, waiting for confirmation.
            </p>
          )}
          {registrationReceipt.isSuccess && (
            <p className="mt-3 text-sm text-cyan-200">
              Registration confirmed on-chain.
            </p>
          )}
          {error && (
            <p
              role="alert"
              className="mt-3 flex items-center gap-2 text-sm text-red-300"
            >
              <CircleAlert size={15} aria-hidden="true" />
              {error}
            </p>
          )}
        </Card>
      </Section>
      <Section eyebrow="Data boundary" title="Identity is off-chain">
        <p className="max-w-2xl text-sm text-ink-soft dark:text-parchment-100/70">
          The contract does not store KYC documents or profile records.
          Sensitive identity data must remain in an authenticated backend and is
          not exposed by this page.
        </p>
      </Section>
    </>
  );
}
