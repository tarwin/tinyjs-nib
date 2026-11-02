# tinyjs-nib — working notes

Nib, a Markdown editor built on tinyjs (../tinyjsapp or
github.com/tarwin/tinyjsapp). `pnpm install`, then `tinyjs dev` runs it.

## Code

Strict TypeScript, no runtime dependencies (pnpm brings build tools only).

- `src/backend/` — txiki.js (NOT Node: the `tjs` global, web APIs). tinyjs
  bundles `main.ts` with esbuild. Types: types/tiny.d.ts, types/tjs.d.ts.
- `src/frontend/` — the four pages (index = Welcome, doc, settings, help),
  ES modules bundled by Vite into web-dist/; `tinyjs dev` runs Vite's dev
  server. Each page has one entry module (welcome.ts, doc.ts,
  settings-page.ts, help-page.ts). `public/` (vendor libs, images) is copied
  as-is; vendored libs are loaded on demand and typed in globals.d.ts.
- boot.ts runs in each page's <head> before first paint (vite.config.ts
  inlines it via Function.toString()): keep those functions self-contained.
- Relative imports carry the `.ts` extension (Node's test runner needs it).
- `pnpm check` = typecheck (tsc -b) + tests (node --test, snapshots in
  tests/; `pnpm test:update` after a deliberate rendering change).
- `pnpm smoke` opens every kind of window in a real `tinyjs dev` run and
  fails if a page throws. Webview consoles don't reach the terminal, so run
  it after any frontend change.

Moved out of tinyjsapp-examples on 2026-11-02 (history kept, via
`git subtree split`). Releases 0.7.0 and older live on that repo's
`nib-v*` releases; 0.8.0 on are `v*` releases here.

## Releasing

See RELEASING.md. Three addresses must stay alive:

- `releases/latest/download/manifest.json` here: what tinyjs.json's
  `update.url` points at from 0.8.0 on.
- tinyjsapp-examples `_builds/nib/manifest.json`: what every copy up to
  0.7.0 polls. `scripts/shelf.mjs` keeps it a copy of the latest manifest.
  Never delete it.
- tinyjsapp-examples `nib-v<ver>` releases: Shelf only downloads from that
  repo, so shelf.mjs mirrors each release's downloads there.

Website: apps.tarwin.art/nib (repo ../tarwin-apps-microsites, `nib/`). It
reads this repo's latest release from the GitHub API.

## Linux lessons (from the examples fleet, don't regress)

- Never `tinyjs publish` for Linux on the host: build in ubuntu:22.04
  (scripts/pkg-linux-container.sh, which the release workflow runs) so the
  glibc floor stays at 2.35.
- Data dirs: `$XDG_DATA_HOME || ~/.local/share`, never a mac-shaped path.
- Mic (dictation) works only because tinyjs.json's `permissions` block
  declares it; Linux has no OS prompt.
- Frameless windows get resize grips on Linux: declare `minSize` on
  satellite windows.
