# Find and search

## Find in the document

**Find ▸ Find…** (<kbd>⌘</kbd><kbd>F</kbd>) opens a bar over the document. It isn't a dialog, so the text stays where it is while you search.

<!-- shot: the find bar with Replace unfolded and a match count -->

- Every match is highlighted at once, with the current one picked out. The count beside the field says where you are.
- <kbd>⏎</kbd> and <kbd>⇧</kbd><kbd>⏎</kbd> step forward and back through the matches. <kbd>⌘</kbd><kbd>G</kbd> and <kbd>⇧</kbd><kbd>⌘</kbd><kbd>G</kbd> do the same from anywhere.
- <kbd>esc</kbd> closes the bar.

The three buttons beside the field:

| Button | Does |
|---|---|
| **Aa** | Match case |
| **\|ab\|** | Whole words only |
| **.\*** | Regular expression: groups, anchors and `\b` all work. `^` and `$` match at the start and end of a line. A pattern that doesn't make sense says so instead of finding nothing |

**Find ▸ Find Highlight** picks the colour of the matches: Default, Marker Yellow, Green, Pink or Orange.

## Replace

**Find ▸ Replace…** (<kbd>⌥</kbd><kbd>⌘</kbd><kbd>F</kbd>), or the **›** button on the find bar, unfolds a replace field underneath.

- <kbd>⏎</kbd> or **Replace** replaces the match you're on.
- <kbd>⌘</kbd><kbd>⏎</kbd> or **All** replaces every match.
- With **.\*** on, the replacement can use `$1`, `$2` and so on for the groups in the pattern.

Both go into the document's undo history, so <kbd>⌘</kbd><kbd>Z</kbd> takes back a whole Replace All in one step.

## Find in Folder

**Find ▸ Find in Folder…** (<kbd>⌘</kbd><kbd>⇧</kbd><kbd>F</kbd>), or **In Folder** on the find bar, runs the same search over every text file in the project. It needs a [folder](./folders) open.

<!-- shot: the Find in Folder results panel grouped by file -->

The file tree's panel turns into the results, grouped by file, with a line number and the matching line for each hit. Click a hit to preview it, or double-click to keep the tab. Either way the editor lands on the match. The **✕** at the top goes back to the file tree.

**Match Case**, **Whole Word** and **Regular Expression** work the same as in the find bar.

If any folders are [pinned](./links-and-pins#pins), Find in Folder searches the pinned scope, and the results panel says which.

### Replace across the folder

**Replace All** in the results panel writes the change to the files on disk, after asking you first.

::: warning
A file with unsaved changes is skipped, and Nib names it, so a replace never overwrites work you haven't saved. A file you have open and saved updates on screen.
:::

There's no index to build or keep up to date. Nib reads the files when you search.
