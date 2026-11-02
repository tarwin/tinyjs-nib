# Tables

## Writing a table

A table is rows of cells separated by pipes, with a row of dashes under the header:

```md
| Thing   | Where it lives | Shortcut |
| ------- | :------------: | -------: |
| Split   | both panes     |       ⌘2 |
| Outline | the sidebar    |      ⌘⇧O |
```

The dashes row sets each column's alignment: `:---` left, `:---:` centre, `---:` right.

## Adding one in the preview

With **✎ Editable** on, type `/` on an empty line and choose **Table**. You get a small two-by-two table with headers, ready to type into. **Insert ▸ Table** in the menu bar does the same from either pane.

A Markdown table pasted into either pane arrives as a real table, not a paragraph of pipes. See [Pasting](./editable-preview#pasting).

## Editing in the preview

<!-- shot: a table in the editable preview with the column grip menu open -->

Click into any cell and type.

- <kbd>⇥</kbd> moves to the next cell and <kbd>⇧</kbd><kbd>⇥</kbd> to the previous one.
- <kbd>⇥</kbd> in the last cell adds a new row.
- If the table is the first thing in the document, <kbd>↑</kbd> from its top row opens a new line above it. If it's the last, <kbd>↓</kbd> from its bottom row opens one below.
- A paste into a cell stays on one line.
- Typing `/` in an empty cell offers a picture, a link to a file or an emoji.

Hover over a table to see a grip above each column (**⋯**) and beside each row (**⋮**). Click one for a menu:

| Column grip | Row grip |
|---|---|
| Align left, center or right | Insert row above or below |
| Insert column left or right | Move row up or down |
| Move column left or right | Delete row |
| Delete column | Delete table |
| Delete table | |

The header row can't be moved or deleted from its grip.

When you edit a table in the preview, Nib writes it back with even pipes. If you keep a table hand-aligned, edit it in the source pane instead.

::: warning
The grips work on tables at the top level of the document. A table inside a callout or a list doesn't get them.
:::
