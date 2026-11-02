// AI — where the models are, and the one rule that keeps them safe to share.
//
// Three adapters cover everything Nib can talk to, and the middle one covers
// most of it:
//
//   apple      Apple's FoundationModels, ON THIS MACHINE. No key, no network,
//              nothing leaves the Mac. macOS 26 with Apple Intelligence
//              switched on — and `availability()` is not optional, because the
//              three honest answers are available / unavailable / unsupported
//              and only the first one can generate anything.
//   anthropic  api.anthropic.com/v1/messages, streamed.
//   openai     ANY /chat/completions that speaks OpenAI's dialect — OpenAI,
//              Groq, OpenRouter, and the local ones: Ollama on :11434/v1,
//              LM Studio on :1234/v1, llama.cpp's server. One adapter, six
//              services, and "run a local model" stops being a macOS feature.
//
// THE RULE. The provider, the endpoint and the key are YOURS. They live in the
// app's own settings, beside the actions file that nothing but you can write.
// A folder's `.nib/actions.json` may carry a prompt and name a model it would
// prefer; it may never name a base url and it can never reach a key. That is
// not a detail. A folder's actions travel with a `git clone`, so an action
// that could aim the endpoint somewhere else would be handing a stranger your
// API key on the first click. actions.ts drops those fields when it loads a
// project action; the request is assembled here, from your settings, always.
//
// Keys go in `tiny.app.secrets` — Keychain on macOS, Credential Manager on
// Windows, Secret Service on Linux. When that fails (a locked gnome-keyring is
// the real case) the key still works, kept in the app's own store, and the
// settings panel SAYS SO rather than pretending otherwise.

const enc = new TextEncoder();
const dec = new TextDecoder();

// ------------------------------------------------------------------ types

/** Which adapter answers. */
export type ProviderKind = 'apple' | 'anthropic' | 'openai';
/** What a model may touch: nothing, the folder read-only, or everything. */
export type ToolsLevel = 'off' | 'read' | 'full';
/** How often it asks first. */
export type ApproveLevel = 'never' | 'writes' | 'always';

/** A provider as Nib ships it (PROVIDERS). */
export interface ProviderPreset {
  kind: ProviderKind;
  label: string;
  base?: string;
  local?: boolean;
  needsKey: boolean;
  keyHint?: string;
  model?: string;
  keyUrl?: string;
  note?: string;
  os?: string;
}

/** Your overrides for one provider, as stored — read from disk, so the policy
 *  fields are checked against TOOL_RANK / APPROVE_RANK before use. */
export interface ProviderOverride {
  model?: string;
  base?: string;
  off?: boolean;
  tools?: string | null;
  approve?: string | null;
}

/** The preset with your overrides on top (providerConfig). */
export interface ProviderConfig extends ProviderPreset {
  id: string;
  base: string;
  model: string;
  off: boolean;
  tools: ToolsLevel | null;
  approve: ApproveLevel | null;
}

/** The app's AI settings (store key 'ai'). */
export interface AiConfig {
  enabled: boolean;
  provider: string;
  providers: Record<string, ProviderOverride>;
  tools: ToolsLevel;
  approve: ApproveLevel;
  maxTurns: number;
  speech: boolean;
}

/** One opinion about policy; unset or unknown values don't count. */
export interface PolicyOpinion {
  tools?: string | null;
  approve?: string | null;
}

export interface Policy {
  tools: ToolsLevel;
  approve: ApproveLevel;
  /** the action asked for more tools than it got (falsy when it didn't) */
  cappedTools: boolean | string | null | undefined;
}

export interface KeyResult {
  ok: boolean;
  where?: 'secrets' | 'store';
  why?: string;
}

export interface ProviderState {
  id: string;
  ok: boolean;
  why: string | null;
  status?: TinyAiAvailability;
}

export interface ProviderRow extends ProviderState {
  label: string;
  kind: ProviderKind;
  local: boolean;
  note: string | null;
  base: string;
  model: string;
  needsKey: boolean;
  keyHint: string | null;
  keyUrl: string | null;
  hasKey: boolean;
  off: boolean;
  tools: ToolsLevel | null;
  approve: ApproveLevel | null;
}

export interface AiStatus {
  enabled: boolean;
  provider: string;
  tools: ToolsLevel;
  approve: ApproveLevel;
  speech: boolean;
  keyStore: 'secrets' | 'store';
  providers: ProviderRow[];
  ready: boolean;
}

