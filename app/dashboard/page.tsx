"use client";

import { useAccount, useChainId, useReadContract } from "wagmi";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { abis, getContractAddress, isContractDeployed } from "@/lib/contracts";
import { useI18n } from "@/lib/i18n/context";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const { t } = useI18n();
  const chainId = useChainId();
  const agentDeployed = isContractDeployed(chainId, "CeloHTAgentRegistry");
  const agentId = useReadContract({ address: getContractAddress(chainId, "CeloHTAgentRegistry"), abi: abis.CeloHTAgentRegistry, functionName: "agentIdOf", args: address ? [address] : undefined, query: { enabled: Boolean(address && agentDeployed) } });

  const registeredAgentId = agentId.data as bigint | undefined;
  return <><Breadcrumbs items={[{ label: "Dashboard" }]} /><PageHero eyebrow={t("dashboard.title")} title={isConnected ? t("dashboard.welcome") : t("dashboard.connectStart")} lead={t("dashboard.description")} /><Section><Card className="max-w-xl"><CardTitle>{t("dashboard.agentStatus")}</CardTitle><CardDescription className="mt-2">{!isConnected ? t("dashboard.connectAgent") : !agentDeployed ? t("dashboard.registryUnavailable") : agentId.isLoading ? t("dashboard.loading") : registeredAgentId && registeredAgentId > 0n ? t("dashboard.registeredAgent", { id: registeredAgentId.toString() }) : t("dashboard.notRegistered")}</CardDescription></Card></Section></>;
}
