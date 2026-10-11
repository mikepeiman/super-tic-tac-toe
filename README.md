# Super Tic-Tac-Toe

Tic-tac-toe grown into a strategy game for 2–8 players: big boards, several marks per turn,
and every run of marks in a row scores. The board always fills; the best territory wins.

- Design: [docs/GDD.md](docs/GDD.md) · Terms: [docs/LEXICON.md](docs/LEXICON.md)
- Agent and contributor workflow: [AGENTS.md](AGENTS.md)

## Layout

| Path | What it is |
| --- | --- |
| `packages/engine` | The rules: board lines, scoring, fair configuration, turns, game records, bots. Pure TypeScript, no dependencies. |
| `apps/web` | The SvelteKit 3 / Svelte 5 app. Static build, works offline as a PWA. |
| `legacy/` | The original 2019–2020 Sapper app, kept as the scoring reference. It does not build on current Node. |

## Commands

Requires Node 22.17+ and pnpm 9.

```sh
pnpm install
pnpm dev            # http://localhost:5173
pnpm build          # static site in apps/web/build
pnpm preview
pnpm lint           # Prettier + ESLint
pnpm check          # TypeScript and svelte-check
pnpm test           # engine and web unit tests
pnpm test:e2e       # Playwright (desktop + phone)
```

`apps/web/build` is a plain static site: host it on any static host. Pages are prerendered,
so the host needs no rewrite rules.