/** One JSON Schema property of a tool's arguments. */
export interface ToolProp {
  type?: string;
  description?: string;
}

/** A tool, in the one shape every adapter converts from. */
export interface AiTool {
  name: string;
  description: string;
  properties?: Record<string, ToolProp>;
  required?: string[];
  // args are whatever JSON the model sent
  run(args: Record<string, any>): unknown;
}

/** Progress from a run's tool calls. */
export type AiEvent =
  | { type: 'tool'; name: string; args: Record<string, any> }
  | { type: 'tool-done'; name: string; ok: boolean; result: string };

/** A stop flag the caller can set mid-run. */
export interface Cancel {
  stopped?: boolean;
}

/** One block of an Anthropic-style message, or a tool result. */
export interface ContentBlock {
  type: string;
  text?: string;
  id?: string;
  name?: string;
  input?: unknown;
  tool_use_id?: string;
  content?: string;
  is_error?: boolean;
}

/** A conversation turn, in either provider's dialect. */
export interface ChatMessage {
  role: string;
  content: string | ContentBlock[] | null;
  tool_calls?: { id: string; type: 'function'; function: { name: string; arguments: string } }[];
  tool_call_id?: string;
}

/** What a tool call did — the record to trust, not the prose. */
export interface ToolCallRecord {
  name: string;
  arguments: Record<string, any>;
  result: string;
  ok: boolean;
}

export interface Usage {
  input: number;
  output: number;
}

export interface GenerateOptions {
  provider?: string;
  model?: string;
  system?: string;
  prompt?: string;
  messages?: ChatMessage[];
  tools?: AiTool[];
  maxTurns?: number;
  temperature?: number;
  maxTokens?: number;
  onDelta?: (text: string) => void;
  onEvent?: (e: AiEvent) => void;
  cancel?: Cancel;
}

/** What an adapter hands back. */
interface AdapterResult {
  text: string;
  calls: ToolCallRecord[];
  usage: Usage | null;
  turns: number;
  capped?: boolean;
  finish?: string | null;
}

export interface GenerateResult extends AdapterResult {
  provider: string;
  providerLabel: string;
  model: string;
}

/** Everything an adapter needs for one generate() call. */
interface AdapterOptions {
  p: ProviderConfig;
  model: string;
  system?: string;
  msgs: ChatMessage[];
  tools: AiTool[];
  turns: number;
  temperature?: number;
  maxTokens: number;
  onDelta?: (text: string) => void;
  onEvent?: (e: AiEvent) => void;
  cancel: Cancel;
  app: TinyApp;
}

// Every provider Nib knows how to reach. `kind` is which adapter answers;
// everything else is what the settings panel needs to draw a row. A local one
// takes no key and sends nothing anywhere — worth saying in the UI, so it's a
// flag here rather than a hardcoded list over there.
export const PROVIDERS: Record<string, ProviderPreset> = {
  apple: {
    kind: 'apple', label: 'Apple on-device', local: true, needsKey: false,
    note: 'Runs on this Mac. Offline, private, free. Needs macOS 26 with Apple Intelligence on.',
    os: 'macos',
  },
  anthropic: {
    kind: 'anthropic', label: 'Anthropic', base: 'https://api.anthropic.com/v1',
    needsKey: true, keyHint: 'sk-ant-…', model: 'claude-sonnet-5',
    keyUrl: 'https://console.anthropic.com/settings/keys',
  },
  openai: {
    kind: 'openai', label: 'OpenAI', base: 'https://api.openai.com/v1',
    needsKey: true, keyHint: 'sk-…', model: 'gpt-4o-mini',
    keyUrl: 'https://platform.openai.com/api-keys',
  },
  groq: {
    kind: 'openai', label: 'Groq', base: 'https://api.groq.com/openai/v1',
    needsKey: true, keyHint: 'gsk_…', model: 'llama-3.3-70b-versatile',
    keyUrl: 'https://console.groq.com/keys',
  },
  openrouter: {
    kind: 'openai', label: 'OpenRouter', base: 'https://openrouter.ai/api/v1',
    needsKey: true, keyHint: 'sk-or-…', model: 'anthropic/claude-sonnet-4.5',
    keyUrl: 'https://openrouter.ai/keys',
  },
  ollama: {
    kind: 'openai', label: 'Ollama', base: 'http://localhost:11434/v1',
    local: true, needsKey: false, model: 'llama3.2',
    note: 'Runs on this machine. Start it with `ollama serve`; models come from `ollama pull`.',
  },
  lmstudio: {
    kind: 'openai', label: 'LM Studio', base: 'http://localhost:1234/v1',
    local: true, needsKey: false, model: '',
    note: 'Runs on this machine. Turn the local server on in LM Studio’s Developer tab.',
  },
  custom: {
    kind: 'openai', label: 'Other (OpenAI-compatible)', base: '',
    needsKey: false, model: '',
    note: 'Anything that speaks /chat/completions — llama.cpp’s server, vLLM, a gateway of your own.',
  },
};

