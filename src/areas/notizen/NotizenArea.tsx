import { useState } from 'react'
import AreaShell, { type Lesson } from '../../components/AreaShell'
import { ProgressBar } from '../../components/ui'
import { addNote, deleteNote, resolveNote, useStore, type Note } from '../../lib/store'
import { pick } from '../../lib/util'
import { useLang, type T } from '../../lib/i18n'

const o = (de: string, en: string): T => ({ de, en })

const LESSONS: Lesson[] = [
  {
    id: 'notiz-warum', title: o('Warum Feldnotizen?', 'Why field notes?'),
    paragraphs: [
      o('Ohne Rückmeldung lernst du nichts. Wer seine Einschätzungen nie überprüft, erinnert sich an die Treffer und vergisst die Fehler – genau wie das Publikum eines Hellsehers.', 'Without feedback you learn nothing. If you never check your reads, you remember the hits and forget the misses – just like a psychic’s audience.'),
      o('Feldnotizen sind dein ehrlicher Spiegel: Du schreibst eine Einschätzung auf, BEVOR du die Auflösung kennst, und markierst später, ob sie gestimmt hat. Über Wochen siehst du, wie gut du wirklich bist – und wo du dich überschätzt.', 'Field notes are your honest mirror: you write down a read BEFORE you know the answer and later mark whether it was right. Over weeks you see how good you really are – and where you overrate yourself.'),
    ],
  },
  {
    id: 'notiz-gut', title: o('Eine gute Einschätzung schreiben', 'Writing a good read'),
    paragraphs: [
      o('Spezifisch: „Sie ist Lehrerin“ statt „Sie arbeitet mit Menschen“. Nur spezifische Aussagen können falsch sein – und nur dann lernst du etwas.', 'Specific: “She is a teacher” rather than “She works with people”. Only specific statements can be wrong – and only then do you learn.'),
      o('Überprüfbar: Wähle Situationen, in denen du die Auflösung später erfährst (Kollegen, Freunde, Bekannte, ein Gespräch, in dem du nachfragen kannst).', 'Checkable: choose situations where you’ll learn the answer later (colleagues, friends, acquaintances, a conversation where you can ask).'),
      o('Begründet: Notiere die Hinweise, auf die du dich stützt. So erkennst du später, welche Hinweise dich gut und welche dich in die Irre geführt haben.', 'Reasoned: note the clues you rely on. Later you’ll see which clues led you well and which misled you.'),
      o('Mit Sicherheit: Wie sicher bist du – 50, 70, 90 %? Wenn deine 90-%-Einschätzungen nur in 60 % stimmen, bist du überkonfident.', 'With confidence: how sure are you – 50, 70, 90 %? If your 90 % reads are only right 60 % of the time, you are overconfident.'),
    ],
  },
  {
    id: 'notiz-ethik', title: o('Respekt & Privatsphäre', 'Respect & privacy'),
    paragraphs: [
      o('Beobachte, ohne zu stören. Stell niemanden bloß, und konfrontiere Menschen nicht mit deinen Vermutungen über private Themen wie Gesundheit, Beziehungen oder Finanzen.', 'Observe without intruding. Don’t expose anyone, and don’t confront people with your guesses about private matters like health, relationships or money.'),
      o('Schreib keine vollständigen Namen in deine Notizen. Die Notizen bleiben nur auf deinem Gerät, aber Gewohnheiten zählen.', 'Don’t write full names in your notes. The notes stay on your device only, but habits matter.'),
    ],
  },
]

const CATS: { id: string; name: T }[] = [
  { id: 'emotion', name: o('Gefühl', 'Emotion') },
  { id: 'beruf', name: o('Beruf / Hobby', 'Job / hobby') },
  { id: 'absicht', name: o('Absicht / nächster Schritt', 'Intention / next move') },
  { id: 'beziehung', name: o('Beziehung zwischen Personen', 'Relationship between people') },
  { id: 'wahrheit', name: o('Wahrheit einer Aussage', 'Truth of a statement') },
  { id: 'sonstiges', name: o('Sonstiges', 'Other') },
]

