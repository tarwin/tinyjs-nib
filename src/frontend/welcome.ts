// The Welcome window's entry (index.html).

import { nibApplyAppearance } from './appearance.ts';
import { checkForUpdatesUI, installCliUI, makeDefaultUI } from './updates.ts';
import { setupZoom } from './zoom.ts';

const $ = (id) => document.getElementById(id);

let appearance = 'system';
// Resolving Light / Dark / Match System — and remembering the answer, so
// the next window opens already knowing (appearance.ts).
async function applyAppearance(a) {
  appearance = a || 'system';
  await nibApplyAppearance(appearance);
}
tiny.theme.on(() => { if (appearance === 'system') applyAppearance('system'); });
tiny.api.on('appearance', ({ appearance: a }) => applyAppearance(a));

function paint(p) {
  if (p.appearance) applyAppearance(p.appearance);
  $('draftCard').hidden = !p.untitledDraft;

  const box = $('recents');
  box.textContent = '';
  const folders = p.folders || [];
  if (!p.recents.length && !folders.length) {
    box.insertAdjacentHTML('beforeend',
      '<div id="empty">Files and folders you open will show up here.</div>');
    return;
  }

  // One row shape for both lists — a folder just opens a whole tree instead
  // of a single document, and says so with its icon.
  const heading = (text) => {
    const h = document.createElement('h2');
    h.textContent = text;
    box.appendChild(h);
  };
  const rowFor = (r, { folder }) => {
    const row = document.createElement('div');
    row.className = 'recent' + (r.exists ? '' : ' gone');
    const slash = r.path.lastIndexOf('/');

    const icon = document.createElement('span');
    icon.className = 'icon';
    icon.textContent = folder ? '🗂' : '📄';
    const names = document.createElement('div');
    names.className = 'names';
    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = r.path.slice(slash + 1);
    const dir = document.createElement('div');
    dir.className = 'dir';
    // A long path is identified by its END, so trim from the left: the last
    // few folders tell you which "docs" this is, the first few never do.
    const full = r.path.slice(0, slash).replace(/^\/Users\/[^/]+/, '~');
    const parts = full.split('/');
    let tail = parts[parts.length - 1];
    for (let i = parts.length - 2; i >= 0 && (parts[i] + '/' + tail).length <= 48; i--) {
      tail = parts[i] + '/' + tail;
    }
    dir.textContent = tail === full ? full : '…/' + tail;
    dir.title = r.path;
    names.append(name, dir);
    row.append(icon, names);

    if (folder && r.open) {
      const badge = document.createElement('span');
      badge.className = 'open';
      badge.textContent = 'open';
      row.appendChild(badge);
    }
    const x = document.createElement('span');
    x.className = 'x';
    x.textContent = '✕';
    x.title = 'Remove from list';
    const forget = folder ? 'removeRecentFolder' : 'removeRecent';
    x.onclick = (e) => {
      e.stopPropagation();
      tiny.api.call(forget, { path: r.path });
    };
    row.appendChild(x);
    row.onclick = () => {
      if (!r.exists) { tiny.api.call(forget, { path: r.path }); return; }
      if (folder) tiny.api.call('openFolder', { path: r.path });
      else tiny.api.call('openPaths', { paths: [r.path] });
    };
    box.appendChild(row);
  };

  if (folders.length) {
    heading('Recent folders');
    for (const r of folders) rowFor(r, { folder: true });
    if (p.recents.length) box.insertAdjacentHTML('beforeend', '<div class="gap"></div>');
  }
  if (p.recents.length) {
    heading(folders.length ? 'Recent files' : 'Recent');
    for (const r of p.recents) rowFor(r, { folder: false });
  }
}

$('btnNew').onclick = () => tiny.api.call('newDoc');
$('btnOpen').onclick = async () => {
  // what Nib can open: the backend's OPENABLE + IMAGES sets
  const picks = await tiny.dialog.openFiles({ types: [
    'md', 'markdown', 'mdown', 'mkdn', 'mkd', 'mdwn', 'mdtxt', 'mdtext',
    'mdx', 'qmd', 'rmd', 'mdc', 'markdoc', 'mdoc', 'adoc', 'asciidoc', 'txt',
    'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'avif', 'heic', 'tiff',
  ] });
  if (picks) tiny.api.call('openPaths', { paths: picks });
};
// A folder becomes the project behind every document window: file tree,
// Open Quickly, and its own .nib/settings.json.
async function openFolder() {
  const dir = await tiny.dialog.pickFolder();
  if (dir) tiny.api.call('openFolder', { path: dir });
}
$('btnFolder').onclick = openFolder;
$('btnDraft').onclick = () => tiny.api.call('restoreUntitled');
$('btnExample').onclick = () => tiny.api.call('openExample');
$('btnCli').onclick = () => installCliUI();

// The Introduction banner, first launches only. Reading it or closing it
// both retire it for good — the goodbye line says where it lives on
// (Help ▸ Introduction to Nib), then the bar fades out.
function retireIntro(open) {
  tiny.api.call('dismissIntro');
  if (open) tiny.api.call('openHelp');
  const bar = $('introBar');
  bar.classList.add('bye');
  bar.textContent = 'It stays in Help ▸ Introduction to Nib — ⌘⇧H whenever you want it.';
  setTimeout(() => { bar.style.opacity = '0'; }, open ? 2500 : 6000);
  setTimeout(() => { bar.hidden = true; }, open ? 3200 : 6700);
}
$('introOpen').onclick = () => retireIntro(true);
$('introX').onclick = () => retireIntro(false);

// menus broadcast to every window; act only when we're the key window
tiny.menu.on(async (id) => {
  if (!document.hasFocus()) return;
  if (id === 'new') tiny.api.call('newDoc');
  else if (id === 'open') $('btnOpen').onclick();
  else if (id === 'openfolder') openFolder();
  // 'closefolder' and 'newwindow' are the backend's — they need no page state
  else if (id === 'check-updates') checkForUpdatesUI();
  else if (id === 'default-md') makeDefaultUI();
  else if (id === 'install-cli') installCliUI();
});

// .md files land here from Finder too (Dock icon, double-click)
tiny.win.onDrop((paths) => tiny.api.call('openPaths', { paths }));
tiny.app.onOpenFiles(() => {});      // backend's onOpenFiles does the work

document.addEventListener('dragover', () => document.body.classList.add('dropping'));
document.addEventListener('dragleave', () => document.body.classList.remove('dropping'));
document.addEventListener('drop', () => document.body.classList.remove('dropping'));

// Whatever size you leave this window at is the size it comes back at —
// a long list of folders is worth making room for once, not every launch.
// The call carries no numbers: innerWidth here is CSS pixels, which UI
// zoom divides, so a zoomed Welcome that reported its own size came back
// smaller every launch. The backend measures the window itself.
let sizeTimer = null;
addEventListener('resize', () => {
  clearTimeout(sizeTimer);
  sizeTimer = setTimeout(() => tiny.api.call('rememberWelcomeSize'), 400);
});

tiny.api.on('welcome', paint);
const boot = await tiny.api.call('boot');
setupZoom(boot.zoom);
$('introBar').hidden = !!boot.introSeen;
paint(boot);
