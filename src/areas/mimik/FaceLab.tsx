import { useState } from 'react'
import Face, { NEUTRAL, PERSONAS, type FaceParams } from './Face'
import { EMOTIONS, faceFor } from './data'
import { addXp } from '../../lib/store'

const SLIDERS: { k: keyof FaceParams; label: string; min: number }[] = [
  { k: 'browInner', label: 'Innere Brauen heben', min: -1 },
  { k: 'browOuter', label: 'Äußere Brauen heben', min: -1 },
  { k: 'browLower', label: 'Brauen senken & zusammenziehen', min: 0 },
  { k: 'eyeUpper', label: 'Oberlid öffnen / hängen', min: -1 },
  { k: 'eyeLower', label: 'Unterlid spannen', min: 0 },
  { k: 'cheek', label: 'Wangen heben', min: 0 },
  { k: 'noseWrinkle', label: 'Nase rümpfen', min: 0 },
  { k: 'nostril', label: 'Nasenflügel blähen', min: 0 },
  { k: 'upperLip', label: 'Oberlippe heben', min: 0 },
  { k: 'cornerL', label: 'Mundwinkel links', min: -1 },
  { k: 'cornerR', label: 'Mundwinkel rechts', min: -1 },
  { k: 'mouthWidth', label: 'Lippen dehnen', min: -1 },
  { k: 'mouthOpen', label: 'Mund öffnen', min: 0 },
  { k: 'lipPress', label: 'Lippen pressen', min: 0 },
]

/** Gesichts-Labor: Emotionen selbst bauen und verstehen, welcher Muskel was bewirkt. */
export default function FaceLab() {
  const [p, setP] = useState<FaceParams>(NEUTRAL)
  const [persona, setPersona] = useState(0)
  const [touched, setTouched] = useState(false)
  const set = (k: keyof FaceParams, v: number) => {
    setP({ ...p, [k]: v })
    if (!touched) { setTouched(true); addXp('mimik', 3) }
  }
  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <div className="card md:sticky md:top-4 md:self-start">
        <div className="mx-auto aspect-[4/5] max-w-xs rounded-xl bg-ink-950">
          <Face p={p} persona={PERSONAS[persona]} className="h-full w-full" />
        </div>
        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
          {PERSONAS.map((pp, i) => (
            <button key={i} onClick={() => setPersona(i)} aria-label={`Person ${i + 1}`} className={`h-6 w-6 rounded-full border-2 ${persona === i ? 'border-gold-400' : 'border-transparent'}`} style={{ background: pp.skin }} />
          ))}
        </div>
      </div>
      <div className="card space-y-4">
        <div>
          <div className="mb-2 text-xs uppercase tracking-widest text-gold-500">Vorlage laden</div>
          <div className="flex flex-wrap gap-2">
            <button className="chip hover:text-gold-300" onClick={() => setP(NEUTRAL)}>Neutral</button>
            {EMOTIONS.map((e) => <button key={e.id} className="chip hover:text-gold-300" onClick={() => setP(faceFor(e.id))}>{e.name}</button>)}
          </div>
        </div>
        <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {SLIDERS.map((s) => (
            <label key={s.k} className="block text-sm">
              <div className="flex justify-between text-ink-400"><span>{s.label}</span><span>{p[s.k].toFixed(1)}</span></div>
              <input type="range" min={s.min} max={1} step={0.05} value={p[s.k]} onChange={(e) => set(s.k, Number(e.target.value))} className="w-full accent-[#c9a24a]" />
            </label>
          ))}
        </div>
        <p className="text-xs text-ink-400">Tipp: Lade „Angst“ und „Überraschung“ nacheinander und vergleiche Brauen, Unterlid und Mund. Bau dann eine Verachtung, indem du nur einen Mundwinkel hebst.</p>
      </div>
    </div>
  )
}
