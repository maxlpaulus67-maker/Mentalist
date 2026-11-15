import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import Face, { NEUTRAL, PERSONAS } from './Face'
import { LESSONS, emotionById, faceFor } from './data'
import { markLessonRead, useStore } from '../../lib/store'
import { useLang } from '../../lib/i18n'
import { PageTitle, Disclaimer } from '../../components/ui'

export function LessonList() {
  const { lessonsRead } = useStore()
  const { t } = useLang()
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {LESSONS.map((l, i) => (
        <Link key={l.id} to={`/bereich/mimik/lektion/${l.id}`} className="card flex items-center gap-4 transition hover:border-gold-600">
          {l.emotion
            ? <div className="h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-ink-950"><Face p={faceFor(l.emotion)} persona={PERSONAS[i % PERSONAS.length]} className="h-full w-full" /></div>
            : <div className="grid h-16 w-14 shrink-0 place-items-center rounded-lg bg-ink-950 font-serif text-2xl text-gold-500">{i + 1}</div>}
          <div className="min-w-0">
            <div className="font-serif text-lg text-gold-300">{t(l.title)}</div>
            <div className="text-xs text-ink-400">{lessonsRead.includes(l.id) ? t('✓ gelesen', '✓ read') : t('neu · +15 XP', 'new · +15 XP')}</div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export function LessonView() {
  const { lessonId } = useParams()
  const { t } = useLang()
  const idx = LESSONS.findIndex((l) => l.id === lessonId)
  const l = LESSONS[idx]
  useEffect(() => { if (l) markLessonRead(l.id, 'mimik') }, [l])
  if (!l) return <p>{t('Lektion nicht gefunden.', 'Lesson not found.')}</p>
  const emo = l.emotion ? emotionById(l.emotion) : null
  const next = LESSONS[idx + 1]
  const faces: [string, typeof NEUTRAL][] = emo
    ? [[t('Neutral', 'Neutral'), NEUTRAL], [t('Subtil', 'Subtle'), faceFor(emo.id, 0.4)], [t('Deutlich', 'Clear'), faceFor(emo.id, 1)]]
    : []
  return (
    <article>
      <PageTitle kicker={t('Mimik · Lektion', 'Facial Expressions · Lesson')} title={t(l.title)} back="/bereich/mimik" />
      {emo && (
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          {faces.map(([label, p], i) => (
            <figure key={i} className="card p-2">
              <div className="aspect-[4/5] overflow-hidden rounded-lg bg-ink-950">
                <Face p={p} persona={PERSONAS[(idx + 2) % PERSONAS.length]} highlight={i === 2 ? emo.regions : []} className="h-full w-full" />
              </div>
              <figcaption className="pt-2 text-center text-xs text-ink-400">{label}</figcaption>
            </figure>
          ))}
        </div>
      )}
      {emo && (
        <section className="card mb-4">
          <h2 className="mb-2 text-xl">{t(`Woran du ${emo.name.de} erkennst`, `How to spot ${emo.name.en.toLowerCase()}`)}</h2>
          <ul className="list-disc space-y-1.5 pl-5">{emo.cues.map((c) => <li key={c.de}>{t(c)}</li>)}</ul>
        </section>
      )}
      <div className="max-w-2xl space-y-4 leading-relaxed">
        {l.paragraphs.map((p) => <p key={p.de}>{t(p)}</p>)}
      </div>
      <div className="mt-6"><Disclaimer compact /></div>
      <div className="mt-6 flex flex-wrap gap-2">
        {next && <Link className="btn-gold" to={`/bereich/mimik/lektion/${next.id}`}>{t('Nächste', 'Next')}: {t(next.title)}</Link>}
        <Link className="btn-ghost" to="/bereich/mimik?tab=uebungen">{t('Zu den Übungen', 'To the exercises')}</Link>
      </div>
    </article>
  )
}
