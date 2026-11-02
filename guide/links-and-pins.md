# Links and pins

Linking is most of the work in a folder of documentation, so Nib makes it quick to write a link and safe to follow one. Pins keep searches and links inside the part of the folder you're working on.

## Linking with @ {#linking}

Type `@` anywhere in a document, in either pane, and a file picker comes up at the caret. Pick a file and Nib writes a link to it. Pick a picture and it inserts the picture.

![The @ picker: typing finds files and headings](/shots/link-picker.webp)

- The link text is the file's real name: its front matter `title:` if it has one, otherwise its first highest-level heading, otherwise its file name.
- Press <kbd>⇥</kbd> on a file to step into its headings and link a section, such as `[Second steps](notes/a.md#second-steps)`. <kbd>esc</kbd> steps back out.
- Headings match your typing too: `@instal` finds the *Installing* section wherever it is.
- <kbd>esc</kbd> closes the picker and keeps the `@` as typed.

**Go ▸ Link to a File…** (<kbd>⌘</kbd><kbd>U</kbd>) opens the same picker without typing `@`. Right-click a file in the tree and choose **Insert Link Here** to link it from the document you're in.

### Link Options

**Format ▸ Link Options** decides how those links are written.

**Heading Links Carry Their Path** labels a section link with the trail of headings above it, such as `Setup › Alerts › SMS`. The items below it pick the separator: `›`, `>`, `/`, `—` or `:`.

The path can be written three ways:

- **Paths Relative to the Document** (the default): `../../sms/index.md`
- **Paths from the Folder Root (/…)**: `/docs/sms/index.md`, from the root set in [Image & Path Settings](./images#roots)
- **Paths from the Pinned Folder (/…)**: `/sms/index.md`, from the closest [pinned folder](#pins) above the document

If the document or the file it links to is outside the root or pin, Nib writes a relative path instead, so it never writes a link that can't work.

## Links to the web

Select some text, then paste a URL over it. The text becomes the link's label: `[the docs](https://…)`. See [Pasting](./editable-preview#pasting) for when this happens.

## Following links

- In the preview, with Editable off, click a link.
- In the source, or in the preview with Editable on, <kbd>⌥</kbd>-click. Holding <kbd>⌥</kbd> marks the links in both panes.

Where it goes:

- A Markdown file or picture opens as a tab.
- `#heading` scrolls to that heading. `file.md#heading` opens the file and scrolls to it.
- `https:` links open in your browser.
- A link to a folder, such as `[specs](/specs/)`, opens its `index.md` or README, the way a docs site would.
- A link without an extension, such as `/guide/setup`, finds `guide/setup.md`.
- A PDF, or a folder with no front page, opens in whatever your system uses for it.
- A link that points at nothing says so.

When you rename a file in the tree, Nib offers to update the links to it. See [Renaming and moving](./folders#renaming-and-moving).

## Pins {#pins}

Pin a folder and every file search (<kbd>⌘</kbd><kbd>P</kbd>, the `@` picker and Find in Folder) looks only inside it. This keeps a big tree manageable, and it's how Nib handles translated docs: pin `en/` and `fr/`, and each language only finds its own pages.

![Two pinned folders: guide/ for documents, public/ for pictures](/shots/pins.webp)

To pin a folder, right-click it in the tree and choose to pin it for search. A 📌 badge appears on its row. Click the badge to narrow what the pin covers: everything, then Markdown only, then pictures only. One more click unpins it.

Markdown and pictures are scoped separately. Pin `notes/` for Markdown and `assets/` for pictures, and `@` offers documents from `notes/` and pictures from `assets/`.

With several pins:

- the closest pin above the document you're in decides its scope
- a document under no pin searches all the pinned folders of the right kind together
- the pickers and results always name the scope they searched, so a short list tells you why it's short

The 📌 at the top of the tree turns all the pins off and on as a set. They keep their places while off. Pinning anything new turns them back on.

Pins also anchor links. A `/…` link in a document under a pin is looked up from the pin first, then from the folder's link root, then as a plain path, so pin-relative links open, preview and update on rename.

Pins are saved in the folder's `.nib/settings.json`, so they travel with it. With **Save Settings in Folder** off they stay on this machine. The on/off switch at the top of the tree is always yours alone. See [Settings](./settings#mine-and-project).