const MISSIONS: { text: T; cat: string }[] = [
  { text: o('Schätze die Stimmung einer Kollegin, bevor sie etwas sagt – frag dann, wie es ihr geht.', 'Guess a colleague’s mood before she says anything – then ask how she is.'), cat: 'emotion' },
  { text: o('Rate, welches Getränk die Person vor dir an der Kasse bestellt.', 'Guess what drink the person ahead of you in the queue will order.'), cat: 'absicht' },
  { text: o('Rate bei einem neuen Bekannten den Beruf – und frag später nach.', 'Guess a new acquaintance’s job – and ask later.'), cat: 'beruf' },
  { text: o('Schätze ein, ob zwei Menschen im Café sich gut kennen oder ein erstes Treffen haben.', 'Judge whether two people in a café know each other well or are meeting for the first time.'), cat: 'beziehung' },
  { text: o('Sag voraus, wie ein Freund auf eine Nachricht reagieren wird.', 'Predict how a friend will react to a piece of news.'), cat: 'emotion' },
  { text: o('Rate, ob jemand im Meeting zustimmen oder widersprechen wird – bevor er spricht.', 'Guess whether someone in a meeting will agree or object – before they speak.'), cat: 'absicht' },
  { text: o('Schätze, ob ein Familienmitglied heute gut oder schlecht geschlafen hat.', 'Guess whether a family member slept well or badly today.'), cat: 'emotion' },
  { text: o('Rate ein Hobby einer Person anhand von Kleidung oder Gegenständen.', 'Guess someone’s hobby from their clothes or belongings.'), cat: 'beruf' },
  { text: o('Sag voraus, welches Gericht dein Gegenüber im Restaurant wählt.', 'Predict which dish your companion will choose at a restaurant.'), cat: 'absicht' },
  { text: o('Schätze ein, ob eine Erzählung ausgeschmückt ist – und frag freundlich nach Details.', 'Judge whether a story is embellished – and kindly ask for details.'), cat: 'wahrheit' },
  { text: o('Rate, ob jemand gerade vom Sport, von der Arbeit oder von zu Hause kommt.', 'Guess whether someone just came from sport, work or home.'), cat: 'sonstiges' },
  { text: o('Schätze die Beziehung zweier Menschen im Zug (Geschwister, Paar, Kollegen …).', 'Guess the relationship of two people on a train (siblings, couple, colleagues …).'), cat: 'beziehung' },
  { text: o('Sag voraus, wer im Freundeskreis als Erstes zu spät kommt.', 'Predict which friend will be late first.'), cat: 'absicht' },
  { text: o('Rate die Baseline: Wie viel gestikuliert ein Kollege normalerweise? Prüf es eine Woche lang.', 'Guess a baseline: how much does a colleague usually gesture? Check it for a week.'), cat: 'sonstiges' },
  { text: o('Schätze ein, ob jemand ein Kompliment wirklich freut oder nur höflich annimmt.', 'Judge whether a compliment genuinely pleases someone or is just politely accepted.'), cat: 'emotion' },
  { text: o('Rate, ob ein Verkäufer gleich ein Zusatzangebot machen wird.', 'Guess whether a salesperson is about to offer an upsell.'), cat: 'absicht' },
  { text: o('Schätze den Herkunftsort eines Gesprächspartners am Dialekt.', 'Guess where someone is from by their accent.'), cat: 'sonstiges' },
  { text: o('Sag voraus, ob ein Freund eine Einladung annimmt.', 'Predict whether a friend will accept an invitation.'), cat: 'absicht' },
  { text: o('Rate, ob jemand Linkshänder ist, bevor du ihn schreiben siehst.', 'Guess whether someone is left-handed before seeing them write.'), cat: 'sonstiges' },
  { text: o('Schätze, ob ein Kind gleich weint, lacht oder ruhig bleibt.', 'Guess whether a child is about to cry, laugh or stay calm.'), cat: 'emotion' },
  { text: o('Rate das ungefähre Alter einer Person – und prüfe es, wenn es sich natürlich ergibt.', 'Guess someone’s approximate age – and check it when it comes up naturally.'), cat: 'sonstiges' },
  { text: o('Schätze ein, ob jemand in einer Diskussion nachgeben wird.', 'Judge whether someone will give in during a discussion.'), cat: 'absicht' },
  { text: o('Rate, ob eine Ausrede für eine Verspätung stimmt (ohne jemanden bloßzustellen).', 'Guess whether an excuse for being late is true (without exposing anyone).'), cat: 'wahrheit' },
  { text: o('Sag die Laune deines Chefs nach einem Termin voraus – an Gang und Gesicht.', 'Predict your boss’s mood after a meeting – from their walk and face.'), cat: 'emotion' },
]

const catName = (id: string) => CATS.find((c) => c.id === id)?.name ?? CATS[5].name

