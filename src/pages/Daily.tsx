import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { PageTitle, ProgressBar } from '../components/ui'
import { setSetting, today, useStore } from '../lib/store'
import { useLang, type T } from '../lib/i18n'
import BlitzTraining from '../areas/mimik/BlitzTraining'
import QuizRunner from '../components/QuizRunner'
import { QUIZ as MIMIK_QUIZ } from '../areas/mimik/data'
import { QUIZ as KOERPER_QUIZ, SITUATIONS } from '../areas/koerper/KoerperArea'
import { SceneDrill } from '../areas/beobachtung/BeobachtungArea'
import { CASES } from '../areas/schluss/SchlussArea'
import { Sorter } from '../areas/cold/ColdArea'
import { OddsDrill } from '../areas/poker/PokerArea'
import { MemoryDrill } from '../areas/palast/PalastArea'

interface Step { title: T; area: T; render: (done: () => void) => ReactNode }
const o = (de: string, en: string): T => ({ de, en })
const later = (d: () => void) => () => setTimeout(d, 0)

/** Rund 10 Minuten, gemischt aus allen Bereichen. */
const STEPS: Step[] = [
  { title: o('Mikroexpressionen', 'Micro-expressions'), area: o('Mimik', 'Facial expressions'), render: (d) => <BlitzTraining daily onDone={d} /> },
  { title: o('Szene einprägen', 'Memorise a scene'), area: o('Beobachtung', 'Observation'), render: (d) => <SceneDrill daily onDone={d} /> },
  { title: o('Ein Fall', 'A case'), area: o('Schlussfolgern', 'Deduction'), render: (d) => <QuizRunner area="schluss" ex="fall" questions={CASES} count={2} onDone={later(d)} /> },
  { title: o('Körpersprache', 'Body language'), area: o('Körpersprache', 'Body language'), render: (d) => <QuizRunner area="koerper" ex="mix" questions={[...KOERPER_QUIZ, ...SITUATIONS]} count={3} onDone={later(d)} /> },
  { title: o('Barnum oder spezifisch?', 'Barnum or specific?'), area: o('Cold Reading', 'Cold reading'), render: (d) => <Sorter count={5} onDone={d} /> },
  { title: o('Call oder Fold?', 'Call or fold?'), area: o('Poker', 'Poker'), render: (d) => <OddsDrill rounds={3} onDone={d} /> },
  { title: o('Wortliste', 'Word list'), area: o('Gedächtnispalast', 'Memory palace'), render: (d) => <MemoryDrill kind="woerter" daily onDone={d} /> },
  { title: o('Merkmale wiederholen', 'Review features'), area: o('Mimik', 'Facial expressions'), render: (d) => <QuizRunner area="mimik" ex="quiz" questions={MIMIK_QUIZ} count={2} onDone={later(d)} /> },
]

export default function Daily() {
  const { t } = useLang()
  const { notes } = useStore()
  const [i, setI] = useState(0)
  const done = i >= STEPS.length
  const open = notes.filter((n) => !n.outcome).length
  const advance = () => {
    if (i + 1 >= STEPS.length) setSetting('daily.last', today())
    setI(i + 1)
  }
  return (
    <div className="max-w-3xl">
      <PageTitle kicker={t('Tägliches Training', 'Daily training')} title={done ? t('Geschafft', 'Done') : t(STEPS[i].title)} back="/">
        {done ? t('Deine Streak ist gesichert. Morgen geht es weiter.', 'Your streak is safe. See you tomorrow.') : `${t('Schritt', 'Step')} ${i + 1} / ${STEPS.length} · ${t(STEPS[i].area)}`}
      </PageTitle>
      <ProgressBar value={i / STEPS.length} className="mb-6" />
      {done ? (
        <div className="space-y-4">
          <div className="card">
            <div className="font-serif text-xl text-gold-300">{t('Feldnotizen', 'Field notes')}</div>
            <p className="mt-1 text-sm text-ink-400">
              {open ? t(`Du hast ${open} offene Einschätzung(en). Weißt du inzwischen, ob sie gestimmt haben?`, `You have ${open} open read(s). Do you know yet whether they were right?`)
                : t('Nimm dir für heute eine Beobachtungs-Mission im echten Leben vor und trag sie ein.', 'Pick a real-life observation mission for today and log it.')}
            </p>
            <Link to="/bereich/notizen?tab=uebungen&ueb=tagebuch" className="btn-ghost mt-3">{t('Zum Tagebuch', 'Open journal')}</Link>
          </div>
          <div className="flex gap-2"><Link to="/" className="btn-gold">{t('Zur Startseite', 'Back home')}</Link><Link to="/statistik" className="btn-ghost">{t('Statistik ansehen', 'View stats')}</Link></div>
        </div>
      ) : (
        <div key={i}>
          {STEPS[i].render(advance)}
          <button onClick={advance} className="mt-4 text-xs text-ink-400 underline hover:text-gold-300">{t('Schritt überspringen', 'Skip step')}</button>
        </div>
      )}
    </div>
  )
}
