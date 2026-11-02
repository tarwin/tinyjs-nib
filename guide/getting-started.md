# Getting started

Nib is a small Markdown editor. Every document opens in a window, with the Markdown on one side and the rendered page on the other. It's built for folders of documentation, the kind behind a VitePress, Docusaurus or MkDocs site, and it works as well on one loose file.

## Install

::: download [Download Nib](https://apps.tarwin.art/nib/)
macOS (Apple Silicon and Intel), Windows and Linux (x86_64 and arm64). Free.
:::

Nib checks for updates once a day and tells you when one is ready. **Help ▸ Check for Updates…** checks now.

## The Welcome window

<!-- shot: the Welcome window with a few recent files and folders -->

When Nib starts you see the Welcome window. It has buttons for **New Document**, **Open…**, **Open Folder…** and **Example**, and lists the files and folders you opened recently. Drop a `.md` file anywhere on it to open it.

The Welcome window steps aside while you have a document open and comes back when the last one closes. Bring it back any time with <kbd>⌘</kbd><kbd>0</kbd> (**Window ▸ Welcome to Nib**).

If an untitled document was closed with unsaved changes, the Welcome window shows an **Unsaved draft** card. Click **Restore** to get it back.

## Try the example document

**Help ▸ Open Example Document** (or **Example** on the Welcome window) opens a document that shows everything Nib renders: headings, lists, tables, callouts, tabs, math, diagrams and more. It's your own copy, so edit it freely. Opening it again from the Help menu always gives you a fresh one.

A good first thing to try there: press <kbd>⌘</kbd><kbd>2</kbd> for the split view, turn on **✎ Editable** (<kbd>⌘</kbd><kbd>⇧</kbd><kbd>L</kbd>), and type into the right-hand side. The Markdown on the left rewrites itself as you go.

## Write something

- **File ▸ New** (<kbd>⌘</kbd><kbd>N</kbd>) starts an untitled document.
- **File ▸ Open…** (<kbd>⌘</kbd><kbd>O</kbd>) opens a file. There are more ways in [Opening files](./opening-files).
- **File ▸ Save** (<kbd>⌘</kbd><kbd>S</kbd>) and **Save As…** (<kbd>⌘</kbd><kbd>⇧</kbd><kbd>S</kbd>) write it to disk.

Closing a window with <kbd>⌘</kbd><kbd>W</kbd> asks whether to save. If a window is closed some other way with unsaved changes, Nib keeps a draft: open the file again and your changes are restored.

## Work on a folder

**File ▸ Open Folder…** (<kbd>⌥</kbd><kbd>⌘</kbd><kbd>O</kbd>) turns a folder into a project. Its files appear in a tree down the left of the window, and each one you open becomes a tab. See [Folders as projects](./folders).

## Windows and Linux

This guide shows macOS keys. On Windows and Linux, use <kbd>Ctrl</kbd> where it says <kbd>⌘</kbd> and <kbd>Alt</kbd> where it says <kbd>⌥</kbd>.

The menus are the same on all three systems, with two differences:

- On macOS there is one menu bar at the top of the screen. On Windows and Linux each document window has its own menu bar. The Welcome window has none; its buttons cover what you need there, and the keyboard shortcuts still work.
- **Settings…** is in the **Nib** menu on macOS and in the **File** menu on Windows and Linux.

On any system, the **Command Palette** (<kbd>⌘</kbd><kbd>⇧</kbd><kbd>P</kbd>) runs any menu item by name. See [Keyboard shortcuts](./shortcuts).

## Then

::: pagelink [Editor and preview](./editor-and-preview)
The two panes, the outline, and how they keep track of each other.
:::

::: pagelink [Folders as projects](./folders)
The file tree, tabs, Open Quickly and Find in Folder.
:::

::: pagelink [Markdown in Nib](./markdown)
What Nib renders, and the switches that decide it.
:::