function NewNote({ onSaved }: { onSaved: () => void }) {
  const { t } = useLang()
  const [situation, setSituation] = useState('')
  const [guess, setGuess] = useState('')
  const [confidence, setConfidence] = useState(70)
  const [category, setCategory] = useState('emotion')
  const mission = () => { const m = pick(MISSIONS); setSituation(t(m.text)); setCategory(m.cat) }
  const field = 'w-full rounded-xl border border-ink-600 bg-ink-900 px-3 py-2 text-ink-200 focus:border-gold-500 focus:outline-none'
  return (
    <div className="card space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-serif text-xl text-gold-300">{t('Neue Einschätzung', 'New read')}</h3>
        <button className="chip hover:text-gold-300" onClick={mission}>🎲 {t('Aufgabe vorschlagen', 'Suggest a mission')}</button>
      </div>
      <label className="block text-sm"><span className="text-ink-400">{t('Situation', 'Situation')}</span>
        <textarea rows={2} value={situation} onChange={(e) => setSituation(e.target.value)} className={field} placeholder={t('z. B. Neue Kollegin, erster Tag, Kantine', 'e.g. new colleague, first day, canteen')} /></label>
      <label className="block text-sm"><span className="text-ink-400">{t('Meine Einschätzung (spezifisch & prüfbar) und die Hinweise dafür', 'My read (specific & checkable) and the clues behind it')}</span>
        <textarea rows={3} value={guess} onChange={(e) => setGuess(e.target.value)} className={field} placeholder={t('z. B. Sie war früher Krankenschwester – kurze Nägel, bequeme Schuhe, fragt sofort nach Allergien', 'e.g. She used to be a nurse – short nails, comfortable shoes, asked about allergies right away')} /></label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm"><span className="text-ink-400">{t('Kategorie', 'Category')}</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={field}>
            {CATS.map((c) => <option key={c.id} value={c.id}>{t(c.name)}</option>)}
          </select></label>
        <label className="block text-sm"><span className="text-ink-400">{t('Wie sicher?', 'How sure?')} {confidence} %</span>
          <input type="range" min={50} max={100} step={10} value={confidence} onChange={(e) => setConfidence(Number(e.target.value))} className="mt-3 w-full accent-[#c9a24a]" /></label>
      </div>
      <button className="btn-gold w-full" disabled={!guess.trim()} onClick={() => { addNote({ situation, guess, confidence, category }); setSituation(''); setGuess(''); onSaved() }}>{t('Speichern', 'Save')}</button>
    </div>
  )
}

function NoteCard({ n }: { n: Note }) {
  const { t, lang } = useLang()
  const btn = (k: NonNullable<Note['outcome']>, label: string, cls: string) => (
    <button onClick={() => resolveNote(n.id, n.outcome === k ? null : k)} className={`rounded-lg border px-3 py-1.5 text-xs ${n.outcome === k ? cls : 'border-ink-600 text-ink-400'}`}>{label}</button>
  )
  return (
    <div className="card space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-ink-400">
        <span>{new Date(n.t).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-GB')} · {t(catName(n.category))} · {n.confidence} %</span>
        <button onClick={() => { if (confirm(t('Notiz löschen?', 'Delete note?'))) deleteNote(n.id) }} className="hover:text-rose-400">{t('löschen', 'delete')}</button>
      </div>
      {n.situation && <p className="text-sm text-ink-400">{n.situation}</p>}
      <p className="whitespace-pre-line">{n.guess}</p>
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs text-ink-400">{t('Hat es gestimmt?', 'Was it right?')}</span>
        {btn('ja', t('Ja', 'Yes'), 'border-emerald-500 bg-emerald-500/15 text-emerald-300')}
        {btn('teils', t('Teilweise', 'Partly'), 'border-gold-500 bg-gold-500/15 text-gold-300')}
        {btn('nein', t('Nein', 'No'), 'border-rose-500 bg-rose-500/15 text-rose-300')}
      </div>
    </div>
  )
}

function Journal() {
  const { t } = useLang()
  const { notes } = useStore()
  const [filter, setFilter] = useState<'offen' | 'alle'>('offen')
  const list = filter === 'offen' ? notes.filter((n) => !n.outcome) : notes
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
      <NewNote onSaved={() => setFilter('offen')} />
      <div className="space-y-3">
        <div className="flex gap-2">
          {(['offen', 'alle'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`rounded-lg border px-3 py-1.5 text-sm ${filter === f ? 'border-gold-500 text-gold-300' : 'border-ink-600 text-ink-400'}`}>
              {f === 'offen' ? `${t('Offen', 'Open')} (${notes.filter((n) => !n.outcome).length})` : `${t('Alle', 'All')} (${notes.length})`}
            </button>
          ))}
        </div>
        {list.length === 0 && <div className="card text-sm text-ink-400">{t('Noch keine Einträge. Schreib deine erste Einschätzung über eine echte Situation.', 'No entries yet. Write your first read about a real situation.')}</div>}
        {list.map((n) => <NoteCard key={n.id} n={n} />)}
      </div>
    </div>
  )
}

