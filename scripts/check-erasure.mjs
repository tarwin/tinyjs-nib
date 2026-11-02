// Typing must not change what runs. For each .ts file under src/, strip its
// types (Node's own stripper — the same erasure tinyjs's esbuild and Vite
// do) and compare the program that is left with the same file at a base
// commit: same syntax tree, ignoring positions, comments, whitespace and
// redundant parentheses. Any difference is a runtime change and is printed.
//
//   node scripts/check-erasure.mjs [base-ref] [files...]
//
// base-ref defaults to the TS_ERASURE_BASE env var, then 42dcc85 — the
// stage-1 commit, where every file was already .ts but untyped JS.
import { readFileSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { stripTypeScriptTypes } from 'node:module';
import { join } from 'node:path';
import { parseAst } from 'rolldown/parseAst';

process.removeAllListeners('warning'); // stripTypeScriptTypes is "experimental"

const args = process.argv.slice(2);
const base = args[0] && !args[0].endsWith('.ts') ? args.shift() : (process.env.TS_ERASURE_BASE || '42dcc85');
const files = args.length ? args : ['src/frontend', 'src/backend'].flatMap((d) =>
  readdirSync(d).filter((f) => f.endsWith('.ts') && !f.endsWith('.d.ts')).map((f) => join(d, f)));

// `shorthand`: { op } and { op: op as T } are the same object once erased
const SKIP = new Set(['start', 'end', 'range', 'loc', 'raw', 'shorthand']);
function norm(node) {
  if (Array.isArray(node)) return node.map(norm);
  if (!node || typeof node !== 'object') return node;
  if (node.type === 'ParenthesizedExpression') return norm(node.expression);
  const out = {};
  for (const k of Object.keys(node).sort()) if (!SKIP.has(k)) out[k] = norm(node[k]);
  return out;
}
const tree = (src) => JSON.stringify(norm(parseAst(src, { lang: 'js' })));

// first differing path, for the report
function firstDiff(a, b, path = '') {
  if (typeof a !== typeof b || Array.isArray(a) !== Array.isArray(b)) return path;
  if (a && typeof a === 'object') {
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
      const p = firstDiff(a[k], b[k], path + '.' + k);
      if (p !== null) return p;
    }
    return null;
  }
  return a === b ? null : path + ` (${JSON.stringify(a)} → ${JSON.stringify(b)})`;
}

let bad = 0;
for (const f of files) {
  let old;
  try { old = execFileSync('git', ['show', `${base}:${f}`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); }
  catch { console.log(`new   ${f} (not in ${base})`); continue; }
  let now;
  try { now = stripTypeScriptTypes(readFileSync(f, 'utf8'), { mode: 'strip' }); }
  catch (e) { console.log(`FAIL  ${f}: can't strip types — ${e.message.split('\n')[0]}`); bad++; continue; }
  const a = tree(stripTypeScriptTypes(old, { mode: 'strip' })), b = tree(now);
  if (a === b) continue;
  bad++;
  console.log(`DIFF  ${f}: ${firstDiff(JSON.parse(a), JSON.parse(b))}`);
}
if (bad) { console.log(`${bad} file(s) changed at runtime`); process.exit(1); }
console.log(`ok — ${files.length} file(s) erase to the same program as ${base}`);
