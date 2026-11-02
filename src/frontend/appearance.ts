// Light / Dark / Match System, resolved. The before-first-paint half is
// boot.ts, inlined into each page's <head>.

// What every page calls once it knows the real setting. Resolving 'system'
// needs the backend (the OS's answer), so this is the async half.
export type Appearance = 'light' | 'dark' | 'system';

export async function nibApplyAppearance(a?: Appearance | string | null): Promise<boolean> {
  const want = a || 'system';
  let dark = want === 'dark';
  if (want === 'system') {
    const t = await tiny.theme.get();
    dark = !!(t && t.dark);
  }
  document.documentElement.dataset.appearance = dark ? 'dark' : 'light';
  // …so the NEXT window to open already knows, and opens without a flash
  try { localStorage.setItem('nib.appearance', dark ? 'dark' : 'light'); } catch { /* fine */ }
  return dark;
}