export const providerIds = () => Object.keys(PROVIDERS);

const OS = () => (tjs.env.OS === 'Windows_NT' ? 'windows'
  : /linux/i.test(globalThis.navigator?.platform ?? '') ? 'linux' : 'macos');

// --------------------------------------------------------------- settings

// Defaults chosen so that an untouched install is OFF and reaches nothing.
// Nothing about AI appears in the app until this says otherwise.
const DEFAULTS: AiConfig = {
  enabled: false,
  // The on-device one where it exists, and the local server everywhere else —
  // so the first thing offered is always the one that costs nothing and sends
  // nothing. On Linux and Windows `apple` isn't even listed, and defaulting to
  // a provider that isn't on the list is a confusing first run.
  provider: OS() === 'macos' ? 'apple' : 'ollama',
  providers: {},            // id -> { model, base }   (never a key — see below)
  tools: 'read',            // 'off' | 'read' | 'full'
  approve: 'writes',        // 'always' | 'writes' | 'never'
  maxTurns: 8,
  speech: true,
};

let cache: AiConfig | null = null;

export async function aiConfig(app: TinyApp): Promise<AiConfig> {
  if (cache) return cache;
  const saved: Partial<AiConfig> = (await app.store.get('ai')) || {};
  cache = { ...DEFAULTS, ...saved, providers: { ...(saved.providers || {}) } };
  return cache;
}

export async function setAiConfig(app: TinyApp, patch: Partial<AiConfig>): Promise<AiConfig> {
  const c = await aiConfig(app);
  const next: AiConfig = { ...c, ...patch };
  if (patch && patch.providers) next.providers = { ...c.providers, ...patch.providers };
  cache = next;
  await app.store.set('ai', next);
  return next;
}

// What a provider is actually configured as: the preset, with your overrides
// on top. `base` is normalised here so a pasted url with a trailing slash —
// or one that already ends in /v1 — reaches the same place.
export async function providerConfig(app: TinyApp, id: string): Promise<ProviderConfig | null> {
  const p = PROVIDERS[id];
  if (!p) return null;
  const c = await aiConfig(app);
  const own = c.providers[id] || {};
  const base = String(own.base || p.base || '').trim().replace(/\/+$/, '');
  return {
    id, ...p, base,
    model: String(own.model || p.model || '').trim(),
    // A provider switched off is not offered and cannot be reached, even by an
    // action that names it. Absent means on: turning one off is a decision,
    // and a fresh install shouldn't have eight of them already made.
    off: own.off === true,
    // The two policy fields. Unset means "whatever the general setting says";
    // set, they are a LIMIT rather than a preference — see effectivePolicy.
    tools: TOOL_RANK[own.tools!] !== undefined ? own.tools as ToolsLevel : null,
    approve: APPROVE_RANK[own.approve!] !== undefined ? own.approve as ApproveLevel : null,
  };
}

// ------------------------------------------------------------------ policy
//
// Two settings decide what a model may do, and they come from three places:
// the general setting, the provider's own limit, and what the action asked
// for. The rule is that NOTHING can widen what came before it.
//
//   tools     off < read < full        — the narrowest of the three wins
//   approve   never < writes < always  — the STRICTEST of the three wins
//
// So "Ollama may read, Anthropic may write" is a sentence you can actually
// rely on: an action naming `"tools": "full"` gets `read` on Ollama, because
// the provider's limit is not a suggestion. An action can still ask for less
// than it is allowed, which is what a rewriting prompt should do.
// keyed by string: the values looked up are often unvalidated ones from disk
export const TOOL_RANK: Record<string, number> = { off: 0, read: 1, full: 2 };
export const APPROVE_RANK: Record<string, number> = { never: 0, writes: 1, always: 2 };
const byRank = (rank: Record<string, number>, pick: number) => Object.keys(rank).find((k) => rank[k] === pick);

