import { useEffect, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { AreaId } from '../lib/areas'
import { markLessonRead, useStore } from '../lib/store'
import { useLang, type T } from '../lib/i18n'
import { Disclaimer, Tabs } from './ui'

export interface Lesson { id: string; title: T; paragraphs: T[]; bullets?: T[] }
export interface Exercise { id: string; title: T; text: T; badge: T; render: () => ReactNode }

/** Gemeinsamer Rahmen: Tabs „Lektionen / Übungen“, Lektionsansicht, Übungsauswahl. */
export default function AreaShell({ area, lessons, exercises, intro }: { area: AreaId; lessons: Lesson[]; exercises: Exercise[]; intro?: ReactNode }) {
  const [sp, setSp] = useSearchParams()
  const { t } = useLang()
  const { lessonsRead } = useStore()
  const tab = (sp.get('tab') as 'lektionen' | 'uebungen') ?? (lessons.length ? 'lektionen' : 'uebungen')
  const ueb = sp.get('ueb')
  const lek = sp.get('lektion')
  const lesson = lessons.find((l) => l.id === lek)

  useEffect(() => { if (lesson) markLessonRead(lesson.id, area) }, [lesson, area])
  useEffect(() => { window.scrollTo(0, 0) }, [ueb, lek])

  if (lesson) {
    const idx = lessons.indexOf(lesson)
    const next = lessons[idx + 1]
    return (
      <article>
        <button onClick={() => setSp({ tab: 'lektionen' })} className="mb-3 text-sm text-ink-400 hover:text-gold-300">← {t('Lektionen', 'Lessons')}</button>
        <h2 className="mb-4 text-3xl">{t(lesson.title)}</h2>
        <div className="max-w-2xl space-y-4 leading-relaxed">
          {lesson.paragraphs.map((p) => <p key={p.de}>{t(p)}</p>)}
          {lesson.bullets && (
            <ul className="card list-disc space-y-1.5 pl-8">{lesson.bullets.map((b) => <li key={b.de}>{t(b)}</li>)}</ul>
          )}
        </div>
        <div className="mt-6 max-w-2xl"><Disclaimer compact /></div>
        <div className="mt-6 flex flex-wrap gap-2">
          {next && <button className="btn-gold" onClick={() => setSp({ tab: 'lektionen', lektion: next.id })}>{t('Nächste', 'Next')}: {t(next.title)}</button>}
          <button className="btn-ghost" onClick={() => setSp({ tab: 'uebungen' })}>{t('Zu den Übungen', 'To the exercises')}</button>
        </div>
      </article>
    )
  }

  if (ueb) {
    const ex = exercises.find((e) => e.id === ueb)
    return (
      <div>
        <button onClick={() => setSp({ tab: 'uebungen' })} className="mb-3 text-sm text-ink-400 hover:text-gold-300">← {t('Übungen', 'Exercises')}</button>
        <h2 className="mb-4 text-2xl">{ex && t(ex.title)}</h2>
        {ex?.render()}
      </div>
    )
  }

  return (
    <div>
      {lessons.length > 0 && (
        <Tabs value={tab} onChange={(v) => setSp({ tab: v })} items={[{ id: 'lektionen', label: t('Lektionen', 'Lessons') }, { id: 'uebungen', label: t('Übungen', 'Exercises') }]} />
      )}
      {intro}
      {tab === 'lektionen' && lessons.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {lessons.map((l, i) => (
            <button key={l.id} onClick={() => setSp({ tab: 'lektionen', lektion: l.id })} className="card flex items-center gap-4 text-left transition hover:border-gold-600">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-ink-950 font-serif text-2xl text-gold-500">{i + 1}</div>
              <div className="min-w-0">
                <div className="font-serif text-lg text-gold-300">{t(l.title)}</div>
                <div className="text-xs text-ink-400">{lessonsRead.includes(l.id) ? t('✓ gelesen', '✓ read') : t('neu · +15 XP', 'new · +15 XP')}</div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {exercises.map((e) => (
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
