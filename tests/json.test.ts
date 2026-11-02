// JSONC: Nib's actions files keep their comments through an edit, so the
// parser, the formatter and the tree ⇄ value round trip are pinned here.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { jsonc } from '../src/frontend/json.ts';

const SRC = `// my actions
{
  "actions": [
    /* the first */ { "id": "a", "label": "Say hi", "cmd": ["echo", "hi"] },
    { "id": "b", "label": "Nested", "args": { "x": 1, "y": [true, null, 2.5e3] } }, // trailing
  ],
  "version": 2,
}
`;

test('check accepts JSONC (comments, trailing commas)', () => {
  assert.equal(jsonc.check(SRC).ok, true);
});

test('check rejects broken JSON with a position', (t) => {
  const r = jsonc.check('{ "a": 1, "b": }');
  assert.equal(r.ok, false);
  t.assert.snapshot(r);
});

test('format keeps the comments', (t) => {
  const out = jsonc.format(SRC);
  assert.match(out, /my actions/);
  assert.match(out, /the first/);
  assert.match(out, /trailing/);
  t.assert.snapshot(out);
});

test('format is idempotent', () => {
  const once = jsonc.format(SRC);
  assert.equal(jsonc.format(once), once);
});

test('toValue reads the tree as plain JSON', () => {
  const r = jsonc.check(SRC);
  assert.ok(r.ok);
  assert.deepEqual(jsonc.toValue(r.tree.root), {
    actions: [
      { id: 'a', label: 'Say hi', cmd: ['echo', 'hi'] },
      { id: 'b', label: 'Nested', args: { x: 1, y: [true, null, 2500] } },
    ],
    version: 2,
  });
});
