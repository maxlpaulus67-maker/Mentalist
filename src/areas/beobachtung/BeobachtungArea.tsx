import { useEffect, useMemo, useRef, useState } from 'react'
import AreaShell, { type Lesson } from '../../components/AreaShell'
import { ProgressBar } from '../../components/ui'
import { record, setSetting, useStore } from '../../lib/store'
import { shuffle } from '../../lib/util'
import { useLang, type T } from '../../lib/i18n'
import { SceneSvg, makeScene, questionsFor } from './Scene'

const o = (de: string, en: string): T => ({ de, en })

const LESSONS: Lesson[] = [
  {
    id: 'beob-sehen', title: o('Sehen ist nicht Beobachten', 'Seeing is not observing'),
    paragraphs: [
      o('Wir sehen ständig, aber wir beobachten selten. Wie viele Stufen hat die Treppe zu deiner Wohnung? Welche Farbe hat das Auto deines Nachbarn? Die meisten wissen es nicht – obwohl sie es hundertfach gesehen haben.', 'We see constantly, but we rarely observe. How many steps lead up to your home? What colour is your neighbour’s car? Most people don’t know – although they have seen it a hundred times.'),
      o('Unser Gehirn filtert alles, was es für unwichtig hält. Beobachten heißt, diesen Filter bewusst zu öffnen: hinsehen mit der Absicht, sich zu erinnern.', 'Our brain filters out everything it deems unimportant. Observing means deliberately opening that filter: looking with the intention to remember.'),
      o('Unaufmerksamkeitsblindheit: In bekannten Experimenten übersahen viele Menschen einen Gorilla, der durch ein Basketballspiel lief, weil sie Pässe zählen sollten. Aufmerksamkeit ist begrenzt – setz sie bewusst ein.', 'Inattentional blindness: in well-known experiments many people missed a gorilla walking through a basketball game because they were counting passes. Attention is limited – use it deliberately.'),
    ],
  },
  {
    id: 'beob-scan', title: o('Systematisch scannen', 'Scanning systematically'),
    paragraphs: [
      o('Wer wahllos herumschaut, erinnert sich an Zufälliges. Wer systematisch vorgeht, erinnert sich an fast alles. Eine einfache Methode: im Uhrzeigersinn von links oben nach rechts unten, oder von groß nach klein.', 'Looking around at random gives you random memories. Working systematically lets you remember almost everything. A simple method: clockwise from top left to bottom right, or from large to small.'),
      o('Stelle dir beim Scannen die typischen Fragen selbst: Wie viele? Welche Farbe? Wer trägt was? Was ist an/aus, offen/zu? Was hält jemand in der Hand?', 'Ask yourself the typical questions while scanning: how many? what colour? who wears what? what is on/off, open/closed? what is someone holding?'),
      o('Menschen zuerst: Personen sind meist das Wichtigste. Gesicht, Kleidung, Hände, Gegenstände, Haltung.', 'People first: people are usually what matters most. Face, clothes, hands, objects, posture.'),
    ],
  },
  {
    id: 'beob-merken', title: o('Beobachtungen festhalten', 'Holding on to observations'),
    paragraphs: [
      o('Sprich innerlich mit: „Rote Tasse, drei Bücher, Uhr auf vier.“ Wörter verankern Bilder.', 'Narrate silently: “Red mug, three books, clock at four.” Words anchor images.'),
      o('Verknüpfe Details: „Die Frau mit der Brille hält die Zeitung – Brille und Zeitung, sie liest.“ Geschichten merkt man sich besser als Einzelteile.', 'Link details: “The woman with glasses holds the newspaper – glasses and paper, she’s reading.” Stories are easier to remember than isolated parts.'),
      o('Übe im Alltag: Schließe nach dem Verlassen eines Raumes kurz die Augen und rekonstruiere ihn. Prüfe beim nächsten Mal, was du vergessen hast.', 'Practise in daily life: after leaving a room, close your eyes briefly and reconstruct it. Check next time what you forgot.'),
    ],
  },
]

const LEVELS = [
  { time: 30, qs: 3 }, { time: 25, qs: 4 }, { time: 20, qs: 5 }, { time: 15, qs: 6 }, { time: 10, qs: 7 },
]

