import { useSearchParams } from 'react-router-dom'
import { LessonList } from './Lessons'
import BlitzTraining from './BlitzTraining'
import FaceLab from './FaceLab'
import QuizRunner from '../../components/QuizRunner'
import { QUIZ } from './data'
import { Tabs } from '../../components/ui'

const EXERCISES = [
  { id: 'blitz', title: 'Blitz-Training', text: 'Ein Gesicht zeigt für 500 bis 40 ms eine Emotion. Erkennst du sie?', badge: '21 Aufgaben' },
  { id: 'quiz', title: 'Merkmals-Quiz', text: 'Wissensfragen zu Muskeln, Verwechslungen und Denkfehlern.', badge: `${QUIZ.length} Fragen` },
  { id: 'labor', title: 'Gesichts-Labor', text: 'Bau Emotionen mit Schiebereglern selbst und sieh, was jeder Muskel bewirkt.', badge: 'frei' },
]

export default function MimikArea() {
  const [sp, setSp] = useSearchParams()
  const tab = (sp.get('tab') as 'lektionen' | 'uebungen') ?? 'lektionen'
  const ueb = sp.get('ueb')

  if (ueb) {
    const ex = EXERCISES.find((e) => e.id === ueb)
    return (
      <div>
        <button onClick={() => setSp({ tab: 'uebungen' })} className="mb-3 text-sm text-ink-400 hover:text-gold-300">← Übungen</button>
        <h2 className="mb-4 text-2xl">{ex?.title}</h2>
        {ueb === 'blitz' && <BlitzTraining />}
        {ueb === 'labor' && <FaceLab />}
        {ueb === 'quiz' && <div className="max-w-2xl"><QuizRunner area="mimik" ex="quiz" questions={QUIZ} count={10} /></div>}
      </div>
    )
  }

  return (
    <div>
      <Tabs value={tab} onChange={(t) => setSp({ tab: t })} items={[{ id: 'lektionen', label: 'Lektionen' }, { id: 'uebungen', label: 'Übungen' }]} />
      {tab === 'lektionen' ? <LessonList /> : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {EXERCISES.map((e) => (
            <button key={e.id} onClick={() => setSp({ tab: 'uebungen', ueb: e.id })} className="card text-left transition hover:border-gold-600">
              <div className="flex items-start justify-between gap-2">
                <div className="font-serif text-xl text-gold-300">{e.title}</div>
                <span className="chip shrink-0">{e.badge}</span>
              </div>
              <p className="mt-2 text-sm text-ink-400">{e.text}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