//
// And a FOURTH opinion, which only ever narrows: where the action came from.
// A folder's action (`scope: 'project'`) is a stranger's prompt, approved
// once. normalize() already drops a `"tools": "full"` or `"approve": "never"`
// it writes for itself — but an action that says NOTHING inherits, and if
// your general setting is full-and-never (a fine answer for your own notes
// on a local model), the cloned repo's "summarise this" quietly gets to
// write files and run commands without a single sheet. So the folder is a
// limit in its own right: tools no wider than read, approve no quieter than
// writes, whatever the other three say.
export function effectivePolicy({ general, provider, action, scope }: {
  general: PolicyOpinion; provider: PolicyOpinion; action: PolicyOpinion; scope?: string;
}): Policy {
  const tools = [general.tools, provider.tools, action.tools]
    .filter((v) => TOOL_RANK[v!] !== undefined).map((v) => TOOL_RANK[v!]);
  const approve = [general.approve, provider.approve, action.approve]
    .filter((v) => APPROVE_RANK[v!] !== undefined).map((v) => APPROVE_RANK[v!]);
  if (scope === 'project') {
    tools.push(TOOL_RANK.read);
    approve.push(APPROVE_RANK.writes);
  }
  return {
    tools: byRank(TOOL_RANK, tools.length ? Math.min(...tools) : TOOL_RANK.read) as ToolsLevel,
    approve: byRank(APPROVE_RANK, approve.length ? Math.max(...approve) : APPROVE_RANK.writes) as ApproveLevel,
    // what an action asked for but didn't get, so a run can say so rather
    // than quietly doing less than the prompt assumed
    cappedTools: action.tools && TOOL_RANK[action.tools] > Math.min(...tools),
  };
}

// -------------------------------------------------------------------- keys
//
// One key per provider, under a name that says which. `secrets` is the real
// home; the store is the fallback and never a silent one — `keyStore()` tells
// the settings panel which of the two answered, so it can say so on screen.

const keyName = (id: string) => 'ai.' + id + '.key';
let secretsBroken: boolean | null = null;                    // null = not tried yet

export async function setKey(app: TinyApp, id: string, value: unknown): Promise<KeyResult> {
  const v = String(value || '');
  if (!v) return deleteKey(app, id);
  try {
    await app.secrets.set(keyName(id), v);
    secretsBroken = false;
    // a key that used to live in the fallback shouldn't stay there
    await app.store.delete('aikey:' + id);
    return { ok: true, where: 'secrets' };
  } catch (e) {
    secretsBroken = true;
    await app.store.set('aikey:' + id, v);
    return { ok: true, where: 'store', why: (e as Error).message || String(e) };
  }
}

export async function getKey(app: TinyApp, id: string): Promise<string | null> {
  try {
    const v = await app.secrets.get(keyName(id));
    if (v) return v;
  } catch { secretsBroken = true; }
  return (await app.store.get('aikey:' + id)) || null;
}

export async function deleteKey(app: TinyApp, id: string): Promise<KeyResult> {
  try { await app.secrets.delete(keyName(id)); } catch { /* may never have been there */ }
  await app.store.delete('aikey:' + id);
  return { ok: true };
}

export const keyStore = (): 'secrets' | 'store' => (secretsBroken === true ? 'store' : 'secrets');

// ------------------------------------------------------------ availability
//
// Why a provider can't answer right now, in one line, or null when it can.
// Same idea as an action's greyed row: a reason beats a disappearance.

export async function providerState(app: TinyApp, id: string): Promise<ProviderState> {
  const p = await providerConfig(app, id);
  if (!p) return { id, ok: false, why: 'unknown provider' };
  if (p.os && p.os !== OS()) return { id, ok: false, why: 'not on ' + OS() };
  if (p.off) return { id, ok: false, why: 'turned off' };

  if (p.kind === 'apple') {
    let status: TinyAiAvailability = 'unsupported';
    try { status = await app.macos.ai.availability(); } catch { /* older launcher */ }
    return {
      id, ok: status === 'available', status,
      why: status === 'available' ? null
        : status === 'unavailable' ? 'Apple Intelligence is off, or still downloading'
          : 'needs macOS 26 with Apple Intelligence',
    };
  }
  if (!p.base) return { id, ok: false, why: 'no address set' };
  if (p.needsKey && !(await getKey(app, id))) return { id, ok: false, why: 'no key yet' };
  if (!p.model) return { id, ok: false, why: 'no model chosen' };
  return { id, ok: true, why: null };
}

