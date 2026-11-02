// Globals the page gets from outside the bundle: the vendored libraries in
// public/vendor (loaded on demand with a <script>) and WebKit's prefixed
// speech recognizer.

interface Window {
  /** public/vendor/temml.min.js — LaTeX → MathML */
  temml?: {
    renderToString(tex: string, opts?: { displayMode?: boolean; throwOnError?: boolean }): string;
  };
  /** public/vendor/mermaid.min.js */
  mermaid?: {
    initialize(config: Record<string, unknown>): void;
    render(id: string, text: string): Promise<{ svg: string }>;
  };
  /** public/vendor/emoji-github.js — the GitHub shortcode set */
  EMOJI_CODES_GITHUB?: Record<string, string>;
  SpeechRecognition?: new () => SpeechRecognitionLike;
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
}

/** The part of the Web Speech API's recognizer that speech.ts drives. */
interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: any) => void) | null;
  onerror: ((e: any) => void) | null;
  onend: (() => void) | null;
  onstart?: (() => void) | null;
}
