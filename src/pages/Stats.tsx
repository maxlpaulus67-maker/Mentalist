import { useMemo, useState } from 'react'
import { AREAS } from '../lib/areas'
import { levelInfo, resetAll, useStore, type Attempt } from '../lib/store'
import { PageTitle, ProgressBar } from '../components/ui'
import LineChart from '../components/LineChart'
import { EMOTIONS } from '../areas/mimik/data'

const DAYS = 14
const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null)

export default function Stats() {
  const { attempts, xp } = useStore()
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
      <PageTitle kicker="Fortschritt" title="Statistik" />
      <div className="flex flex-wrap gap-2">
        {[{ id: 'alle', title: 'Alle' }, ...AREAS.filter((a) => a.ready)].map((a) => (
          <button key={a.id} onClick={() => setArea(a.id)} className={`rounded-lg border px-3 py-1.5 text-sm ${area === a.id ? 'border-gold-500 text-gold-300' : 'border-ink-600 text-ink-400'}`}>{a.title}</button>
        ))}
      </div>

      {list.length === 0 ? <div className="card text-ink-400">Noch keine Daten. Starte ein Training – hier erscheint dann dein Verlauf.</div> : <>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="card"><div className="font-serif text-3xl text-gold-300">{list.length}</div><div className="text-xs text-ink-400">Aufgaben</div></div>
          <div className="card"><div className="font-serif text-3xl text-gold-300">{Math.round((list.filter((a) => a.ok).length / list.length) * 100)} %</div><div className="text-xs text-ink-400">Trefferquote</div></div>
          <div className="card"><div className="font-serif text-3xl text-gold-300">{Math.round(avg(list.filter((a) => a.ms && a.ms < 30000).map((a) => a.ms!)) ?? 0)}</div><div className="text-xs text-ink-400">Ø ms Reaktion</div></div>
        </div>
        <section className="card"><h2 className="mb-2 text-xl">Trefferquote · letzte {DAYS} Tage</h2><LineChart label="Trefferquote pro Tag" labels={days.map((d) => d.label)} values={acc} unit="%" max={100} /></section>
        <section className="card"><h2 className="mb-2 text-xl">Reaktionszeit · letzte {DAYS} Tage</h2><LineChart label="Reaktionszeit pro Tag" labels={days.map((d) => d.label)} values={rt} unit="" color="#8fb3c9" /><p className="text-xs text-ink-400">in Millisekunden – niedriger ist schneller</p></section>
      </>}

      {(area === 'alle' || area === 'mimik') && blitz.length > 0 && (
        <section className="card">
          <h2 className="mb-3 text-xl">Mimik · Trefferquote je Emotion</h2>
          <div className="space-y-2">
            {EMOTIONS.map((e) => {
              const rs = blitz.filter((a) => a.d?.startsWith(e.id + ':'))
              const r = rs.length ? rs.filter((a) => a.ok).length / rs.length : 0
              return (
                <div key={e.id} className="flex items-center gap-3 text-sm">
                  <span className="w-28">{e.name}</span><ProgressBar value={r} /><span className="w-16 text-right text-ink-400">{rs.length ? `${Math.round(r * 100)} %` : '–'}</span>
                </div>
              )
            })}
          </div>
        </section>
      )}

      <section className="card">
        <h2 className="mb-3 text-xl">Level pro Bereich</h2>
        <div className="space-y-2">
          {AREAS.map((a) => { const L = levelInfo(xp[a.id]); return (
            <div key={a.id} className="flex items-center gap-3 text-sm"><span className="w-36 truncate">{a.title}</span><ProgressBar value={L.progress} /><span className="w-24 text-right text-ink-400">Lv {L.lvl} · {xp[a.id] ?? 0} XP</span></div>
          ) })}
        </div>
      </section>

      <button className="text-xs text-ink-400 underline hover:text-rose-400" onClick={() => { if (confirm('Wirklich den gesamten Fortschritt löschen?')) resetAll() }}>Fortschritt zurücksetzen</button>
    </div>
  )
}
