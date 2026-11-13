import { useEffect, useMemo, useRef, useState } from 'react';
import type { Entry, Mood, Prompt } from './types';
import { FOLLOW_UPS, PROMPTS, currentTimeOfDay, pickPrompt } from './prompts';
import { loadEntries, loadRecentPromptIds, newId, rememberPrompt, saveEntries } from './storage';

const MOODS: { value: Mood; emoji: string; label: string }[] = [
  { value: 1, emoji: '😞', label: 'Çok kötü' },
  { value: 2, emoji: '😕', label: 'Kötü' },
  { value: 3, emoji: '😐', label: 'İdare eder' },
  { value: 4, emoji: '🙂', label: 'İyi' },
  { value: 5, emoji: '😄', label: 'Çok iyi' },
];

const SHORT_ANSWER = 60;

type View = { name: 'bugun' } | { name: 'gunluk' } | { name: 'duzenle'; id: string };

function daysBetween(a: Date, b: Date) {
  const start = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  return Math.round((start(b) - start(a)) / 86_400_000);
}

const dayFmt = new Intl.DateTimeFormat('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const timeFmt = new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit' });

export default function App() {
  const [entries, setEntries] = useState<Entry[]>(() => loadEntries());
  const [view, setView] = useState<View>({ name: 'bugun' });

  useEffect(() => saveEntries(entries), [entries]);

  const upsert = (e: Entry) =>
    setEntries((list) => [e, ...list.filter((x) => x.id !== e.id)].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  const remove = (id: string) => setEntries((list) => list.filter((x) => x.id !== id));

  return (
    <div className="shell">
      <main className="content">
        {view.name === 'bugun' && <Today entries={entries} onSave={upsert} />}
        {view.name === 'gunluk' && <Journal entries={entries} onOpen={(id) => setView({ name: 'duzenle', id })} />}
        {view.name === 'duzenle' && (
          <EditEntry
            entry={entries.find((e) => e.id === view.id)}
            onSave={(e) => {
              upsert(e);
              setView({ name: 'gunluk' });
            }}
            onDelete={(id) => {
              remove(id);
              setView({ name: 'gunluk' });
            }}
            onBack={() => setView({ name: 'gunluk' })}
          />
        )}
      </main>
      <nav className="tabbar" aria-label="Gezinme">
        <button className={view.name === 'bugun' ? 'active' : ''} onClick={() => setView({ name: 'bugun' })}>
          <span aria-hidden>✍️</span>Bugün
        </button>
        <button className={view.name !== 'bugun' ? 'active' : ''} onClick={() => setView({ name: 'gunluk' })}>
          <span aria-hidden>📖</span>Günlüğüm
        </button>
      </nav>
    </div>
  );
}

/* ---------------- Bugün ---------------- */

function Today({ entries, onSave }: { entries: Entry[]; onSave: (e: Entry) => void }) {
  const daysSinceLast = entries.length ? daysBetween(new Date(entries[0].createdAt), new Date()) : null;

  const nextPrompt = (excludeId?: string) =>
    pickPrompt({ recentIds: loadRecentPromptIds(), daysSinceLastEntry: daysSinceLast, excludeId });

  const [prompt, setPrompt] = useState<Prompt | null>(() => nextPrompt());
  const [body, setBody] = useState('');
  const [mood, setMood] = useState<Mood | undefined>();
  const [followUp, setFollowUp] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const todayCount = entries.filter((e) => daysBetween(new Date(e.createdAt), new Date()) === 0).length;
  const greeting = currentTimeOfDay() === 'sabah' ? 'Günaydın' : 'İyi akşamlar';

  const reset = () => {
    setPrompt(nextPrompt(prompt?.id));
    setBody('');
    setMood(undefined);
    setFollowUp(null);
    setSaved(false);
  };

  const commit = () => {
    const now = new Date().toISOString();
    onSave({
      id: newId(),
      createdAt: now,
      updatedAt: now,
      promptId: prompt?.id,
      promptText: prompt?.text,
      body: body.trim(),
      mood,
    });
    if (prompt) rememberPrompt(prompt.id);
    setSaved(true);
  };

  const handleSave = () => {
    if (!body.trim()) return;
    if (body.trim().length < SHORT_ANSWER && followUp === null) {
      setFollowUp(FOLLOW_UPS[Math.floor(Math.random() * FOLLOW_UPS.length)]);
      return;
    }
    commit();
  };

  if (saved) {
    return (
      <section className="today">
        <div className="saved card">
          <div className="saved-icon" aria-hidden>🌿</div>
          <h2>Kaydedildi</h2>
          <p className="muted">Bugün {todayCount} kayıt yazdın. Yazmak istediğin başka bir şey varsa yeni bir soru seni bekliyor.</p>
          <button className="primary" onClick={reset}>Bir soru daha</button>
        </div>
      </section>
    );
  }

  return (
    <section className="today">
      <header className="today-head">
        <p className="muted">{dayFmt.format(new Date())}</p>
        <h1>{greeting}</h1>
        {daysSinceLast !== null && daysSinceLast >= 3 && (
          <p className="muted small">Tekrar hoş geldin. Küçük bir soruyla başlayalım.</p>
        )}
      </header>

      {prompt ? (
        <div className="card prompt-card">
          <p className="prompt-text">{prompt.text}</p>
          <div className="prompt-actions">
            <button className="ghost" onClick={() => setPrompt(nextPrompt(prompt.id))}>↻ Başka soru</button>
            <button className="ghost" onClick={() => setPrompt(null)}>Serbest yaz</button>
          </div>
        </div>
      ) : (
        <div className="card prompt-card free">
          <p className="prompt-text">Aklından ne geçiyorsa…</p>
          <div className="prompt-actions">
            <button className="ghost" onClick={() => setPrompt(nextPrompt())}>Bana bir soru sor</button>
          </div>
        </div>
      )}

      <textarea
        ref={textRef}
        className="writer"
        placeholder="Tek bir cümle bile yeter…"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={7}
      />

      {followUp && (
        <div className="followup card">
          <p>
            Kısa ve güzel. İstersen biraz daha: <strong>{followUp}</strong>
          </p>
          <div className="prompt-actions">
            <button
              className="ghost"
              onClick={() => {
                setBody((b) => b.trimEnd() + '\n\n');
                textRef.current?.focus();
              }}
            >
              Devam edeyim
            </button>
            <button className="ghost" onClick={commit}>Böyle kalsın</button>
          </div>
        </div>
      )}

      <MoodPicker value={mood} onChange={setMood} />

      <button className="primary" disabled={!body.trim()} onClick={handleSave}>
        Kaydet
      </button>
    </section>
  );
}

function MoodPicker({ value, onChange }: { value?: Mood; onChange: (m: Mood | undefined) => void }) {
  return (
    <div className="moods" role="radiogroup" aria-label="Ruh hali">
      <span className="muted small">Bugün nasılsın?</span>
      <div className="mood-row">
        {MOODS.map((m) => (
          <button
            key={m.value}
            role="radio"
            aria-checked={value === m.value}
            aria-label={m.label}
            title={m.label}
            className={`mood ${value === m.value ? 'selected' : ''}`}
            onClick={() => onChange(value === m.value ? undefined : m.value)}
          >
            {m.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Günlüğüm ---------------- */

function Journal({ entries, onOpen }: { entries: Entry[]; onOpen: (id: string) => void }) {
  const groups = useMemo(() => {
    const map = new Map<string, Entry[]>();
    for (const e of entries) {
      const key = dayFmt.format(new Date(e.createdAt));
      map.set(key, [...(map.get(key) ?? []), e]);
    }
    return [...map.entries()];
  }, [entries]);

  if (entries.length === 0) {
    return (
      <section className="empty">
        <div aria-hidden className="saved-icon">📖</div>
        <h2>Günlüğün henüz boş</h2>
        <p className="muted">"Bugün" sekmesindeki soruyla ilk sayfanı yazabilirsin.</p>
      </section>
    );
  }

  return (
    <section className="journal">
      <h1>Günlüğüm</h1>
      <p className="muted small">{entries.length} kayıt · {groups.length} gün</p>
      {groups.map(([day, list]) => (
        <div key={day} className="day-group">
          <h3 className="day-title">{day}</h3>
          {list.map((e) => (
            <button key={e.id} className="card entry" onClick={() => onOpen(e.id)}>
              <div className="entry-meta">
                <span>{timeFmt.format(new Date(e.createdAt))}</span>
                {e.mood && <span aria-label={MOODS[e.mood - 1].label}>{MOODS[e.mood - 1].emoji}</span>}
              </div>
              {e.promptText && <p className="entry-prompt">{e.promptText}</p>}
              <p className="entry-body">{e.body}</p>
            </button>
          ))}
        </div>
      ))}
    </section>
  );
}

/* ---------------- Düzenle ---------------- */

function EditEntry({
  entry,
  onSave,
  onDelete,
  onBack,
}: {
  entry?: Entry;
  onSave: (e: Entry) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}) {
  const [body, setBody] = useState(entry?.body ?? '');
  const [mood, setMood] = useState<Mood | undefined>(entry?.mood);

  if (!entry) {
    return (
      <section>
        <button className="ghost" onClick={onBack}>← Geri</button>
        <p className="muted">Kayıt bulunamadı.</p>
      </section>
    );
  }

  const promptText = entry.promptText ?? PROMPTS.find((p) => p.id === entry.promptId)?.text;

  return (
    <section className="edit">
      <button className="ghost back" onClick={onBack}>← Günlüğüm</button>
      <p className="muted">
        {dayFmt.format(new Date(entry.createdAt))} · {timeFmt.format(new Date(entry.createdAt))}
      </p>
      {promptText && (
        <div className="card prompt-card">
          <p className="prompt-text">{promptText}</p>
        </div>
      )}
      <textarea className="writer" value={body} onChange={(e) => setBody(e.target.value)} rows={10} />
      <MoodPicker value={mood} onChange={setMood} />
      <div className="edit-actions">
        <button
          className="danger"
          onClick={() => {
            if (confirm('Bu kaydı silmek istediğine emin misin?')) onDelete(entry.id);
          }}
        >
          Sil
        </button>
        <button
          className="primary"
          disabled={!body.trim()}
          onClick={() => onSave({ ...entry, body: body.trim(), mood, updatedAt: new Date().toISOString() })}
        >
          Kaydet
        </button>
      </div>
    </section>
  );
}
