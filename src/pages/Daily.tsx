import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { PageTitle, ProgressBar } from '../components/ui'
import { setSetting, today } from '../lib/store'
import BlitzTraining from '../areas/mimik/BlitzTraining'
import QuizRunner from '../components/QuizRunner'
import { QUIZ as MIMIK_QUIZ } from '../areas/mimik/data'

interface Step { title: string; area: string; render: (done: () => void) => ReactNode }

/** Bausteine des täglichen Trainings – jeder neue Bereich hängt sich hier an. */
const STEPS: Step[] = [
  { title: 'Mikroexpressionen', area: 'Mimik', render: (d) => <BlitzTraining daily onDone={d} /> },
  { title: 'Merkmale wiederholen', area: 'Mimik', render: (d) => <QuizRunner area="mimik" ex="quiz" questions={MIMIK_QUIZ} count={5} onDone={() => setTimeout(d, 0)} /> },
]

export default function Daily() {
  const [i, setI] = useState(0)
  const done = i >= STEPS.length
  const advance = () => {
    if (i + 1 >= STEPS.length) setSetting('daily.last', today())
    setI(i + 1)
  }
  return (
    <div className="max-w-3xl">
      <PageTitle kicker="Tägliches Training" title={done ? 'Geschafft' : STEPS[i].title} back="/">
        {done ? 'Deine Streak ist gesichert. Morgen geht es weiter.' : `Schritt ${i + 1} von ${STEPS.length} · ${STEPS[i].area}`}
      </PageTitle>
      <ProgressBar value={i / STEPS.length} className="mb-6" />
      {done ? (
        <div className="flex gap-2"><Link to="/" className="btn-gold">Zur Startseite</Link><Link to="/statistik" className="btn-ghost">Statistik ansehen</Link></div>
      ) : <div key={i}>{STEPS[i].render(advance)}</div>}
    </div>
  )
}
