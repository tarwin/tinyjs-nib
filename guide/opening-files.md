# Opening files

Every way of opening a file ends up in the same place: a Nib window with the document in it.

## Ways in

- **File ▸ Open…** (<kbd>⌘</kbd><kbd>O</kbd>).
- Drop files on any Nib window, including the Welcome window.
- Double-click a Markdown file in Finder or your file manager, or use **Open With ▸ Nib**.
- Drop files on Nib's Dock icon.
- Type `nib notes.md` in a terminal. See [The nib command](./command-line).
- **File ▸ Open Recent** lists the folders and files you opened lately. **Clear Menu** at the bottom empties it. The same lists are on the Welcome window.

A folder dropped on the Dock icon, opened with **Open With ▸ Nib**, or passed as `nib .` opens as a project. See [Folders as projects](./folders).

## What Nib opens

| Kind | Extensions | How it opens |
|---|---|---|
| Markdown | `.md`, `.markdown`, `.mdown`, `.mkdn`, `.mkd`, `.mdwn`, `.mdtxt`, `.mdtext` | Editor and preview |
| Markdown with extras | `.mdx`, `.qmd`, `.Rmd`, `.mdc`, `.markdoc`, `.mdoc` | Editor and preview; the extra syntax shows as text |
| AsciiDoc | `.adoc`, `.asciidoc` | Editor and a read-only preview |
| JSON | `.json` | Editor only |
| Pictures | `.png`, `.jpg`, `.gif`, `.webp`, `.svg` and others | A picture viewer |

**AsciiDoc** gets a preview of its everyday constructs, but **Editable** stays off for it: writing the preview back would put Markdown into an AsciiDoc file.

**JSON** files open in the editor alone, because their preview would only be the same text again. The view buttons grey out while a JSON tab is showing, and your usual view comes back with the next Markdown tab. The editor colours keys, strings, numbers and comments, and puts a red wavy line under anything that isn't valid. **Format ▸ Format JSON** lays the file out neatly. Comments and blank lines survive it.

**Pictures** open in a tab of their own when you click them in the file tree, with a button to switch between **Actual Size** and **Fit to Window**, and the picture's dimensions and file size underneath.

## Making Nib the default for .md files

Double-clicking a `.md` file opens Nib once Nib is in the system's **Open With** list, but that doesn't make it the default. **File ▸ Open .md Files with Nib…** does what each system allows. On Linux it makes Nib the default. On macOS and Windows the switch is yours to throw in the system's own settings, and Nib tells you where it is.

## Windows and tabs

A document opened on its own gets its own window. Inside a project, opening a file puts it in a tab in the current window. **File ▸ New Window** (<kbd>⌘</kbd><kbd>⇧</kbd><kbd>N</kbd>) gives you a fresh window with no folder. **File ▸ New Window (Same Folder)** gives you one with the same project. New windows open at the size you last left one.

## Saving and closing

- <kbd>⌘</kbd><kbd>S</kbd> saves. <kbd>⌘</kbd><kbd>⇧</kbd><kbd>S</kbd> is **Save As…**.
- <kbd>⌘</kbd><kbd>W</kbd> closes the tab. If it has unsaved changes you're asked: **Save**, **Don't Save** or **Cancel**. Closing the last tab closes the window.
- <kbd>⌘</kbd><kbd>⇧</kbd><kbd>W</kbd> closes the whole window.
- <kbd>⌘</kbd><kbd>⇧</kbd><kbd>T</kbd> reopens the tab you closed last.

Every edit is kept as you type. If a window closes with unsaved changes some other way, Nib keeps a draft. Open the file again and your changes come back, with a banner saying so. An untitled document closed this way comes back from the **Unsaved draft** card on the Welcome window.
