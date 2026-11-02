import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Lantern',
  description: 'Photo journals from a folder of pictures and notes.',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Reference', link: '/reference/cli' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting started', link: '/guide/getting-started' },
          { text: 'Writing a trip', link: '/guide/writing-a-trip' },
          { text: 'Photos and maps', link: '/guide/photos' },
          { text: 'Themes', link: '/guide/themes' },
          { text: 'Plugins', link: '/guide/plugins' },
          { text: 'Deploying', link: '/guide/deploying' },
        ],
      },
      {
        text: 'Reference',
        items: [
          { text: 'Command line', link: '/reference/cli' },
          { text: 'lantern.config.js', link: '/reference/config' },
        ],
      },
    ],
  },
});
