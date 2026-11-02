# Deploying

`npm run build` writes the finished journal to `dist/`. It's plain files: put them on any static host.

## Netlify, Cloudflare Pages, GitHub Pages

Set the build command to `npm run build` and the output folder to `dist`.

> [!NOTE]
> Lantern never adds analytics or third-party scripts. If you want visitor counts, add them yourself.