// Every provider's state at once — what the settings panel draws, and what
// decides whether the AI parts of the app appear at all.
export async function aiStatus(app: TinyApp): Promise<AiStatus> {
  const c = await aiConfig(app);
  const rows: ProviderRow[] = [];
  for (const id of providerIds()) {
    const p = (await providerConfig(app, id))!;      // every id here is a preset
    if (p.os && p.os !== OS()) continue;                 // don't offer what can't exist
    const st = await providerState(app, id);
    rows.push({
      id, label: p.label, kind: p.kind, local: !!p.local, note: p.note || null,
      base: p.base, model: p.model, needsKey: !!p.needsKey, keyHint: p.keyHint || null,
      keyUrl: p.keyUrl || null, hasKey: p.needsKey ? !!(await getKey(app, id)) : false,
      off: p.off, tools: p.tools, approve: p.approve,
      ...(st as Omit<ProviderState, 'id'>),   // same id; the spread is the state
    });
  }
  return {
    enabled: c.enabled, provider: c.provider, tools: c.tools, approve: c.approve,
    speech: c.speech, keyStore: keyStore(), providers: rows,
    ready: c.enabled && rows.some((r) => r.id === c.provider && r.ok),
  };
}

// The models a provider will admit to having. Worth asking for real rather
// than shipping a list that goes stale in a month — and for Ollama it is the
// only way to know what you have actually pulled.
export async function listModels(app: TinyApp, id: string): Promise<{ models?: string[]; error?: string }> {
  const p = await providerConfig(app, id);
  if (!p) return { error: 'unknown provider' };
  if (p.kind === 'apple') return { models: ['on-device'] };
  if (!p.base) return { error: 'no address set' };
  // asked for even when the provider doesn't require one: a gateway of your
  // own may well want a key on a url that looks local
  const key = await getKey(app, id);
  try {
    const r = await fetch(p.base + '/models', { headers: authHeaders(p, key) });
    if (!r.ok) return { error: 'HTTP ' + r.status + ' from ' + p.base + '/models' };
    const j = await r.json();
    const arr = Array.isArray(j.data) ? j.data : Array.isArray(j.models) ? j.models : [];
    const models = arr.map((m: { id?: string; name?: string }) => m.id || m.name).filter(Boolean).sort();
    return { models };
  } catch (e) {
    return { error: (e as Error).message || String(e) };
  }
}

function authHeaders(p: ProviderConfig, key: string | null): Record<string, string> {
  const h: Record<string, string> = { 'content-type': 'application/json' };
  if (p.kind === 'anthropic') {
    if (key) h['x-api-key'] = key;
    h['anthropic-version'] = '2023-06-01';
  } else if (key) {
    h.authorization = 'Bearer ' + key;
  }
  return h;
}

// ------------------------------------------------------------------ tools
//
// One tool shape, three wire formats. A tool is
//   { name, description, properties, required, run(args) }
// where `properties` is plain JSON Schema — which is, happily, exactly what
// Apple's `parameters` already wants, so that adapter needs no conversion.

const toApple = (t: AiTool): TinyAiTool => ({
  name: t.name, description: t.description, parameters: t.properties || {}, run: t.run,
});
const toAnthropic = (t: AiTool) => ({
  name: t.name, description: t.description,
  input_schema: { type: 'object', properties: t.properties || {}, required: t.required || [] },
});
const toOpenAI = (t: AiTool) => ({
  type: 'function',
  function: {
    name: t.name, description: t.description,
    parameters: { type: 'object', properties: t.properties || {}, required: t.required || [] },
  },
});

// A tool that throws is not a failed request — the model is told what went
// wrong and gets to try something else, which is usually the right answer
// (a path that doesn't exist, a write that wasn't approved).
async function callTool(tools: AiTool[], name: string, args: Record<string, any>, onEvent?: (e: AiEvent) => void): Promise<{ text: string; error: boolean }> {
  const t = tools.find((x) => x.name === name);
  if (!t) return { text: 'no such tool: ' + name, error: true };
  if (onEvent) onEvent({ type: 'tool', name, args });
  try {
    const r = await t.run(args || {});
    const text = typeof r === 'string' ? r : JSON.stringify(r ?? null);
    if (onEvent) onEvent({ type: 'tool-done', name, ok: true, result: text });
    return { text, error: false };
  } catch (e) {
    const text = 'error: ' + ((e as Error).message || String(e));
    if (onEvent) onEvent({ type: 'tool-done', name, ok: false, result: text });
    return { text, error: true };
  }
}

