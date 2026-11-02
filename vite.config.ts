import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import { blockContextMenu, bootPage, smokeReporter } from './src/frontend/boot.ts';

// The four pages. Each window opens one by name (app.win.open's `page`), so
// they keep their names at the top of the build.
const PAGES = ['index', 'doc', 'settings', 'help'];

// What each page runs in <head>, synchronously, before first paint — inlined
// as a classic script, because a module would run after the body paints.
const HEAD_SCRIPTS: Record<string, Array<() => void>> = {
  index: [bootPage, blockContextMenu],
  doc: [bootPage, blockContextMenu],
  settings: [bootPage, blockContextMenu],
  help: [bootPage],
};

function headScripts(): Plugin {
  return {
    name: 'nib-head-scripts',
    transformIndexHtml(html, ctx) {
      const page = ctx.filename.replace(/\\/g, '/').split('/').pop()!.replace(/\.html$/, '');
      const fns = HEAD_SCRIPTS[page];
      if (!fns) throw new Error(`no HEAD_SCRIPTS entry for ${page}.html`);
      // pnpm smoke: every page reports its errors (src/backend/smoke.ts)
      const run = process.env.NIB_SMOKE ? [smokeReporter, ...fns] : fns;
      return {
        html,
        tags: [{
          tag: 'script',
          children: run.map((f) => `(${f.toString()})();`).join('\n'),
          injectTo: 'head-prepend',
        }],
      };
    },
  };
}

export default defineConfig({
  root: 'src/frontend',
  // Built pages load from file:// inside the app, so every URL is relative.
  base: './',
  plugins: [headScripts()],
  build: {
    outDir: '../../web-dist',
    emptyOutDir: true,
    // WKWebView (macOS 15+), WebView2, WebKitGTK 4.1 on Ubuntu 22.04. The
    // sources already ran as written on all three before there was a build,
    // so nothing needs lowering: these targets only stop Vite from
    // "polyfilling" what the webviews do natively (at safari16 it rewrote
    // every color-scheme into --lightningcss-* variables).
    target: ['es2022', 'safari18'],
    cssTarget: ['safari18'],
    // vendor/ (Mermaid, Temml, emoji tables) is copied as-is from public/
    // and loaded on demand; nothing big goes through the bundler.
    rolldownOptions: {
      input: Object.fromEntries(PAGES.map((p) =>
        [p, fileURLToPath(new URL(`./src/frontend/${p}.html`, import.meta.url))])),
    },
  },
});
