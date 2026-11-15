import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { PageTitle, ProgressBar } from '../components/ui'
import { setSetting, today } from '../lib/store'
import BlitzTraining from '../areas/mimik/BlitzTraining'
import QuizRunner from '../components/QuizRunner'
import { QUIZ as MIMIK_QUIZ } from '../areas/mimik/data'
import { useLang, type T } from '../lib/i18n'

interface Step { title: T; area: T; render: (done: () => void) => ReactNode }

/** Bausteine des täglichen Trainings – jeder neue Bereich hängt sich hier an. */
const STEPS: Step[] = [
  { title: { de: 'Mikroexpressionen', en: 'Micro-expressions' }, area: { de: 'Mimik', en: 'Facial Expressions' }, render: (d) => <BlitzTraining daily onDone={d} /> },
  { title: { de: 'Merkmale wiederholen', en: 'Review features' }, area: { de: 'Mimik', en: 'Facial Expressions' }, render: (d) => <QuizRunner area="mimik" ex="quiz" questions={MIMIK_QUIZ} count={5} onDone={() => setTimeout(d, 0)} /> },
]

export default function Daily() {
  const { t } = useLang()
  const [i, setI] = useState(0)
  const done = i >= STEPS.length
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
        <div className="flex gap-2"><Link to="/" className="btn-gold">{t('Zur Startseite', 'Back home')}</Link><Link to="/statistik" className="btn-ghost">{t('Statistik ansehen', 'View stats')}</Link></div>
      ) : <div key={i}>{STEPS[i].render(advance)}</div>}
    </div>
  )
}
