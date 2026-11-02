// The small pure helpers: moving lines, AsciiDoc → Markdown, the settings
// layers. (tables.ts can't load outside a page: it pulls in icons.ts, which
// paints the page's icons as it loads.)
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { effective, readPath, writePath } from '../src/backend/layers.ts';
import { adocToMarkdown } from '../src/frontend/adoc.ts';
import { nibMoveLines } from '../src/frontend/move.ts';

test('moving lines', (t) => {
  const text = 'a\nb\nc\nd\n';
  t.assert.snapshot([
    nibMoveLines(text, 1, 2, 3),   // b → after c
    nibMoveLines(text, 2, 4, 0),   // c, d → top
    nibMoveLines(text, 0, 1, 9),   // past the end
  ]);
});

test('AsciiDoc → Markdown', (t) => {
  t.assert.snapshot(adocToMarkdown([
    '= Title', ':toc:', '', '== Section', '', 'Some *bold* and _italic_ and `mono`.', '',
    '* one', '** two', '. first', '', '[source,js]', '----', 'const a = 1;', '----', '',
    'NOTE: A note.', '', 'link:https://example.com[Example] and <<anchor,see>>.', '',
  ].join('\n')));
});

test('settings layers: per key, the highest layer holding a value wins', () => {
  const mine = {}, folder = {}, local = {};
  writePath(mine, 'theme', 'paper');
  writePath(folder, 'theme', 'night');
  writePath(mine, 'images.dest', 'beside');
  assert.equal(readPath(folder, 'theme'), 'night');
  const stack = [{ name: 'mine', data: mine }, { name: 'folder', data: folder }, { name: 'local', data: local }];
  assert.deepEqual(effective(stack, 'theme', 'x'), { value: 'night', from: 'folder', set: ['mine', 'folder'] });
  assert.deepEqual(effective(stack, 'images.dest', 'x'), { value: 'beside', from: 'mine', set: ['mine'] });
  assert.deepEqual(effective(stack, 'missing', 'fallback'), { value: 'fallback', from: null, set: [] });
});
