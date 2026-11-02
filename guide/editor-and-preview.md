# Editor and preview

A document window has the Markdown source on the left and the rendered page on the right. The source is the document; the preview shows what it becomes.

<!-- shot: a document window in Split view, outline open on the right -->

## Three views

| View | Key | Shows |
|---|---|---|
| Editor Only | <kbd>⌘</kbd><kbd>1</kbd> | The Markdown source |
| Split | <kbd>⌘</kbd><kbd>2</kbd> | Source and preview side by side |
| Preview Only | <kbd>⌘</kbd><kbd>3</kbd> | The rendered page |

They're in the **View** menu and on the switcher in the toolbar. Drag the divider between the panes to resize them. **Settings ▸ General ▸ Opens in** picks the view a newly opened document starts in.

## The two panes follow each other

Wherever the cursor is in one pane, the other shows the same place.

- Select text in the source and exactly that text highlights in the preview, without its Markdown markers. Select **\*\*a phrase\*\*** and only *a phrase* lights up.
- Select text in the preview and the matching Markdown highlights in the source.
- A caret in one pane shows as a thin blinking bar in the other.
- Scrolling one pane scrolls the other to the same block, so a tall code block can't make them drift apart.
- If the cursor is inside a hidden tab panel or a folded `::: details` block, the preview opens it to show you.

To type into the preview itself, see [The editable preview](./editable-preview).

## The source pane

The source is syntax-coloured as you type. Some editing help works here too:

- <kbd>⌘</kbd><kbd>B</kbd>, <kbd>⌘</kbd><kbd>I</kbd> and <kbd>⌘</kbd><kbd>E</kbd> wrap the selection in bold, italic or code. **Format ▸ Strikethrough** (<kbd>⌘</kbd><kbd>⇧</kbd><kbd>X</kbd>) and **Highlight** (<kbd>⌘</kbd><kbd>⇧</kbd><kbd>M</kbd>) work the same way.
- <kbd>⌘</kbd><kbd>K</kbd> inserts a link.
- <kbd>⇥</kbd> and <kbd>⇧</kbd><kbd>⇥</kbd> indent and outdent every selected line.
- **Insert** in the menu bar adds a block (a table, a callout, a code block) on the caret's line.

## The outline

**View ▸ Outline** (<kbd>⌘</kbd><kbd>⇧</kbd><kbd>O</kbd>) slides in a list of the document's headings. Click one to jump there: the preview scrolls and the editor's caret moves with it. Drag a heading to another place in the list and its whole section moves with it.

Drag the outline's inner edge to make it wider or narrower. Double-click the edge to reset it.

## Undo

<kbd>⌘</kbd><kbd>Z</kbd> and <kbd>⌘</kbd><kbd>⇧</kbd><kbd>Z</kbd> undo and redo. Each tab keeps its own history, covering edits in both panes. A **Replace All**, a ticked checkbox, or the link updates after a rename are each one step.

## How the preview looks

The **Preview** menu decides how the page reads. These settings apply to every open document and follow the document into [print, PDF and exported HTML](./exporting).

| Item | What it does |
|---|---|
| **Theme** | Paper, Ink, Typewriter or Night: fonts, colours and the code palette |
| **Page Width** | How long a line gets: Narrow, Normal, Wide, Full Width, A4 or US Letter. **Apply to Editor** narrows the source pane too |
| **Page View** | Shows the document as sheets of paper on a desk, with each page break starting a new sheet |
| **Image Captions** | Prints each picture's alt text underneath it |
| **Center Images** | Centres a picture that stands alone in its paragraph |
| **Click Image to Zoom** | A click opens the picture full size; <kbd>esc</kbd> closes it |
| **Link Tabs** | Tab groups with the same tab title switch together: pick "macOS" once and every group shows its macOS tab |
| **"---" as Page Break** | Every `---` rule becomes a page break. `***` and `___` stay rules |

**Preview ▸ Markdown Flavor** decides which extras render. See [Markdown in Nib](./markdown).

## How the app looks

The app's own look is separate from the preview theme.

- **View ▸ Appearance**: Light, Dark or Match System.
- **View ▸ High Contrast**.
- **Find ▸ Find Highlight** picks the colour of search matches.
- <kbd>⌘</kbd><kbd>+</kbd> and <kbd>⌘</kbd><kbd>−</kbd> make the whole interface bigger or smaller, in every window at once. <kbd>⌥</kbd><kbd>⌘</kbd><kbd>0</kbd> goes back to normal. Nib remembers the size between launches.

## The toolbar

Along the top of a document window, from left to right:

- the Files panel button (<kbd>⌘</kbd><kbd>⇧</kbd><kbd>B</kbd>)
- the view switcher, with the **✎** Editable pencil at its end
- the **⚡** [Actions](./actions) menu, when you have actions, and any actions pinned beside it
- the **🎙** [dictation](./dictation) button, when it's turned on
- the emoji picker (<kbd>⌘</kbd><kbd>⇧</kbd><kbd>J</kbd>)
- the preview theme picker
- at the far right, the Outline button
