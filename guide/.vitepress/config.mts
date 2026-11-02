// The Nib user guide. Built and published to the microsite at
// apps.tarwin.art/nib/docs/ by scripts/publish-docs.sh; preview with
// `pnpm docs:dev`.
import { defineConfig } from 'vitepress';
import markdownExtras from './markdown';

export default defineConfig({
  title: 'Nib Guide',
  description: 'How to use Nib, a tiny Markdown editor: one native window per document, an editable preview, and folders as projects.',
  base: '/nib/docs/',
  lang: 'en',
  cleanUrls: true,
  // ::: tabs / pagelink / download / carousel / embed, image captions + zoom
  markdown: { config: markdownExtras },
  lastUpdated: false,
  head: [
    ['link', { rel: 'icon', href: '/nib/docs/icon.png', type: 'image/png' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&family=JetBrains+Mono:wght@400;600&display=swap',
      },
    ],
  ],
  themeConfig: {
    logo: '/icon.png',
    siteTitle: 'Nib',
    nav: [
      { text: 'Guide', link: '/getting-started' },
      { text: 'Download', link: 'https://apps.tarwin.art/nib/' },
    ],
    sidebar: [
      {
        text: 'Start here',
        items: [
          { text: 'Getting started', link: '/getting-started' },
          { text: 'Opening files', link: '/opening-files' },
        ],
      },
      {
        text: 'Writing',
        items: [
          { text: 'Editor and preview', link: '/editor-and-preview' },
          { text: 'The editable preview', link: '/editable-preview' },
          { text: 'Markdown in Nib', link: '/markdown' },
          { text: 'Images', link: '/images' },
          { text: 'Tables', link: '/tables' },
        ],
      },
      {
        text: 'Folders',
        items: [
          { text: 'Folders as projects', link: '/folders' },
          { text: 'Links and pins', link: '/links-and-pins' },
          { text: 'Find and search', link: '/find' },
          { text: 'Docs-site menus', link: '/site-menus' },
        ],
      },
      {
        text: 'More',
        items: [
          { text: 'Printing and exporting', link: '/exporting' },
          { text: 'Actions', link: '/actions' },
          { text: 'AI', link: '/ai' },
          { text: 'Dictation', link: '/dictation' },
          { text: 'The nib command', link: '/command-line' },
        ],
      },
      {
        text: 'Reference',
        items: [
          { text: 'Settings', link: '/settings' },
          { text: 'Keyboard shortcuts', link: '/shortcuts' },
        ],
      },
    ],
    search: { provider: 'local' },
    socialLinks: [{ icon: 'github', link: 'https://github.com/tarwin/tinyjs-nib' }],
    outline: { level: [2, 3], label: 'On this page' },
    docFooter: { prev: 'Previous', next: 'Next' },
    footer: { message: 'Nib is free, by Tarwin Stroh-Spijer. Built on tinyjs.' },
  },
});
