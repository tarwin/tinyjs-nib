#!/usr/bin/env node
// Lists a published release in Shelf, the tinyjs app store, and keeps the
// old update address working:
//
//   node scripts/shelf.mjs [v<version>] [--no-push]    # default: tinyjs.json's version
//
// Nib lived in tinyjsapp-examples until 0.7.0, and every copy shipped from
// there checks raw.githubusercontent.com/tarwin/tinyjsapp-examples/main/
// _builds/nib/manifest.json for updates. So besides the catalog, this copies
// this release's manifest.json over that file: old installs update straight
// to the current version, and from then on read this repo's
// releases/latest/download/manifest.json (tinyjs.json `update.url`).
// Never delete that file in tinyjsapp-examples.
//
// Shelf reads its list from catalog.json there (EXAMPLES, default
// ../tinyjsapp-examples) and only downloads from that repo's own releases.
// So this also copies the release's dmgs, Windows zip and Linux tarballs to
// a nib-v<version> release there (same notes, which Shelf shows), writes
// Nib's entry into the catalog and Shelf's bundled copy of it, then commits
// and pushes. The entry is marked "external": the catalog's own generator
// keeps it as it is.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const config = JSON.parse(readFileSync(new URL('../tinyjs.json', import.meta.url), 'utf8'));
const args = process.argv.slice(2);
const push = !args.includes('--no-push');
const tag = args.find((a) => a.startsWith('v')) ?? `v${config.version}`;
const version = tag.replace(/^v/, '');
const examples = resolve(process.env.EXAMPLES ?? new URL('../../tinyjsapp-examples', import.meta.url).pathname);
const EXAMPLES_REPO = 'tarwin/tinyjsapp-examples';
const shelfTag = `${config.name}-v${version}`;
const run = (cmd, args, opts = {}) => execFileSync(cmd, args, { encoding: 'utf8', ...opts });
const git = (...a) => run('git', ['-C', examples, ...a]);

if (git('status', '--porcelain').trim()) {
  console.error(`${examples} has uncommitted changes; commit or stash them first.`);
  process.exit(1);
}
git('pull', '--quiet', '--rebase', 'origin', 'main');

const release = JSON.parse(run('gh', ['release', 'view', tag, '--json', 'body,isDraft']));
if (release.isDraft) {
  console.error(`${tag} is still a draft; publish it first.`);
  process.exit(1);
}
const files = {
  macArm: `${config.name}-${version}-macos-arm64.dmg`,
  macIntel: `${config.name}-${version}-macos-x86_64.dmg`,
  win: `${config.name}-${version}-win.zip`,
  linuxX64: `${config.name}-${version}-linux-x86_64.tar.gz`,
  linuxArm: `${config.name}-${version}-linux-arm64.tar.gz`,
};
const dir = mkdtempSync(join(tmpdir(), 'nib-shelf-'));
for (const f of [...Object.values(files), 'manifest.json']) run('gh', ['release', 'download', tag, '--pattern', f, '--dir', dir]);

// The update manifest must describe this release before old installs see it.
const manifest = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf8'));
if (manifest.version !== version) {
  console.error(`${tag}'s manifest.json says ${manifest.version}; run scripts/release-manifest.mjs first.`);
  process.exit(1);
}

// The copy Shelf downloads from.
const notesFile = join(dir, 'notes.md');
writeFileSync(notesFile, release.body ?? '');
try {
  run('gh', ['release', 'view', shelfTag, '-R', EXAMPLES_REPO], { stdio: 'ignore' });
  run('gh', ['release', 'edit', shelfTag, '-R', EXAMPLES_REPO, '--notes-file', notesFile]);
} catch {
  run('gh', ['release', 'create', shelfTag, '-R', EXAMPLES_REPO, '--title', `${config.title} ${version}`, '--notes-file', notesFile]);
}
run('gh', ['release', 'upload', shelfTag, '-R', EXAMPLES_REPO, '--clobber', ...Object.values(files).map((f) => join(dir, f))]);
console.log(`uploaded to ${EXAMPLES_REPO} ${shelfTag}`);

const download = (file, name) => {
  const bytes = readFileSync(join(dir, file));
  return {
    [name]: file,
    url: `https://github.com/${EXAMPLES_REPO}/releases/download/${shelfTag}/${file}`,
    bytes: bytes.length,
    size: (bytes.length / 1048576).toFixed(1) + ' MB',
    sha256: createHash('sha256').update(bytes).digest('hex'),
  };
};
const RAW = `https://raw.githubusercontent.com/${EXAMPLES_REPO}/main`;
const macArm = { version, ...download(files.macArm, 'dmg') };

