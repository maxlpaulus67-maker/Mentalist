import { useEffect, useMemo, useRef, useState } from 'react'
import AreaShell, { type Lesson } from '../../components/AreaShell'
import { ProgressBar } from '../../components/ui'
import { record } from '../../lib/store'
import { shuffle } from '../../lib/util'
import { useLang, type T } from '../../lib/i18n'

const o = (de: string, en: string): T => ({ de, en })

const LESSONS: Lesson[] = [
  {
    id: 'palast-loci', title: o('Die Loci-Methode', 'The method of loci'),
    paragraphs: [
      o('Der Gedächtnispalast ist über 2000 Jahre alt. Du nimmst einen Ort, den du sehr gut kennst – deine Wohnung, deinen Schulweg – und legst auf einer festen Route Bilder ab, die für die Dinge stehen, die du dir merken willst.', 'The memory palace is over 2,000 years old. You take a place you know very well – your home, your way to school – and place images along a fixed route that stand for the things you want to remember.'),
      o('Zum Abrufen gehst du die Route im Kopf ab und „siehst“, was an jedem Ort liegt. Unser Gehirn ist für Orte und Bilder gemacht, nicht für Listen – deshalb funktioniert das so gut.', 'To recall, you walk the route in your mind and “see” what is at each spot. Our brains are built for places and images, not lists – that’s why it works so well.'),
    ],
    bullets: [
      o('1. Wähle einen bekannten Ort.', '1. Choose a familiar place.'),
      o('2. Lege eine feste Route mit 10–20 Stationen fest (Haustür, Garderobe, Spiegel, Sofa …).', '2. Fix a route with 10–20 stations (front door, coat rack, mirror, sofa …).'),
      o('3. Verwandle jeden Begriff in ein lebhaftes, übertriebenes, bewegtes Bild.', '3. Turn every item into a vivid, exaggerated, moving image.'),
      o('4. Verbinde das Bild mit der Station – je absurder, desto besser.', '4. Connect the image with the station – the more absurd, the better.'),
      o('5. Geh die Route einmal ab, bevor du abgefragt wirst.', '5. Walk the route once before being tested.'),
    ],
  },
  {
    id: 'palast-bilder', title: o('Gute Merkbilder bauen', 'Building good memory images'),
    paragraphs: [
      o('Ein gutes Merkbild ist groß, bunt, bewegt, laut, riecht nach etwas und hat oft mit dir selbst zu tun. „Ein Apfel auf dem Sofa“ ist schwach. „Ein riesiger Apfel springt auf dem Sofa auf und ab und spritzt Saft an die Decke“ ist stark.', 'A good memory image is big, colourful, moving, loud, has a smell and often involves you. “An apple on the sofa” is weak. “A giant apple bouncing up and down on the sofa, squirting juice at the ceiling” is strong.'),
      o('Abstrakte Wörter verwandelst du in ähnlich klingende oder symbolische Dinge: „Freiheit“ → eine Freiheitsstatue, „Steuer“ → ein Lenkrad.', 'Turn abstract words into similar-sounding or symbolic things: “freedom” → the Statue of Liberty, “tax” → a stack of tacks.'),
      o('Für die Reihenfolge sorgt die Route. Du musst also nur das Bild an der richtigen Station wiederfinden.', 'The route takes care of the order. You only need to find the image again at the right station.'),
    ],
  },
  {
    id: 'palast-zahlen', title: o('Zahlen merken', 'Remembering numbers'),
    paragraphs: [
      o('Zahlen sind abstrakt. Man macht sie merkbar, indem man sie in Bilder verwandelt. Am einfachsten ist das Zahl-Form-System: 0 = Ei, 1 = Kerze, 2 = Schwan, 3 = Dreizack, 4 = Segelboot, 5 = Haken, 6 = Elefantenrüssel, 7 = Sense, 8 = Sanduhr, 9 = Luftballon an der Schnur.', 'Numbers are abstract. You make them memorable by turning them into images. The simplest is the number-shape system: 0 = egg, 1 = candle, 2 = swan, 3 = trident, 4 = sailboat, 5 = hook, 6 = elephant’s trunk, 7 = scythe, 8 = hourglass, 9 = balloon on a string.'),
      o('Fortgeschrittene nutzen das Major-System: Jede Ziffer wird zu Konsonanten (z. B. 1 = t/d, 2 = n, 3 = m, 4 = r, 5 = l, 6 = sch/ch/j, 7 = k/g, 8 = f/v/w, 9 = p/b, 0 = s/z). Mit Vokalen dazwischen entstehen Wörter: 32 = M-N = „Mond“, 14 = T-R = „Tor“.', 'Advanced users use the major system: each digit becomes consonants (e.g. 1 = t/d, 2 = n, 3 = m, 4 = r, 5 = l, 6 = sh/ch/j, 7 = k/g, 8 = f/v, 9 = p/b, 0 = s/z). Adding vowels produces words: 32 = M-N = “moon”, 14 = T-R = “tire”.'),
      o('Für den Anfang: Teile lange Zahlen in Zweier- oder Dreiergruppen und lege je eine Gruppe an eine Station deines Palastes.', 'To start: split long numbers into pairs or triplets and put each group at one station of your palace.'),
    ],
  },
  {
    id: 'palast-karten', title: o('Kartenreihenfolgen', 'Card sequences'),
    paragraphs: [
      o('Gedächtnissportler merken sich ein gemischtes Kartenspiel in unter 20 Sekunden. Der Trick: Jede Karte ist ein festes Bild (oft eine Person), und die Personen werden entlang der Route platziert.', 'Memory athletes memorise a shuffled deck in under 20 seconds. The trick: each card is a fixed image (often a person), and the people are placed along the route.'),
      o('Einfacher Einstieg: Farbe als Ort-Thema (♥ = Liebe/Herz, ♦ = Geld/Juwelen, ♣ = Natur/Wald, ♠ = Werkzeug/Spaten), Wert als Zahl-Form-Bild. Die Karo-Sieben wird so z. B. zu einer goldenen Sense.', 'Easy start: the suit as a theme (♥ = love/heart, ♦ = money/jewels, ♣ = nature/forest, ♠ = tools/spade), the value as a number-shape image. The seven of diamonds thus becomes, for example, a golden scythe.'),
      o('Beginne mit 5 Karten, steigere langsam auf 10, 15, 20. Die Übung in dieser App zeigt die Karten nacheinander; danach wählst du sie in der richtigen Reihenfolge aus.', 'Start with 5 cards and slowly increase to 10, 15, 20. The exercise in this app shows the cards one after another; afterwards you pick them in the right order.'),
    ],
  },
]

