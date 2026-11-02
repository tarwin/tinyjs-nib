// The Markdown renderer, pinned by snapshot: every construct Nib renders,
// with the flavor extras on and off. A snapshot change is a rendering
// change — check it in the app, then `pnpm test:update`.
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { EXAMPLE_MD } from '../src/backend/example.ts';
import { renderMarkdown } from '../src/frontend/md.ts';

const fixture = (name: string) => readFileSync(new URL(`./fixtures/${name}`, import.meta.url), 'utf8');
const plain = { alerts: false, emojiCodes: false, footnotes: false, math: false, mermaid: false, html: false };

test('the example document', (t) => {
  t.assert.snapshot(renderMarkdown(EXAMPLE_MD, {}));
});

test('the sample document', (t) => {
  t.assert.snapshot(renderMarkdown(readFileSync(new URL('../sample.md', import.meta.url), 'utf8'), {}));
});

test('every flavor on (the defaults)', (t) => {
  t.assert.snapshot(renderMarkdown(fixture('flavors.md'), {}));
});

test('every flavor off (CommonMark)', (t) => {
  t.assert.snapshot(renderMarkdown(fixture('flavors.md'), plain));
});

test('--- as page breaks', (t) => {
  t.assert.snapshot(renderMarkdown('one\n\n---\n\ntwo\n', { hrBreaks: true }));
});

test('CRLF reads like LF', (t) => {
  const lf = fixture('flavors.md');
  t.assert.equal(renderMarkdown(lf.replace(/\n/g, '\r\n'), {}), renderMarkdown(lf, {}));
});
