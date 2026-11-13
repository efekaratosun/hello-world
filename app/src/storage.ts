import type { Entry } from './types';

// MVP: veriler yalnızca bu cihazda, tarayıcının yerel deposunda tutulur.
// İleride IndexedDB / şifreli bulut eşitlemesine geçmek için tek erişim noktası burası.

const ENTRIES_KEY = 'gunluk.entries.v1';
const RECENT_PROMPTS_KEY = 'gunluk.recentPrompts.v1';
const RECENT_LIMIT = 30;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // depolama dolu ya da engelli; sessizce geç
  }
}

export function loadEntries(): Entry[] {
  return read<Entry[]>(ENTRIES_KEY, []).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function saveEntries(entries: Entry[]) {
  write(ENTRIES_KEY, entries);
}

export function loadRecentPromptIds(): string[] {
  return read<string[]>(RECENT_PROMPTS_KEY, []);
}

export function rememberPrompt(id: string) {
  const list = [id, ...loadRecentPromptIds().filter((x) => x !== id)].slice(0, RECENT_LIMIT);
  write(RECENT_PROMPTS_KEY, list);
}

export function newId() {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
