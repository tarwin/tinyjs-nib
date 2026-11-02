# Dictation

Dictation types what you say at the caret. It uses your system's speech recognition and has nothing to do with the [AI](./ai) settings. If you want the words tidied up afterwards, select them and run an AI action such as *Tidy the Selection*.

## Turning it on

Dictation is off until you turn it on, because it needs the microphone.

1. Open **Settings ▸ General**.
2. Tick **Dictation**.

A **🎙** button appears in the document toolbar. The first time you use it, your system may ask whether Nib can use the microphone and speech recognition.

::: warning Linux
Dictation isn't available on Linux. The web engine Nib uses there has no speech recognition, so the setting says *Not available* and the button never appears.
:::

## Dictating

1. Put the caret where you want the words.
2. Click **🎙**, or press <kbd>⌃</kbd><kbd>⌘</kbd><kbd>D</kbd> (<kbd>Ctrl</kbd><kbd>Shift</kbd><kbd>D</kbd> on Windows).
3. Speak. Words that are still being recognized show in a small pill above the document, not in the text.
4. Click **🎙** again, press the same keys, or press <kbd>esc</kbd> to stop.

<!-- shot: the dictation pill above a document with interim words -->

Nib adds the spacing between words and a capital letter after a full stop, based on the text already before the caret.