export function SceneDrill({ daily, onDone }: { daily?: boolean; onDone?: () => void }) {
  const { t } = useLang()
  const { settings } = useStore()
  const level = (settings['beob.level'] as number) ?? 1
  const [phase, setPhase] = useState<'setup' | 'look' | 'ask' | 'result'>(daily ? 'look' : 'setup')
  const [seed, setSeed] = useState(0)
  const L = LEVELS[level - 1]
  const scene = useMemo(() => makeScene(level), [seed, level])
  const qs = useMemo(() => shuffle(questionsFor(scene)).slice(0, L.qs), [scene, L.qs])
  const [left, setLeft] = useState(L.time)
  const [i, setI] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const at = useRef(0)

  useEffect(() => {
    if (phase !== 'look') return
    setLeft(L.time)
    const start = Date.now()
    const id = setInterval(() => {
      const r = L.time - Math.floor((Date.now() - start) / 1000)
      setLeft(r)
      if (r <= 0) { clearInterval(id); setPhase('ask'); at.current = performance.now() }
    }, 250)
    return () => clearInterval(id)
  }, [phase, L.time, seed])

  const start = () => { setSeed(seed + 1); setI(0); setAnswers([]); setPhase('look') }

  if (phase === 'setup') {
    return (
      <div className="card max-w-xl space-y-4">
        <p className="text-sm text-ink-400">{t('Eine Szene ist kurz sichtbar. Danach beantwortest du Detailfragen. Höhere Stufen: weniger Zeit, mehr Personen, mehr Fragen.', 'A scene is visible briefly. Then you answer detail questions. Higher levels: less time, more people, more questions.')}</p>
        <div className="grid grid-cols-5 gap-2">
          {LEVELS.map((l, k) => (
            <button key={k} onClick={() => setSetting('beob.level', k + 1)} className={`rounded-xl border px-2 py-3 text-center ${level === k + 1 ? 'border-gold-500 bg-gold-500/15' : 'border-ink-600'}`}>
              <div className="font-serif text-2xl text-gold-300">{k + 1}</div>
              <div className="text-[11px] text-ink-400">{l.time}s · {l.qs} {t('Fr.', 'Q')}</div>
            </button>
          ))}
        </div>
        <button className="btn-gold w-full" onClick={start}>{t('Szene zeigen', 'Show scene')}</button>
      </div>
    )
  }

  if (phase === 'look') {
    return (
      <div className="max-w-3xl space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink-400">{t('Präge dir alles ein …', 'Memorise everything …')}</span>
          <span className="font-serif text-2xl text-gold-300">{Math.max(0, left)}s</span>
        </div>
        <ProgressBar value={left / L.time} />
        <SceneSvg s={scene} />
        <button className="btn-ghost w-full" onClick={() => { setPhase('ask'); at.current = performance.now() }}>{t('Bereit – Fragen stellen', 'Ready – ask me')}</button>
      </div>
    )
  }

  if (phase === 'ask') {
    const q = qs[i]
    const choose = (k: number) => {
      const ok = k === q.answer
      record({ area: 'beobachtung', ex: 'szene', ok, ms: Math.round(performance.now() - at.current), d: q.key })
      const next = [...answers, k]
      setAnswers(next)
      at.current = performance.now()
      if (i + 1 >= qs.length) setPhase('result'); else setI(i + 1)
    }
    return (
      <div className="card max-w-xl">
        <div className="mb-3 flex justify-between text-xs text-ink-400"><span>{t('Frage', 'Question')} {i + 1} / {qs.length}</span><span>{t('Stufe', 'Level')} {level}</span></div>
        <ProgressBar value={i / qs.length} className="mb-4" />
        <p className="mb-4 text-lg">{t(q.q)}</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {q.options.map((op, k) => <button key={k} onClick={() => choose(k)} className="rounded-xl border border-ink-600 px-4 py-3 text-left hover:border-gold-500">{t(op)}</button>)}
        </div>
      </div>
    )
  }

  const score = qs.filter((q, k) => answers[k] === q.answer).length
  return (
    <div className="max-w-3xl space-y-4">
      <div className="card text-center">
        <div className="font-serif text-4xl text-gold-300">{score} / {qs.length}</div>
        <p className="text-ink-400">{score === qs.length && level < 5 && !daily ? t('Perfekt! Probier die nächste Stufe.', 'Perfect! Try the next level.') : t('richtig erinnert', 'remembered correctly')}</p>
      </div>
      <SceneSvg s={scene} />
      <div className="card space-y-2 text-sm">
        {qs.map((q, k) => (
          <div key={k} className="flex flex-wrap justify-between gap-2 border-b border-ink-700 pb-2 last:border-0">
            <span>{t(q.q)}</span>
            <span className={answers[k] === q.answer ? 'text-emerald-400' : 'text-rose-400'}>
              {t(q.options[q.answer])}{answers[k] !== q.answer && <span className="text-ink-400"> ({t('du', 'you')}: {t(q.options[answers[k]])})</span>}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {daily ? <button className="btn-gold" onClick={onDone}>{t('Weiter', 'Next')}</button> : <>
          <button className="btn-gold" onClick={start}>{t('Neue Szene', 'New scene')}</button>
          {score === qs.length && level < 5 && <button className="btn-ghost" onClick={() => { setSetting('beob.level', level + 1); setPhase('setup') }}>{t('Stufe erhöhen', 'Level up')}</button>}
          <button className="btn-ghost" onClick={() => setPhase('setup')}>{t('Stufe wählen', 'Choose level')}</button>
        </>}
      </div>
    </div>
  )
}

export default function BeobachtungArea() {
  return (
    <AreaShell
      area="beobachtung"
      lessons={LESSONS}
      exercises={[
        { id: 'szene', title: o('Szenen-Training', 'Scene training'), text: o('Ein Raum mit Gegenständen und Personen ist 10–30 Sekunden sichtbar. Dann kommen Detailfragen.', 'A room with objects and people is visible for 10–30 seconds. Then come detail questions.'), badge: o('20+ Fragetypen · 5 Stufen', '20+ question types · 5 levels'), render: () => <SceneDrill /> },
      ]}
    />
  )
}
