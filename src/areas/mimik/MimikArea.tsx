import { useSearchParams } from 'react-router-dom'
import { LessonList } from './Lessons'
import BlitzTraining from './BlitzTraining'
import FaceLab from './FaceLab'
import QuizRunner from '../../components/QuizRunner'
import { QUIZ } from './data'
import { Tabs } from '../../components/ui'
import { useLang } from '../../lib/i18n'

const EXERCISES = [
  { id: 'blitz', title: { de: 'Blitz-Training', en: 'Flash Training' }, text: { de: 'Ein Gesicht zeigt für 500 bis 40 ms eine Emotion. Erkennst du sie?', en: 'A face shows an emotion for 500 to 40 ms. Can you spot it?' }, badge: { de: '21 Aufgaben', en: '21 tasks' } },
  { id: 'quiz', title: { de: 'Merkmals-Quiz', en: 'Feature Quiz' }, text: { de: 'Wissensfragen zu Muskeln, Verwechslungen und Denkfehlern.', en: 'Questions on muscles, mix-ups and thinking errors.' }, badge: { de: `${QUIZ.length} Fragen`, en: `${QUIZ.length} questions` } },
  { id: 'labor', title: { de: 'Gesichts-Labor', en: 'Face Lab' }, text: { de: 'Bau Emotionen mit Schiebereglern selbst und sieh, was jeder Muskel bewirkt.', en: 'Build emotions with sliders and see what each muscle does.' }, badge: { de: 'frei', en: 'free play' } },
]

export default function MimikArea() {
  const [sp, setSp] = useSearchParams()
  const { t } = useLang()
  const tab = (sp.get('tab') as 'lektionen' | 'uebungen') ?? 'lektionen'
  const ueb = sp.get('ueb')

  if (ueb) {
    const ex = EXERCISES.find((e) => e.id === ueb)
    return (
      <div>
        <button onClick={() => setSp({ tab: 'uebungen' })} className="mb-3 text-sm text-ink-400 hover:text-gold-300">← {t('Übungen', 'Exercises')}</button>
        <h2 className="mb-4 text-2xl">{ex && t(ex.title)}</h2>
        {ueb === 'blitz' && <BlitzTraining />}
        {ueb === 'labor' && <FaceLab />}
        {ueb === 'quiz' && <div className="max-w-2xl"><QuizRunner area="mimik" ex="quiz" questions={QUIZ} count={10} /></div>}
      </div>
    )
  }

  return (
    <div>
      <Tabs value={tab} onChange={(t) => setSp({ tab: t })} items={[{ id: 'lektionen', label: t('Lektionen', 'Lessons') }, { id: 'uebungen', label: t('Übungen', 'Exercises') }]} />
      {tab === 'lektionen' ? <LessonList /> : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {EXERCISES.map((e) => (
            <button key={e.id} onClick={() => setSp({ tab: 'uebungen', ueb: e.id })} className="card text-left transition hover:border-gold-600">
              <div className="flex items-start justify-between gap-2">
                <div className="font-serif text-xl text-gold-300">{t(e.title)}</div>
                <span className="chip shrink-0">{t(e.badge)}</span>
              </div>
              <p className="mt-2 text-sm text-ink-400">{t(e.text)}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