const WORDS: T[] = [
  o('Apfel', 'apple'), o('Leuchtturm', 'lighthouse'), o('Gitarre', 'guitar'), o('Krokodil', 'crocodile'), o('Regenschirm', 'umbrella'), o('Schlüssel', 'key'),
  o('Vulkan', 'volcano'), o('Trompete', 'trumpet'), o('Kerze', 'candle'), o('Pinguin', 'penguin'), o('Brille', 'glasses'), o('Ananas', 'pineapple'),
  o('Rakete', 'rocket'), o('Teekanne', 'teapot'), o('Fahrrad', 'bicycle'), o('Krone', 'crown'), o('Elefant', 'elephant'), o('Uhr', 'clock'),
  o('Zitrone', 'lemon'), o('Anker', 'anchor'), o('Spiegel', 'mirror'), o('Kaktus', 'cactus'), o('Feder', 'feather'), o('Hammer', 'hammer'),
  o('Eule', 'owl'), o('Pizza', 'pizza'), o('Schneemann', 'snowman'), o('Geige', 'violin'), o('Koffer', 'suitcase'), o('Tomate', 'tomato'),
  o('Drache', 'dragon'), o('Laterne', 'lantern'), o('Bürste', 'brush'), o('Muschel', 'seashell'), o('Hubschrauber', 'helicopter'), o('Kissen', 'pillow'),
  o('Schere', 'scissors'), o('Löwe', 'lion'), o('Banane', 'banana'), o('Kompass', 'compass'), o('Ballon', 'balloon'), o('Zahnbürste', 'toothbrush'),
  o('Pyramide', 'pyramid'), o('Frosch', 'frog'), o('Wecker', 'alarm clock'), o('Honig', 'honey'), o('Skateboard', 'skateboard'), o('Fernrohr', 'telescope'),
  o('Bienenstock', 'beehive'), o('Seil', 'rope'), o('Kürbis', 'pumpkin'), o('Taschenlampe', 'torch'), o('Wal', 'whale'), o('Schachbrett', 'chessboard'),
  o('Kirsche', 'cherry'), o('Zelt', 'tent'), o('Papagei', 'parrot'), o('Würfel', 'dice'), o('Mikrofon', 'microphone'), o('Schatztruhe', 'treasure chest'),
]

const SUITS = ['♠', '♥', '♦', '♣']
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
const DECK = SUITS.flatMap((s) => RANKS.map((r) => `${r}${s}`))

function Card({ c, small }: { c: string; small?: boolean }) {
  const red = c.endsWith('♥') || c.endsWith('♦')
  return (
    <div className={`grid place-items-center rounded-lg border border-ink-600 bg-[#f4efe4] font-serif font-semibold shadow ${red ? 'text-rose-700' : 'text-ink-950'} ${small ? 'h-14 w-10 text-base' : 'h-36 w-24 text-4xl'}`}>{c}</div>
  )
}

