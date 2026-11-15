import type { T } from '../../lib/i18n'
import { pick, shuffle } from '../../lib/util'

const o = (de: string, en: string): T => ({ de, en })

export const COLORS = {
  rot: { hex: '#c0392b', name: o('Rot', 'Red') },
  blau: { hex: '#2e6fb7', name: o('Blau', 'Blue') },
  gruen: { hex: '#3f8f4f', name: o('Grün', 'Green') },
  gelb: { hex: '#e2b93b', name: o('Gelb', 'Yellow') },
  weiss: { hex: '#ece8df', name: o('Weiß', 'White') },
  lila: { hex: '#7d4fa6', name: o('Lila', 'Purple') },
  orange: { hex: '#e07b2e', name: o('Orange', 'Orange') },
} as const
export type Color = keyof typeof COLORS
const C = Object.keys(COLORS) as Color[]

export type Weather = 'sonne' | 'regen' | 'nacht'
export type Held = 'handy' | 'zeitung' | 'tasse' | 'nichts'
export type Motif = 'berg' | 'meer' | 'blume'

export interface Person { shirt: Color; hat: boolean; glasses: boolean; held: Held; x: number; sitting: boolean }
export interface SceneState {
  wall: string
  weather: Weather
  clock: number
  motif: Motif
  frame: Color
  mug: Color
  tableBooks: number
  flowers: Color | null
  lampOn: boolean
  shelfBooks: number
  cat: boolean
  rug: Color
  door: boolean // offen
  plant: boolean
  curtain: Color
  persons: Person[]
}

const WALLS = ['#3b3a36', '#34404a', '#463a33', '#3b4538']

export function makeScene(level: number): SceneState {
  const nP = Math.min(3, Math.max(1, level - 1 + (Math.random() < 0.5 ? 0 : 1)))
  const shirts = shuffle(C)
  const xs = shuffle([70, 300, 345])
  return {
    wall: pick(WALLS),
    weather: pick(['sonne', 'regen', 'nacht'] as Weather[]),
    clock: 1 + Math.floor(Math.random() * 12),
    motif: pick(['berg', 'meer', 'blume'] as Motif[]),
    frame: pick(C),
    mug: pick(C),
    tableBooks: 1 + Math.floor(Math.random() * 4),
    flowers: Math.random() < 0.7 ? pick(C) : null,
    lampOn: Math.random() < 0.5,
    shelfBooks: 3 + Math.floor(Math.random() * 5),
    cat: Math.random() < 0.5,
    rug: pick(C),
    door: Math.random() < 0.5,
    plant: Math.random() < 0.6,
    curtain: pick(C),
    persons: Array.from({ length: nP }, (_, i) => ({
      shirt: shirts[i], hat: Math.random() < 0.4, glasses: Math.random() < 0.4,
      held: pick(['handy', 'zeitung', 'tasse', 'nichts'] as Held[]), x: xs[i], sitting: i === 0 && Math.random() < 0.5,
    })),
  }
}

// ------------------------------------------------------------------ Fragen
export interface SceneQ { q: T; options: T[]; answer: number; key: string }

const num = (n: number): T => ({ de: String(n), en: String(n) })
const yesNo = (b: boolean): [T[], number] => [[o('Ja', 'Yes'), o('Nein', 'No')], b ? 0 : 1]

function mc(correct: T, pool: T[]): [T[], number] {
  const others = shuffle(pool.filter((p) => p.de !== correct.de)).slice(0, 3)
  const opts = shuffle([correct, ...others])
  return [opts, opts.findIndex((x) => x.de === correct.de)]
}
const colorQ = (key: string, q: T, c: Color): SceneQ => { const [options, answer] = mc(COLORS[c].name, C.map((x) => COLORS[x].name)); return { key, q, options, answer } }
const numQ = (key: string, q: T, n: number, lo: number, hi: number): SceneQ => {
  const pool: T[] = []; for (let i = lo; i <= hi; i++) pool.push(num(i))
  const [options, answer] = mc(num(n), pool); return { key, q, options, answer }
}

const HELD: Record<Held, T> = { handy: o('Ein Handy', 'A phone'), zeitung: o('Eine Zeitung', 'A newspaper'), tasse: o('Eine Tasse', 'A cup'), nichts: o('Nichts', 'Nothing') }
const WEATHER: Record<Weather, T> = { sonne: o('Sonnig', 'Sunny'), regen: o('Regen', 'Rain'), nacht: o('Nacht', 'Night') }
const MOTIF: Record<Motif, T> = { berg: o('Berge', 'Mountains'), meer: o('Meer mit Segelboot', 'Sea with a sailboat'), blume: o('Eine Blume', 'A flower') }
const posName = (p: Person): T => p.x < 150 ? o('links', 'on the left') : p.x < 320 ? o('in der Mitte', 'in the middle') : o('rechts', 'on the right')

