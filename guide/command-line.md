# The nib command

Nib can put a `nib` command on your terminal's path, so you can open files and folders from wherever you're working.

## Installing it

Choose **File ▸ Install ‘nib’ Shell Command…**. The Welcome window has the same thing as a link at the bottom: **Install the nib terminal command…**.

- **macOS**: Nib tries Homebrew's folder first, then `/usr/local/bin`. If neither can be written to, it asks for an administrator password once.
- **Windows**: Nib adds the command to your user path.
- **Linux**: Nib puts the command in `~/.local/bin`.

If you move Nib somewhere else, choose the menu item again to repair the command.

## Using it

```sh
nib notes.md          # open a file
nib .                 # open the current folder as a project
nib . README.md       # open the folder, with that file in it
```

If Nib is already running, the files open in the copy that's running. The terminal prompt comes straight back; Nib doesn't keep the terminal busy.

`nib .` does the same as **File ▸ Open Folder…**: the folder becomes the project, with its [file tree](./folders) down the left.

Arguments that aren't paths, such as `--verbose`, are ignored.
