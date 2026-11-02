# Printing and exporting

Everything in the **Preview** menu follows the document out of Nib: the theme, the page width, image captions, centred images and click-to-zoom. What you see in the preview is what gets printed or written out.

## Export as HTML

**File ▸ Export as HTML…** (<kbd>⌘</kbd><kbd>⇧</kbd><kbd>E</kbd>) writes the rendered document as a single standalone HTML file, styled in the current preview theme.

- Tabs still switch in the exported file. They need no script.
- Math is written as real math markup, with no script.
- Code keeps its colours.
- Page breaks start a new page when the file is printed from a browser.

## Print

**File ▸ Print…** prints the rendered document. It has no shortcut, because <kbd>⌘</kbd><kbd>P</kbd> is Open Quickly. If you print often, give it one in [Settings ▸ Shortcuts](./settings#shortcuts).

When printing:

- page breaks start a new page
- every tab panel is printed, one after another
- Page View is switched off, since the paper is real

## Save as PDF

**File ▸ Save as PDF…** writes the document to a PDF in the current theme. The PDF is one continuous page, so page breaks don't split it.

## Page breaks

Put `\newpage` or `<!-- pagebreak -->` alone on a line. On screen it's a faint dotted line.

**Preview ▸ "---" as Page Break** turns every `---` rule into a page break too. `***` and `___` stay ordinary rules, so you can still draw a line when you want one.

The **/** menu in the [editable preview](./editable-preview#slash-menu) has **Page Break** and **Divider**.

## Seeing the pages

**Preview ▸ Page View** shows the preview as sheets of paper on a desk. Each page break starts a new sheet. Set **Preview ▸ Page Width** to **A4** or **US Letter** so the sheet is the size of real paper.

![Page View: a page break starts a new sheet](/shots/page-view.webp)

You can keep editing in Page View, including in the editable preview.
