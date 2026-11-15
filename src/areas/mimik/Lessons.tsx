import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import Face, { NEUTRAL, PERSONAS } from './Face'
import { LESSONS, emotionById, faceFor } from './data'
import { markLessonRead, useStore } from '../../lib/store'
import { PageTitle, Disclaimer } from '../../components/ui'

export function LessonList() {
  const { lessonsRead } = useStore()
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {LESSONS.map((l, i) => (
        <Link key={l.id} to={`/bereich/mimik/lektion/${l.id}`} className="card flex items-center gap-4 transition hover:border-gold-600">
          {l.emotion
            ? <div className="h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-ink-950"><Face p={faceFor(l.emotion)} persona={PERSONAS[i % PERSONAS.length]} className="h-full w-full" /></div>
            : <div className="grid h-16 w-14 shrink-0 place-items-center rounded-lg bg-ink-950 font-serif text-2xl text-gold-500">{i + 1}</div>}
          <div className="min-w-0">
            <div className="font-serif text-lg text-gold-300">{l.title}</div>
            <div className="text-xs text-ink-400">{lessonsRead.includes(l.id) ? '✓ gelesen' : 'neu · +15 XP'}</div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export function LessonView() {
  const { lessonId } = useParams()
  const idx = LESSONS.findIndex((l) => l.id === lessonId)
  const l = LESSONS[idx]
  useEffect(() => { if (l) markLessonRead(l.id, 'mimik') }, [l])
  if (!l) return <p>Lektion nicht gefunden.</p>
  const emo = l.emotion ? emotionById(l.emotion) : null
  const next = LESSONS[idx + 1]
  return (
    <article>
      <PageTitle kicker="Mimik · Lektion" title={l.title} back="/bereich/mimik" />
      {emo && (
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          {[['Neutral', NEUTRAL], ['Subtil', faceFor(emo.id, 0.4)], ['Deutlich', faceFor(emo.id, 1)]].map(([label, p], i) => (
            <figure key={i} className="card p-2">
              <div className="aspect-[4/5] overflow-hidden rounded-lg bg-ink-950">
                <Face p={p as typeof NEUTRAL} persona={PERSONAS[(idx + 2) % PERSONAS.length]} highlight={i === 2 ? emo.regions : []} className="h-full w-full" />
              </div>
              <figcaption className="pt-2 text-center text-xs text-ink-400">{label as string}</figcaption>
            </figure>
          ))}
        </div>
      )}
      {emo && (
        <section className="card mb-4">
          <h2 className="mb-2 text-xl">Woran du {emo.name} erkennst</h2>
          <ul className="list-disc space-y-1.5 pl-5">{emo.cues.map((c) => <li key={c}>{c}</li>)}</ul>
        </section>
      )}
      <div className="max-w-2xl space-y-4 leading-relaxed">
        {l.paragraphs.map((p) => <p key={p}>{p}</p>)}
      </div>
      <div className="mt-6"><Disclaimer compact /></div>
      <div className="mt-6 flex flex-wrap gap-2">
        {next && <Link className="btn-gold" to={`/bereich/mimik/lektion/${next.id}`}>Nächste: {next.title}</Link>}
        <Link className="btn-ghost" to="/bereich/mimik?tab=uebungen">Zu den Übungen</Link>
      </div>
    </article>
  )
}
