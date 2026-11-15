import { useState } from 'react'
import Face, { NEUTRAL, PERSONAS, type FaceParams } from './Face'
import { EMOTIONS, faceFor } from './data'
import { addXp } from '../../lib/store'
import { useLang, type T } from '../../lib/i18n'

const SLIDERS: { k: keyof FaceParams; label: T; min: number }[] = [
  { k: 'browInner', label: { de: 'Innere Brauen heben', en: 'Raise inner brows' }, min: -1 },
  { k: 'browOuter', label: { de: 'Äußere Brauen heben', en: 'Raise outer brows' }, min: -1 },
  { k: 'browLower', label: { de: 'Brauen senken & zusammenziehen', en: 'Lower & draw brows together' }, min: 0 },
  { k: 'eyeUpper', label: { de: 'Oberlid öffnen / hängen', en: 'Open / droop upper lid' }, min: -1 },
  { k: 'eyeLower', label: { de: 'Unterlid spannen', en: 'Tense lower lid' }, min: 0 },
  { k: 'cheek', label: { de: 'Wangen heben', en: 'Raise cheeks' }, min: 0 },
  { k: 'noseWrinkle', label: { de: 'Nase rümpfen', en: 'Wrinkle nose' }, min: 0 },
  { k: 'nostril', label: { de: 'Nasenflügel blähen', en: 'Flare nostrils' }, min: 0 },
  { k: 'upperLip', label: { de: 'Oberlippe heben', en: 'Raise upper lip' }, min: 0 },
  { k: 'cornerL', label: { de: 'Mundwinkel links', en: 'Left lip corner' }, min: -1 },
  { k: 'cornerR', label: { de: 'Mundwinkel rechts', en: 'Right lip corner' }, min: -1 },
  { k: 'mouthWidth', label: { de: 'Lippen dehnen', en: 'Stretch lips' }, min: -1 },
  { k: 'mouthOpen', label: { de: 'Mund öffnen', en: 'Open mouth' }, min: 0 },
  { k: 'lipPress', label: { de: 'Lippen pressen', en: 'Press lips' }, min: 0 },
]

/** Gesichts-Labor: Emotionen selbst bauen und verstehen, welcher Muskel was bewirkt. */
export default function FaceLab() {
  const { t } = useLang()
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
            <button key={i} onClick={() => setPersona(i)} aria-label={`${t('Person', 'Person')} ${i + 1}`} className={`h-6 w-6 rounded-full border-2 ${persona === i ? 'border-gold-400' : 'border-transparent'}`} style={{ background: pp.skin }} />
          ))}
        </div>
      </div>
      <div className="card space-y-4">
        <div>
          <div className="mb-2 text-xs uppercase tracking-widest text-gold-500">{t('Vorlage laden', 'Load preset')}</div>
          <div className="flex flex-wrap gap-2">
            <button className="chip hover:text-gold-300" onClick={() => setP(NEUTRAL)}>{t('Neutral', 'Neutral')}</button>
            {EMOTIONS.map((e) => <button key={e.id} className="chip hover:text-gold-300" onClick={() => setP(faceFor(e.id))}>{t(e.name)}</button>)}
          </div>
        </div>
        <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {SLIDERS.map((s) => (
            <label key={s.k} className="block text-sm">
              <div className="flex justify-between text-ink-400"><span>{t(s.label)}</span><span>{p[s.k].toFixed(1)}</span></div>
              <input type="range" min={s.min} max={1} step={0.05} value={p[s.k]} onChange={(e) => set(s.k, Number(e.target.value))} className="w-full accent-[#c9a24a]" />
            </label>
          ))}
        </div>
        <p className="text-xs text-ink-400">{t('Tipp: Lade „Angst“ und „Überraschung“ nacheinander und vergleiche Brauen, Unterlid und Mund. Bau dann eine Verachtung, indem du nur einen Mundwinkel hebst.', 'Tip: load “Fear” and “Surprise” one after the other and compare brows, lower lid and mouth. Then build contempt by raising just one lip corner.')}</p>
      </div>
    </div>
  )
}
