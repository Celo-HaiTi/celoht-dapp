# Brand Guidelines

The dApp shares CeloHT's brand identity with the flagship repository and
the marketing website — same palette, same principles.

## Palette

| Color     | Hex       | Use                                      |
| --------- | --------- | ---------------------------------------- |
| Navy      | `#0B1120` | Primary, authority, dark-mode background |
| Gold      | `#F5C842` | Accent, primary actions                  |
| Forest    | `#2F6B4F` | Reforestation-specific accents           |
| Parchment | `#F7F8FA` | Light-mode background                    |

Defined once in `apps/web/src/app/globals.css` under the Tailwind v4
`@theme` block — see [`../ARCHITECTURE.md`](../ARCHITECTURE.md).

## Typography

System font stacks are used rather than a remote webfont service, to
avoid an external network dependency in the Content Security Policy and
at build time — see the `--font-display`, `--font-body`, and
`--font-mono` tokens in `globals.css`.

## Voice in the dApp

Same principles as the rest of CeloHT: plain language, no unexplained
jargon, and explicit about what CeloHT is not (no blockchain claims, no
token claims, no ownership claims over Valora). See
[`../FAQ.md`](../FAQ.md) for examples of how these principles show up in
actual copy.

## Logo Usage

See the flagship repository's
[`docs/logo-usage.md`](https://github.com/Celo-HaiTi/celoht/blob/main/docs/logo-usage.md)
for the full logo usage policy. The logo file used in this app lives at
`apps/web/public/celoht-logo.png`.