/** Alle möglichen Fragen zu einer Szene (über 20 Vorlagen). */
export function questionsFor(s: SceneState): SceneQ[] {
  const qs: SceneQ[] = [
    colorQ('mug', o('Welche Farbe hatte die Tasse auf dem Tisch?', 'What colour was the mug on the table?'), s.mug),
    numQ('tableBooks', o('Wie viele Bücher lagen auf dem Tisch?', 'How many books were on the table?'), s.tableBooks, 1, 4),
    numQ('clock', o('Welche Stunde zeigte die Wanduhr?', 'Which hour did the wall clock show?'), s.clock, 1, 12),
    { key: 'weather', q: o('Wie war es draußen vor dem Fenster?', 'What was it like outside the window?'), ...(([options, answer]) => ({ options, answer }))(mc(WEATHER[s.weather], Object.values(WEATHER))) },
    { key: 'motif', q: o('Was zeigte das Bild an der Wand?', 'What did the picture on the wall show?'), ...(([options, answer]) => ({ options, answer }))(mc(MOTIF[s.motif], Object.values(MOTIF))) },
    colorQ('frame', o('Welche Farbe hatte der Bilderrahmen?', 'What colour was the picture frame?'), s.frame),
    { key: 'lamp', q: o('War die Stehlampe eingeschaltet?', 'Was the floor lamp switched on?'), ...(([options, answer]) => ({ options, answer }))(yesNo(s.lampOn)) },
    numQ('shelf', o('Wie viele Bücher standen im Regal?', 'How many books stood on the shelf?'), s.shelfBooks, 3, 7),
    { key: 'cat', q: o('War eine Katze im Raum?', 'Was there a cat in the room?'), ...(([options, answer]) => ({ options, answer }))(yesNo(s.cat)) },
    colorQ('rug', o('Welche Farbe hatte der Teppich?', 'What colour was the rug?'), s.rug),
    { key: 'door', q: o('War die Tür offen?', 'Was the door open?'), ...(([options, answer]) => ({ options, answer }))(yesNo(s.door)) },
    { key: 'plant', q: o('Stand eine Topfpflanze im Raum?', 'Was there a potted plant in the room?'), ...(([options, answer]) => ({ options, answer }))(yesNo(s.plant)) },
    colorQ('curtain', o('Welche Farbe hatten die Vorhänge?', 'What colour were the curtains?'), s.curtain),
    numQ('persons', o('Wie viele Personen waren im Raum?', 'How many people were in the room?'), s.persons.length, 1, 4),
    s.flowers
      ? colorQ('flowers', o('Welche Farbe hatten die Blumen in der Vase?', 'What colour were the flowers in the vase?'), s.flowers)
      : { key: 'flowers', q: o('Standen Blumen auf dem Tisch?', 'Were there flowers on the table?'), options: [o('Ja', 'Yes'), o('Nein', 'No')], answer: 1 },
  ]
  s.persons.forEach((p, i) => {
    const where = posName(p)
    qs.push(colorQ(`shirt${i}`, o(`Welche Farbe hatte das Oberteil der Person ${where.de}?`, `What colour was the top of the person ${where.en}?`), p.shirt))
    qs.push({ key: `hat${i}`, q: o(`Trug die Person ${where.de} einen Hut?`, `Was the person ${where.en} wearing a hat?`), ...(([options, answer]) => ({ options, answer }))(yesNo(p.hat)) })
    qs.push({ key: `gl${i}`, q: o(`Trug die Person ${where.de} eine Brille?`, `Was the person ${where.en} wearing glasses?`), ...(([options, answer]) => ({ options, answer }))(yesNo(p.glasses)) })
    qs.push({ key: `held${i}`, q: o(`Was hielt die Person ${where.de} in der Hand?`, `What was the person ${where.en} holding?`), ...(([options, answer]) => ({ options, answer }))(mc(HELD[p.held], Object.values(HELD))) })
    if (p.x < 150) qs.push({ key: `sit${i}`, q: o('Saß die Person links oder stand sie?', 'Was the person on the left sitting or standing?'), options: [o('Sie saß', 'Sitting'), o('Sie stand', 'Standing')], answer: p.sitting ? 0 : 1 })
  })
  return qs
}

