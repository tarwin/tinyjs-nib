# Images

Nib copies pictures into place for you and writes the link. You decide where they land, what they're called, and whether they're shrunk on the way in.

## Adding a picture

- **Paste** one with <kbd>⌘</kbd><kbd>V</kbd>, in either pane.
- **Drop** a picture file on the document. It lands where you dropped it, as if you had pasted it there.
- **Format ▸ Insert Image…** (<kbd>⌘</kbd><kbd>⇧</kbd><kbd>I</kbd>) picks a file. This is the one way in that keeps the file's own name.
- Type `@` and pick a picture from the folder to link one that's already there. See [Links and pins](./links-and-pins#linking).

If a file name has spaces or brackets in it, Nib writes the path in angle brackets, `![](<Screen Shot 2026.png>)`, which is the spelling that works in Markdown.

## Image & Path Settings {#image-path-settings}

**Format ▸ Image & Path Settings…** opens the **Images & Paths** section of [Settings](./settings). It also shows itself once, the first time you paste into a folder. It shows the exact path the next paste will write.

<!-- shot: the Images & Paths settings section with a sample path showing -->

### Where it goes

**Put it**:

- **Beside the document**
- **In a folder next to it**, called `images` unless you change **Folder called**
- **In one folder at the project root**

### What it's called

**Name it after**:

- **Document + heading** (the default): the document's name plus the heading your caret is under. A screenshot pasted under "Installing on macOS" in `guide.md` becomes `guide-installing-on-macos-1.png`.
- **Document name**
- **Date and time**
- **A template of my own**

A template is built from variables. Each one is turned into a safe file-name piece, unknown ones are dropped, and doubled dashes collapse.

| Variable | Means |
|---|---|
| `{doc}` | The document's name |
| `{heading}` | The heading the caret is under |
| `{name}` | The file's own name, for drops and Insert Image |
| `{date}`, `{time}` | Now |
| `{dir}`, `{dir2}`… | Folder names, counted up from the document, stopping at the project root |
| `{path}` | The whole folder path from the root, with dashes |
| `{pin}` | The closest [pinned folder](./links-and-pins#pins) above the document |
| `{pintop}`, `{pin2}`… | The outermost pin, then pins counted down from the top |
| `{pinpath}` | The way from the pin to the document |

The default shape is `{doc}-{heading}`. With a template set, it names pictures from all three ways in, so use `{name}` if you want an inserted file to keep its name.

### On the way in

**Optimise**:

- **Keep the original** (the default)
- **Convert**: re-encode to WebP where the system can write it. On macOS it converts to JPEG, and the setting says so.
- **Re-encode, same format**

With either of the last two, **Widest side** caps the size (2000 pixels by default; 0 means don't scale) and **Quality** sets the compression (82 by default). SVG and animated GIF are never touched, and if a re-encode comes out bigger than the original, Nib keeps the original.

### What a leading "/" means {#roots}

A docs site with its sources in `src/` may write `[home](/index.md)` meaning `src/index.md`, and `![](/images/logo.png)` meaning `src/assets/images/logo.png`. **Images from** and **Links from** set those two roots, relative to the open folder. Left empty, they mean the folder itself. Nib uses them in the preview, when following links, and when updating links after a rename. It also tries the plain path, so setting a root never breaks a link that already worked.

These settings belong to the project when a folder is open. See [Settings](./settings#mine-and-project).

## Pictures in the preview

With **✎ Editable** on, click a picture for a small bar with **replace**, **alt text** and **remove**. The alt text field updates the caption as you type.

**Preview ▸ Image Captions** prints each picture's alt text underneath it. **Center Images** centres a picture standing alone in its paragraph. **Click Image to Zoom** opens a picture full size on a click.

## Optimizing pictures already in the folder

Right-click a picture in the file tree and choose **Optimize Picture…**, or right-click a folder for **Optimize N Pictures Here…**.

<!-- shot: the Optimize Picture bench with the split divider -->

The preview is the re-encoded picture, split against the original under a divider you can drag. Set the format, quality and maximum width, and the file size shows underneath. Once the first picture looks right, **This + the Rest** runs the same settings over the others without stopping. **Skip** passes one by. A re-encode that comes out bigger is skipped.

Files are replaced where they are. If you change the format, the file is renamed (`shot.png` becomes `shot.webp`) and Nib offers once, at the end, to update every link in the folder that pointed at the old names.

## Cleaning up

**Go ▸ Clean Up Unused Files…** lists the pictures, PDFs and other attachments that no document links to, and moves the ones you tick to the Trash. See [Folders as projects](./folders#cleaning-up).