// -------------------------------------------------------------------- SSE
//
// Both HTTP providers stream Server-Sent Events, and both send one JSON object
// per `data:` line. Lines are buffered across chunk boundaries because a chunk
// is a network artefact, not a message.
// Each yield is one event of the provider's wire format — network JSON, read
// field by field by the adapter that asked.
async function* sseLines(res: Response, cancel?: Cancel): AsyncGenerator<any, void, undefined> {
  if (!res.body || !res.body.getReader) throw new Error('no streaming body');
  const rd = res.body.getReader();
  let buf = '';
  for (;;) {
    if (cancel && cancel.stopped) { try { await rd.cancel(); } catch { /* gone */ } return; }
    const { done, value } = await rd.read();
    if (done) return;
    buf += dec.decode(value, { stream: true });
    let i;
    while ((i = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, i).replace(/\r$/, '');
      buf = buf.slice(i + 1);
      if (!line.startsWith('data:')) continue;
      const data = line.slice(5).trim();
      if (!data || data === '[DONE]') continue;
      try { yield JSON.parse(data); } catch { /* a keep-alive, or a half-line */ }
    }
  }
}

async function httpError(res: Response): Promise<Error> {
  let detail = '';
  try {
    const t = await res.text();
    try {
      const j = JSON.parse(t);
      detail = j.error?.message || j.message || t;
    } catch { detail = t; }
  } catch { /* nothing to read */ }
  return new Error('HTTP ' + res.status + (detail ? ' — ' + String(detail).slice(0, 400) : ''));
}

// ---------------------------------------------------------------- generate
//
// One call, whichever provider answers. Text arrives through `onDelta` as it
// is produced; tool calls run here and the conversation goes round again until
// the model stops asking (or `maxTurns` says enough — a model in a loop is a
// real thing and it should cost a bounded number of requests, not a bill).
export async function generate(app: TinyApp, {
  provider, model, system, prompt, messages, tools = [],
  maxTurns, temperature, maxTokens = 4096,
  onDelta, onEvent, cancel = {},
}: GenerateOptions = {}): Promise<GenerateResult> {
  const c = await aiConfig(app);
  const id = provider || c.provider;
  const p = await providerConfig(app, id);
  if (!p) throw new Error('unknown provider “' + id + '”');
  const st = await providerState(app, id);
  if (!st.ok) throw new Error(p.label + ': ' + st.why);

  const turns = Math.max(1, maxTurns || c.maxTurns || 8);
  const msgs: ChatMessage[] = messages && messages.length
    ? messages.slice()
    : [{ role: 'user', content: String(prompt || '') }];
  const chosen = String(model || p.model || '').trim();
  const opts: AdapterOptions = { p, model: chosen, system, msgs, tools, turns, temperature, maxTokens,
    onDelta, onEvent, cancel, app };

  const r = p.kind === 'apple' ? await runApple(opts)
    : p.kind === 'anthropic' ? await runAnthropic(opts)
      : await runOpenAI(opts);
  return { ...r, provider: id, providerLabel: p.label, model: chosen };
}

// --------------------------------------------------------------- adapters

