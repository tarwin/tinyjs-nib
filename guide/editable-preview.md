# The editable preview

Turn on **✎ Editable** and the rendered page takes a caret. Type into it, select text to format it, tick checkboxes, paste pictures. Every time you pause, Nib writes the page back out as Markdown into the source. The Markdown file is still the document; the preview is a second way in, for anyone who would rather fix a sentence than think about asterisks.

![The editable preview with the format bubble over a selection](/shots/editable-preview.webp)

## Turning it on

Click the pencil at the end of the view switcher, choose **View ▸ Edit in Preview**, or press <kbd>⌘</kbd><kbd>⇧</kbd><kbd>L</kbd>. It works in Split and Preview Only, not Editor Only.

In Split view you can work from either side of the divider and watch the other side keep up.

Editable isn't available for AsciiDoc or JSON files.

## Markdown still works as you type

These turn into the real thing the moment you finish them:

| Type | You get |
|---|---|
| `## ` | A heading, one `#` per level |
| `- ` | A bullet list. Then `[ ] ` makes it a task |
| `1. ` | A numbered list |
| `> ` | A blockquote |
| `---` then <kbd>⏎</kbd> | A horizontal rule |
| `` `code` `` | A code span |
| `**bold**`, `*italic*`, `~~struck~~` | Bold, italic, strikethrough |
| `==text==` | Highlighted text |
| `[label](url)` | A link |

<kbd>⌘</kbd><kbd>B</kbd>, <kbd>⌘</kbd><kbd>I</kbd> and the other **Format** menu items work here as they do in the source.

## The format bubble

Select anything and a small bubble appears above it: bold, italic, strikethrough, code and link. Its **⋯** holds the rest: highlight, inline math, clear formatting, and **Turn into** a heading, quote or list.

If you have [actions](./actions) set to appear on a selection, a **⚡** at the end of the bubble lists them.

## The / menu {#slash-menu}

Type <kbd>/</kbd> on an empty line for a menu of everything you can insert:

- headings, quotes, bulleted, numbered and task lists
- a table, a code block, a divider, a page break, a collapsible details block, tabs
- callouts and GitHub alerts
- the extras your [Markdown flavor](./markdown#markdown-flavor) has turned on: table of contents, math, a Mermaid diagram, download and page link cards, an embed
- a picture, a link to a file in the folder, or an emoji

Type to narrow the list and press <kbd>⏎</kbd> to insert. The new block's sample words come up selected so you can type straight over them. <kbd>esc</kbd> closes the menu and keeps the `/`.

In an empty table cell, `/` offers only what fits in a cell: a picture, a file link or an emoji.

The same list is the **Insert** menu in the menu bar, which works in either pane.

## Moving blocks

<kbd>⌘</kbd><kbd>⇧</kbd><kbd>↑</kbd> and <kbd>⌘</kbd><kbd>⇧</kbd><kbd>↓</kbd> move the block the caret is in past its neighbour. To move a whole section, drag its heading in the outline.

At the very top or bottom of the document, pressing <kbd>↑</kbd> out of a first code block or table, or <kbd>↓</kbd> out of a last one, opens a new line there.

## Pictures, formulas and diagrams

Click a picture to get a small bar with **replace**, **alt text** and **remove**. The alt text field is live: type in it and the caption changes as you go. See [Images](./images).

Math, Mermaid diagrams, tables of contents and blocks of HTML are locked: you can't type inside them in the preview. Hover one to see what it is; click it to select its lines in the source pane (Nib opens Split view if the source is hidden). Edit those in the source.

## Pasting

Pasting arrives as Markdown, in either pane:

- A Markdown table or fenced code block becomes a real table or code block.
- Markdown copied out of a code editor such as VS Code comes in without the editor's colours.
- Text copied from a web page, Google Docs, Notion or Mail keeps its bold, links, headings and lists, as Markdown.
- From Word, Excel or Numbers, the text wins, so a copied table doesn't arrive as a picture.
- Inside a code block a paste stays literal. Inside a table cell it stays on one line.

<kbd>⌥</kbd><kbd>⇧</kbd><kbd>⌘</kbd><kbd>V</kbd> always pastes plain text.

**Paste a URL over selected text** and the text becomes the link's label: select *the docs*, paste `https://…`, and you get `[the docs](https://…)`. This only happens when the clipboard holds a single URL starting with a scheme like `https:` and the selection looks like a label. Pasting onto a URL, or onto the address inside an existing link, replaces it as usual.

## What to expect in the source

The source is rewritten only for the blocks you edited. Every other block keeps its exact bytes, so a hard-wrapped paragraph stays wrapped and one word typed in the preview is a one-block change. A document you never edit in the preview is never rewritten.

Blocks you do edit come back in Nib's own style:

- bullets as `-`, bold as `**…**`, italic as `*…*`
- tables with even pipes, whatever you originally typed

::: tip
Anything the preview can't show can't survive the trip back. Keep unusual source, such as hand-aligned tables, for the editor pane.
:::
