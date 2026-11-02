# Actions

An action is a button that runs something: a build, a deploy, a formatter, the shell one-liner you keep retyping. Actions can also run a small script, or send a prompt to an [AI model](./ai).

<!-- shot: the ⚡ menu open in a document window, with a few actions listed -->

## Running an action

Actions appear in three places:

- the **⚡** menu in the toolbar
- the **Actions** menu in the menu bar
- the right-click menu in the file tree, for actions that work on a file. They run on the file you clicked.

An action can also have its own button pinned beside the ⚡, or appear on the format bubble when you select text in the [editable preview](./editable-preview).

An action that can't run right now is greyed out with the reason: *needs a saved file*, *not for this file*, or the name of a command that wasn't found.

What an action prints goes to a panel under the document, with a **Stop** button and the exit code. If a run fails, the panel opens whatever the action was set to do with its output.

To give an action a keyboard shortcut, use [Settings ▸ Shortcuts](./settings#shortcuts). Actions are listed there with the menu commands.

## Yours and the folder's

Actions come from two files:

- **Your actions** are kept with Nib's settings and appear in every folder.
- **A folder's actions** are kept in its `.nib/actions.json`, and travel with it. Folder actions are marked ⟨folder⟩ in the Actions menu.

Because a folder's actions can be written by someone else (clone a repo and its buttons come along), each one does nothing until you approve it. The first time you run one, a sheet shows the real command, with its variables filled in, and the folder it will run in. Choose **Run Once**, **Always Allow** or **Cancel**.

**Always Allow** is tied to what the action does. If someone renames the button, Nib doesn't ask again. If someone changes the command, Nib asks again and says it changed.

**Settings ▸ Actions** lists the folder actions you've approved. Remove one and it asks again next time.

::: warning
A script action runs inside Nib. One that loops forever freezes the app. Read a folder's scripts before you allow them.
:::

## Making an action

**Actions ▸ Manage Actions…** (<kbd>⌥</kbd><kbd>⌘</kbd><kbd>A</kbd>) opens the editor: your actions down the left, the selected one's settings on the right. With a folder open, a switch at the top moves between your actions and the folder's.

<!-- shot: the Manage Actions sheet with a command action selected -->

Click **+ New Action**, give it a **Name**, and choose what it **Does**:

- **Runs a command**: type it as you would in a terminal. Underneath, Nib shows how it splits into separate arguments as you type, so you can see that `echo "hello there"` is two. Tick **Run through a shell** for pipes, `&&` and redirects. **Different command per platform** gives macOS, Windows and Linux their own command.
- **Runs a script (JavaScript)**: a short script with access to the file, the selection and the folder. It can ask you questions with `ctx.prompt`, `ctx.choose`, `ctx.confirm` and file pickers. Return a string to use it as the output.
- **Asks a model (AI)**: a prompt instead of a command. See [AI](./ai).

The rest is optional:

| Setting | Choices |
|---|---|
| **Icon** | An emoji, or an icon from the Iconify set. 🙂 opens the emoji picker and 🔍 searches icons |
| **What it does** | A description, shown when you hover the action |
| **Where it appears** | **Pinned to the toolbar**, **On a selection in the preview**. It's always in the ⚡ menu and the Actions menu |
| **Ask first** | Questions to answer before it runs. Each answer becomes a variable: a question called *Branch name* fills `{branch_name}`. A question can be a line of text, several lines, a number, a choice from a list, a tick box, or a file or folder |
| **Available when** | Always, a folder is open, a saved file is open, or something is selected. **Only for files like** limits it to a pattern such as `*.md` |
| **Reads** | Nothing, or the document or selection piped in |
| **What it prints** | Shows in the panel, replaces the document (for a formatter), goes in at the caret, opens as a new document, a small toast, a box with the answer and a **Copy** button, or nothing |
| **Runs in** | Where it runs. By default: the pinned folder above the document, else the open folder, else the document's own folder |
| **On** | Which systems it's offered on |
| **Before it runs** | **Save the document first**, **Ask me every time** |

**Run it now** tries the action without leaving the editor. Nothing is written until you press **Save**. **Revert** puts an action back the way the file has it. Edits you haven't saved stay with each action while the editor is open, marked with a dot.

**Edit as JSON…** opens the actions file itself in a tab, for anything the form doesn't cover. Comments you write in the file survive edits made through the form. **Actions ▸ Reload Actions** reads the files again after you change them outside Nib.

The answers you gave to **Ask first** questions are offered again next time.

## Variables

Variables in a command, script or prompt are filled in when the action runs:

| Variable | Is |
|---|---|
| `{file}` | The document's full path |
| `{dir}` | The document's folder |
| `{root}` | The open folder |
| `{rel}` | The document's path from the open folder |
| `{name}`, `{stem}`, `{ext}` | The file name, without its extension, and the extension |
| `{pin}` | The closest [pinned folder](./links-and-pins#pins) |
| `{sel}` | The selected text |
| `{line}` | The caret's line number |
| `{heading}` | The heading the caret is under |
| `{date}` | Today's date |

## Finding commands

Apps started from the Dock don't get your terminal's search path, so Nib also looks for commands where they usually live, such as `/opt/homebrew/bin` and `~/.local/bin`. A command it can't find shows *not found* on the button, before you press it.