// Shaped like the fleet's entries (shelf/gen-catalog.js): the top level is
// the Apple Silicon dmg, for Shelf before 0.2.9.
const entry = {
  dir: config.name,
  title: config.title,
  id: config.id,
  version,
  app: `${config.title}.app`,
  category: 'useful',
  tagline: 'A tiny Markdown editor — one window per document',
  desc:
    "Syntax-coloured source and highlighted code blocks, two panes that mirror each other's cursor and selection to the character, " +
    'an editable preview that writes Markdown back as you type, heading outline, `::: note` callouts and `::: tabs` that can switch in lockstep, ' +
    'a project file tree with Open Quickly, @-mentions and a rename that offers to re-aim the links pointing at the old name, ' +
    'image paste with a destination, ⌥-click to follow a link from either pane, emoji picker, themed PDF and HTML export, lossless closing. ' +
    'A folder that is a docs site (VitePress, Docusaurus, MkDocs, Starlight and more) gets a ☰ Menu tab with its navigation, editable. ' +
    "Actions run your own commands, scripts and AI prompts on the folder you're in, and there's dictation. " +
    'Source on [GitHub](https://github.com/tarwin/tinyjs-nib).',
  ...macArm,
  screenshot: 'https://apps.tarwin.art/nib/screenshot.webp',
  icon: `${RAW}/shelf/src/frontend/icons/${config.name}.png`,
  readme: 'https://apps.tarwin.art/nib/',
  mac: { arm64: macArm, x86_64: { version, ...download(files.macIntel, 'dmg') } },
  platforms: ['linux', 'macos', 'windows'],
  win: { version, ...download(files.win, 'zip'), folder: config.name, exe: `${config.name}.exe` },
  linux: {
    version,
    folder: config.name,
    bin: config.name,
    arm64: download(files.linuxArm, 'tarball'),
    x86_64: download(files.linuxX64, 'tarball'),
  },
  external: true,
};
// Every url in the entry and the manifest must answer before anyone sees them.
const urls = [
  entry.screenshot, entry.readme, entry.mac.arm64.url, entry.mac.x86_64.url, entry.win.url, entry.linux.arm64.url, entry.linux.x86_64.url,
  manifest.url, manifest.mac?.x86_64?.url, manifest.win?.url, manifest.linux?.x86_64?.url, manifest.linux?.arm64?.url,
].filter(Boolean);
let bad = 0;
for (const url of urls) {
  const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
  console.log(`${res.ok ? 'ok ' : 'BAD'} ${res.status} ${url}`);
  if (!res.ok) bad++;
}
if (bad) process.exit(1);

// Shelf bundles 128px icons; the live catalog points at the same file.
run('sips', ['-z', '128', '128', new URL('../icon.png', import.meta.url).pathname, '--out', join(examples, `shelf/src/frontend/icons/${config.name}.png`)]);

const catalogPath = join(examples, 'catalog.json');
const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));
const at = catalog.apps.findIndex((a) => a.dir === entry.dir);
if (at >= 0) catalog.apps[at] = entry;
else catalog.apps.push(entry);
catalog.generated = new Date().toISOString().slice(0, 10);
writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + '\n');
writeFileSync(
  join(examples, 'shelf/src/frontend/catalog.js'),
  '// bundled fallback — regenerate with scripts in repo (gen-catalog)\n' + 'window.CATALOG = ' + JSON.stringify(catalog, null, 2) + ';\n',
);

// The old update address: the whole manifest, every platform (it all lives
// on this repo's release now, so nothing in the old file is worth keeping).
const legacy = `_builds/${config.name}/manifest.json`;
writeFileSync(join(examples, legacy), JSON.stringify(manifest, null, 2) + '\n');

git('add', 'catalog.json', 'shelf/src/frontend/catalog.js', `shelf/src/frontend/icons/${config.name}.png`, legacy);
git('commit', '--quiet', '-m', `catalog + legacy update manifest: ${config.name} ${version} (from tarwin/tinyjs-nib)`);
if (push) {
  git('push', '--quiet', 'origin', 'main');
  console.log(`Shelf lists ${config.title} ${version}; installs from before the move will update to it.`);
} else console.log(`Committed to ${examples}; not pushed (--no-push).`);
