import { useMemo, useState } from 'react'
import { AREAS } from '../lib/areas'
import { levelInfo, resetAll, useStore, type Attempt } from '../lib/store'
import { PageTitle, ProgressBar } from '../components/ui'
import LineChart from '../components/LineChart'
import { EMOTIONS } from '../areas/mimik/data'
import { useLang } from '../lib/i18n'

const DAYS = 14
const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null)

export default function Stats() {
  const { attempts, xp } = useStore()
  const { t } = useLang()
  const [area, setArea] = useState<string>('alle')
  const list = useMemo(() => attempts.filter((a) => area === 'alle' || a.area === area), [attempts, area])

  const days = useMemo(() => {
    const out: { label: string; items: Attempt[] }[] = []
    for (let k = DAYS - 1; k >= 0; k--) {
      const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - k)
      const end = d.getTime() + 864e5
      out.push({ label: `${d.getDate()}.${d.getMonth() + 1}.`, items: list.filter((a) => a.t >= d.getTime() && a.t < end) })
    }
    return out
  }, [list])

  const acc = days.map((d) => (d.items.length ? (d.items.filter((a) => a.ok).length / d.items.length) * 100 : null))
  const rt = days.map((d) => avg(d.items.filter((a) => a.ms && a.ms < 30000).map((a) => a.ms!)))
  const blitz = attempts.filter((a) => a.ex === 'blitz')

  return (
    <div className="space-y-6">
      <PageTitle kicker={t('Fortschritt', 'Progress')} title={t('Statistik', 'Statistics')} />
      <div className="flex flex-wrap gap-2">
        {[{ id: 'alle', title: { de: 'Alle', en: 'All' } }, ...AREAS.filter((a) => a.ready)].map((a) => (
          <button key={a.id} onClick={() => setArea(a.id)} className={`rounded-lg border px-3 py-1.5 text-sm ${area === a.id ? 'border-gold-500 text-gold-300' : 'border-ink-600 text-ink-400'}`}>{t(a.title)}</button>
        ))}
      </div>

      {list.length === 0 ? <div className="card text-ink-400">{t('Noch keine Daten. Starte ein Training – hier erscheint dann dein Verlauf.', 'No data yet. Start a training session – your history will appear here.')}</div> : <>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="card"><div className="font-serif text-3xl text-gold-300">{list.length}</div><div className="text-xs text-ink-400">{t('Aufgaben', 'Tasks')}</div></div>
          <div className="card"><div className="font-serif text-3xl text-gold-300">{Math.round((list.filter((a) => a.ok).length / list.length) * 100)} %</div><div className="text-xs text-ink-400">{t('Trefferquote', 'Hit rate')}</div></div>
          <div className="card"><div className="font-serif text-3xl text-gold-300">{Math.round(avg(list.filter((a) => a.ms && a.ms < 30000).map((a) => a.ms!)) ?? 0)}</div><div className="text-xs text-ink-400">{t('Ø ms Reaktion', 'Avg. ms reaction')}</div></div>
        </div>
        <section className="card"><h2 className="mb-2 text-xl">{t(`Trefferquote · letzte ${DAYS} Tage`, `Hit rate · last ${DAYS} days`)}</h2><LineChart label={t('Trefferquote pro Tag', 'Hit rate per day')} labels={days.map((d) => d.label)} values={acc} unit="%" max={100} /></section>
        <section className="card"><h2 className="mb-2 text-xl">{t(`Reaktionszeit · letzte ${DAYS} Tage`, `Reaction time · last ${DAYS} days`)}</h2><LineChart label={t('Reaktionszeit pro Tag', 'Reaction time per day')} labels={days.map((d) => d.label)} values={rt} unit="" color="#8fb3c9" /><p className="text-xs text-ink-400">{t('in Millisekunden – niedriger ist schneller', 'in milliseconds – lower is faster')}</p></section>
      </>}

      {(area === 'alle' || area === 'mimik') && blitz.length > 0 && (
        <section className="card">
          <h2 className="mb-3 text-xl">{t('Mimik · Trefferquote je Emotion', 'Facial expressions · hit rate per emotion')}</h2>
          <div className="space-y-2">
            {EMOTIONS.map((e) => {
              const rs = blitz.filter((a) => a.d?.startsWith(e.id + ':'))
              const r = rs.length ? rs.filter((a) => a.ok).length / rs.length : 0
              return (
                <div key={e.id} className="flex items-center gap-3 text-sm">
                  <span className="w-28">{t(e.name)}</span><ProgressBar value={r} /><span className="w-16 text-right text-ink-400">{rs.length ? `${Math.round(r * 100)} %` : '–'}</span>
                </div>
              )
            })}
          </div>
        </section>
      )}

      <section className="card">
        <h2 className="mb-3 text-xl">{t('Level pro Bereich', 'Level per area')}</h2>
        <div className="space-y-2">
          {AREAS.map((a) => { const L = levelInfo(xp[a.id]); return (
            <div key={a.id} className="flex items-center gap-3 text-sm"><span className="w-36 truncate">{t(a.title)}</span><ProgressBar value={L.progress} /><span className="w-24 text-right text-ink-400">Lv {L.lvl} · {xp[a.id] ?? 0} XP</span></div>
          ) })}
        </div>
      </section>

      <button className="text-xs text-ink-400 underline hover:text-rose-400" onClick={() => { if (confirm(t('Wirklich den gesamten Fortschritt löschen?', 'Really delete all progress?'))) resetAll() }}>{t('Fortschritt zurücksetzen', 'Reset progress')}</button>
    </div>
  )
}
