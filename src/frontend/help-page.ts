// Help ▸ Introduction to Nib and About Nib (help.html).

import { nibApplyAppearance } from './appearance.ts';
import { checkForUpdatesUI } from './updates.ts';
import { setupZoom } from './zoom.ts';

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;

tiny.app.info().then((i) => {
  $('aboutVersion').textContent =
    'Nib ' + i.version + ' · tinyjs ' + i.tinyjs + ' · ' + i.runtime;
}).catch(() => {});

// ------------------------------------------------------------ chrome & co.

let appearance = 'system';
// Resolving Light / Dark / Match System — and remembering the answer, so
// the next window opens already knowing (appearance.ts).
async function applyAppearance(a: string | null | undefined) {
  appearance = a || 'system';
  await nibApplyAppearance(appearance);
}
tiny.theme.on(() => { if (appearance === 'system') applyAppearance('system'); });
tiny.api.on('appearance', ({ appearance: a }) => applyAppearance(a));

// section jumps and the example-document buttons
const jumps = [...document.querySelectorAll<HTMLElement>('[data-jump]')];
for (const b of jumps) {
  b.onclick = () => $(b.dataset.jump!).scrollIntoView({ behavior: 'smooth', block: 'start' });
}
for (const b of document.querySelectorAll<HTMLButtonElement>('button[data-example]')) {
  b.onclick = () => tiny.api.call('openExample');
}

// the sidenav follows the scroll: the last section whose top has passed
// the fold line is the one you're reading
function spy() {
  let cur = jumps.length ? jumps[0].dataset.jump : null;
  for (const b of jumps) {
    const el = $(b.dataset.jump!);
    if (el && el.getBoundingClientRect().top <= 90) cur = b.dataset.jump;
  }
  // the very bottom of the page can never bring a short last section past
  // the line — pinned to the end means the last entry is the one
  if (innerHeight + scrollY >= document.body.scrollHeight - 4 && jumps.length) {
    cur = jumps[jumps.length - 1].dataset.jump;
  }
  for (const b of jumps) b.classList.toggle('on', b.dataset.jump === cur);
}
addEventListener('scroll', () => requestAnimationFrame(spy), { passive: true });
spy();

// every link on this page is an outside link — hand them all to the browser
document.addEventListener('click', (e) => {
  const a = (e.target as Element).closest('a[href]');
  if (!a) return;
  e.preventDefault();
  tiny.api.call('openExternal', { url: a.getAttribute('href') });
});

tiny.menu.on((id) => {
  if (!document.hasFocus()) return;
  if (id === 'close') tiny.win.close();
  else if (id === 'new') tiny.api.call('newDoc');
  else if (id === 'print') tiny.win.print();
  else if (id === 'check-updates') checkForUpdatesUI();
});

// Help ▸ About Nib (and the app menu's About) lands here as a jump
tiny.api.on('help-jump', ({ id }) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// the slice of the boot payload (main.ts) this page reads
const boot: { zoom?: number; appearance?: string } = await tiny.api.call('boot');
setupZoom(boot.zoom);                       // ⌘+ / ⌘− work here too
await applyAppearance(boot.appearance);
