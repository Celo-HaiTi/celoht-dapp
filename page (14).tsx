"use client";

import { useState } from "react";
import { parseUnits, stringToHex } from "viem";
import { useAccount, useChainId, useWriteContract } from "wagmi";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { abis, getContractAddress, isContractDeployed } from "@/lib/contracts";
import { donationProjects } from "@/lib/data/projects";

export default function DonationsPage() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { push } = useToast();
  const { writeContract, isPending } = useWriteContract();

  const [projectId, setProjectId] = useState(donationProjects[0]?.id ?? "");
  const [amount, setAmount] = useState("10");

  const deployed = isContractDeployed(chainId, "DonationManager");
  const donationManagerAddress = getContractAddress(chainId, "DonationManager");
  // USDm (or the configured donation token) address isn't hardcoded here —
  // it's read from DonationManager.donationToken() in a full integration.
  // See docs/API.md for the read pattern.

  function handleDonate() {
    if (!donationManagerAddress) return;
    const amountWei = parseUnits(amount || "0", 18);
    const projectIdHex = stringToHex(projectId, { size: 32 });

    writeContract(
      {
        address: donationManagerAddress,
        abi: abis.DonationManager,
        functionName: "donate",
        args: [projectIdHex, amountWei, ""],
      },
      {
        onSuccess: () => push({ title: "Donation submitted", tone: "success" }),
        onError: (error) =>
          push({ title: "Donation failed", description: error.message, tone: "error" }),
      },
    );
  }

  return (
    <>
      <Breadcrumbs items={[{ label: "Donations" }]} />
      <PageHero
        eyebrow="Donations"
        title="Support a project directly"
        lead="Donations go straight to DonationManager, earmarked to the project you choose. The platform fee defaults to 0% and is hard-capped at 5% in the contract itself."
      />

      <Section>
        {!deployed ? (
          <Card className="max-w-md">
            <CardTitle>Not yet available on this network</CardTitle>
            <CardDescription className="mt-2">
              DonationManager isn&rsquo;t deployed here yet. See docs/DEPLOYMENT.md.
            </CardDescription>
          </Card>
        ) : (
          <Card className="max-w-lg">
            <CardTitle>Make a donation</CardTitle>
            <CardDescription className="mt-1">
              This requires two wallet confirmations: approving the token spend, then the donation
              itself.
            </CardDescription>

            <div className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="project"
                  className="text-ink-soft dark:text-parchment-100/50 text-xs font-medium tracking-wide uppercase"
                >
                  Project
                </label>
                <select
                  id="project"
                  value={projectId}
                  onChange={(event) => setProjectId(event.target.value)}
                  className="border-navy-700/20 dark:border-parchment-100/20 mt-1 w-full rounded-lg border bg-transparent px-3 py-2 text-sm"
                >
                  {donationProjects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="amount"
                  className="text-ink-soft dark:text-parchment-100/50 text-xs font-medium tracking-wide uppercase"
                >
                  Amount (USDm)
                </label>
                <input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  className="border-navy-700/20 dark:border-parchment-100/20 mt-1 w-full rounded-lg border bg-transparent px-3 py-2 text-sm"
                />
              </div>

              {!isConnected ? (
                <p className="text-ink-soft dark:text-parchment-100/70 text-sm">
                  Connect your wallet to donate.
                </p>
              ) : (
                <Button className="w-full" disabled={isPending} onClick={handleDonate}>
                  {isPending ? "Confirm in wallet…" : "Donate"}
                </Button>
              )}
            </div>
          </Card>
        )}
      </Section>

      <Section eyebrow="How funds move" title="">
        <p className="text-ink-soft dark:text-parchment-100/70 max-w-2xl text-sm">
          Donated funds sit in the contract, earmarked per project, until a WITHDRAWER_ROLE holder
          moves them to that project&rsquo;s beneficiary — see <code>DonationManager.sol</code> in
          the contracts package for the full logic and test coverage.
        </p>
      </Section>
    </>
  );
}