type Kind = 'woerter' | 'zahlen' | 'karten'
const LEVELS: Record<Kind, number[]> = { woerter: [6, 10, 15, 20], zahlen: [8, 12, 20, 30], karten: [5, 10, 15, 20] }

export function MemoryDrill({ kind, daily, onDone }: { kind: Kind; daily?: boolean; onDone?: () => void }) {
  const { t, lang } = useLang()
  const [n, setN] = useState<number | null>(daily ? LEVELS[kind][0] : null)
  const [phase, setPhase] = useState<'study' | 'recall' | 'result'>('study')
  const [seed, setSeed] = useState(0)
  const items = useMemo<string[]>(() => {
    if (!n) return []
    if (kind === 'woerter') return shuffle(WORDS).slice(0, n).map((w) => w[lang])
    if (kind === 'karten') return shuffle(DECK).slice(0, n)
    return Array.from({ length: n }, () => String(Math.floor(Math.random() * 10)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n, kind, seed])
  const [cardIdx, setCardIdx] = useState(0)
  const [picked, setPicked] = useState<string[]>([])
  const [typed, setTyped] = useState('')
  const studyStart = useRef(0)
  const pool = useMemo(() => shuffle(items), [items])

  useEffect(() => { studyStart.current = performance.now(); setCardIdx(0) }, [items])

  if (!n) {
    const names: Record<Kind, [string, string]> = { woerter: ['Wörter', 'words'], zahlen: ['Ziffern', 'digits'], karten: ['Karten', 'cards'] }
    return (
      <div className="card max-w-xl space-y-4">
        <p className="text-sm text-ink-400">{t('Wie viele willst du dir merken?', 'How many do you want to remember?')}</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {LEVELS[kind].map((l, i) => (
            <button key={l} onClick={() => { setN(l); setPhase('study') }} className="rounded-xl border border-ink-600 px-3 py-4 hover:border-gold-500">
              <div className="font-serif text-2xl text-gold-300">{l}</div>
              <div className="text-xs text-ink-400">{t(names[kind][0], names[kind][1])} · {t(['leicht', 'mittel', 'schwer', 'Profi'][i], ['easy', 'medium', 'hard', 'pro'][i])}</div>
            </button>
          ))}
        </div>
        <p className="text-xs text-ink-400">{t('Tipp: Lies vorher die Lektion zur Loci-Methode und lege jedes Element an eine Station deines Palastes.', 'Tip: read the lesson on the method of loci first and place each item at a station of your palace.')}</p>
      </div>
    )
  }

  const correctCount = () => {
    if (kind === 'zahlen') return items.filter((d, i) => typed[i] === d).length
    return items.filter((x, i) => picked[i] === x).length
  }

  const finish = () => {
    const c = correctCount()
    record({ area: 'palast', ex: kind, ok: c === items.length, ms: Math.round(performance.now() - studyStart.current), d: `${c}/${items.length}` }, 3 + c * 2)
    setPhase('result')
  }

  const reset = () => { setSeed(seed + 1); setPicked([]); setTyped(''); setPhase('study') }

  if (phase === 'study') {
    return (
      <div className="card max-w-2xl space-y-5">
        <div className="flex justify-between text-xs text-ink-400"><span>{t('Einprägen', 'Memorise')}</span><span>{items.length}</span></div>
        {kind === 'woerter' && (
          <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {items.map((w, i) => <li key={i} className="rounded-lg bg-ink-900/70 px-3 py-2"><span className="mr-2 text-xs text-gold-500">{i + 1}</span>{w}</li>)}
          </ol>
        )}
        {kind === 'zahlen' && (
          <div className="break-all rounded-xl bg-ink-900/70 p-5 text-center font-mono text-3xl tracking-[0.25em] text-gold-300">
            {items.join('').replace(/(.{4})/g, '$1 ').trim()}
          </div>
        )}
        {kind === 'karten' && (
          <div className="flex flex-col items-center gap-3">
            <div className="text-xs text-ink-400">{t('Karte', 'Card')} {cardIdx + 1} / {items.length}</div>
            <Card c={items[cardIdx]} />
            <div className="flex gap-2">
              <button className="btn-ghost" disabled={cardIdx === 0} onClick={() => setCardIdx(cardIdx - 1)}>←</button>
              <button className="btn-ghost" disabled={cardIdx === items.length - 1} onClick={() => setCardIdx(cardIdx + 1)}>→</button>
            </div>
          </div>
        )}
        <button className="btn-gold w-full" onClick={() => setPhase('recall')} disabled={kind === 'karten' && cardIdx < items.length - 1}>
          {kind === 'karten' && cardIdx < items.length - 1 ? t('Erst alle Karten ansehen', 'View all cards first') : t('Gemerkt – abfragen!', 'Got it – test me!')}
        </button>
      </div>
    )
  }

  if (phase === 'recall') {
    if (kind === 'zahlen') {
      return (
        <div className="card max-w-2xl space-y-4">
          <p className="text-sm text-ink-400">{t(`Gib die ${items.length} Ziffern in der richtigen Reihenfolge ein.`, `Enter the ${items.length} digits in the right order.`)}</p>
          <input autoFocus inputMode="numeric" value={typed} onChange={(e) => setTyped(e.target.value.replace(/\D/g, '').slice(0, items.length))}
            className="w-full rounded-xl border border-ink-600 bg-ink-900 px-4 py-3 text-center font-mono text-2xl tracking-[0.25em] text-gold-300 focus:border-gold-500 focus:outline-none" />
          <ProgressBar value={typed.length / items.length} />
          <button className="btn-gold w-full" onClick={finish}>{t('Auswerten', 'Check')}</button>
        </div>
      )
    }
    const rest = pool.filter((x) => !picked.includes(x))
    return (
      <div className="card max-w-2xl space-y-4">
        <p className="text-sm text-ink-400">{t('Tippe die Elemente in der richtigen Reihenfolge an.', 'Tap the items in the correct order.')}</p>
        <div className="flex min-h-14 flex-wrap gap-2 rounded-xl bg-ink-900/70 p-3">
          {picked.map((x, i) => kind === 'karten'
            ? <button key={i} onClick={() => setPicked(picked.slice(0, i))}><Card c={x} small /></button>
            : <button key={i} onClick={() => setPicked(picked.slice(0, i))} className="chip text-ink-200"><span className="mr-1 text-gold-500">{i + 1}</span>{x}</button>)}
          {!picked.length && <span className="text-xs text-ink-400">{t('Deine Reihenfolge erscheint hier (antippen zum Zurücknehmen).', 'Your order appears here (tap to undo).')}</span>}
        </div>
        <div className="flex flex-wrap gap-2">
          {rest.map((x) => kind === 'karten'
            ? <button key={x} onClick={() => setPicked([...picked, x])}><Card c={x} small /></button>
            : <button key={x} onClick={() => setPicked([...picked, x])} className="rounded-lg border border-ink-600 px-3 py-2 text-sm hover:border-gold-500">{x}</button>)}
        </div>
        <button className="btn-gold w-full" disabled={rest.length > 0} onClick={finish}>{t('Auswerten', 'Check')}</button>
      </div>
    )
  }

  const c = correctCount()
  const given = kind === 'zahlen' ? typed.split('') : picked
  return (
    <div className="card max-w-2xl space-y-4">
      <div className="text-center">
        <div className="font-serif text-4xl text-gold-300">{c} / {items.length}</div>
        <p className="text-ink-400">{t('an der richtigen Position', 'in the right position')}</p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((x, i) => (
          <span key={i} className={`rounded-md px-2 py-1 text-sm ${given[i] === x ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'}`}>
            {i + 1}. {x}{given[i] !== x && given[i] ? <span className="opacity-60"> ({given[i]})</span> : null}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {daily ? <button className="btn-gold" onClick={onDone}>{t('Weiter', 'Next')}</button> : <>
          <button className="btn-gold" onClick={reset}>{t('Neue Runde', 'New round')}</button>
          <button className="btn-ghost" onClick={() => setN(null)}>{t('Schwierigkeit ändern', 'Change difficulty')}</button>
        </>}
      </div>
    </div>
  )
}

export default function PalastArea() {
  return (
    <AreaShell
      area="palast"
      lessons={LESSONS}
      exercises={[
        { id: 'woerter', title: o('Wortlisten', 'Word lists'), text: o('6 bis 20 Begriffe einprägen und in Reihenfolge abrufen.', 'Memorise 6 to 20 items and recall them in order.'), badge: o(`${WORDS.length} Wörter`, `${WORDS.length} words`), render: () => <MemoryDrill kind="woerter" /> },
        { id: 'zahlen', title: o('Zahlen', 'Numbers'), text: o('8 bis 30 Ziffern merken und eintippen.', 'Remember 8 to 30 digits and type them in.'), badge: o('∞ Aufgaben', '∞ tasks'), render: () => <MemoryDrill kind="zahlen" /> },
        { id: 'karten', title: o('Kartenreihenfolge', 'Card sequence'), text: o('5 bis 20 Spielkarten nacheinander ansehen und in Reihenfolge wählen.', 'View 5 to 20 playing cards one by one and pick them in order.'), badge: o('52 Karten', '52 cards'), render: () => <MemoryDrill kind="karten" /> },
      ]}
    />
  )
}
