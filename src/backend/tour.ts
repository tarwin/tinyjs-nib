// The screenshot tour (scripts/screenshots.sh): open the demo docs project
// (scripts/tour/demo, copied to a temp folder) and step through the app,
// having each screen captured. Only runs when NIB_TOUR names that folder.
//
// For each screen this writes <tour>/shot.json — { seq, name, title }, the
// title being the window to capture — and waits for the script to answer
// with <tour>/done-<seq>. The pages' half (clicking, typing, opening
// panels) goes in with app.window(id).eval, against the hooks doc.ts hangs
// on window.nibTour when the page is built for the tour (VITE_NIB_TOUR).

export const tourDir: string | null = tjs.env.NIB_TOUR || null;

/** What the tour needs from main.ts. */
export interface TourHooks {
  api: Record<string, (...a: any[]) => any>;
  onMenu(id: string, app: TinyApp): void;
  openDoc(app: TinyApp, path: string, opts?: { withFolder?: boolean; from?: string; forceWindow?: boolean }): Promise<string>;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const enc = new TextEncoder();

async function exists(p: string) {
  try { await tjs.stat(p); return true; } catch { return false; }
}

let seq = 0;
async function shot(name: string, title: string) {
  await wait(400);
  seq++;
  await tjs.writeFile(tourDir + '/shot.json', enc.encode(JSON.stringify({ seq, name, title })));
  for (let i = 0; i < 100 && !(await exists(tourDir + '/done-' + seq)); i++) await wait(100);
  console.log('tour: ' + name);
}

// Helpers every page-side step gets (inside the eval, before `code`).
const PAGE_HELPERS = `
  const T = window.nibTour, $ = (s) => document.querySelector(s);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  // the first text node under root holding text: [node, offset]
  const textAt = (root, text) => {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let n; (n = w.nextNode());) { const i = n.nodeValue.indexOf(text); if (i >= 0) return [n, i]; }
    return null;
  };
  const select = (root, text, collapse) => {
    const at = textAt(root, text); if (!at) return;
    const r = document.createRange();
    r.setStart(at[0], at[1]); r.setEnd(at[0], at[1] + (collapse ? 0 : text.length));
    const s = getSelection(); s.removeAllRanges(); s.addRange(r);
  };
  // waits (up to 3s) for an element under sel whose text includes text
  const clickText = async (sel, text) => {
    for (let i = 0; i < 30; i++) {
      const el = [...document.querySelectorAll(sel)].find((e) => e.textContent.includes(text));
      if (el) { el.click(); return; }
      await wait(100);
    }
    console.warn('tour: no ' + text);
  };
  const type = async (input, text) => {
    input.focus();
    for (const ch of text) { document.execCommand('insertText', false, ch); await wait(60); }
  };
  const fill = (input, text) => {
    input.focus(); input.value = text;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  };
`;

export async function runTour(app: TinyApp, h: TourHooks): Promise<void> {
  const root = tjs.env.NIB_TOUR_PROJECT || tourDir + '/lantern';
  const guide = root + '/docs/guide/';
  const W = 1280, H = 820;
  const js = (win: string, code: string) =>
    app.window(win).eval(`(async () => { ${PAGE_HELPERS} ${code} })().catch((e) => console.error(e))`);
  // a menu click reaches both halves: the backend's onMenu and the page
  const menu = (win: string, id: string) => { h.onMenu(id, app); js(win, `T.menuAct(${JSON.stringify(id)})`); };
  const size = (win: string) => { app.window(win).setSize(W, H); app.window(win).center(); };
  const front = (win: string) => app.window(win).show();
  const tab = async (win: string, file: string) => { await h.openDoc(app, file, { from: win }); await wait(1500); };

  try {
    await wait(2500);
    await h.api.setAppearance({ appearance: 'light' }, app);

    // ------------------------------------------ a folder, in Split view
    await h.api.openFolder({ path: root, quiet: true }, app);
    const doc = await h.openDoc(app, guide + 'getting-started.md', { withFolder: true, forceWindow: true });
    await wait(3000);
    size(doc);
    await tab(doc, guide + 'themes.md');
    await tab(doc, guide + 'getting-started.md');
    menu(doc, 'view:split');
    await wait(1500);
    front(doc);
    await shot('folders', 'getting-started.md');

    // ----------------------------------------- outline, on a richer page
    await tab(doc, guide + 'photos.md');
    menu(doc, 'outline');
    await wait(1000);
    await shot('editor-and-preview', 'photos.md');
    menu(doc, 'outline');

    // --------------------------------- the editable preview, a selection
    await tab(doc, guide + 'getting-started.md');
    menu(doc, 'editable');
    await wait(1000);
    js(doc, `T.preview.focus(); select(T.preview, 'photo journal'); document.dispatchEvent(new Event('selectionchange'));`);
    await wait(900);
    await shot('editable-preview', 'getting-started.md');

    // -------------------------------------------------- a table's grips
    js(doc, `
      const cell = [...T.preview.querySelectorAll('td')].find((c) => c.textContent.includes('When it started'));
      cell.scrollIntoView({ block: 'center' });
      await wait(400);
      T.preview.focus(); select(cell, 'When', true);
      const r = cell.getBoundingClientRect();
      cell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: r.left + 10, clientY: r.top + 5 }));
      await wait(500);
      const g = $('.tgrip.tcol');
      if (g) g.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));`);
    await wait(1500);
    await shot('tables', 'getting-started.md');
    js(doc, `T.preview.scrollTo?.(0, 0); $('#previewPane').scrollTop = 0;`);
    menu(doc, 'editable');
    await wait(600);

    // ------------------------------------------------- the find bar
    menu(doc, 'find:replace');
    await wait(600);
    js(doc, `fill($('#findInput'), 'trip'); await wait(200); const r = $('#findReplaceRow input'); if (r) fill(r, 'journey');`);
    await wait(1000);
    await shot('find', 'getting-started.md');
    js(doc, `$('#findClose').click()`);
    await wait(400);

    // ------------------------------------------------- Find in Folder
    menu(doc, 'find:folder');
    await wait(600);
    js(doc, `fill($('#sfInput'), 'photo')`);
    await wait(2000);
    await shot('find-in-folder', 'getting-started.md');
    js(doc, `$('#sfBack').click()`);
    await wait(500);

    // -------------------------------------------------- the @ picker
    await tab(doc, guide + 'writing-a-trip.md');
    menu(doc, 'view:editor');
    await wait(800);
    js(doc, `
      const at = T.ed.value.indexOf('so write them for people.') + 'so write them for people.'.length;
      T.ed.focus(); T.ed.setSelectionRange(at, at);
      await type(T.ed, ' See @insta');`);
    await wait(1500);
    await shot('link-picker', 'writing-a-trip.md');
    js(doc, `document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); await wait(200); document.execCommand('undo');`);
    await wait(600);
    menu(doc, 'view:split');
    await wait(800);

    // ---------------------------------------------------------- pins
    await h.api.setPin({ path: root + '/docs/guide', state: 'docs' }, app);
    await h.api.setPin({ path: root + '/docs/public', state: 'images' }, app);
    await wait(1500);
    await shot('pins', 'writing-a-trip.md');
    await h.api.setPin({ path: root + '/docs/guide', state: null }, app);
    await h.api.setPin({ path: root + '/docs/public', state: null }, app);
    await wait(800);

    // -------------------------------------------------- the site menu
    menu(doc, 'sitemenu');
    await wait(1500);
    await shot('site-menu', 'writing-a-trip.md');
    js(doc, `$('#stProject').click()`);
    await wait(500);

    // ------------------------------------------------------ Page View
    menu(doc, 'view:preview');
    menu(doc, 'pw:a4');
    menu(doc, 'opt:hrBreaks');
    menu(doc, 'opt:paged');
    await wait(1500);
    js(doc, `const p = $("#previewPane"); p.scrollTop = p.scrollHeight - p.clientHeight - 260;`);
    await wait(600);
    await shot('page-view', 'writing-a-trip.md');
    menu(doc, 'opt:paged');
    menu(doc, 'opt:hrBreaks');
    menu(doc, 'pw:normal');
    menu(doc, 'view:split');
    await wait(800);

    // -------------------------------------------------------- actions
    await tab(doc, guide + 'getting-started.md');
    js(doc, `T.ed.focus(); T.ed.setSelectionRange(0, 0); T.ed.scrollTop = 0; $('#previewPane').scrollTop = 0;`);
    await wait(800);
    js(doc, `$('#btnActions').click()`);
    await wait(1200);
    await shot('actions-menu', 'getting-started.md');
    js(doc, `document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); $('#actMenu').hidden = true;`);
    await wait(400);
    menu(doc, 'act:manage');
    await wait(1500);
    js(doc, `await clickText('.aerow', 'Build the site')`);
    await wait(1000);
    await shot('manage-actions', 'getting-started.md');
    js(doc, `document.activeElement.blur(); document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));`);
    await wait(800);

    // ------------------------------------------------ Optimize Picture
    js(doc, `T.openOptimizer([${JSON.stringify(root + '/docs/public/images/harbour.jpg')}])`);
    await wait(3000);
    await shot('optimize', 'getting-started.md');
    js(doc, `document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));`);
    await wait(800);

    // ------------------------------------------------------- Settings
    front(doc);
    await wait(500);
    h.api.openSettings({ section: 'preview' }, app);
    await wait(2500);
    await shot('settings', 'Settings');
    h.api.openSettings({ section: 'images' }, app);
    await wait(1200);
    await shot('settings-images', 'Settings');
    const set = (code: string) => app.window('settings').eval(`(async () => { ${PAGE_HELPERS} ${code} })()`);
    set(`await clickText('#setTabs button', 'Mine'); await wait(800); await clickText('#setSide .setnav', 'AI');`);
    await wait(1500);
    await shot('settings-ai', 'Settings');
    app.window('settings').close();
    await wait(800);

    // ----------------------------------------------------------- dark
    await h.api.setAppearance({ appearance: 'dark' }, app);
    menu(doc, 'theme:night');
    front(doc);
    await wait(1500);
    await shot('dark', 'getting-started.md');
    await h.api.setAppearance({ appearance: 'light' }, app);
    menu(doc, 'theme:paper');
    menu(doc, 'theme:paper');

    // ------------------------------------- Welcome, with recents in it
    app.window(doc).close();
    await wait(1500);
    app.show();
    app.eval(`document.getElementById('introBar').style.display = 'none';`);
    await wait(1200);
    await shot('welcome', 'Nib');
  } catch (e) {
    console.log('tour: failed — ' + String(e));
  }
  await tjs.writeFile(tourDir + '/finished', enc.encode('1'));
  await wait(500);
  tjs.exit(0);
}