// Apple's model runs its own tool loop and hands back the record of what it
// called. It does not stream, so `onDelta` gets one delta: the answer. And a
// warning worth repeating from tinyjs's own docs — the prose CLAIMS tool calls
// it silently skipped. `calls` is what happened; `text` is what it says
// happened. Anything that matters is checked against `calls`.
async function runApple({ app, system, msgs, tools, onDelta, onEvent, cancel }: AdapterOptions): Promise<AdapterResult> {
  const flat = msgs.map((m) => {
    const body = typeof m.content === 'string' ? m.content
      : (m.content || []).map((b) => b.text || '').join('\n');
    return msgs.length === 1 ? body : (m.role === 'user' ? 'User: ' : 'Assistant: ') + body;
  }).join('\n\n');

  // The record is kept HERE rather than read back from tinyjs's, for one
  // reason: this wrapper knows whether the tool actually worked, and tinyjs's
  // `calls` only knows it was invoked. A tool that answered "error: no such
  // file" is not a call that succeeded, and the two are worth telling apart.
  // (It is equally authoritative about what ran — this function is only
  // reached when the model really does call the tool.)
  const calls: ToolCallRecord[] = [];
  const wrapped = tools.map((t) => toApple({
    ...t,
    run: async (args: Record<string, any>) => {
      if (cancel.stopped) throw new Error('stopped');
      const r = await callTool(tools, t.name, args, onEvent);
      calls.push({ name: t.name, arguments: args || {}, result: r.text, ok: !r.error });
      return r.text;
    },
  }));

  // a string without tools, { text, calls } with them
  const out = await (app.macos.ai.generate(flat, {
    instructions: system || undefined,
    tools: wrapped.length ? wrapped : undefined,
  } as { instructions?: string; tools: TinyAiTool[] }) as Promise<string | { text: string; calls: TinyAiCall[] }>);
  const text = typeof out === 'string' ? out : (out.text || '');
  if (cancel.stopped) throw new Error('stopped');
  if (text && onDelta) onDelta(text);
  return { text, calls, usage: null, turns: 1 };
}

// A content block as it streams in: text, or a tool call whose JSON arrives
// in pieces.
interface TextBlock { type: 'text'; text: string }
interface ToolUseBlock { type: 'tool_use'; id: string; name: string; json: string }
type StreamBlock = TextBlock | ToolUseBlock;

async function runAnthropic({ p, app, model, system, msgs, tools, turns, temperature,
  maxTokens, onDelta, onEvent, cancel }: AdapterOptions): Promise<AdapterResult> {
  const key = await getKey(app, p.id);
  let all = '';
  const calls: ToolCallRecord[] = [];
  const usage: Usage = { input: 0, output: 0 };

  for (let turn = 0; turn < turns; turn++) {
    if (cancel.stopped) throw new Error('stopped');
    const body = {
      model, max_tokens: maxTokens, messages: msgs, stream: true,
      ...(system ? { system } : {}),
      ...(temperature !== undefined ? { temperature } : {}),
      ...(tools.length ? { tools: tools.map(toAnthropic) } : {}),
    };
    const res = await fetch(p.base + '/messages', {
      method: 'POST', headers: authHeaders(p, key), body: JSON.stringify(body),
    });
    if (!res.ok) throw await httpError(res);

    // Blocks arrive interleaved: text streams as `text_delta`, a tool call
    // streams as a partial JSON string that only parses once it's whole.
    const blocks: StreamBlock[] = [];
    let stop: string | null = null;
    for await (const ev of sseLines(res, cancel)) {
      if (ev.type === 'content_block_start') {
        blocks[ev.index] = ev.content_block.type === 'tool_use'
          ? { type: 'tool_use', id: ev.content_block.id, name: ev.content_block.name, json: '' }
          : { type: 'text', text: '' };
      } else if (ev.type === 'content_block_delta') {
        const b = blocks[ev.index];
        if (!b) continue;
        if (ev.delta.type === 'text_delta') {
          (b as TextBlock).text += ev.delta.text;
          all += ev.delta.text;
          if (onDelta) onDelta(ev.delta.text);
        } else if (ev.delta.type === 'input_json_delta') {
          (b as ToolUseBlock).json += ev.delta.partial_json;
        }
      } else if (ev.type === 'message_delta') {
        stop = ev.delta?.stop_reason || stop;
        if (ev.usage) usage.output += ev.usage.output_tokens || 0;
      } else if (ev.type === 'message_start' && ev.message?.usage) {
        usage.input += ev.message.usage.input_tokens || 0;
      } else if (ev.type === 'error') {
        throw new Error(ev.error?.message || 'stream error');
      }
    }
    if (cancel.stopped) throw new Error('stopped');

    const wants = blocks.filter((b): b is ToolUseBlock => b && b.type === 'tool_use');
    if (stop !== 'tool_use' || !wants.length) {
      return { text: all, calls, usage, turns: turn + 1 };
    }

    msgs.push({
      role: 'assistant',
      content: blocks.filter(Boolean).map((b) => (b.type === 'text'
        ? { type: 'text', text: b.text }
        : { type: 'tool_use', id: b.id, name: b.name, input: safeJson(b.json) })),
    });
    const results: ContentBlock[] = [];
    for (const b of wants) {
      const args = safeJson(b.json);
      const r = await callTool(tools, b.name, args, onEvent);
      calls.push({ name: b.name, arguments: args, result: r.text, ok: !r.error });
      results.push({ type: 'tool_result', tool_use_id: b.id, content: r.text,
        ...(r.error ? { is_error: true } : {}) });
    }
    msgs.push({ role: 'user', content: results });
    all += '\n';
  }
  return { text: all, calls, usage, turns, capped: true };
}