// ------------------------------------------------------------------ Zeichnung
function PersonSvg({ p }: { p: Person }) {
  const x = p.x
  const top = p.sitting ? 120 : 92
  const shirt = COLORS[p.shirt].hex
  return (
    <g>
      {/* Beine */}
      {p.sitting
        ? <path d={`M ${x - 9} ${top + 58} l 22 0 l 0 30 M ${x + 7} ${top + 58} l 22 0 l 0 30`} stroke="#2b2b33" strokeWidth="9" fill="none" strokeLinecap="round" />
        : <path d={`M ${x - 7} ${top + 60} l -2 52 M ${x + 7} ${top + 60} l 2 52`} stroke="#2b2b33" strokeWidth="10" strokeLinecap="round" />}
      {/* Körper */}
      <rect x={x - 17} y={top + 16} width="34" height="48" rx="10" fill={shirt} />
      {/* Arme */}
      <path d={`M ${x - 15} ${top + 24} q -10 18 -2 32 M ${x + 15} ${top + 24} q 12 14 4 26`} stroke={shirt} strokeWidth="8" fill="none" strokeLinecap="round" />
      {/* Kopf */}
      <circle cx={x} cy={top} r="15" fill="#d9a882" />
      <circle cx={x - 5} cy={top - 1} r="1.6" fill="#222" /><circle cx={x + 5} cy={top - 1} r="1.6" fill="#222" />
      {p.glasses && <g fill="none" stroke="#111" strokeWidth="1.6"><circle cx={x - 5} cy={top - 1} r="4" /><circle cx={x + 5} cy={top - 1} r="4" /><path d={`M ${x - 1} ${top - 1} h 2`} /></g>}
      {p.hat
        ? <g fill="#1d1d22"><rect x={x - 20} y={top - 13} width="40" height="5" rx="2" /><rect x={x - 12} y={top - 28} width="24" height="17" rx="3" /></g>
        : <path d={`M ${x - 15} ${top - 3} q 2 -16 15 -15 q 13 -1 15 15 q -6 -8 -15 -8 q -9 0 -15 8z`} fill="#3a2a1e" />}
      {/* Gegenstand */}
      {p.held === 'handy' && <rect x={x + 16} y={top + 44} width="8" height="13" rx="2" fill="#111" stroke="#666" />}
      {p.held === 'zeitung' && <g><rect x={x + 10} y={top + 36} width="22" height="16" fill="#e9e5da" /><path d={`M ${x + 13} ${top + 41} h 16 M ${x + 13} ${top + 45} h 16`} stroke="#888" /></g>}
      {p.held === 'tasse' && <g><rect x={x + 16} y={top + 42} width="10" height="11" rx="2" fill="#f2f2f2" /><path d={`M ${x + 26} ${top + 45} q 4 2 0 6`} stroke="#f2f2f2" strokeWidth="2" fill="none" /></g>}
    </g>
  )
}

