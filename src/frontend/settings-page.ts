// The Settings window's entry.

import { setupAiPanel } from './aipanel.ts';
import { nibAppearance, nibToast, setupSettings } from './settings.ts';
import { setupZoom } from './zoom.ts';

const panel = setupAiPanel({ toast: nibToast });
setupSettings({ ai: panel, toast: nibToast });

// The same three lines every other window runs. This one didn't, which is
// exactly why it sat in light mode while the rest of the app was dark.
const boot = await tiny.api.call('boot');
setupZoom(boot.zoom);                     // ⌘+ / ⌘− work here too
await nibAppearance(boot.appearance);
