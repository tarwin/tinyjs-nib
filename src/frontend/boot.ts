// Stamp the appearance before the first paint.
//
// vite.config.ts inlines these into the pages' <head> as a classic script
// (vite.config.ts → HEAD_SCRIPTS) — so each must stay self-contained: no
// imports, no outside names.
//
// This is a <head> script on purpose, and it is synchronous on purpose. Every
// page resolves Light / Dark / Match System itself and puts a concrete
// data-appearance on <html>, but it could only do that AFTER asking the
// backend — so a window opened in dark mode painted light first and blinked.
// The old answer was a duplicate of the whole dark palette behind
// `@media (prefers-color-scheme: dark)`, which covered the flash and cost a
// second copy of every colour.
//
// So: remember the last resolved answer, and use it immediately. `matchMedia`
// covers a first run with nothing remembered, and the real answer arrives a
// moment later from the backend and corrects the attribute if it disagrees —
// which it only can when the setting changed while Nib wasn't running.
//
// With the attribute always present, palette.css needs no media query at all,
// and a new variant is one more block rather than one more block in two places.

export function bootPage(): void {
  let saved: string | null = null;
  try { saved = localStorage.getItem('nib.appearance'); } catch { /* private mode */ }
  const dark = saved === 'dark' || (saved !== 'light'
    && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.appearance = dark ? 'dark' : 'light';
}

// No browser right-click menu in tinyjs apps — text fields keep theirs.
// Every page but Help, which keeps the browser's (Copy on a selection).
export function blockContextMenu(): void {
  addEventListener('contextmenu', (e) => {
    const t = e.target as Element | null;
    if (!t?.closest?.('input, textarea, [contenteditable]')) e.preventDefault();
  });
}


// `pnpm smoke` only (vite.config.ts adds it when NIB_SMOKE is set): report
// this page's errors, and that it loaded, to the backend (src/backend/smoke.ts).
export function smokeReporter(): void {
  const report = (o: Record<string, unknown>) => {
    try { tiny.api.call('smokeReport', o); } catch { /* the bridge isn't up */ }
  };
  addEventListener('error', (e) => report({ err: String(e.message), at: e.filename + ':' + e.lineno }));
  addEventListener('unhandledrejection', (e) =>
    report({ rej: String((e.reason && e.reason.stack) || e.reason) }));
  setTimeout(() => report({ ok: location.pathname, nodes: document.querySelectorAll('*').length }), 1500);
}
