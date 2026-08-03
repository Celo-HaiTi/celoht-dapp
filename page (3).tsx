"use client";

import { useMemo, useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Badge } from "@/components/ui/Badge";
import { agents } from "@/lib/data/agents";

// Bounding box roughly covering the Ouest department pilot region, used
// to project lat/lng onto a simple 0-100 percentage grid for this
// lightweight built-in visualization. Swap for a real map provider
// (Mapbox GL, Leaflet, Google Maps) by replacing this component's body —
// see docs/ARCHITECTURE.md for the integration point.
const BOUNDS = { minLat: 18.35, maxLat: 18.65, minLng: -72.95, maxLng: -72.45 };

function project(lat: number, lng: number) {
  const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * 100;
  const y = 100 - ((lat - BOUNDS.minLat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 100;
  return { x: Math.min(96, Math.max(4, x)), y: Math.min(96, Math.max(4, y)) };
}

export default function AgentMapPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const active = useMemo(() => agents.filter((a) => a.status === "Active"), []);

  return (
    <>
      <Breadcrumbs items={[{ label: "Agents", href: "/agents" }, { label: "Map" }]} />
      <PageHero
        eyebrow="Agent Network · Map"
        title="Nearby agents"
        lead="A lightweight built-in visualization of active agents by region. A production deployment would swap this panel for a full map provider (Mapbox, Leaflet, or Google Maps) — see docs/ARCHITECTURE.md."
      />

      <Section>
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="border-navy-700/15 bg-forest-500/5 dark:border-parchment-100/10 relative aspect-[4/3] overflow-hidden rounded-2xl border">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="text-navy-700/10 dark:text-parchment-100/10 absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              {Array.from({ length: 9 }, (_, i) => (i + 1) * 10).map((v) => (
                <g key={v}>
                  <line x1={v} y1={0} x2={v} y2={100} stroke="currentColor" strokeWidth="0.2" />
                  <line x1={0} y1={v} x2={100} y2={v} stroke="currentColor" strokeWidth="0.2" />
                </g>
              ))}
            </svg>

            {active.map((agent) => {
              const { x, y } = project(agent.lat, agent.lng);
              const isSelected = selected === agent.address;
              return (
                <button
                  key={agent.address}
                  type="button"
                  onClick={() => setSelected(agent.address)}
                  style={{ left: `${x}%`, top: `${y}%` }}
                  className={`border-parchment-50 dark:border-navy-900 absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-md transition-transform hover:scale-110 ${
                    isSelected ? "bg-gold-500 h-5 w-5" : "bg-forest-500 h-4 w-4"
                  }`}
                >
                  <span className="sr-only">{agent.displayName}</span>
                </button>
              );
            })}
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-lg font-semibold">
              {selected ? "Selected agent" : `${active.length} active agents`}
            </h2>
            {active
              .filter((a) => !selected || a.address === selected)
              .map((agent) => (
                <button
                  key={agent.address}
                  type="button"
                  onClick={() => setSelected(agent.address === selected ? null : agent.address)}
                  className="border-navy-700/15 hover:border-gold-500/50 dark:border-parchment-100/10 block w-full rounded-xl border p-4 text-left text-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{agent.displayName}</span>
                    <Badge tone="forest">Active</Badge>
                  </div>
                  <p className="text-ink-soft dark:text-parchment-100/60 mt-1">{agent.region}</p>
                </button>
              ))}
          </div>
        </div>
      </Section>
    </>
  );
}
