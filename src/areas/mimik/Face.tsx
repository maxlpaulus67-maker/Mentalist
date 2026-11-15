import { useId } from 'react'
import { useLang } from '../../lib/i18n'

/**
 * Parametrisches Gesicht. Jeder Wert steuert eine Muskelgruppe
 * (grob angelehnt an Action Units des Facial Action Coding System).
 */
export interface FaceParams {
  browInner: number   // -1..1  inneres Brauenende heben (AU1)
  browOuter: number   // -1..1  äußeres Brauenende heben (AU2)
  browLower: number   //  0..1  Brauen senken & zusammenziehen (AU4)
  eyeUpper: number    // -1..1  Oberlid heben (AU5) / hängen lassen
  eyeLower: number    //  0..1  Unterlid spannen (AU7)
  cheek: number       //  0..1  Wangen heben, Krähenfüße (AU6)
  noseWrinkle: number //  0..1  Nase rümpfen (AU9)
  nostril: number     //  0..1  Nasenflügel blähen (AU38)
  upperLip: number    //  0..1  Oberlippe heben (AU10)
  cornerL: number     // -1..1  linker Mundwinkel (aus Betrachtersicht) hoch/runter
  cornerR: number     // -1..1  rechter Mundwinkel
  mouthWidth: number  // -1..1  Lippen dehnen (AU20) / spitzen
  mouthOpen: number   //  0..1  Kiefer öffnen (AU26/27)
  lipPress: number    //  0..1  Lippen pressen (AU23/24)
}

export const NEUTRAL: FaceParams = {
  browInner: 0, browOuter: 0, browLower: 0, eyeUpper: 0, eyeLower: 0, cheek: 0,
  noseWrinkle: 0, nostril: 0, upperLip: 0, cornerL: 0, cornerR: 0,
  mouthWidth: 0, mouthOpen: 0, lipPress: 0,
}

export interface Persona {
  skin: string
  shade: string
  hair: string
  hairStyle: 0 | 1 | 2 | 3
  iris: string
  width: number // 0.9..1.1
  lip: string
}

export const PERSONAS: Persona[] = [
  { skin: '#e9c4a4', shade: '#c99a78', hair: '#3a2a1e', hairStyle: 0, iris: '#4b6b8a', width: 1, lip: '#b8706a' },
  { skin: '#c68c62', shade: '#a26c45', hair: '#17110d', hairStyle: 1, iris: '#3b2618', width: 1.06, lip: '#8f544a' },
  { skin: '#f1d6c0', shade: '#d4ae94', hair: '#a8743f', hairStyle: 2, iris: '#5c7d4a', width: 0.95, lip: '#c4807a' },
  { skin: '#8d5a3b', shade: '#6c4129', hair: '#120c09', hairStyle: 3, iris: '#2a1a10', width: 1.03, lip: '#6e3b33' },
  { skin: '#dfb592', shade: '#bd8f6b', hair: '#6b6b6b', hairStyle: 1, iris: '#5a4632', width: 1.08, lip: '#a8665d' },
  { skin: '#f3dcc8', shade: '#d8b49a', hair: '#c9a24a', hairStyle: 0, iris: '#3f6a8f', width: 0.97, lip: '#c98a84' },
  { skin: '#b07a52', shade: '#8c5a37', hair: '#2b1d14', hairStyle: 2, iris: '#3a2618', width: 1, lip: '#83493f' },
  { skin: '#e3bc98', shade: '#c09370', hair: '#5a1f12', hairStyle: 3, iris: '#47603d', width: 0.93, lip: '#b06a60' },
]

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))

interface Props {
  p: FaceParams
  persona?: Persona
  className?: string
  /** Hebt Regionen hervor (für Erklärungen) */
  highlight?: Array<'brows' | 'eyes' | 'nose' | 'mouth' | 'cheeks'>
}