async function runOpenAI({ p, app, model, system, msgs, tools, turns, temperature,
  maxTokens, onDelta, onEvent, cancel }: AdapterOptions): Promise<AdapterResult> {
  const key = await getKey(app, p.id);
  const conv: ChatMessage[] = system ? [{ role: 'system', content: system }, ...msgs] : msgs.slice();
  let all = '';
  const calls: ToolCallRecord[] = [];
  const usage: Usage = { input: 0, output: 0 };

  for (let turn = 0; turn < turns; turn++) {
    if (cancel.stopped) throw new Error('stopped');
    const body = {
      model, messages: conv, stream: true,
      stream_options: { include_usage: true },
      max_tokens: maxTokens,
      ...(temperature !== undefined ? { temperature } : {}),
      ...(tools.length ? { tools: tools.map(toOpenAI) } : {}),
    };
    const res = await fetch(p.base + '/chat/completions', {
      method: 'POST', headers: authHeaders(p, key), body: JSON.stringify(body),
    });
    if (!res.ok) throw await httpError(res);

    let text = '';
    let finish: string | null = null;
    const wants: { id: string; name: string; json: string }[] = [];                 // by `index`, assembled across deltas
    for await (const ev of sseLines(res, cancel)) {
      if (ev.usage) {
        usage.input += ev.usage.prompt_tokens || 0;
        usage.output += ev.usage.completion_tokens || 0;
      }
      const ch = ev.choices && ev.choices[0];
      if (!ch) continue;
      if (ch.finish_reason) finish = ch.finish_reason;
      const d = ch.delta || {};
      if (d.content) { text += d.content; all += d.content; if (onDelta) onDelta(d.content); }
      for (const tc of d.tool_calls || []) {
        const i = tc.index ?? wants.length;
        const w = wants[i] || (wants[i] = { id: tc.id || 'call_' + i, name: '', json: '' });
        if (tc.id) w.id = tc.id;
        if (tc.function?.name) w.name += tc.function.name;
        if (tc.function?.arguments) w.json += tc.function.arguments;
      }
    }
    if (cancel.stopped) throw new Error('stopped');

    const asked = wants.filter(Boolean).filter((w) => w.name);
    if (!asked.length) return { text: all, calls, usage, turns: turn + 1, finish };

    conv.push({
      role: 'assistant',
      content: text || null,
      tool_calls: asked.map((w) => ({
        id: w.id, type: 'function', function: { name: w.name, arguments: w.json || '{}' },
      })),
    });
    for (const w of asked) {
      const args = safeJson(w.json);
      const r = await callTool(tools, w.name, args, onEvent);
      calls.push({ name: w.name, arguments: args, result: r.text, ok: !r.error });
      conv.push({ role: 'tool', tool_call_id: w.id, content: r.text });
    }
    all += '\n';
  }
  return { text: all, calls, usage, turns, capped: true };
}

// A model that streams half a JSON object and then stops is a real failure
// mode; an empty object is a better tool argument than a thrown parse error,
// because the tool can say what it needed and the model can try again.
function safeJson(s: string): Record<string, any> {
  if (!s) return {};
  try { return JSON.parse(s); } catch { return {}; }
}

// ---------------------------------------------------------------- counting
//
// No pricing table: they go stale and a wrong number is worse than none. What
// the drawer shows is tokens, which are the honest unit — and for a local
// provider it says so instead, because nothing was spent and nothing was sent.
export function usageLine(r: GenerateResult | null | undefined): string {
  if (!r) return '';
  const p = PROVIDERS[r.provider];
  if (p && p.local) return 'on this machine · nothing sent';
  if (!r.usage || (!r.usage.input && !r.usage.output)) return '';
  return r.usage.input + ' in / ' + r.usage.output + ' out tokens';
}

export { enc as _enc, dec as _dec };
