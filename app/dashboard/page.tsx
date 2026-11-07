"use client";

import Link from "next/link";
import { Activity, ArrowUpRight, BookOpen, Leaf, ShieldCheck, Users, WalletCards } from "lucide-react";
import { useAccount, useReadContract } from "wagmi";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ConnectWalletButton } from "@/ConnectWalletButton";
import { abis, getContractAddress, isContractDeployed } from "@/lib/contracts";
import { useI18n } from "@/lib/i18n/context";
import { useWalletChainId } from "@/lib/web3/useWalletChainId";
import { shortenAddress } from "@/lib/utils";
import { celoSepolia } from "wagmi/chains";

export default function DashboardPage() {
  const { address, chain, isConnected } = useAccount();
  const { t } = useI18n();
  const chainId = useWalletChainId();
  const agentDeployed = isContractDeployed(chainId, "CeloHTAgentRegistry");
  const agentId = useReadContract({ address: getContractAddress(chainId, "CeloHTAgentRegistry"), abi: abis.CeloHTAgentRegistry, functionName: "agentIdOf", args: address ? [address] : undefined, query: { enabled: Boolean(address && agentDeployed) } });
  const registeredAgentId = agentId.data as bigint | undefined;
  const supportedNetwork = chainId === celoSepolia.id;
  const networkLabel = isConnected
    ? `${chain?.name ?? "Unknown network"} · ${chainId}`
    : t("common.notConnected");
  const networkDescription = !isConnected
    ? t("dashboard.networkConfigured")
    : supportedNetwork
      ? t("dashboard.networkSupported")
      : t("wallet.wrongNetwork");
  const agentLabel = !isConnected
    ? t("dashboard.connectAgent")
    : !agentDeployed || agentId.isError
      ? t("dashboard.registryUnavailable")
      : agentId.isLoading
        ? t("dashboard.loading")
        : registeredAgentId && registeredAgentId > 0n
          ? t("dashboard.registeredAgent", { id: registeredAgentId.toString() })
          : t("dashboard.notRegistered");

  return (
    <>
      <Breadcrumbs items={[{ label: "Dashboard" }]} />
      <PageHero
        eyebrow={t("dashboard.title")}
        title={isConnected ? t("dashboard.welcome") : t("dashboard.connectStart")}
        lead={t("dashboard.description")}
      />
      <Section eyebrow={t("dashboard.liveStatus")} title={t("dashboard.accountOverview")}>
        <div className="dashboard-status-grid">
          <Card className="dashboard-status-card">
            <CardHeader>
              <span className="dashboard-status-icon"><WalletCards size={18} aria-hidden="true" /></span>
              <div><p className="section-kicker">{t("common.wallet")}</p><CardTitle>{isConnected && address ? shortenAddress(address, 6) : t("common.notConnected")}</CardTitle></div>
            </CardHeader>
            <CardDescription>{isConnected ? t("dashboard.connectedWalletDetail") : t("dashboard.connectWalletDetail")}</CardDescription>
            <div className="mt-5">{isConnected ? <Button asChild variant="secondary"><Link href="/profile">{t("settings.openProfile")}</Link></Button> : <ConnectWalletButton />}</div>
          </Card>
          <Card className="dashboard-status-card">
            <CardHeader>
              <span className="dashboard-status-icon"><ShieldCheck size={18} aria-hidden="true" /></span>
              <div><p className="section-kicker">{t("common.network")}</p><CardTitle>{networkLabel}</CardTitle></div>
            </CardHeader>
            <CardDescription>{networkDescription}</CardDescription>
            <Button asChild className="mt-5" variant="secondary"><Link href="/trust">{t("common.trustCenter")}</Link></Button>
          </Card>
          <Card className="dashboard-status-card">
            <CardHeader>
              <span className="dashboard-status-icon dashboard-status-icon-forest"><Users size={18} aria-hidden="true" /></span>
              <div><p className="section-kicker">{t("dashboard.agentRegistry")}</p><CardTitle>{t("dashboard.agentStatus")}</CardTitle></div>
            </CardHeader>
            <CardDescription>{agentLabel}</CardDescription>
            <Button asChild className="mt-5" variant="secondary"><Link href="/agents">{t("dashboard.viewAgentStatus")}</Link></Button>
          </Card>
        </div>
      </Section>
      <Section eyebrow={t("navigation.workspace")} title={t("dashboard.destinations")}>
        <div className="dashboard-destinations">
          <Destination href="/learn" icon={<BookOpen size={18} />} title={t("common.learn")} />
          <Destination href="/wallet" icon={<WalletCards size={18} />} title={t("common.finance")} />
          <Destination href="/agents" icon={<Users size={18} />} title={t("common.agents")} />
          <Destination href="/reforestation" icon={<Leaf size={18} />} title={t("common.reforest")} />
          <Destination href="/wallet/activity" icon={<Activity size={18} />} title={t("common.activity")} />
        </div>
      </Section>
    </>
  );
}

function Destination({ href, icon, title }: { href: string; icon: React.ReactNode; title: string }) {
  return <Link href={href} className="dashboard-destination"><span>{icon}</span><strong>{title}</strong><ArrowUpRight size={15} aria-hidden="true" /></Link>;
}
