# Docs-site menus

A docs site has a menu, the sidebar readers click through, and it's usually written somewhere other than the pages. When the open folder is a docs site, Nib reads that menu and shows it the way the site will draw it. For most site generators you can also edit it there.

<!-- shot: the ☰ Menu panel with the current page marked, a red dead entry and the "Not in any menu" list -->

## Opening the menu

When Nib recognizes a site, a **☰ Menu** tab appears over the sidebar, beside **📁 Project**. **Go ▸ Show Site Menu** switches to it.

Nib reads menus from VitePress, Docusaurus, Starlight, MkDocs, Mintlify, GitBook, mdBook, Docsify, GitHub wikis, Antora, Writerside, Quarto, Jupyter Book, Sphinx, Fumadocs, Nextra, Rspress, Hugo, Just the Docs and Retype.

One folder can hold several sites, and a site can have several menus, such as one per language. The picker at the top of the panel switches between them, and follows you to whichever menu has the page you open.

## Reading it

- **The page you're on** is marked, its groups are opened, and the trail is spelled out at the top: *This page: SMS › Integration*.
- **Entries that point at nothing** are red where they sit. A red **✗** count in the header jumps to them.
- **Not in any menu**, under the tree, lists the pages in the site's content folder that no menu reaches. Pages the site hides on purpose, and the home page, aren't listed.
- **ⓘ** unfolds the details: which file the menu is written in (click it to open it), and what Nib couldn't read.

Anything the site builds by running code shows as a grey *Built by code* row, and the panel says the menu is only partly read. Nib never runs your site's code to read the menu.

## Moving around

It handles like the [file tree](./folders#the-file-tree):

| Do this | To |
|---|---|
| Click | Preview the page |
| Double-click | Keep the page's tab. On a group that is also a page, this opens the group too |
| <kbd>↑</kbd> <kbd>↓</kbd> | Move through the menu, previewing as you go |
| <kbd>←</kbd> <kbd>→</kbd> | Fold and unfold groups |
| <kbd>⏎</kbd> | Rename the entry in place |
| <kbd>⌘</kbd><kbd>⏎</kbd> | Keep the entry's page |

## Editing it

| Do this | To |
|---|---|
| Drag a row | Move it. Drop on the top of a row to go before it, the bottom to go after, the middle to go inside a group |
| <kbd>⌘</kbd><kbd>↑</kbd> <kbd>⌘</kbd><kbd>↓</kbd> | Move the entry up or down among its neighbours |
| Drag a page up from *Not in any menu* | Add it to the menu |
| <kbd>⌘</kbd><kbd>⌫</kbd>, or right-click ▸ **Remove from Menu** | Take it out of the menu. The page itself stays |
| Right-click ▸ **Add This Page** | Add the page you're on beside that entry |
| <kbd>⌘</kbd><kbd>Z</kbd> <kbd>⌘</kbd><kbd>⇧</kbd><kbd>Z</kbd> | Undo and redo menu edits, while the menu has the keyboard |

Each edit goes straight into the menu's own file, and only the entry's own lines change. Comments and code around it are left alone. If that file is open in a tab, the edit goes into the tab: saved through if the tab had no unsaved changes, left unsaved if it did.

While the menu has the keyboard, **Edit ▸ Undo** names the edit, such as *Undo Move "Intro"*. One undo takes back an edit even when it touched several files.

### Menus written in a file

`SUMMARY.md`, `_sidebar.md`, `mkdocs.yml`, `docs.json`, a VitePress, Docusaurus or Starlight config, `_quarto.yml`, `_toc.yml` and `myst.yml`, and Jekyll's `_data/navigation.yml` are edited where the entry is written. A page you add is linked the way that menu writes its other links.

### Menus built from the folders

Some sites build the menu from the folders and keep the order in each page's front matter (`sidebar_position`, `sidebar.order`, `weight`, `nav_order`, `order`) or in a file in each folder (Fumadocs' `meta.json`, Nextra's `_meta`, Rspress' `_meta.json`). Nib edits those:

- Moving a page changes as few numbers as it can.
- Renaming sets the page's sidebar label.
- **Hide from Menu** uses the site's own switch for hiding a page, and says so where the site has none.

In these menus a page moves only among its own folder's entries. Its folder is its place, so moving it somewhere else means moving the file in the tree. Just the Docs is the exception: there, dropping a page onto another changes its parent.

### A VitePress sidebar built from pieces

A VitePress sidebar put together from several parts, such as pieces imported from other files, is shown whole but can't be edited in place. **ⓘ ▸ Move it to a JSON file…** writes the sidebar to `.vitepress/sidebar.json` and changes the config to import it. From then on the menu edits like any other, and <kbd>⌘</kbd><kbd>Z</kbd> puts the config back. Nib refuses if any part of the sidebar is built by code it can't read, so nothing is lost on the way.

## Shown, but not editable yet

Antora's `nav.adoc`, Writerside's `.tree`, Sphinx toctrees, MkDocs menus built from the folders, and VitePress sidebars made by a plugin can be read but not edited. A read-only menu's file is a right-click away (**Show in …**).
