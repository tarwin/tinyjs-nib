# Settings

Open Settings with <kbd>⌘</kbd><kbd>,</kbd>: **Nib ▸ Settings…** on macOS, **File ▸ Settings…** on Windows and Linux. It opens in its own window, with sections down the left.

Nothing applies until you click **Save** (<kbd>⌘</kbd><kbd>S</kbd>). **Cancel** or <kbd>esc</kbd> throws your changes away. The **Shortcuts**, **AI** and **Actions** sections are the exception: changes there apply straight away.

Most settings are also in the menus. The menu and the Settings window always agree, since they change the same thing.

<!-- shot: the Settings window on the Project tab with a "set here" row -->

## Mine and Project {#mine-and-project}

With a folder open, Settings has two tabs: **Project** and **Mine**.

- **Mine** is yours, on this machine, in every folder. It has every setting, and it's what everything else falls back to.
- **Project** is the open folder's setup: the Markdown flavor, how links are written, and where pictures go and what they're called. These change what ends up in the files, or should match what the folder's site renders, so they can belong to the folder.

Your appearance, theme, view and widths are always yours. A folder can never change them.

Each row on the Project tab says where its value comes from: *from Mine* when the folder doesn't set it, *set here* with a **↺** to go back to your default, or *this Mac* when pinned. **Clear all** at the bottom removes every answer on the tab at once.

### Where a folder's settings are kept

The **Project** section at the top of the tab has the folder's own switches:

- **Save settings in the folder**: on, the Project tab writes `.nib/settings.json` inside the folder. Commit it and everyone who opens the folder gets the same setup. Off, the same answers are kept in Nib's own settings on this machine, and Nib never reads or writes anything inside the folder. This is remembered per folder, and is the same switch as **File ▸ Save Settings in Folder**.
- **Pinned folders**: turns the folder's [pins](./links-and-pins#pins) on and off.
- **Edit .nib/settings.json…** opens the file as a tab (also **File ▸ Edit Folder Settings…**). Saving the tab applies it immediately. Nib checks the file before saving and refuses if it's broken, showing the line and column of the problem.

The file is only created when you change a project setting. To keep one answer to yourself without changing it for everyone else, click the **📌** on its row: that answer stays on this machine and is never written into the folder.

## General

| Setting | What it does |
|---|---|
| **Appearance** | Match System, Light or Dark, for Nib itself. The preview has its own theme |
| **Zoom** | 90% to 150%, for every window. <kbd>⌘</kbd><kbd>+</kbd> and <kbd>⌘</kbd><kbd>−</kbd> do it too |
| **Opens in** | The view a newly opened document starts in: Editor Only, Split or Preview Only |
| **Dictation** | Shows the 🎙 button. See [Dictation](./dictation) |
| **Show all files** | The file tree and Open Quickly list files Nib can't open, too |
| **Show hidden files** | Dot-files and dot-folders in the tree and Open Quickly |

## Editor

| Setting | What it does |
|---|---|
| **High contrast** | A higher-contrast look |
| **Find highlight** | The colour of search matches |
| **Page width applies to the editor** | Page Width narrows the source pane as well as the preview |
| **Heading links carry their path** | A link to a heading is labelled with its whole trail, such as *H1 › H2 › SMS* |
| **Joined by** | The separator in that trail |
| **Paths written** | Relative to the document, from the link root, or from the pinned folder. See [Link Options](./links-and-pins#link-options) |

## Preview

| Setting | What it does |
|---|---|
| **Theme** | Paper, Ink, Typewriter or Night. It follows the document into print, PDF and exported HTML |
| **Page width** | Narrow, Normal, Wide or Full |
| **Page view** | The preview as sheets of paper |
| **Markdown flavour** | The GitHub and CommonMark presets, and a switch for each extra. See [Markdown flavor](./markdown#markdown-flavor) |
| **"---" as a page break** | Every `---` rule becomes a page break |
| **Image captions**, **Centre images**, **Click an image to zoom**, **Link tabs** | As in the **Preview** menu. See [How the preview looks](./editor-and-preview#how-the-preview-looks) |

## Images & Paths

Where a pasted or dropped picture goes, what it's called, whether it's optimised, and what a leading `/` in a path means. See [Image & Path Settings](./images#image-path-settings).

## Shortcuts {#shortcuts}

Change the key for any menu command or action:

1. Click the key shown beside a command.
2. Press the new combination. It must include <kbd>⌘</kbd> (<kbd>Ctrl</kbd> on Windows and Linux).

<kbd>⌫</kbd> removes a shortcut and <kbd>esc</kbd> keeps the old one. If a key is already used by another command, both are shown in red.

**Preset** starts you from another editor's habits: VS Code, Sublime Text, Atom, Notepad++, TextMate, Vim or Eclipse. The panel lists exactly what the preset changes. For example, VS Code's moves the preview to <kbd>⌘</kbd><kbd>⇧</kbd><kbd>V</kbd> and the file tree to <kbd>⌘</kbd><kbd>⇧</kbd><kbd>E</kbd>. Some presets, like Vim's, change nothing, and the panel says so. Change any key on top of a preset and it reads **Custom**; picking a preset again starts fresh.

Shortcuts are only on the **Mine** tab. A folder can't change your keys.

## AI

Which AI providers Nib may use and what a model may do. See [AI](./ai).

## Actions

**Manage Actions…** opens the action editor, **Reload from disk** reads the actions files again, and **Approved folder actions** lists the folder actions you've allowed. See [Actions](./actions).
