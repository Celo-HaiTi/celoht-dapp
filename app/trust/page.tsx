"use client";

import { ExternalLink, FileCode2, Globe2, Landmark, Network, RefreshCw, ShieldCheck } from "lucide-react";
import { celo, celoSepolia } from "wagmi/chains";
import { useAccount, useBlockNumber, useChainId } from "wagmi";
import { getContractAddress, getUsdmAddress, type ContractName } from "@/lib/contracts";

const contracts: { name: ContractName; purpose: string }[] = [
  { name: "CeloHTAgentRegistry", purpose: "Agent registration and status" },
  { name: "CeloHTServicePayments", purpose: "Agent-mediated USDm payments" },
  { name: "CeloHTEducation", purpose: "Certificate eligibility and issuance" },
  { name: "CeloHTReforestation", purpose: "USDm donation records" },
  { name: "CeloHTGovernance", purpose: "One-wallet-one-vote governance" },
];

export default function TrustCenterPage() {
  const { chain, isConnected } = useAccount();
  const chainId = useChainId();
  const block = useBlockNumber({ watch: false, query: { enabled: isConnected } });
  const networkSupported = chainId === celo.id || chainId === celoSepolia.id;
  const usdmAddress = getUsdmAddress(chainId);
  const configuredCount = contracts.filter(({ name }) => getContractAddress(chainId, name)).length;

  return <div className="trust-shell min-h-[calc(100dvh-64px)] px-4 py-6 pb-28 sm:px-6 lg:px-8 lg:py-8"><div className="mx-auto max-w-7xl"><header className="trust-header"><div><p className="section-kicker">CeloHT · Verification workspace</p><h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">Trust Center</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-parchment-100/62">Inspect synchronized contract configuration and the boundaries that are not yet available.</p></div><div className="trust-readiness"><span className="trust-readiness-score">{configuredCount}/{contracts.length}</span><div><p>Contracts configured</p><small>Official snapshot evidence</small></div></div></header><section className="trust-status-grid mt-7" aria-label="Infrastructure status"><StatusItem icon={<Globe2 size={18} />} label="Celo network" value={!isConnected ? "Not connected" : networkSupported ? chain?.name ?? "Supported" : "Unsupported network"} /><StatusItem icon={<Network size={18} />} label="RPC / latest block" value={!isConnected ? "Not connected" : block.isLoading ? "Checking" : block.error ? "Unavailable" : block.data ? `Operational · ${block.data}` : "Unavailable"} /><StatusItem icon={<ShieldCheck size={18} />} label="Wallet" value={isConnected ? "Connected" : "Disconnected"} /><StatusItem icon={<RefreshCw size={18} />} label="Backend / indexer" value="Not configured" /></section><section className="trust-panel mt-7" aria-labelledby="contracts-heading"><PanelHeading icon={<FileCode2 size={18} />} title="Official contract registry" id="contracts-heading" /><p className="trust-muted">Addresses come from the synchronized official deployment snapshot. Mainnet CeloHT contracts are unavailable because the official source repository currently provides a Celo Sepolia deployment only.</p><div className="contract-list mt-5">{contracts.map(({ name, purpose }) => <ContractRow key={name} name={name} purpose={purpose} address={getContractAddress(chainId, name)} chainId={chainId} />)}</div></section><section className="trust-panel mt-5" aria-labelledby="usdm-heading"><PanelHeading icon={<Landmark size={18} />} title="USDm verification" id="usdm-heading" /><p className="trust-muted">USDm is displayed only when its network-specific official address is configured.</p><div className="trust-data-grid mt-5"><DataPoint label="Network" value={chain?.name ?? "Not connected"} /><DataPoint label="Token status" value={usdmAddress ? "Configured" : "Unavailable"} /><DataPoint label="Contract address" value={usdmAddress ?? "Unavailable"} mono /></div>{usdmAddress && <a className="trust-link" href={`${explorerBase(chainId)}/address/${usdmAddress}`} target="_blank" rel="noreferrer">View USDm contract <ExternalLink size={13} aria-hidden="true" /></a>}</section><section className="trust-panel mt-5" aria-labelledby="boundary-heading"><PanelHeading icon={<ShieldCheck size={18} />} title="Security boundary" id="boundary-heading" /><p className="trust-muted">Role-controlled operations remain on-chain. This frontend exposes no admin API, private key, nonce authentication, KYC store, planting evidence indexer, or privileged role management.</p></section></div></div>;
}

function PanelHeading({ icon, title, id }: { icon: React.ReactNode; title: string; id: string }) { return <div className="flex items-start gap-3"><span className="text-gold-300">{icon}</span><h2 id={id} className="font-display text-xl font-semibold text-white">{title}</h2></div>; }
function StatusItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="trust-status-item"><span className="trust-status-icon trust-tone-neutral">{icon}</span><div><p>{label}</p><strong>{value}</strong></div></div>; }
function DataPoint({ label, value, mono }: { label: string; value: string; mono?: boolean }) { return <div className="trust-data-point"><span>{label}</span><strong className={mono ? "break-all font-mono text-xs" : ""}>{value}</strong></div>; }
function ContractRow({ name, purpose, address, chainId }: { name: ContractName; purpose: string; address?: `0x${string}`; chainId: number }) { return <div className="contract-row"><div><strong>{name}</strong><p>{purpose}</p></div><div className="contract-address">{address ? <><span className="font-mono text-xs">{address}</span><a className="trust-link" href={`${explorerBase(chainId)}/address/${address}`} target="_blank" rel="noreferrer">Explorer <ExternalLink size={13} aria-hidden="true" /></a></> : <span className="trust-unavailable">Unavailable on this network</span>}</div></div>; }
function explorerBase(chainId: number) { return chainId === celoSepolia.id ? "https://celo-sepolia.blockscout.com" : "https://celoscan.io"; }
