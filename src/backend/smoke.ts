// `pnpm smoke` — open every kind of window in a real `tinyjs dev` run and
// fail if any page throws.
//
// Webviews keep their console to themselves, so a page that dies on load
// looks, from the terminal, exactly like one that worked. With NIB_SMOKE set
// (and only then) each page carries a reporter (boot.ts smokeReporter, added
// by vite.config.ts) that sends its errors and a "loaded" note here; this
// opens the example document, Settings and Help in turn, then exits non-zero
// if anything threw or a page never reported in.
//
// It uses your real Nib data (recents, settings), as `tinyjs dev` always has.

export const smokeOn = !!tjs.env.NIB_SMOKE;

interface SmokeReport {
  ok?: string;          // page path, once it has loaded
  nodes?: number;
  err?: string;
  at?: string;
  rej?: string;
}

const loaded = new Set<string>();
const problems: string[] = [];

export const smokeApi = {
  smokeReport: (p: SmokeReport, _app: TinyApp, meta: { window?: string }) => {
    const win = meta?.window ?? '?';
    if (p.ok) {
      loaded.add(p.ok.split('/').pop() || 'index.html');
      console.log(`smoke: ${win} loaded ${p.ok} (${p.nodes} elements)`);
    } else {
      const what = p.err ? `${p.err} at ${p.at}` : `unhandled rejection: ${p.rej}`;
      problems.push(`${win}: ${what}`);
      console.log(`smoke: ${win} ERROR ${what}`);
    }
  },
};

// The steps, each given time to load and report.
export async function runSmoke(app: TinyApp, api: Record<string, (...a: any[]) => any>): Promise<void> {
  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
  await wait(2500);
  await api.openExample({}, app);
  await wait(4000);
  api.openSettings({}, app);
  await wait(3000);
  api.openHelp({}, app);
  await wait(3000);
  for (const page of ['index.html', 'doc.html', 'settings.html', 'help.html']) {
    if (!loaded.has(page)) problems.push(`${page} never reported in`);
  }
  if (problems.length) {
    console.log(`smoke: FAILED\n  ${problems.join('\n  ')}`);
    tjs.exit(1);
  }
  console.log('smoke: ok — every window loaded without an error');
  tjs.exit(0);
}
