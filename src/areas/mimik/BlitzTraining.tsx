import { useEffect, useMemo, useRef, useState } from 'react'
import Face, { NEUTRAL, PERSONAS, type Persona } from './Face'
import { BLITZ_ITEMS, EMOTIONS, INTENSITY, emotionById, faceFor, type EmotionId, type Intensity } from './data'
import { record, setSetting, useStore } from '../../lib/store'
import { pick, shuffle } from '../../lib/util'
import { ProgressBar } from '../../components/ui'

const DURATIONS = [500, 300, 200, 120, 80, 40]
type Phase = 'setup' | 'fix' | 'pre' | 'flash' | 'post' | 'answer' | 'feedback' | 'summary'
interface Round { emotion: EmotionId; intensity: Intensity; persona: Persona; mirror: boolean }
interface Result { r: Round; chosen: EmotionId; ms: number }

export default function BlitzTraining({ daily, onDone }: { daily?: boolean; onDone?: () => void }) {
  const { settings } = useStore()
  const duration = (settings['mimik.duration'] as number) ?? 500
  const level = (settings['mimik.intensity'] as Intensity | 'alle') ?? 'alle'
  const mask = (settings['mimik.mask'] as boolean) ?? true
  const rounds = daily ? 10 : ((settings['mimik.rounds'] as number) ?? 14)

  const [phase, setPhase] = useState<Phase>(daily ? 'fix' : 'setup')
  const [seed, setSeed] = useState(0)
  const plan = useMemo<Round[]>(() => {
    const pool = BLITZ_ITEMS.filter((b) => level === 'alle' || b.intensity === level)
    const list: Round[] = []
    let bag: typeof pool = []
    while (list.length < rounds) {
      if (!bag.length) bag = shuffle(pool)
      const b = bag.pop()!
      list.push({ emotion: b.emotion, intensity: b.intensity, persona: pick(PERSONAS), mirror: Math.random() < 0.5 })
    }
    return list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed, level, rounds])

  const [idx, setIdx] = useState(0)
  const [results, setResults] = useState<Result[]>([])
  const answerAt = useRef(0)
  const cur = plan[idx]

  // --- Ablaufsteuerung mit präzisem Timing ---
  useEffect(() => {
    let raf = 0
    let to: number | undefined
    if (phase === 'fix') to = window.setTimeout(() => setPhase(mask ? 'pre' : 'flash'), 650)
    if (phase === 'pre') to = window.setTimeout(() => setPhase('flash'), 450)
    if (phase === 'flash') {
      let t0 = 0
      const tick = (now: number) => {
        if (!t0) t0 = now
        if (now - t0 >= duration - 8) setPhase(mask ? 'post' : 'answer')
        else raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }
    if (phase === 'post') to = window.setTimeout(() => setPhase('answer'), 350)
    if (phase === 'answer') answerAt.current = performance.now()
    return () => { cancelAnimationFrame(raf); clearTimeout(to) }
  }, [phase, duration, mask, idx])

  const choose = (e: EmotionId) => {
    if (phase !== 'answer') return
    const ms = Math.round(performance.now() - answerAt.current)
    const ok = e === cur.emotion
    record({ area: 'mimik', ex: 'blitz', ok, ms, d: `${cur.emotion}:${cur.intensity}:${duration}` }, ok ? 8 + Math.round((500 - duration) / 50) : 2)
    setResults((r) => [...r, { r: cur, chosen: e, ms }])
    setPhase('feedback')
  }

  const next = () => {
    if (idx + 1 >= plan.length) setPhase('summary')
    else { setIdx(idx + 1); setPhase('fix') }
  }

  const restart = () => { setSeed((s) => s + 1); setIdx(0); setResults([]); setPhase('fix') }

  // ---------------- Einstellungen ----------------
  if (phase === 'setup') {
    return (
      <div className="card space-y-5">
        <div>
          <div className="mb-2 text-sm text-ink-400">Anzeigedauer</div>
          <div className="flex flex-wrap gap-2">
            {DURATIONS.map((d) => (
              <button key={d} onClick={() => setSetting('mimik.duration', d)} className={`rounded-lg border px-3 py-2 text-sm ${duration === d ? 'border-gold-500 bg-gold-500/15 text-gold-300' : 'border-ink-600 text-ink-400'}`}>{d} ms</button>
            ))}
          </div>
          <input type="range" min={40} max={500} step={10} value={duration} onChange={(e) => setSetting('mimik.duration', Number(e.target.value))} className="mt-3 w-full accent-[#c9a24a]" aria-label="Anzeigedauer in Millisekunden" />
          <div className="text-right text-xs text-ink-400">{duration} ms</div>
        </div>
        <div>
          <div className="mb-2 text-sm text-ink-400">Intensität der Ausdrücke</div>
          <div className="flex flex-wrap gap-2">
            {(['alle', 'stark', 'mittel', 'subtil'] as const).map((l) => (
              <button key={l} onClick={() => setSetting('mimik.intensity', l)} className={`rounded-lg border px-3 py-2 text-sm capitalize ${level === l ? 'border-gold-500 bg-gold-500/15 text-gold-300' : 'border-ink-600 text-ink-400'}`}>{l}</button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={mask} onChange={(e) => setSetting('mimik.mask', e.target.checked)} className="h-4 w-4 accent-[#c9a24a]" />
            Maskierung (neutrales Gesicht davor & danach)
          </label>
          <label className="flex items-center gap-2 text-sm">
            Runden
            <select value={rounds} onChange={(e) => setSetting('mimik.rounds', Number(e.target.value))} className="rounded-lg border border-ink-600 bg-ink-900 px-2 py-1">
              {[7, 14, 21, 28].map((n) => <option key={n}>{n}</option>)}
            </select>
          </label>
        </div>
        <button className="btn-gold w-full" onClick={restart}>Training starten</button>
      </div>
    )
  }

  // ---------------- Auswertung ----------------
  if (phase === 'summary') {
    const ok = results.filter((r) => r.r.emotion === r.chosen).length
    const avg = Math.round(results.reduce((s, r) => s + r.ms, 0) / Math.max(1, results.length))
    const rate = ok / Math.max(1, results.length)
    const per = EMOTIONS.map((e) => {
      const rs = results.filter((r) => r.r.emotion === e.id)
      return { e, n: rs.length, ok: rs.filter((r) => r.chosen === e.id).length }
    }).filter((x) => x.n)
    const tip = rate >= 0.85 && duration > 40
      ? `Stark! Versuch als Nächstes ${DURATIONS.find((d) => d < duration) ?? 40} ms oder subtilere Ausdrücke.`
      : rate < 0.55 ? 'Geh eine Stufe langsamer und lies die Lektion zu den Verwechslungen.' : 'Bleib bei dieser Geschwindigkeit, bis du über 85 % liegst.'
    return (
      <div className="card space-y-5">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="rounded-xl bg-ink-900/70 p-4"><div className="font-serif text-4xl text-gold-300">{Math.round(rate * 100)} %</div><div className="text-xs text-ink-400">Trefferquote</div></div>
          <div className="rounded-xl bg-ink-900/70 p-4"><div className="font-serif text-4xl text-gold-300">{avg} ms</div><div className="text-xs text-ink-400">Ø Reaktionszeit</div></div>
        </div>
        <div className="space-y-2">
          {per.map(({ e, n, ok }) => (
            <div key={e.id} className="flex items-center gap-3 text-sm">
              <span className="w-28">{e.name}</span>
              <ProgressBar value={ok / n} />
              <span className="w-12 text-right text-ink-400">{ok}/{n}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-ink-400">{tip}</p>
        <div className="flex flex-wrap gap-2">
          {daily ? <button className="btn-gold" onClick={onDone}>Weiter</button> : <>
            <button className="btn-gold" onClick={restart}>Nochmal</button>
            <button className="btn-ghost" onClick={() => setPhase('setup')}>Einstellungen</button>
          </>}
        </div>
      </div>
    )
  }

  // ---------------- Durchlauf ----------------
  const last = results[results.length - 1]
  const showEmotion = phase === 'flash' || phase === 'feedback'
  const showNeutral = phase === 'pre' || phase === 'post'
  const emo = emotionById(cur.emotion)
  const wrongEmo = last && last.chosen !== cur.emotion ? emotionById(last.chosen) : null

  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-start">
      <div className="card">
        <div className="mb-2 flex items-center justify-between text-xs text-ink-400">
          <span>Runde {idx + 1} / {plan.length}</span>
          <span>{duration} ms · {mask ? 'maskiert' : 'ohne Maske'}</span>
        </div>
        <ProgressBar value={idx / plan.length} className="mb-3" />
        <div className="relative mx-auto aspect-[4/5] w-full max-w-xs overflow-hidden rounded-xl bg-ink-950">
          {/* Beide Gesichter vorgerendert – nur Sichtbarkeit wechselt, für exaktes Timing */}
          <div className="absolute inset-0" style={{ visibility: showNeutral ? 'visible' : 'hidden' }}>
            <Face p={NEUTRAL} persona={cur.persona} className="h-full w-full" />
          </div>
          <div className="absolute inset-0" style={{ visibility: showEmotion ? 'visible' : 'hidden' }}>
            <Face p={faceFor(cur.emotion, INTENSITY[cur.intensity], cur.mirror)} persona={cur.persona} className="h-full w-full" highlight={phase === 'feedback' ? emo.regions : []} />
          </div>
          {phase === 'fix' && <div className="absolute inset-0 grid place-items-center font-serif text-4xl text-gold-500">+</div>}
          {phase === 'answer' && <div className="absolute inset-0 grid place-items-center text-sm text-ink-400">Welche Emotion?</div>}
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-2">
          {EMOTIONS.map((e) => {
            const fb = phase === 'feedback'
            const cls = !fb ? 'border-ink-600 hover:border-gold-500'
              : e.id === cur.emotion ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                : e.id === last?.chosen ? 'border-rose-500 bg-rose-500/10 text-rose-300' : 'border-ink-700 opacity-40'
            return (
              <button key={e.id} disabled={phase !== 'answer' && !fb} onClick={() => choose(e.id)}
                className={`rounded-xl border px-3 py-3 text-sm transition ${cls}`}>{e.name}</button>
            )
          })}
        </div>

        {phase === 'feedback' && last && (
          <div className="card space-y-3 text-sm">
            <div className="flex items-baseline justify-between">
              <span className={wrongEmo ? 'text-rose-400' : 'text-emerald-400'}>
                {wrongEmo ? `Es war ${emo.name}.` : `Richtig – ${emo.name}.`}
              </span>
              <span className="text-xs text-ink-400">{last.ms} ms · {cur.intensity}</span>
            </div>
            <div>
              <div className="mb-1 text-xs uppercase tracking-widest text-gold-500">Woran du es erkennst</div>
              <ul className="list-disc space-y-1 pl-5 text-ink-200">{emo.cues.slice(0, 3).map((c) => <li key={c}>{c}</li>)}</ul>
            </div>
            {wrongEmo && (
              <div className="rounded-lg bg-ink-900/70 p-3">
                <div className="mb-1 text-xs uppercase tracking-widest text-gold-500">{emo.name} vs. {wrongEmo.name}</div>
                <p className="text-ink-200">{emo.vs[wrongEmo.id] ?? wrongEmo.vs[emo.id] ?? `${wrongEmo.name}: ${wrongEmo.cues[0]}`}</p>
              </div>
            )}
            <button className="btn-gold w-full" onClick={next} autoFocus>{idx + 1 >= plan.length ? 'Auswertung' : 'Nächstes Gesicht'}</button>
          </div>
        )}
      </div>
    </div>
  )
}
