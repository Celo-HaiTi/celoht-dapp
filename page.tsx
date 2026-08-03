"use client";

import { useAccount, useChainId, useReadContract, useReadContracts } from "wagmi";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { abis, getContractAddress, isContractDeployed } from "@/lib/contracts";

export default function CertificatesPage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const deployed = isContractDeployed(chainId, "CertificateRegistry");
  const certRegistry = getContractAddress(chainId, "CertificateRegistry");

  const tokenIds = useReadContract({
    address: certRegistry,
    abi: abis.CertificateRegistry,
    functionName: "certificatesOf",
    args: address ? [address] : undefined,
    query: { enabled: isConnected && deployed },
  });

  const ids = (tokenIds.data as bigint[] | undefined) ?? [];

  const courseReads = useReadContracts({
    contracts: ids.map((id) => ({
      address: certRegistry,
      abi: abis.CertificateRegistry,
      functionName: "courseIdOf",
      args: [id],
    })),
    query: { enabled: ids.length > 0 },
  });

  return (
    <>
      <Breadcrumbs items={[{ label: "Certificates" }]} />
      <PageHero
        eyebrow="Education · Certificates"
        title="Your learning record, on-chain"
        lead="Each certificate is a non-transferable ERC-721 token minted directly to your wallet by CeloHT's CertificateRegistry contract when you complete a course."
      />

      <Section>
        {!isConnected ? (
          <Card className="max-w-md">
            <CardTitle>Connect your wallet</CardTitle>
            <CardDescription className="mt-2">
              Certificates are tied to your wallet address — connect to see yours.
            </CardDescription>
          </Card>
        ) : !deployed ? (
          <Card className="max-w-md">
            <CardTitle>Not yet available on this network</CardTitle>
            <CardDescription className="mt-2">
              CertificateRegistry hasn&rsquo;t been deployed here yet. See docs/DEPLOYMENT.md.
            </CardDescription>
          </Card>
        ) : tokenIds.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-3">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        ) : ids.length === 0 ? (
          <Card className="max-w-md">
            <CardTitle>No certificates yet</CardTitle>
            <CardDescription className="mt-2">
              Complete a course to earn your first certificate.
            </CardDescription>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            {ids.map((id, index) => (
              <Card key={id.toString()}>
                <CardTitle>Certificate #{id.toString()}</CardTitle>
                <CardDescription className="mt-2">
                  {courseReads.data?.[index]?.result
                    ? String(courseReads.data[index].result)
                    : "Loading course…"}
                </CardDescription>
              </Card>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
