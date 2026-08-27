"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Activity, Check, CircleAlert, Copy, ExternalLink, Globe2, Info, Languages, LockKeyhole, LogOut, Network, ShieldCheck, SlidersHorizontal, WalletCards } from "lucide-react";
import { celo, celoSepolia } from "wagmi/chains";
import { useAccount, useBlockNumber, useChainId, useDisconnect, useSwitchChain } from "wagmi";
import { ConnectWalletButton } from "@/ConnectWalletButton";
import { getUsdmAddress } from "@/lib/contracts";
import { shortenAddress } from "@/lib/utils";

const notificationDefaults = { confirmations: true, failures: true, security: true, agents: false, reforest: true, announcements: true };
const notificationLabels = { confirmations: "Transaction confirmations", failures: "Transaction failures", security: "Wallet and security alerts", agents: "Agent activity", reforest: "Reforestation updates", announcements: "Important CeloHT announcements" } as const;
type NotificationKey = keyof typeof notificationDefaults;

export default function SettingsPage() {
  const { address, chain, connector, isConnected } = useAccount();
  const chainId = useChainId();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: switching, error: switchError } = useSwitchChain();
  const block = useBlockNumber({ watch: false, query: { enabled: isConnected } });
  const notificationRaw = useSyncExternalStore(subscribeLocal, getNotificationSnapshot, getNotificationServerSnapshot);
  const language = useSyncExternalStore(subscribeLocal, getLanguageSnapshot, () => "English");
  const notifications = parseNotifications(notificationRaw);
  const [copied, setCopied] = useState(false);
  const [cleared, setCleared] = useState(false);
  const supported = chainId === celo.id || chainId === celoSepolia.id;
  const usdmConfigured = Boolean(getUsdmAddress(chainId));

  function toggleNotification(key: NotificationKey) {
    const next = { ...notifications, [key]: !notifications[key] };
    localStorage.setItem("celoht-notification-prefs", JSON.stringify(next));
    window.dispatchEvent(new Event("celoht-settings"));
  }
  function changeLanguage(value: string) { localStorage.setItem("celoht-language", value); window.dispatchEvent(new Event("celoht-settings")); }
  async function copyAddress() { if (!address) return; await navigator.clipboard.writeText(address); setCopied(true); window.setTimeout(() => setCopied(false), 1500); }
  function clearLocalData() { localStorage.removeItem("celoht-notification-prefs"); localStorage.removeItem("celoht-language"); localStorage.removeItem("celoht-academy-progress:guest"); window.dispatchEvent(new Event("celoht-settings")); setCleared(true); }

  return <div className="settings-shell min-h-[calc(100dvh-64px)] px-4 py-6 pb-28 sm:px-6 lg:px-8 lg:py-8"><div className="mx-auto max-w-6xl"><header className="settings-header"><div><p className="section-kicker">CeloHT · Control center</p><h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">Settings</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-parchment-100/58">Manage your account, wallet connection, network preferences, and local application controls.</p></div><Link href="/profile" className="settings-header-link"><ShieldCheck size={16} aria-hidden="true" /> Open profile</Link></header>
    <div className="settings-grid mt-7"><main className="space-y-5"><SettingsPanel icon={<WalletCards size={18} />} eyebrow="Account" title="Wallet identity"><div className="settings-identity"><div className="settings-avatar">{isConnected && address ? address.slice(2, 4).toUpperCase() : "?"}</div><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-white">{isConnected && address ? "Connected wallet" : "Wallet not connected"}</p><p className="mt-1 break-all font-mono text-xs text-parchment-100/48">{isConnected && address ? shortenAddress(address, 6) : "Connect to establish your CeloHT identity"}</p></div>{isConnected ? <span className="settings-status settings-status-live">Connected</span> : <ConnectWalletButton />}</div>{isConnected && address && <div className="mt-4 flex flex-wrap items-center gap-2"><button type="button" onClick={copyAddress} className="settings-action">{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? "Address copied" : "Copy address"}</button><button type="button" onClick={() => disconnect()} className="settings-action"><LogOut size={14} aria-hidden="true" /> Disconnect</button></div>}</SettingsPanel>
      <SettingsPanel icon={<Network size={18} />} eyebrow="Wallet & Security" title="Connection and safety"><SettingRow label="Provider" value={isConnected ? connector?.name ?? "Connected wallet" : "Unavailable"} /><SettingRow label="Connection status" value={isConnected ? "Active" : "Not connected"} /><p className="settings-note"><LockKeyhole size={15} aria-hidden="true" /> CeloHT never asks for private keys or recovery phrases.</p></SettingsPanel>
      <SettingsPanel icon={<Globe2 size={18} />} eyebrow="Network & Blockchain" title="Celo connection"><SettingRow label="Network" value={isConnected ? chain?.name ?? `Chain ${chainId}` : "Not connected"} /><SettingRow label="Chain ID" value={isConnected ? String(chainId) : "Unavailable"} mono /><SettingRow label="RPC status" value={!isConnected ? "Not connected" : block.isLoading ? "Checking" : block.error ? "Unavailable" : "Operational"} /><SettingRow label="Latest block" value={block.data !== undefined ? block.data.toString() : "Unavailable"} mono />{isConnected && !supported && <div className="settings-warning" role="alert"><CircleAlert size={15} aria-hidden="true" /><span>Wrong network. Switch to Celo to continue.</span><button type="button" onClick={() => switchChain({ chainId: celo.id })} disabled={switching}>{switching ? "Switching..." : "Switch to Celo"}</button></div>}{switchError && <p className="settings-error" role="alert">Network switch was rejected. Change networks directly in your wallet.</p>}<SettingRow label="USDm token" value={usdmConfigured ? "Configured" : "Unavailable"} /></SettingsPanel>
      <SettingsPanel icon={<SlidersHorizontal size={18} />} eyebrow="Notifications" title="Choose what matters"><div className="settings-toggles">{(Object.keys(notificationLabels) as NotificationKey[]).map((key) => <label key={key} className="settings-toggle"><span><strong>{notificationLabels[key]}</strong><small>Stored locally on this device</small></span><input type="checkbox" checked={notifications[key]} onChange={() => toggleNotification(key)} /><i aria-hidden="true" /></label>)}</div></SettingsPanel>
      <SettingsPanel icon={<Languages size={18} />} eyebrow="Language" title="Interface language"><label htmlFor="language" className="sr-only">Interface language</label><select id="language" className="settings-select" value={language} onChange={(event) => changeLanguage(event.target.value)}><option>English</option><option>Kreyòl</option><option>Français</option></select><p className="settings-note"><Info size={15} aria-hidden="true" /> Preference is saved locally. Full application translation becomes available when localization content is connected.</p></SettingsPanel>
      <SettingsPanel icon={<LockKeyhole size={18} />} eyebrow="Privacy" title="Local data controls"><p className="text-sm leading-6 text-parchment-100/58">Wallet addresses and blockchain transactions are public by design. CeloHT stores notification, language, and local learning preferences in this browser. No backend analytics service is configured.</p><button type="button" onClick={clearLocalData} className="settings-action mt-4">{cleared ? <Check size={14} /> : null}{cleared ? "Local data cleared" : "Clear local application data"}</button><div className="mt-4 flex gap-4 text-xs"><Link href="/privacy" className="settings-link">Privacy policy</Link><Link href="/terms" className="settings-link">Terms</Link></div></SettingsPanel></main>
      <aside className="settings-aside"><SettingsPanel icon={<Info size={18} />} eyebrow="About CeloHT" title="Application details"><SettingRow label="Application" value="CeloHT dApp" /><SettingRow label="Version" value="0.1.0" mono /><SettingRow label="Network" value={chain?.name ?? "Celo networks"} /><SettingRow label="USDm" value={usdmConfigured ? "Configured for this network" : "Unavailable on this network"} /><p className="settings-note mt-4"><ShieldCheck size={15} aria-hidden="true" /> Open-source wallet interface with non-custodial transactions.</p><Link href="/trust" className="settings-link mt-5">Trust Center <ExternalLink size={14} aria-hidden="true" /></Link></SettingsPanel><SettingsPanel icon={<Activity size={18} />} eyebrow="Connected modules" title="Your CeloHT workspace"><Link href="/wallet" className="settings-module-link">Wallet <ExternalLink size={14} aria-hidden="true" /></Link><Link href="/wallet/activity" className="settings-module-link">Activity <ExternalLink size={14} aria-hidden="true" /></Link><Link href="/learn" className="settings-module-link">Learn <ExternalLink size={14} aria-hidden="true" /></Link><Link href="/agents" className="settings-module-link">Agents <ExternalLink size={14} aria-hidden="true" /></Link></SettingsPanel></aside></div>
  </div></div>;
}

function SettingsPanel({ icon, eyebrow, title, children }: { icon: React.ReactNode; eyebrow: string; title: string; children: React.ReactNode }) { return <section className="settings-panel"><div className="settings-panel-title"><span>{icon}</span><div><p className="section-kicker">{eyebrow}</p><h2 className="mt-1 font-display text-lg font-semibold text-white">{title}</h2></div></div><div className="mt-5">{children}</div></section>; }
function SettingRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) { return <div className="setting-row"><span>{label}</span><strong className={mono ? "font-mono" : ""}>{value}</strong></div>; }

function subscribeLocal(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener("celoht-settings", onChange);
  return () => { window.removeEventListener("storage", onChange); window.removeEventListener("celoht-settings", onChange); };
}
function getNotificationSnapshot() { return localStorage.getItem("celoht-notification-prefs") ?? JSON.stringify(notificationDefaults); }
function getNotificationServerSnapshot() { return JSON.stringify(notificationDefaults); }
function getLanguageSnapshot() { return localStorage.getItem("celoht-language") ?? "English"; }
function parseNotifications(raw: string) { try { const value: unknown = JSON.parse(raw); return value && typeof value === "object" ? { ...notificationDefaults, ...value } : notificationDefaults; } catch { return notificationDefaults; } }