function NoteStats() {
  const { t } = useLang()
  const { notes } = useStore()
  const done = notes.filter((n) => n.outcome)
  const score = (n: Note) => (n.outcome === 'ja' ? 1 : n.outcome === 'teils' ? 0.5 : 0)
  const rate = done.length ? done.reduce((s, n) => s + score(n), 0) / done.length : 0
  if (!done.length) return <div className="card max-w-xl text-ink-400">{t('Sobald du Einträge als richtig/falsch markiert hast, siehst du hier deine Trefferquote.', 'Once you have marked entries as right or wrong, your hit rate appears here.')}</div>
  return (
    <div className="max-w-2xl space-y-4">
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="card"><div className="font-serif text-3xl text-gold-300">{Math.round(rate * 100)} %</div><div className="text-xs text-ink-400">{t('Trefferquote', 'Hit rate')}</div></div>
        <div className="card"><div className="font-serif text-3xl text-gold-300">{done.length}</div><div className="text-xs text-ink-400">{t('aufgelöst', 'resolved')}</div></div>
        <div className="card"><div className="font-serif text-3xl text-gold-300">{notes.length - done.length}</div><div className="text-xs text-ink-400">{t('offen', 'open')}</div></div>
      </div>
      <section className="card space-y-2">
        <h3 className="mb-1 font-serif text-xl text-gold-300">{t('Nach Kategorie', 'By category')}</h3>
        {CATS.map((c) => {
          const rs = done.filter((n) => n.category === c.id)
          if (!rs.length) return null
          const r = rs.reduce((s, n) => s + score(n), 0) / rs.length
          return <div key={c.id} className="flex items-center gap-3 text-sm"><span className="w-48 truncate">{t(c.name)}</span><ProgressBar value={r} /><span className="w-20 text-right text-ink-400">{Math.round(r * 100)} % · {rs.length}</span></div>
        })}
      </section>
      <section className="card space-y-2">
        <h3 className="mb-1 font-serif text-xl text-gold-300">{t('Kalibrierung', 'Calibration')}</h3>
        <p className="text-xs text-ink-400">{t('Stimmen deine 90-%-Einschätzungen auch in etwa 90 % der Fälle? Liegt der Balken deutlich unter der Sicherheit, bist du überkonfident.', 'Are your 90 % reads right about 90 % of the time? If the bar is clearly below the confidence, you are overconfident.')}</p>
        {[50, 60, 70, 80, 90, 100].map((c) => {
          const rs = done.filter((n) => n.confidence === c)
          if (!rs.length) return null
          const r = rs.reduce((s, n) => s + score(n), 0) / rs.length
          return <div key={c} className="flex items-center gap-3 text-sm"><span className="w-28">{t('Sicherheit', 'Confidence')} {c} %</span><ProgressBar value={r} /><span className="w-20 text-right text-ink-400">{Math.round(r * 100)} % · {rs.length}</span></div>
        })}
      </section>
    </div>
  )
}

function MissionList() {
  const { t } = useLang()
  return (
    <ol className="grid max-w-3xl gap-2 sm:grid-cols-2">
      {MISSIONS.map((m, i) => (
        <li key={i} className="card py-3 text-sm"><span className="mr-2 font-serif text-gold-500">{i + 1}.</span>{t(m.text)}<div className="mt-1 text-xs text-ink-400">{t(catName(m.cat))}</div></li>
      ))}
    </ol>
  )
}

export default function NotizenArea() {
  return (
    <AreaShell
      area="notizen"
      lessons={LESSONS}
      exercises={[
        { id: 'tagebuch', title: o('Tagebuch', 'Journal'), text: o('Einschätzung über eine echte Situation eintragen, später auflösen.', 'Record a read about a real situation, resolve it later.'), badge: o('dein Logbuch', 'your log'), render: () => <Journal /> },
        { id: 'statistik', title: o('Trefferquote', 'Hit rate'), text: o('Wie oft lagst du richtig – nach Kategorie und Sicherheit.', 'How often you were right – by category and confidence.'), badge: o('Statistik', 'stats'), render: () => <NoteStats /> },
        { id: 'missionen', title: o('Missionen', 'Missions'), text: o('24 Ideen für Beobachtungsaufgaben im Alltag.', '24 ideas for everyday observation tasks.'), badge: o(`${MISSIONS.length} Aufgaben`, `${MISSIONS.length} tasks`), render: () => <MissionList /> },
      ]}
    />
  )
}
