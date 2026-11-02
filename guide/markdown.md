# Markdown in Nib

Nib renders the everyday Markdown set as CommonMark and GitHub spell it, plus the extras documentation sites use. The fastest way to see all of it is **Help ▸ Open Example Document**: every construct on this page is in it, live and editable.

## The basics

- **Headings**: one to six `#` and a space. Every heading becomes an anchor and an entry in the [outline](./editor-and-preview#the-outline).
- **Text**: `*italic*`, `**bold**`, `***both***`, `~~struck~~`, `==highlighted==`, `` `code` ``. Underscores work too. A backslash keeps a marker literal: `\*not italic\*`.
- **Line breaks**: a blank line starts a new paragraph. Two spaces at the end of a line break it inside one.
- **Lists**: `-`, `*` or `+` for bullets, `1.` for numbers. Nest them two spaces at a time. A numbered list can start at any number.
- **Task lists**: `- [ ]` and `- [x]`. Click a checkbox in the preview and the source line updates.
- **Quotes**: `>`. Quotes can hold lists, code and other blocks.
- **Code**: fence with three backticks or three tildes. Name the language after the fence (` ```js `) for colours. Nib colours JavaScript and TypeScript, JSON, Python, shell, CSS, HTML, SQL, YAML, Go, Rust, C, Java and Swift.
- **Tables**: see [Tables](./tables).
- **Links**: `[text](url)`, `<https://…>`, and bare `https://` addresses. See [Links and pins](./links-and-pins).
- **Images**: `![alt](path)`. See [Images](./images).
- **Rules**: three or more dashes, asterisks or underscores.
- **Front matter**: a YAML block at the top between `---` lines shows as its own quiet block. Nib never edits or hides it.

## Callouts

Three colons, a type, an optional title; three colons to close. The body is ordinary Markdown.

```md
::: warning Careful
Callouts can hold **anything**, including other callouts.
:::
```

The types are `note` (the default), `info`, `tip`, `hint`, `important`, `warning`, `caution`, `danger`, `success` and `bug`. A type Nib doesn't know gets neutral styling with its name as the title. `::: details Title` makes a section that folds away.

## Tabs

```md
::: tabs
== macOS
Steps for macOS.
== Windows
Steps for Windows.
:::
```

Each `== Title` line starts a tab. Tabs keep working in exported HTML, and printing shows every panel. With **Preview ▸ Link Tabs** on, tab groups with the same titles switch together.

## Page breaks

`\newpage` or `<!-- pagebreak -->` alone on a line. On screen it's a faint dotted line; when printing and in exported HTML it starts a new page. **Preview ▸ "---" as Page Break** turns every `---` rule into one too. See [Printing and exporting](./exporting).

## Markdown flavor {#markdown-flavor}

**Preview ▸ Markdown Flavor** has a switch for each extra, so the preview can match what your site or platform will actually render. Three presets set them as a group:

- **GitHub**: everything on. This is the default.
- **CommonMark (plain)**: everything off.
- **Everything**: everything on.

| Switch | Syntax |
|---|---|
| **Math** | `$x$` inline, `$$…$$` or a ` ```math ` fence for a block. TeX, rendered to real math markup |
| **Mermaid Diagrams** | A ` ```mermaid ` fence. Diagrams are coloured to match the preview theme |
| **Alerts** | GitHub's callouts: `> [!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, `[!CAUTION]` |
| **Emoji Shortcodes** | `:tada:` becomes 🎉 |
| **Footnotes** | `text[^1]` and `[^1]: the note`. Notes gather at the end |
| **HTML** | The HTML GitHub allows: `<div align="center">`, `<details>`, `<kbd>`, `<sub>`, `<img width>`, `<picture>`. Scripts, colours and positioning are dropped; layout such as a grid is kept. Comments are hidden. With the switch off, HTML shows as text |
| **Carousels** | `::: carousel small` (or `medium`, `large`): the images inside as a strip that scrolls sideways |
| **Download Cards** | `::: download [Title](url)`: a card, with the body as its description |
| **Page Links** | `::: pagelink [Title](./page)`: a card that opens the page |
| **Embeds** | `::: embed <url>`: YouTube, Vimeo, Spotify, Figma, CodePen and similar, with the body as a caption. It needs the network; without it, the link stays a link |
| **Table of Contents** | `::: toc On this page 2-3`: a linked list of the document's headings. The title and level range are optional; `3` alone means levels 1 to 3 |

Callouts, tabs and page breaks render whatever the flavor.

In a [project](./folders), the flavor can be kept with the folder's settings, so everyone working on it sees the same thing. See [Settings](./settings#mine-and-project).

## Not supported

Nib keeps to the everyday set. These are the notable gaps:

- reference-style links and images (`[a][1]` with `[1]: url` elsewhere)
- definition lists and abbreviations
- Setext headings (text underlined with `===` or `---`)

Files such as `.mdx` or `.qmd` open, but their extra syntax shows as plain text.
