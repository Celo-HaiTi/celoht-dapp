# Accessibility

## Standards

This dApp targets WCAG 2.1 AA. Concretely:

- **Keyboard navigation**: every interactive element (nav links, wallet
  connect, dialogs, tabs, form controls) is reachable and operable via
  keyboard alone. Modal dialogs (wallet connect, in `Dialog.tsx`) use
  Radix's focus-trap behavior.
- **Skip link**: `SkipLink.tsx` lets keyboard and screen reader users
  jump past repeated navigation to `#main-content`.
- **Semantic HTML**: pages use `<nav>`, `<main>`, `<section>`, `<dl>`, and
  heading levels that increment logically rather than div soup.
- **Visible focus states**: a global `:focus-visible` outline is defined
  in `globals.css` rather than relying on (often invisible) browser
  defaults.
- **Color contrast**: the shared navy/gold/forest/parchment palette was
  checked against WCAG AA contrast ratios for text use — see the
  website repository's `docs/ARCHITECTURE.md` for the specific
  calculations behind the `gold-800` vs. `gold-700` distinction.
- **`prefers-reduced-motion`**: respected globally in `globals.css`.
- **ARIA labels**: icon-only buttons (theme toggle, mobile menu, wallet
  disconnect) include `sr-only` text or `aria-label`.

## Known Gaps

- Automated accessibility auditing (e.g. axe-core in CI) isn't wired up
  yet — see [`../ROADMAP.md`](../ROADMAP.md).
- The Agent Map page's coordinate visualization uses colored markers with
  a text-based list alongside it as the accessible equivalent, but hasn't
  been tested with a screen reader against a real map provider's
  accessibility patterns.

## Reporting an Accessibility Issue

Open a GitHub issue with the `accessibility` label, or see
[`../SUPPORT.md`](../SUPPORT.md) for other contact channels.
