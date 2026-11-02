# Releasing

1. `pnpm check` and `pnpm smoke` pass. Bump `version` in `tinyjs.json`,
   commit, push to `main`.
2. Linux and Windows: run the **release** workflow (Actions → release → Run
   workflow, or `gh workflow run release.yml -f tinyjs_tag=v0.70.1`). It
   builds Linux x86_64 + arm64 in an ubuntu:22.04 container (glibc 2.35
   floor) and Windows x64 (smoke-tested), and uploads them to a **draft**
   release `v<version>`.
3. macOS, on the Mac (needs `TINYJS_SIGN_IDENTITY` and
   `TINYJS_NOTARY_PROFILE`):

   ```sh
   sh scripts/release-mac.sh            # arm64 and x86_64, notarized and stapled
   gh release upload v<version> release/nib-<version>-macos-*
   ```

   The script runs `pnpm install` (tinyjs build needs Vite and esbuild) and
   clears other versions' builds out of `release/` before it starts, so only
   this version's four files are there.

4. Write the release notes into the draft (they're shown in the app's update
   banner, on apps.tarwin.art/nib and in Shelf). Check the draft has all
   seven files (2 Linux, 1 Windows, 2 dmg + 2 zip for macOS), then publish it:
   `gh release edit v<version> --draft=false`.
5. Auto-update: `node scripts/release-manifest.mjs`. It hashes the update
   archives on the release, uploads one `manifest.json` covering every
   platform, and checks each url answers. Apps look for it at
   `releases/latest/download/manifest.json` (tinyjs.json `update.url`).
6. Shelf + old installs: `node scripts/shelf.mjs`. Copies the release's
   downloads to tinyjsapp-examples' `nib-v<version>` release (Shelf only
   downloads from there), writes Nib's catalog entry, and copies this
   release's `manifest.json` to tinyjsapp-examples' `_builds/nib/manifest.json`
   — the address every Nib up to 0.7.0 checks for updates. Commits and pushes
   there; that repo must have no uncommitted changes.

The microsite (apps.tarwin.art/nib, repo `tarwin-apps-microsites`) reads the
latest release from the GitHub API, so it needs no change per release.
