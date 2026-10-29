# Fumbly

Browser source for a Game of Life learning prototype. A lesson combines a story,
a small Python-style answer, a cellular board and feedback. The implementation
contains a lesson catalogue, answer checks, pattern presets and a rules sandbox.

The TypeScript checker matches supported answers and lesson conditions; it does
not run arbitrary Python. Progress is stored locally through Zustand persistence.
Clearing browser storage removes that local progress.

## Development

Use Node.js 22.12+ and npm. From this directory:

```sh
npm ci --ignore-scripts
npm run dev
```

The development server binds to `127.0.0.1:5173`. This source snapshot contains the
browser application. Desktop wrappers, installers and icon packages are omitted.
The existing guarded desktop bridge remains in the source; browser use needs no
desktop process or model provider.

## Checks

```sh
npm run typecheck
npm test
npm run build
```

The tests cover cellular rules/patterns, lesson progression, answer conditions and
the rendered application shell in jsdom. Build output is generated in `dist/`
and is excluded from source control. See [VALIDATION.md](VALIDATION.md) for the
actual publication-copy results and limits.

## Assets and scope

The story-panel illustration is original inline SVG drawn from geometric shapes
and a glider pattern. It does not use the prior PNG illustration. Fonts and UI
libraries are installed through the dependency lockfile; their upstream terms
continue to apply.

This remains a learning-game prototype. Unit and build checks do not establish
browser rendering, accessibility across devices or the effectiveness of lessons
with learners. No project-wide reuse license was supplied with the local source.