export function SceneSvg({ s }: { s: SceneState }) {
  const sky = s.weather === 'nacht' ? '#0f1a33' : s.weather === 'regen' ? '#6d7a86' : '#8cc6ef'
  const h = (s.clock % 12) * 30 * (Math.PI / 180)
  return (
    <svg viewBox="0 0 400 260" className="w-full rounded-xl" role="img" aria-label="Szene / scene">
      <rect width="400" height="260" fill={s.wall} />
      <rect y="200" width="400" height="60" fill="#5a4636" />
      <path d="M0 200 H400" stroke="#2a211a" strokeWidth="2" />

      {/* Fenster */}
      <rect x="150" y="30" width="90" height="80" fill={sky} stroke="#e6e1d6" strokeWidth="4" />
      {s.weather === 'sonne' && <circle cx="215" cy="52" r="11" fill="#f6d55c" />}
      {s.weather === 'nacht' && <><circle cx="214" cy="50" r="9" fill="#e8e6d8" /><circle cx="218" cy="47" r="8" fill={sky} /><circle cx="170" cy="45" r="1.2" fill="#fff" /><circle cx="190" cy="70" r="1" fill="#fff" /></>}
      {s.weather === 'regen' && <g stroke="#cfe3f2" strokeWidth="1.3">{[160, 175, 190, 205, 220, 232].map((x, i) => <path key={x} d={`M ${x} ${40 + (i % 3) * 18} l -4 10`} />)}</g>}
      <path d="M195 30 V110 M150 70 H240" stroke="#e6e1d6" strokeWidth="3" />
      <path d="M140 26 q 6 40 0 90 h 12 q -4 -50 0 -90z" fill={COLORS[s.curtain].hex} />
      <path d="M250 26 q -6 40 0 90 h -12 q 4 -50 0 -90z" fill={COLORS[s.curtain].hex} />

      {/* Uhr */}
      <circle cx="290" cy="45" r="17" fill="#f3efe5" stroke="#222" strokeWidth="2" />
      <path d={`M290 45 L ${290 + Math.sin(h) * 9} ${45 - Math.cos(h) * 9}`} stroke="#111" strokeWidth="3" strokeLinecap="round" />
      <path d="M290 45 L 290 31" stroke="#111" strokeWidth="1.6" strokeLinecap="round" />
      {[0, 3, 6, 9].map((k) => <circle key={k} cx={290 + Math.sin(k * Math.PI / 6) * 14} cy={45 - Math.cos(k * Math.PI / 6) * 14} r="1.2" fill="#111" />)}

      {/* Bild */}
      <rect x="30" y="30" width="70" height="52" fill={COLORS[s.frame].hex} />
      <rect x="36" y="36" width="58" height="40" fill="#cfe5f0" />
      {s.motif === 'berg' && <path d="M36 76 L 55 48 L 66 62 L 76 46 L 94 76 Z" fill="#6f7d6a" />}
      {s.motif === 'meer' && <><rect x="36" y="58" width="58" height="18" fill="#2f6fa8" /><path d="M60 58 l 0 -16 l 10 14z" fill="#fff" /></>}
      {s.motif === 'blume' && <><path d="M65 76 V58" stroke="#3f8f4f" strokeWidth="2" /><circle cx="65" cy="52" r="7" fill="#d9486b" /><circle cx="65" cy="52" r="2.5" fill="#f6d55c" /></>}

      {/* Tür */}
      {s.door
        ? <><rect x="330" y="80" width="56" height="120" fill="#1a1a1a" /><path d="M330 80 l 22 8 v 120 l -22 -8z" fill="#7a5a3e" /></>
        : <><rect x="330" y="80" width="56" height="120" fill="#7a5a3e" stroke="#4d3826" strokeWidth="2" /><circle cx="377" cy="142" r="3" fill="#d9b968" /></>}

      {/* Regal */}
      <rect x="20" y="110" width="80" height="6" fill="#6b5039" />
      {Array.from({ length: s.shelfBooks }, (_, i) => <rect key={i} x={24 + i * 10} y={88 + (i % 2) * 3} width="8" height={22 - (i % 2) * 3} fill={COLORS[C[(i * 3) % C.length]].hex} />)}

      {/* Teppich */}
      <ellipse cx="200" cy="232" rx="110" ry="18" fill={COLORS[s.rug].hex} opacity="0.9" />

      {/* Stehlampe */}
      <path d="M118 200 V128" stroke="#222" strokeWidth="3" />
      <path d="M104 128 h 28 l -6 -18 h -16z" fill={s.lampOn ? '#f6e3a1' : '#8a8577'} />
      {s.lampOn && <path d="M104 128 L 90 190 H 146 L 132 128 Z" fill="#f6e3a1" opacity="0.12" />}

      {/* Tisch */}
      <rect x="160" y="160" width="110" height="7" fill="#7a5a3e" />
      <path d="M168 167 V200 M262 167 V200" stroke="#5c4330" strokeWidth="5" />
      {Array.from({ length: s.tableBooks }, (_, i) => <rect key={i} x={170} y={154 - i * 5} width="30" height="5" fill={['#8b2f2f', '#2f4f8b', '#3d6b3d', '#8b6a2f'][i]} stroke="#111" strokeWidth="0.5" />)}
      <rect x="214" y="146" width="12" height="14" rx="2" fill={COLORS[s.mug].hex} />
      <path d="M226 149 q 5 3 0 8" stroke={COLORS[s.mug].hex} strokeWidth="2.5" fill="none" />
      {s.flowers && <g><rect x="244" y="144" width="10" height="16" rx="3" fill="#9fb4c2" /><path d="M249 144 v -10 M246 144 l -5 -8 M252 144 l 5 -8" stroke="#3f8f4f" strokeWidth="1.5" />
        {[[249, 132], [240, 135], [258, 135]].map(([cx, cy]) => <circle key={cx} cx={cx} cy={cy} r="4" fill={COLORS[s.flowers!].hex} />)}</g>}

      {/* Pflanze */}
      {s.plant && <g><path d="M300 200 l 4 -18 h 18 l 4 18z" fill="#8b5a3c" /><path d="M313 182 q -14 -20 -6 -34 M313 182 q 12 -18 4 -32 M313 182 q 0 -24 2 -36" stroke="#3f8f4f" strokeWidth="5" fill="none" strokeLinecap="round" /></g>}

      {/* Stuhl für sitzende Person */}
      {s.persons.some((p) => p.sitting) && <g fill="#4d3826"><rect x="55" y="176" width="40" height="6" /><rect x="55" y="132" width="6" height="68" /><rect x="89" y="180" width="5" height="20" /></g>}

      {s.persons.map((p, i) => <PersonSvg key={i} p={p} />)}

      {/* Katze */}
      {s.cat && <g fill="#222"><ellipse cx="230" cy="232" rx="16" ry="8" /><circle cx="246" cy="225" r="6.5" /><path d="M242 220 l 2 -6 l 3 5 M247 219 l 3 -6 l 2 6" /><path d="M214 232 q -10 -2 -8 -10" stroke="#222" strokeWidth="3" fill="none" /></g>}
    </svg>
  )
}
