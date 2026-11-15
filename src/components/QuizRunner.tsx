import { useMemo, useRef, useState } from 'react'
import type { AreaId } from '../lib/areas'
import { record } from '../lib/store'
import { shuffle } from '../lib/util'
import { ProgressBar } from './ui'
import { useLang, type T } from '../lib/i18n'

export interface QuizQuestion { q: T; options: T[]; answer: number; why: T }

/** Wiederverwendbares Multiple-Choice-Quiz mit Begründung nach jeder Antwort. */
export default function QuizRunner({ area, ex, questions, count, onDone }: {
  area: AreaId; ex: string; questions: QuizQuestion[]; count?: number; onDone?: (correct: number, total: number) => void
}) {
  const { t } = useLang()
  const set = useMemo(() => shuffle(questions).slice(0, count ?? questions.length).map((q) => {
    const order = shuffle(q.options.map((_, i) => i))
    return { ...q, options: order.map((i) => q.options[i]), answer: order.indexOf(q.answer) }
  }), [questions, count])
  const [i, setI] = useState(0)
  const [chosen, setChosen] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const shownAt = useRef(performance.now())

  if (done) {
    return (
      <div className="card text-center">
        <div className="font-serif text-4xl text-gold-300">{score} / {set.length}</div>
        <p className="mt-2 text-ink-400">{t('richtig beantwortet', 'correct')}</p>
        {!onDone && <button className="btn-gold mt-5" onClick={() => { setI(0); setScore(0); setChosen(null); setDone(false) }}>{t('Nochmal', 'Again')}</button>}
      </div>
    )
  }

  const cur = set[i]
  const answer = (k: number) => {
    if (chosen !== null) return
    setChosen(k)
    const ok = k === cur.answer
    if (ok) setScore((s) => s + 1)
    record({ area, ex, ok, ms: Math.round(performance.now() - shownAt.current) })
  }
  const next = () => {
    if (i + 1 >= set.length) { setDone(true); onDone?.(score, set.length); return }
    setI(i + 1); setChosen(null); shownAt.current = performance.now()
  }

  return (
    <div className="card">
      <div className="mb-3 flex items-center justify-between text-xs text-ink-400">
        <span>{t('Frage', 'Question')} {i + 1} / {set.length}</span><span>{score} {t('richtig', 'correct')}</span>
      </div>
      <ProgressBar value={i / set.length} className="mb-4" />
      <p className="mb-4 text-lg text-ink-200">{t(cur.q)}</p>
      <div className="grid gap-2">
        {cur.options.map((o, k) => {
          const state = chosen === null ? '' : k === cur.answer ? 'border-emerald-500/70 bg-emerald-500/10' : k === chosen ? 'border-rose-500/70 bg-rose-500/10' : 'opacity-50'
          return (
            <button key={k} onClick={() => answer(k)} className={`rounded-xl border border-ink-600 px-4 py-3 text-left text-sm transition hover:border-gold-600 ${state}`}>{t(o)}</button>
          )
        })}
      </div>
      {chosen !== null && (
        <div className="mt-4 rounded-xl bg-ink-900/70 p-4 text-sm">
          <div className={chosen === cur.answer ? 'text-emerald-400' : 'text-rose-400'}>{chosen === cur.answer ? t('Richtig.', 'Correct.') : t('Nicht ganz.', 'Not quite.')}</div>
          <p className="mt-1 text-ink-200">{t(cur.why)}</p>
          <button className="btn-gold mt-4 w-full sm:w-auto" onClick={next}>{i + 1 >= set.length ? t('Auswertung', 'Results') : t('Weiter', 'Next')}</button>
        </div>
      )}
    </div>
  )
}