export default function Face({ p, persona = PERSONAS[0], className, highlight = [] }: Props) {
  const uid = useId().replace(/:/g, '')
  const { t } = useLang()
  const W = persona.width
  const cx = 100

  // ---------- Augenbrauen ----------
  const brow = (side: -1 | 1) => {
    const innerX = cx + side * (12 - p.browLower * 4)
    const outerX = cx + side * 44 * W
    const innerY = 86 - p.browInner * 11 + p.browLower * 8
    const outerY = 88 - p.browOuter * 9 + p.browLower * 2
    const midX = (innerX + outerX) / 2
    const arch = 6 + p.browOuter * 3 - p.browLower * 3 - Math.max(0, p.browInner) * 2
    const midY = Math.min(innerY, outerY) - arch
    return `M ${outerX} ${outerY} Q ${midX} ${midY} ${innerX} ${innerY}`
  }

  // ---------- Augen ----------
  const eye = (side: -1 | 1) => {
    const ex = cx + side * 25 * W
    const ey = 108
    const hw = 12.5
    const up = clamp(6 + p.eyeUpper * 5 - p.browLower * 1.5, 1.2, 13)
    const lo = clamp(5 - p.eyeLower * 3.2 - p.cheek * 1.2, 1, 7)
    const shape = `M ${ex - hw} ${ey} Q ${ex} ${ey - up * 2} ${ex + hw} ${ey} Q ${ex} ${ey + lo * 2} ${ex - hw} ${ey} Z`
    const upperLid = `M ${ex - hw - 1} ${ey} Q ${ex} ${ey - up * 2 - 0.5} ${ex + hw + 1} ${ey}`
    const lidCrease = `M ${ex - hw + 1} ${ey - 3} Q ${ex} ${ey - up * 2 - 6 + p.browLower * 3} ${ex + hw} ${ey - 4}`
    return { ex, ey, shape, upperLid, lidCrease, up, lo }
  }

  // ---------- Mund ----------
  const mY = 176
  const avg = (p.cornerL + p.cornerR) / 2
  const halfW = (22 + p.mouthWidth * 6 + Math.max(0, avg) * 5 - p.lipPress * 2) * W
  const lX = cx - halfW, rX = cx + halfW
  const lY = mY - p.cornerL * 9 + p.mouthWidth * 1
  const rY = mY - p.cornerR * 9 + p.mouthWidth * 1
  const lineY = mY + avg * 5 - p.upperLip * 2
  const gap = p.mouthOpen * 20
  const thick = 1 - p.lipPress * 0.75
  const upTop = lineY - gap * 0.25 - 6 * thick - p.upperLip * 3
  const innerTop = lineY - gap * 0.25 - p.upperLip * 2.5
  const innerBot = lineY + gap * 0.9
  const lowBot = innerBot + 8 * thick
  const upperLipPath =
    `M ${lX} ${lY} C ${cx - halfW * 0.5} ${upTop - 1}, ${cx - 5} ${upTop - 2}, ${cx} ${upTop + 1.5} ` +
    `C ${cx + 5} ${upTop - 2}, ${cx + halfW * 0.5} ${upTop - 1}, ${rX} ${rY} ` +
    `Q ${cx} ${innerTop + (avg > 0 ? avg * 3 : avg * 2)} ${lX} ${lY} Z`
  const lowerLipPath =
    `M ${lX} ${lY} Q ${cx} ${innerBot + (avg > 0 ? avg * 4 : 0)} ${rX} ${rY} ` +
    `Q ${cx} ${lowBot + (avg > 0 ? avg * 4 : -Math.min(0, avg) * -1)} ${lX} ${lY} Z`
  const cavity =
    `M ${lX} ${lY} Q ${cx} ${innerTop + (avg > 0 ? avg * 3 : avg * 2)} ${rX} ${rY} ` +
    `Q ${cx} ${innerBot + (avg > 0 ? avg * 4 : 0)} ${lX} ${lY} Z`
  const showTeeth = gap > 1.5 && (avg > 0.25 || p.upperLip > 0.4 || p.mouthWidth > 0.5)
  const showBottomTeeth = gap > 6 && p.mouthWidth > 0.5

  const L = eye(-1), R = eye(1)
  const stroke = '#2a1d17'
  const hl = (k: string) => highlight.includes(k as never)

  return (
    <svg viewBox="0 0 200 250" className={className} role="img" aria-label={t('Gezeichnetes Gesicht', 'Drawn face')}>
      <defs>
        <radialGradient id={`sk${uid}`} cx="50%" cy="42%" r="62%">
          <stop offset="0%" stopColor={persona.skin} />
          <stop offset="100%" stopColor={persona.shade} />
        </radialGradient>
        <clipPath id={`el${uid}`}><path d={L.shape} /></clipPath>
        <clipPath id={`er${uid}`}><path d={R.shape} /></clipPath>
        <clipPath id={`mc${uid}`}><path d={cavity} /></clipPath>
      </defs>

      {/* Hals & Schultern */}
      <path d={`M ${cx - 28} 205 L ${cx - 30} 236 L ${cx + 30} 236 L ${cx + 28} 205 Z`} fill={persona.shade} />
      <path d="M 20 250 Q 30 228 70 226 L 130 226 Q 170 228 180 250 Z" fill="#2e2e34" />
      <path d={`M ${cx - 20} 226 L ${cx} 244 L ${cx + 20} 226`} fill="none" stroke="#1d1d22" strokeWidth="3" />

      {/* Haare hinten */}
      {persona.hairStyle === 2 && (
        <path d={`M ${cx - 78 * W} 110 Q ${cx - 86 * W} 30 ${cx} 26 Q ${cx + 86 * W} 30 ${cx + 78 * W} 110 L ${cx + 80 * W} 200 Q ${cx + 60} 210 ${cx + 52 * W} 170 L ${cx - 52 * W} 170 Q ${cx - 60} 210 ${cx - 80 * W} 200 Z`} fill={persona.hair} />
      )}

      {/* Ohren */}
      <ellipse cx={cx - 70 * W} cy={118} rx={9} ry={16} fill={persona.shade} />
      <ellipse cx={cx + 70 * W} cy={118} rx={9} ry={16} fill={persona.shade} />

      {/* Kopf */}
      <path
        d={`M ${cx} 30 C ${cx + 52 * W} 30 ${cx + 72 * W} 66 ${cx + 70 * W} 112 C ${cx + 68 * W} 168 ${cx + 40 * W} 210 ${cx} 212 C ${cx - 40 * W} 210 ${cx - 68 * W} 168 ${cx - 70 * W} 112 C ${cx - 72 * W} 66 ${cx - 52 * W} 30 ${cx} 30 Z`}
        fill={`url(#sk${uid})`}
      />

      {/* Stirnfalten bei gehobenen Brauen */}
      {Math.max(p.browInner, p.browOuter) > 0.45 && (
        <g stroke={persona.shade} strokeWidth="1.4" fill="none" opacity={Math.min(1, (Math.max(p.browInner, p.browOuter) - 0.4) * 1.6)}>
          {p.browOuter > 0.4
            ? <><path d={`M ${cx - 32} 60 Q ${cx} 55 ${cx + 32} 60`} /><path d={`M ${cx - 26} 68 Q ${cx} 64 ${cx + 26} 68`} /></>
            : <><path d={`M ${cx - 14} 64 Q ${cx} 58 ${cx + 14} 64`} /><path d={`M ${cx - 10} 71 Q ${cx} 66 ${cx + 10} 71`} /></>}
        </g>
      )}
      {/* Zornesfalten */}
      {p.browLower > 0.3 && (
        <g stroke={persona.shade} strokeWidth="1.6" opacity={Math.min(1, p.browLower * 1.3)}>
          <path d={`M ${cx - 4} 82 L ${cx - 3} 96`} /><path d={`M ${cx + 4} 82 L ${cx + 3} 96`} />
        </g>
      )}

      {/* Haare vorne */}
      {persona.hairStyle === 0 && (
        <path d={`M ${cx - 72 * W} 104 C ${cx - 80 * W} 40 ${cx - 30} 18 ${cx + 6} 22 C ${cx + 56 * W} 22 ${cx + 82 * W} 48 ${cx + 72 * W} 104 C ${cx + 64 * W} 70 ${cx + 46} 54 ${cx + 20} 50 C ${cx - 10} 56 ${cx - 40} 52 ${cx - 56 * W} 62 C ${cx - 64 * W} 72 ${cx - 68 * W} 86 ${cx - 72 * W} 104 Z`} fill={persona.hair} />
      )}
      {persona.hairStyle === 1 && (
        <path d={`M ${cx - 70 * W} 96 C ${cx - 74 * W} 44 ${cx - 40} 22 ${cx} 22 C ${cx + 40} 22 ${cx + 74 * W} 44 ${cx + 70 * W} 96 C ${cx + 66 * W} 64 ${cx + 48} 48 ${cx} 46 C ${cx - 48} 48 ${cx - 66 * W} 64 ${cx - 70 * W} 96 Z`} fill={persona.hair} />
      )}
      {persona.hairStyle === 2 && (
        <path d={`M ${cx - 72 * W} 112 C ${cx - 76 * W} 40 ${cx - 30} 22 ${cx} 24 C ${cx + 30} 22 ${cx + 76 * W} 40 ${cx + 72 * W} 112 C ${cx + 62 * W} 70 ${cx + 40} 56 ${cx + 6} 46 C ${cx - 20} 60 ${cx - 56 * W} 66 ${cx - 72 * W} 112 Z`} fill={persona.hair} />
      )}
      {persona.hairStyle === 3 && (
        <path d={`M ${cx - 66 * W} 80 C ${cx - 64 * W} 38 ${cx - 30} 26 ${cx} 26 C ${cx + 30} 26 ${cx + 64 * W} 38 ${cx + 66 * W} 80 C ${cx + 56 * W} 56 ${cx + 30} 44 ${cx} 44 C ${cx - 30} 44 ${cx - 56 * W} 56 ${cx - 66 * W} 80 Z`} fill={persona.hair} />
      )}

      {/* Augen */}
      {[L, R].map((e, i) => (
        <g key={i}>
          <path d={e.lidCrease} fill="none" stroke={persona.shade} strokeWidth="1.3" opacity={0.8} />
          <path d={e.shape} fill="#f6f2ea" />
          <g clipPath={`url(#${i === 0 ? 'el' : 'er'}${uid})`}>
            <circle cx={e.ex} cy={e.ey + (p.eyeUpper < 0 ? 1.5 : 0)} r={6} fill={persona.iris} />
            <circle cx={e.ex} cy={e.ey + (p.eyeUpper < 0 ? 1.5 : 0)} r={2.8} fill="#0b0b0b" />
            <circle cx={e.ex + 2} cy={e.ey - 2} r={1.2} fill="#fff" opacity="0.9" />
          </g>
          <path d={e.upperLid} fill="none" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" />
          {/* gespanntes Unterlid */}
          {p.eyeLower > 0.35 && (
            <path d={`M ${e.ex - 11} ${e.ey + 1} Q ${e.ex} ${e.ey + e.lo * 2 + 1} ${e.ex + 11} ${e.ey + 1}`} fill="none" stroke={persona.shade} strokeWidth="1.4" />
          )}
          {/* Krähenfüße */}
          {p.cheek > 0.35 && (
            <g stroke={persona.shade} strokeWidth="1.2" opacity={Math.min(1, p.cheek * 1.2)} fill="none">
              {[-5, 0, 5].map((dy) => {
                const sx = e.ex + (i === 0 ? -15 : 15)
                return <path key={dy} d={`M ${sx} ${e.ey + dy * 0.6} l ${i === 0 ? -7 : 7} ${dy}`} />
              })}
            </g>
          )}
        </g>
      ))}

      {/* Brauen */}
      <path d={brow(-1)} fill="none" stroke={persona.hair === '#c9a24a' ? '#8a6a2a' : persona.hair} strokeWidth="5" strokeLinecap="round" />
      <path d={brow(1)} fill="none" stroke={persona.hair === '#c9a24a' ? '#8a6a2a' : persona.hair} strokeWidth="5" strokeLinecap="round" />

      {/* Wangen gehoben */}
      {p.cheek > 0.2 && (
        <g fill="#d2756a" opacity={p.cheek * 0.18}>
          <ellipse cx={cx - 40 * W} cy={140 - p.cheek * 4} rx={14} ry={9} />
          <ellipse cx={cx + 40 * W} cy={140 - p.cheek * 4} rx={14} ry={9} />
        </g>
      )}

      {/* Nase */}
      <g fill="none" stroke={persona.shade} strokeWidth="1.8" strokeLinecap="round">
        <path d={`M ${cx - 4} 104 Q ${cx - 6} 130 ${cx - 10} ${144 - p.noseWrinkle * 3}`} opacity={0.7} />
        <path d={`M ${cx - 12 - p.nostril * 3 - p.noseWrinkle * 2} ${146 - p.noseWrinkle * 4} Q ${cx - 14 - p.nostril * 3} ${153 - p.noseWrinkle * 3} ${cx - 5} ${152 - p.noseWrinkle * 3} Q ${cx} ${155 - p.noseWrinkle * 3} ${cx + 5} ${152 - p.noseWrinkle * 3} Q ${cx + 14 + p.nostril * 3} ${153 - p.noseWrinkle * 3} ${cx + 12 + p.nostril * 3 + p.noseWrinkle * 2} ${146 - p.noseWrinkle * 4}`} stroke={stroke} strokeWidth="1.6" opacity={0.75} />
        {p.noseWrinkle > 0.3 && (
          <g opacity={Math.min(1, p.noseWrinkle * 1.3)} strokeWidth="1.4">
            <path d={`M ${cx - 8} 112 Q ${cx} 116 ${cx + 8} 112`} />
            <path d={`M ${cx - 9} 119 Q ${cx} 123 ${cx + 9} 119`} />
            <path d={`M ${cx - 7} 126 Q ${cx} 129 ${cx + 7} 126`} />
          </g>
        )}
      </g>

      {/* Nasolabialfalten */}
      {(p.cheek > 0.3 || p.upperLip > 0.3) && (
        <g fill="none" stroke={persona.shade} strokeWidth="1.6" opacity={Math.min(1, Math.max(p.cheek, p.upperLip))}>
          <path d={`M ${cx - 17 - p.nostril * 3} ${148 - p.noseWrinkle * 3} Q ${lX - 6} ${(lY + 150) / 2} ${lX - 3} ${lY + 4}`} />
          <path d={`M ${cx + 17 + p.nostril * 3} ${148 - p.noseWrinkle * 3} Q ${rX + 6} ${(rY + 150) / 2} ${rX + 3} ${rY + 4}`} />
        </g>
      )}

      {/* Mund */}
      <path d={cavity} fill="#3a1414" />
      {showTeeth && (
        <g clipPath={`url(#mc${uid})`}>
          <rect x={lX} y={innerTop - 4} width={halfW * 2} height={Math.max(4, gap * 0.45) + 4} fill="#f2ede4" />
          {showBottomTeeth && <rect x={lX} y={innerBot - 5} width={halfW * 2} height={5} fill="#e6e0d4" />}
        </g>
      )}
      <path d={upperLipPath} fill={persona.lip} />
      <path d={lowerLipPath} fill={persona.lip} opacity={0.92} />
      <path d={`M ${lX} ${lY} Q ${cx} ${innerTop + (avg > 0 ? avg * 3 : avg * 2)} ${rX} ${rY}`} fill="none" stroke={stroke} strokeWidth="1.4" opacity="0.75" />
      {/* Kinnspannung bei Trauer/gepressten Lippen */}
      {(avg < -0.4 || p.lipPress > 0.6) && (
        <path d={`M ${cx - 10} ${lowBot + 12} Q ${cx} ${lowBot + 8} ${cx + 10} ${lowBot + 12}`} fill="none" stroke={persona.shade} strokeWidth="1.3" opacity="0.8" />
      )}
      {/* Grübchen Verachtung */}
      {Math.abs(p.cornerL - p.cornerR) > 0.3 && (
        <path
          d={p.cornerR > p.cornerL
            ? `M ${rX + 2} ${rY - 5} q 4 4 1 9`
            : `M ${lX - 2} ${lY - 5} q -4 4 -1 9`}
          fill="none" stroke={persona.shade} strokeWidth="1.5"
        />
      )}

      {/* Hervorhebungen */}
      <g fill="none" stroke="#d9b968" strokeWidth="1.5" strokeDasharray="4 3">
        {hl('brows') && <rect x={cx - 52 * W} y={66} width={104 * W} height={30} rx={10} />}
        {hl('eyes') && <rect x={cx - 44 * W} y={94} width={88 * W} height={28} rx={10} />}
        {hl('cheeks') && <><ellipse cx={cx - 40 * W} cy={138} rx={18} ry={12} /><ellipse cx={cx + 40 * W} cy={138} rx={18} ry={12} /></>}
        {hl('nose') && <rect x={cx - 20} y={106} width={40} height={52} rx={10} />}
        {hl('mouth') && <rect x={cx - 38 * W} y={158} width={76 * W} height={40} rx={12} />}
      </g>
    </svg>
  )
}
