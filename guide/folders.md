# Folders as projects

Open a folder and Nib treats it as a project: its files get a tree down the left of the window, every file you open becomes a tab, and searches cover the whole folder.

![A folder open: the file tree, tabs, and a document in Split view](/shots/folders.webp)

## Opening a folder

- **File ▸ Open Folder…** (<kbd>⌥</kbd><kbd>⌘</kbd><kbd>O</kbd>).
- With no folder open, the Files panel (<kbd>⌘</kbd><kbd>⇧</kbd><kbd>B</kbd>) is where you choose one.
- Drop a folder on Nib's Dock icon, or use **Open With ▸ Nib** on it.
- Type `nib .` in a terminal. See [The nib command](./command-line).
- Folders you've opened are listed under **File ▸ Open Recent** and on the Welcome window.

One folder is open at a time. **File ▸ Close Folder** closes it.

A folder belongs to the window that opened it. A window opened for a single file, or a new window from <kbd>⌘</kbd><kbd>⇧</kbd><kbd>N</kbd>, says *No folder is open*. **File ▸ New Window (Same Folder)** opens a window that has the folder too. <kbd>⌘</kbd><kbd>N</kbd> inside a project window adds a new tab to the project.

## The file tree

**View ▸ Files** (<kbd>⌘</kbd><kbd>⇧</kbd><kbd>B</kbd>) shows or hides it. Drag its inner edge to resize it; double-click the edge to reset.

| Do this | To |
|---|---|
| Click | Preview the file in a tab. The next file you click replaces it |
| Double-click, or <kbd>⌘</kbd><kbd>⏎</kbd> | Keep the tab. Editing the file keeps it too |
| <kbd>↑</kbd> <kbd>↓</kbd> | Move through the tree, showing each file as you go |
| <kbd>←</kbd> <kbd>→</kbd> | Close and open folders |
| <kbd>⏎</kbd> | Rename in place, with the extension left out of the selection |
| <kbd>esc</kbd> | Hand the keyboard back to the editor |
| Right-click | Rename, Reveal in Finder, copy the path or relative path, pin for search, **Insert Link Here**, and more |

A preview tab's name is in italics. Previewing means reading through a folder leaves one tab behind, not thirty.

The tree watches the folder. A file saved by another app, renamed in Finder or changed by `git checkout` shows up on its own. **Go ▸ Refresh File Tree** (<kbd>⌘</kbd><kbd>⇧</kbd><kbd>R</kbd>) is there for the rare change it misses. Whichever file you're looking at, the tree opens the folders above it and scrolls it into view.

### What the tree shows

Markdown, text and pictures open in a tab. Other files appear only with **View ▸ Show All Files in Folder** on (also the 👁 at the top of the tree), so you can link to them.

Hidden files stay out unless **View ▸ Show Hidden Files** is on. `.gitbook`, `.github` and `.vitepress` always show, since they hold pages people edit. `.git`, `node_modules` and build output never show.

Nib's own `.nib` folder shows with a ⚙ instead of a folder icon. It holds the [folder's settings](./settings#mine-and-project) and [actions](./actions).

## Tabs

A tab strip appears along the top once a window holds two documents. A dot marks unsaved work. Drag tabs to reorder them.

- <kbd>⌘</kbd><kbd>W</kbd> closes the tab. The last one closes the window.
- <kbd>⌘</kbd><kbd>⇧</kbd><kbd>T</kbd> reopens the last tab you closed, in the window it left.
- **Window ▸ Next Tab** and **Previous Tab** step through them.
- <kbd>⌘</kbd><kbd>⇧</kbd><kbd>N</kbd> opens a separate window, for two documents side by side.

## Open Quickly and the Command Palette

**Go ▸ Open Quickly…** (<kbd>⌘</kbd><kbd>P</kbd>) finds any file in the project by typing part of its path. Folder names narrow the list as well as file names, and a space starts another search term: `deep note` finds `docs/deep/nested-note.md`. Headings match too, marked `##`; picking one opens the file at that heading.

Type `>` in the box to switch from files to commands. **Go ▸ Command Palette…** (<kbd>⌘</kbd><kbd>⇧</kbd><kbd>P</kbd>) opens it that way straight off. Every menu item and every [action](./actions) is there, with its shortcut beside it and a ✓ on settings that are on.

## Renaming and moving

Rename a file with <kbd>⏎</kbd> in the tree, **Go ▸ Rename File…**, or a right-click. The open tab, its unsaved draft and its place in your recent files move with it.

Then Nib asks whether to update the links that pointed at the old name, listing the documents they're in first. Say yes and they're re-aimed:

- links to pictures as well as documents
- `#section` parts of links are kept
- renaming a folder updates links to everything inside it
- links are matched by where they point, not how they're written, so `../notes/todo.md` is found and an unrelated `todo.md` elsewhere is left alone
- a document you have open with unsaved changes is updated in its tab, not written over on disk

## Removing files

Right-click a file or folder and choose **Remove…** to move it to the Trash. Nib won't remove a file that has unsaved changes in a tab.

If that broke links, the sidebar switches to **Links You Broke**: every link elsewhere that pointed at what went, grouped by file. Click one to go to it. The list checks itself again as you type and save, and a row leaves once its link is fixed. If the removed documents were the only ones linking to some pictures or attachments, Nib offers to move those to the Trash too.

**Go ▸ Find Broken Links** opens the same panel for every link in the folder.

## Cleaning up

**Go ▸ Clean Up Unused Files…** (or right-click a folder ▸ **Clean Up Unused Files Here…**) lists the pictures, PDFs, media and other attachments that no document links to. Tick the ones to move to the Trash.

Links are read from every document, saved or not. A file that isn't linked but whose name turns up somewhere else (a site config, a stylesheet, front matter), or that lives in `public/`, or is a favicon, is listed separately and left unticked.

## Next

::: pagelink [Links and pins](./links-and-pins)
Link with @, follow links, and scope searches to part of the folder.
:::

::: pagelink [Find and search](./find)
Find and replace in one document or across the folder.
:::
