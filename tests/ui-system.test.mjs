import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

test("shared navigation retains workspace destinations and keyboard dismissal", () => {
  const header = read("../components/Header.tsx");
  for (const href of ["/", "/learn", "/wallet", "/agents", "/reforestation", "/pilot", "/wallet/activity", "/profile", "/settings", "/trust"]) {
    assert.ok(header.includes(`href: "${href}"`), `missing navigation destination ${href}`);
  }
  assert.match(header, /aria-current=\{isActive\(href\) \? "page" : undefined\}/);
  assert.match(header, /aria-expanded=\{menuOpen\}/);
  assert.match(header, /event\.key === "Escape"/);
  assert.match(header, /className="mobile-menu-backdrop/);
  assert.match(header, /celoht-logo\.png/);
});

test("brand tokens remain unchanged and shared route components use them", () => {
  const styles = read("../globals.css");
  const hero = read("../PageHero.tsx");
  const card = read("../Card.tsx");
  assert.match(styles, /--color-navy-950:\s*#0b1120/i);
  assert.match(styles, /--color-gold-500:\s*#f5c842/i);
  assert.match(styles, /--color-forest-500:\s*#2f6b4f/i);
  assert.match(hero, /page-hero-title/);
  assert.match(card, /premium-card/);
});