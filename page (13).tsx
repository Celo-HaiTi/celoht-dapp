"use client";

import { useSyncExternalStore } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { celo, celoAlfajores } from "wagmi/chains";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/components/ThemeProvider";

const NOTIFICATIONS_KEY = "celoht-notification-prefs";

type NotificationPrefs = { governance: boolean; reforestation: boolean; agentUpdates: boolean };
const defaultPrefs: NotificationPrefs = {
  governance: true,
  reforestation: true,
  agentUpdates: false,
};

type Listener = () => void;
let listeners: Listener[] = [];

function subscribe(listener: Listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot(): string {
  return window.localStorage.getItem(NOTIFICATIONS_KEY) ?? JSON.stringify(defaultPrefs);
}

function getServerSnapshot(): string {
  return JSON.stringify(defaultPrefs);
}

function writePrefs(next: NotificationPrefs) {
  window.localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(next));
  listeners.forEach((listener) => listener());
}

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { chain, isConnected } = useAccount();
  const { switchChain } = useSwitchChain();
  const prefs: NotificationPrefs = JSON.parse(
    useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot),
  );

  function togglePref(key: keyof NotificationPrefs) {
    writePrefs({ ...prefs, [key]: !prefs[key] });
  }

  return (
    <>
      <Breadcrumbs items={[{ label: "Settings" }]} />
      <PageHero
        eyebrow="Settings"
        title="Preferences"
        lead="Theme and notification preferences are stored locally in your browser — nothing here is sent to a server."
      />

      <Section eyebrow="Appearance" title="Theme">
        <Card className="max-w-md">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Dark mode</CardTitle>
              <CardDescription className="mt-1">Currently: {theme}</CardDescription>
            </div>
            <Button variant="secondary" onClick={toggleTheme}>
              Switch to {theme === "light" ? "dark" : "light"}
            </Button>
          </div>
        </Card>
      </Section>

      <Section eyebrow="Network" title="Wallet network">
        <Card className="max-w-md">
          <CardTitle>{isConnected ? (chain?.name ?? "Unknown") : "Not connected"}</CardTitle>
          <CardDescription className="mt-2">
            CeloHT supports Celo mainnet and the Alfajores testnet.
          </CardDescription>
          {isConnected && (
            <div className="mt-4 flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => switchChain({ chainId: celo.id })}
              >
                Switch to Celo
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => switchChain({ chainId: celoAlfajores.id })}
              >
                Switch to Alfajores
              </Button>
            </div>
          )}
        </Card>
      </Section>

      <Section eyebrow="Notifications" title="What you hear about">
        <Card className="max-w-md space-y-3">
          {(
            [
              ["governance", "New governance proposals"],
              ["reforestation", "Reforestation project updates"],
              ["agentUpdates", "Agent network announcements"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center justify-between text-sm">
              {label}
              <input
                type="checkbox"
                checked={prefs[key]}
                onChange={() => togglePref(key)}
                className="accent-gold-500 h-4 w-4"
              />
            </label>
          ))}
          <p className="text-ink-soft dark:text-parchment-100/50 pt-2 text-xs">
            Delivery channel (email/push) isn&rsquo;t wired up yet — these preferences are stored
            for when it is.
          </p>
        </Card>
      </Section>
    </>
  );
}
