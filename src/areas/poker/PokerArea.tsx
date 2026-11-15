import { useMemo, useRef, useState } from 'react'
import AreaShell, { type Lesson } from '../../components/AreaShell'
import QuizRunner, { type QuizQuestion } from '../../components/QuizRunner'
import { ProgressBar } from '../../components/ui'
import { record } from '../../lib/store'
import { pick } from '../../lib/util'
import { useLang, type T } from '../../lib/i18n'

const o = (de: string, en: string): T => ({ de, en })

// ---------------------------------------------------------------- Mathe
/** Gewinnwahrscheinlichkeit, die Hand zu treffen. cards = noch kommende Karten (1 oder 2). */
export function hitChance(outs: number, cards: 1 | 2) {
  if (cards === 1) return outs / 46
  return 1 - ((47 - outs) / 47) * ((46 - outs) / 46)
}
/** Benötigte Equity für einen profitablen Call */
export const potOdds = (pot: number, call: number) => call / (pot + call)

const DRAWS: { name: T; outs: number }[] = [
  { name: o('Flush-Draw', 'Flush draw'), outs: 9 },
  { name: o('Open-Ended Straight-Draw', 'Open-ended straight draw'), outs: 8 },
  { name: o('Gutshot (Inside Straight-Draw)', 'Gutshot (inside straight draw)'), outs: 4 },
  { name: o('Zwei Overcards', 'Two overcards'), outs: 6 },
  { name: o('Flush-Draw + Open-Ended', 'Flush draw + open-ended'), outs: 15 },
  { name: o('Flush-Draw + Gutshot', 'Flush draw + gutshot'), outs: 12 },
  { name: o('Pocket-Paar auf Drilling', 'Pocket pair to a set'), outs: 2 },
  { name: o('Zwei Paare auf Full House', 'Two pair to a full house'), outs: 4 },
]

const LESSONS: Lesson[] = [
  {
    id: 'poker-spielgeld', title: o('Warum Poker für Mentalisten?', 'Why poker for mentalists?'),
    paragraphs: [
      o('Poker verbindet Wahrscheinlichkeitsrechnung mit dem Lesen von Menschen. Es zwingt dich, in Wahrscheinlichkeiten statt in Gewissheiten zu denken – genau die Haltung, die ein guter Beobachter braucht.', 'Poker combines probability with reading people. It forces you to think in probabilities instead of certainties – exactly the mindset a good observer needs.'),
      o('Dieser Bereich trainiert ausschließlich mit Spielgeld und Rechenaufgaben. Es gibt keinen Bezug zu Echtgeld-Glücksspiel. Glücksspiel um Geld kann süchtig machen – wenn du merkst, dass es dir schadet, hol dir Hilfe (z. B. bei einer Suchtberatungsstelle).', 'This area trains exclusively with play money and maths exercises. There is no link to real-money gambling. Gambling for money can be addictive – if you notice it harming you, seek help (e.g. from an addiction counselling service).'),
      o('Die wichtigste Lektion vorweg: Tells sind schwache Hinweise. Mathematik und Position schlagen fast immer die Körpersprache.', 'The most important lesson first: tells are weak clues. Maths and position almost always beat body language.'),
    ],
  },
  {
    id: 'poker-potodds', title: o('Pot Odds', 'Pot odds'),
    paragraphs: [
      o('Pot Odds vergleichen, was du einsetzen musst, mit dem, was du gewinnen kannst. Formel: benötigte Gewinnchance = zu callender Betrag ÷ (Pot inkl. gegnerischem Einsatz + dein Call).', 'Pot odds compare what you must put in with what you can win. Formula: required equity = amount to call ÷ (pot including opponent’s bet + your call).'),
      o('Beispiel: Im Pot liegen 100 (inkl. Einsatz des Gegners), du musst 20 callen. 20 ÷ 120 ≈ 17 %. Gewinnst du in mehr als 17 % der Fälle, ist der Call langfristig profitabel.', 'Example: the pot holds 100 (including the opponent’s bet), you must call 20. 20 ÷ 120 ≈ 17 %. If you win more than 17 % of the time, the call is profitable in the long run.'),
      o('Faustregel für Einsätze: Ein Einsatz von einem halben Pot verlangt 25 %, ein Pot-großer Einsatz 33 %, ein doppelter Pot 40 %.', 'Rules of thumb for bets: a half-pot bet requires 25 %, a pot-sized bet 33 %, a double-pot bet 40 %.'),
    ],
  },
  {
    id: 'poker-outs', title: o('Outs & die 2/4-Regel', 'Outs & the rule of 2 and 4'),
    paragraphs: [
      o('Outs sind die Karten, die deine Hand zur (vermutlich) besten machen. Ein Flush-Draw hat 9 Outs (13 Karten einer Farbe minus 4 sichtbare).', 'Outs are the cards that turn your hand into the (probably) best one. A flush draw has 9 outs (13 cards of a suit minus 4 visible).'),
      o('2/4-Regel: Auf dem Turn (eine Karte kommt) Outs × 2 ≈ Trefferchance in %. Auf dem Flop, wenn du bis zum River siehst (zwei Karten), Outs × 4. Bei vielen Outs (über 8) überschätzt ×4 leicht.', 'Rule of 2 and 4: on the turn (one card to come) outs × 2 ≈ hit chance in %. On the flop, seeing to the river (two cards), outs × 4. With many outs (over 8), ×4 slightly overestimates.'),
      o('Genau gerechnet: Flush-Draw auf dem Turn 9/46 ≈ 19,6 %, auf dem Flop bis zum River ≈ 35 %.', 'Exactly: a flush draw on the turn is 9/46 ≈ 19.6 %; on the flop to the river ≈ 35 %.'),
    ],
    bullets: [
      o('Flush-Draw: 9 Outs', 'Flush draw: 9 outs'),
      o('Open-Ended Straight-Draw: 8 Outs', 'Open-ended straight draw: 8 outs'),
      o('Gutshot: 4 Outs', 'Gutshot: 4 outs'),
      o('Zwei Overcards: ca. 6 Outs', 'Two overcards: about 6 outs'),
      o('Flush-Draw + Open-Ended: 15 Outs', 'Flush draw + open-ended: 15 outs'),
    ],
  },
  {
    id: 'poker-positionen', title: o('Positionen', 'Positions'),
    paragraphs: [
      o('Wer später handelt, hat mehr Informationen. Deshalb ist der Button (Dealer) die stärkste Position, die Blinds und „Under the Gun“ (direkt links vom Big Blind) die schwächsten.', 'Acting later means more information. That is why the button (dealer) is the strongest position, and the blinds and “under the gun” (directly left of the big blind) the weakest.'),
      o('Frühe Position: Small Blind, Big Blind (nach dem Flop), Under the Gun. Mittlere Position: die Plätze danach. Späte Position: Hijack, Cutoff, Button.', 'Early position: small blind, big blind (after the flop), under the gun. Middle position: the seats after that. Late position: hijack, cutoff, button.'),
      o('Faustregel: In früher Position nur starke Hände spielen, in später Position darf die Auswahl breiter werden.', 'Rule of thumb: in early position play only strong hands; in late position your range can widen.'),
    ],
  },
  {
    id: 'poker-starthaende', title: o('Starthände', 'Starting hands'),
    paragraphs: [
      o('Die stärksten Starthände im Texas Hold’em: Asse (AA), Könige (KK), Damen (QQ), Ass-König (AK). Gleiche Farbe („suited“) ist etwas besser als verschiedene Farben („offsuit“).', 'The strongest starting hands in Texas Hold’em: aces (AA), kings (KK), queens (QQ), ace-king (AK). Same suit (“suited”) is slightly better than different suits (“offsuit”).'),
      o('Gefährlich sind „dominierte“ Hände wie A2 offsuit oder KJ in früher Position: Wenn du triffst, hat der Gegner oft dieselbe hohe Karte mit besserem Kicker.', 'Dangerous are “dominated” hands like A2 offsuit or KJ in early position: when you hit, the opponent often has the same high card with a better kicker.'),
      o('Kleine Paare spielt man oft, um einen Drilling zu treffen (ca. 12 % auf dem Flop) – dann aber nur, wenn genug Chips im Spiel sind.', 'Small pairs are often played to hit a set (about 12 % on the flop) – but only when enough chips are in play.'),
    ],
  },
  {
    id: 'poker-tells', title: o('Tells – mit Vorsicht', 'Tells – with caution'),
    paragraphs: [
      o('Ein Tell ist eine Verhaltensänderung, die mit der Stärke der Hand zusammenhängt. Auch hier gilt: Baseline zuerst! Ein Spieler, der immer zittert, verrät mit Zittern nichts.', 'A tell is a change in behaviour linked to hand strength. Here too: baseline first! A player who always shakes reveals nothing by shaking.'),
      o('Häufig beschrieben: Starke Hand → betont gelangweilt oder schwach wirken („Stark heißt schwach, schwach heißt stark“). Zittern beim Setzen kann Aufregung über eine starke Hand sein. Sofortiges Checken nach dem Blick auf den Flop kann Desinteresse zeigen.', 'Commonly described: strong hand → acting deliberately bored or weak (“strong means weak, weak means strong”). Shaking while betting can be excitement about a strong hand. Checking immediately after looking at the flop can show disinterest.'),
      o('Gute Spieler kennen diese Tells und spielen sie absichtlich falsch vor. Wetten nie allein auf einen Tell – kombiniere ihn mit Setzverhalten und Mathematik.', 'Good players know these tells and fake them on purpose. Never bet on a tell alone – combine it with betting patterns and maths.'),
    ],
  },
]

const QUIZ_POS: QuizQuestion[] = [
  { q: o('Welche Position gilt als die stärkste?', 'Which position is considered the strongest?'), options: [o('Button', 'Button'), o('Small Blind', 'Small blind'), o('Under the Gun', 'Under the gun'), o('Big Blind', 'Big blind')], answer: 0, why: o('Der Button handelt nach dem Flop zuletzt und hat die meisten Informationen.', 'The button acts last after the flop and has the most information.') },
  { q: o('Warum ist späte Position ein Vorteil?', 'Why is late position an advantage?'), options: [o('Man sieht, was die anderen tun, bevor man entscheidet', 'You see what others do before you decide'), o('Man bekommt bessere Karten', 'You get better cards'), o('Man zahlt keine Blinds', 'You pay no blinds'), o('Gar nicht', 'It isn’t')], answer: 0, why: o('Information ist im Poker der wichtigste Vorteil.', 'Information is the biggest advantage in poker.') },
  { q: o('Welche Starthand ist die stärkste?', 'Which starting hand is the strongest?'), options: [o('AA', 'AA'), o('AK suited', 'AK suited'), o('KK', 'KK'), o('72 offsuit', '72 offsuit')], answer: 0, why: o('Zwei Asse sind die beste Starthand im Hold’em.', 'Pocket aces are the best starting hand in Hold’em.') },
  { q: o('Was bedeutet „suited“?', 'What does “suited” mean?'), options: [o('Beide Karten haben dieselbe Farbe', 'Both cards have the same suit'), o('Beide Karten sind gleich hoch', 'Both cards have the same rank'), o('Man trägt einen Anzug', 'Wearing a suit'), o('Die Karten sind aufeinanderfolgend', 'The cards are consecutive')], answer: 0, why: o('Suited = gleiche Farbe, z. B. A♠ K♠.', 'Suited = same suit, e.g. A♠ K♠.') },
  { q: o('Warum ist A2 offsuit in früher Position riskant?', 'Why is A2 offsuit risky in early position?'), options: [o('Sie ist oft dominiert – Gegner haben ein Ass mit besserem Kicker', 'It is often dominated – opponents have an ace with a better kicker'), o('Asse sind schwach', 'Aces are weak'), o('Weil 2 eine Glückszahl ist', 'Because 2 is a lucky number'), o('Ist sie nicht', 'It isn’t')], answer: 0, why: o('Beim Treffen des Asses verliert man oft gegen AK, AQ usw.', 'When you hit the ace you often lose to AK, AQ etc.') },
  { q: o('Wie oft trifft ein Pocket-Paar auf dem Flop einen Drilling (oder besser)?', 'How often does a pocket pair flop a set (or better)?'), options: [o('ca. 12 %', 'about 12 %'), o('ca. 50 %', 'about 50 %'), o('ca. 2 %', 'about 2 %'), o('ca. 33 %', 'about 33 %')], answer: 0, why: o('Rund 1 von 8,5 Flops.', 'Roughly 1 in 8.5 flops.') },
  { q: o('Was ist „Under the Gun“?', 'What is “under the gun”?'), options: [o('Erster Spieler, der vor dem Flop handeln muss', 'The first player to act before the flop'), o('Der Dealer', 'The dealer'), o('Der Spieler mit den meisten Chips', 'The player with the most chips'), o('Ein Tell', 'A tell')], answer: 0, why: o('UTG sitzt links vom Big Blind und handelt preflop zuerst.', 'UTG sits left of the big blind and acts first preflop.') },
  { q: o('Was ist ein Kicker?', 'What is a kicker?'), options: [o('Die Beikarte, die bei gleicher Hand entscheidet', 'The side card that decides between equal hands'), o('Ein aggressiver Spieler', 'An aggressive player'), o('Der höchste Einsatz', 'The highest bet'), o('Ein Bluff', 'A bluff')], answer: 0, why: o('Bei AK gegen AQ auf einem Ass-Board entscheidet der Kicker (K schlägt Q).', 'With AK vs AQ on an ace-high board the kicker decides (K beats Q).') },
  { q: o('Pot 100, Gegner setzt 50 (Pot jetzt 150). Welche Gewinnchance brauchst du für den Call?', 'Pot 100, opponent bets 50 (pot now 150). What equity do you need to call?'), options: [o('25 %', '25 %'), o('33 %', '33 %'), o('50 %', '50 %'), o('10 %', '10 %')], answer: 0, why: o('50 ÷ (150 + 50) = 25 %.', '50 ÷ (150 + 50) = 25 %.') },
  { q: o('Wie viele Outs hat ein Flush-Draw?', 'How many outs does a flush draw have?'), options: [o('9', '9'), o('8', '8'), o('4', '4'), o('13', '13')], answer: 0, why: o('13 Karten der Farbe minus 4 sichtbare = 9.', '13 cards of the suit minus 4 visible = 9.') },
  { q: o('2/4-Regel: 8 Outs auf dem Flop, du siehst Turn und River. Ungefähre Chance?', 'Rule of 2 and 4: 8 outs on the flop, you see turn and river. Approximate chance?'), options: [o('ca. 32 %', 'about 32 %'), o('ca. 16 %', 'about 16 %'), o('ca. 8 %', 'about 8 %'), o('ca. 64 %', 'about 64 %')], answer: 0, why: o('8 × 4 = 32 % (exakt ca. 31,5 %).', '8 × 4 = 32 % (exactly about 31.5 %).') },
  { q: o('Ein Pot-großer Einsatz verlangt welche Gewinnchance für einen Call?', 'A pot-sized bet requires what equity to call?'), options: [o('33 %', '33 %'), o('50 %', '50 %'), o('25 %', '25 %'), o('20 %', '20 %')], answer: 0, why: o('Pot P, Einsatz P: P ÷ (2P + P) = 1/3.', 'Pot P, bet P: P ÷ (2P + P) = 1/3.') },
]

const QUIZ_TELLS: QuizQuestion[] = [
  { q: o('Was musst du kennen, bevor du einen Tell deutest?', 'What must you know before reading a tell?'), options: [o('Die Baseline des Spielers', 'The player’s baseline'), o('Seinen Namen', 'Their name'), o('Seine Lieblingskarte', 'Their favourite card'), o('Nichts', 'Nothing')], answer: 0, why: o('Nur Veränderungen gegenüber dem Normalverhalten sind Tells.', 'Only changes from normal behaviour are tells.') },
  { q: o('„Stark heißt schwach, schwach heißt stark“ beschreibt …', '“Strong means weak, weak means strong” describes …'), options: [o('Schauspielern: Spieler zeigen oft das Gegenteil ihrer Handstärke', 'Acting: players often show the opposite of their hand strength'), o('Die Kartenwerte', 'Card values'), o('Die Position', 'Position'), o('Die Blinds', 'The blinds')], answer: 0, why: o('Unerfahrene Spieler „spielen“ oft das Gegenteil vor.', 'Inexperienced players often act out the opposite.') },
  { q: o('Ein Spieler mit ruhiger Baseline zittert plötzlich beim Setzen. Das deutet oft auf …', 'A player with a calm baseline suddenly shakes while betting. This often suggests …'), options: [o('Aufregung – häufig über eine starke Hand', 'Excitement – often about a strong hand'), o('Sicher einen Bluff', 'Definitely a bluff'), o('Kälte', 'Cold'), o('Langeweile', 'Boredom')], answer: 0, why: o('Adrenalin bei starker Hand ist schwer zu kontrollieren – aber kein Beweis.', 'Adrenaline with a strong hand is hard to control – but not proof.') },
  { q: o('Ein Spieler schaut nach dem Flop sofort auf seine Chips. Häufige Deutung?', 'A player glances at their chips right after the flop. Common reading?'), options: [o('Interesse – er plant vielleicht zu setzen', 'Interest – they may plan to bet'), o('Desinteresse', 'Disinterest'), o('Er zählt aus Langeweile', 'Counting out of boredom'), o('Er will gehen', 'They want to leave')], answer: 0, why: o('Ein unbewusster Blick zu den Chips kann zeigen, dass der Flop gefallen hat.', 'An unconscious glance at the chips can show the flop pleased them.') },
  { q: o('Was ist die größte Gefahr beim Spielen nach Tells?', 'What is the biggest danger when playing by tells?'), options: [o('Gute Spieler täuschen absichtlich falsche Tells vor', 'Good players deliberately fake tells'), o('Tells sind verboten', 'Tells are forbidden'), o('Tells gibt es nicht', 'Tells don’t exist'), o('Tells sind immer richtig', 'Tells are always right')], answer: 0, why: o('Reverse Tells sind ein bekanntes Mittel erfahrener Spieler.', 'Reverse tells are a known tool of experienced players.') },
  { q: o('Was ist verlässlicher als Körpersprache am Pokertisch?', 'What is more reliable than body language at the poker table?'), options: [o('Setzmuster und Mathematik', 'Betting patterns and maths'), o('Kleidung', 'Clothing'), o('Sitzplatzfarbe', 'Seat colour'), o('Uhrzeit', 'Time of day')], answer: 0, why: o('Wie jemand über viele Hände setzt, verrät mehr als ein einzelner Blick.', 'How someone bets over many hands reveals more than a single glance.') },
  { q: o('Ein Spieler, der sonst lange überlegt, callt plötzlich sofort. Mögliche Deutung?', 'A player who usually thinks long suddenly calls instantly. Possible reading?'), options: [o('Eine Hand, die zum Callen reicht, aber nicht zum Erhöhen (z. B. ein Draw)', 'A hand good enough to call but not to raise (e.g. a draw)'), o('Sicher die Nuts', 'Definitely the nuts'), o('Er hat nicht zugehört', 'They weren’t listening'), o('Sicher ein Bluff', 'Definitely a bluff')], answer: 0, why: o('Schnelle Calls zeigen oft eine „mittlere“ Entscheidung ohne Erhöhungsgedanken.', 'Quick calls often show a “medium” decision with no thought of raising.') },
  { q: o('Ein Spieler redet nach seinem großen Einsatz plötzlich viel und locker. Was ist vorsichtig richtig?', 'After a big bet a player suddenly gets chatty and relaxed. What is a careful reading?'), options: [o('Kann Entspannung bei starker Hand sein – oder bewusste Show', 'Could be relaxation with a strong hand – or a deliberate show'), o('Sicher ein Bluff', 'Definitely a bluff'), o('Er ist betrunken', 'They are drunk'), o('Hat keine Bedeutung, nie', 'Never means anything')], answer: 0, why: o('Viele Spieler werden bei starker Hand gesprächiger – aber manche spielen das vor.', 'Many players get chattier with strong hands – but some act it out.') },
  { q: o('Was sollte am Tisch mit „Spielgeld“ trainiert werden?', 'What should be trained at the table with “play money”?'), options: [o('Rechnen, Position, Beobachten – ohne finanzielles Risiko', 'Maths, position, observation – without financial risk'), o('Wie man Echtgeld gewinnt', 'How to win real money'), o('Schummeln', 'Cheating'), o('Nichts', 'Nothing')], answer: 0, why: o('Das Training dient dem Denken in Wahrscheinlichkeiten.', 'The training is about thinking in probabilities.') },
  { q: o('Ein Spieler deckt seine Karten nach dem Ansehen schnell und schützt sie mit der Hand. Häufige Deutung?', 'A player quickly covers their cards after looking and protects them with a hand. Common reading?'), options: [o('Er hält die Karten für wertvoll', 'They consider the cards valuable'), o('Er will folden', 'They want to fold'), o('Er ist Linkshänder', 'They are left-handed'), o('Er friert', 'They are cold')], answer: 0, why: o('Was wir schützen, ist uns wichtig – aber auch das kann Gewohnheit sein.', 'What we protect matters to us – but this can also be habit.') },
]

// ---------------------------------------------------------------- Rechner
function Calculator() {
  const { t } = useLang()
  const [pot, setPot] = useState(100)
  const [call, setCall] = useState(25)
  const [outs, setOuts] = useState(9)
  const [cards, setCards] = useState<1 | 2>(1)
  const need = potOdds(pot, call)
  const have = hitChance(outs, cards)
  const ok = have >= need
  const num = (label: string, v: number, set: (n: number) => void, max: number) => (
    <label className="block text-sm">
      <span className="text-ink-400">{label}</span>
      <input type="number" inputMode="numeric" min={0} max={max} value={v} onChange={(e) => set(Math.max(0, Math.min(max, Number(e.target.value) || 0)))}
        className="mt-1 w-full rounded-lg border border-ink-600 bg-ink-900 px-3 py-2 text-lg text-ink-200 focus:border-gold-500 focus:outline-none" />
    </label>
  )
  return (
    <div className="grid max-w-3xl gap-4 md:grid-cols-2">
      <div className="card space-y-3">
        {num(t('Pot (inkl. Einsatz des Gegners)', 'Pot (incl. opponent’s bet)'), pot, setPot, 100000)}
        {num(t('Zu callen', 'To call'), call, setCall, 100000)}
        {num(t('Outs', 'Outs'), outs, setOuts, 20)}
        <div className="text-sm">
          <span className="text-ink-400">{t('Noch kommende Karten', 'Cards to come')}</span>
          <div className="mt-1 grid grid-cols-2 gap-2">
            {([1, 2] as const).map((c) => (
              <button key={c} onClick={() => setCards(c)} className={`rounded-lg border px-3 py-2 ${cards === c ? 'border-gold-500 text-gold-300' : 'border-ink-600 text-ink-400'}`}>
                {c === 1 ? t('1 (Turn → River)', '1 (turn → river)') : t('2 (Flop → River)', '2 (flop → river)')}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {DRAWS.map((d) => <button key={d.outs + d.name.de} className="chip hover:text-gold-300" onClick={() => setOuts(d.outs)}>{t(d.name)} · {d.outs}</button>)}
        </div>
      </div>
      <div className="card space-y-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-gold-500">{t('Benötigte Gewinnchance', 'Required equity')}</div>
          <div className="font-serif text-4xl text-gold-300">{(need * 100).toFixed(1)} %</div>
          <div className="text-xs text-ink-400">{call} ÷ ({pot} + {call})</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-gold-500">{t('Deine Trefferchance', 'Your hit chance')}</div>
          <div className="font-serif text-4xl text-gold-300">{(have * 100).toFixed(1)} %</div>
          <div className="text-xs text-ink-400">{t('Faustregel', 'Rule of thumb')}: {outs} × {cards === 1 ? 2 : 4} ≈ {outs * (cards === 1 ? 2 : 4)} %</div>
        </div>
        <div className={`rounded-xl p-3 text-center font-medium ${ok ? 'bg-emerald-500/10 text-emerald-300' : 'bg-rose-500/10 text-rose-300'}`}>
          {ok ? t('Call ist mathematisch profitabel', 'Call is mathematically profitable') : t('Fold – die Pot Odds reichen nicht', 'Fold – the pot odds aren’t enough')}
        </div>
        <p className="text-xs text-ink-400">{t('Ohne Implied Odds (spätere Gewinne). Nur Spielgeld, kein Echtgeld.', 'Without implied odds (later winnings). Play money only, no real money.')}</p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- Übungsaufgaben
interface Task { draw: { name: T; outs: number }; cards: 1 | 2; pot: number; call: number }
function makeTask(): Task {
  const draw = pick(DRAWS)
  const cards = pick([1, 2] as const)
  const pot = pick([40, 60, 80, 100, 120, 150, 200, 300])
  const frac = pick([0.25, 0.33, 0.5, 0.75, 1, 1.5, 2])
  return { draw, cards, pot: pot + Math.round(pot * frac), call: Math.round(pot * frac) }
}

export function OddsDrill({ rounds = 10, onDone }: { rounds?: number; onDone?: () => void }) {
  const { t } = useLang()
  const [seed, setSeed] = useState(0)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tasks = useMemo(() => Array.from({ length: rounds }, makeTask), [seed, rounds])
  const [i, setI] = useState(0)
  const [ans, setAns] = useState<'call' | 'fold' | null>(null)
  const [score, setScore] = useState(0)
  const at = useRef(performance.now())

  if (i >= tasks.length) {
    return (
      <div className="card max-w-xl text-center">
        <div className="font-serif text-4xl text-gold-300">{score} / {tasks.length}</div>
        <p className="mt-2 text-ink-400">{t('richtige Entscheidungen', 'correct decisions')}</p>
        {onDone ? <button className="btn-gold mt-5" onClick={onDone}>{t('Weiter', 'Next')}</button>
          : <button className="btn-gold mt-5" onClick={() => { setSeed(seed + 1); setI(0); setScore(0); setAns(null) }}>{t('Neue Aufgaben', 'New tasks')}</button>}
      </div>
    )
  }
  const k = tasks[i]
  const need = potOdds(k.pot, k.call)
  const have = hitChance(k.draw.outs, k.cards)
  const right: 'call' | 'fold' = have >= need ? 'call' : 'fold'
  const choose = (a: 'call' | 'fold') => {
    if (ans) return
    setAns(a)
    const ok = a === right
    if (ok) setScore(score + 1)
    record({ area: 'poker', ex: 'odds', ok, ms: Math.round(performance.now() - at.current) })
  }
  return (
    <div className="card max-w-xl">
      <div className="mb-3 flex justify-between text-xs text-ink-400"><span>{t('Aufgabe', 'Task')} {i + 1} / {tasks.length}</span><span>{t('Spielgeld', 'Play money')}</span></div>
      <ProgressBar value={i / tasks.length} className="mb-4" />
      <div className="space-y-1 text-lg">
        <p>{t('Du hast einen', 'You have a')} <b className="text-gold-300">{t(k.draw.name)}</b> ({k.draw.outs} Outs).</p>
        <p>{k.cards === 1 ? t('Turn ist gefallen – noch eine Karte.', 'The turn is out – one card to come.') : t('Flop – du siehst bis zum River (zwei Karten).', 'Flop – you see to the river (two cards).')}</p>
        <p>{t('Pot', 'Pot')}: <b>{k.pot}</b> · {t('Zu callen', 'To call')}: <b>{k.call}</b></p>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2">
        {(['call', 'fold'] as const).map((a) => {
          const st = !ans ? 'border-ink-600 hover:border-gold-500' : a === right ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300' : a === ans ? 'border-rose-500 bg-rose-500/10 text-rose-300' : 'border-ink-700 opacity-40'
          return <button key={a} onClick={() => choose(a)} className={`rounded-xl border px-3 py-4 text-lg uppercase tracking-wider ${st}`}>{a}</button>
        })}
      </div>
      {ans && (
        <div className="mt-4 rounded-xl bg-ink-900/70 p-4 text-sm">
          <p>{t('Benötigt', 'Needed')}: {k.call} ÷ ({k.pot} + {k.call}) = <b>{(need * 100).toFixed(1)} %</b></p>
          <p>{t('Trefferchance', 'Hit chance')}: <b>{(have * 100).toFixed(1)} %</b> ({t('Faustregel', 'rule of thumb')} {k.draw.outs} × {k.cards === 1 ? 2 : 4} ≈ {k.draw.outs * (k.cards === 1 ? 2 : 4)} %)</p>
          <p className="mt-1 text-gold-300">{right === 'call' ? t('→ Call ist profitabel.', '→ Calling is profitable.') : t('→ Fold, die Odds reichen nicht.', '→ Fold, the odds aren’t enough.')}</p>
          <button className="btn-gold mt-4" onClick={() => { setI(i + 1); setAns(null); at.current = performance.now() }}>{t('Weiter', 'Next')}</button>
        </div>
      )}
    </div>
  )
}

export default function PokerArea() {
  const { t } = useLang()
  return (
    <AreaShell
      area="poker"
      lessons={LESSONS}
      intro={<p className="mb-4 text-xs text-ink-400">{t('♠ Nur Spielgeld und Rechenaufgaben – kein Echtgeld-Bezug.', '♠ Play money and maths only – no real-money gambling.')}</p>}
      exercises={[
        { id: 'rechner', title: o('Pot-Odds-Rechner', 'Pot odds calculator'), text: o('Pot, Einsatz und Outs eingeben – Call oder Fold?', 'Enter pot, bet and outs – call or fold?'), badge: o('Werkzeug', 'tool'), render: () => <Calculator /> },
        { id: 'drill', title: o('Call oder Fold?', 'Call or fold?'), text: o('Übungsaufgaben mit Draws, Pot und Einsatz – mit Rechenweg.', 'Practice hands with draws, pot and bet – with the maths shown.'), badge: o('∞ Aufgaben', '∞ tasks'), render: () => <OddsDrill /> },
        { id: 'grundlagen', title: o('Positionen & Starthände', 'Positions & starting hands'), text: o('Quiz zu Position, Starthänden, Outs und Pot Odds.', 'Quiz on position, starting hands, outs and pot odds.'), badge: o(`${QUIZ_POS.length} Fragen`, `${QUIZ_POS.length} questions`), render: () => <div className="max-w-2xl"><QuizRunner area="poker" ex="grundlagen" questions={QUIZ_POS} /></div> },
        { id: 'tells', title: o('Tells', 'Tells'), text: o('Typische Tells – und warum man ihnen nicht blind trauen darf.', 'Typical tells – and why you shouldn’t trust them blindly.'), badge: o(`${QUIZ_TELLS.length} Fragen`, `${QUIZ_TELLS.length} questions`), render: () => <div className="max-w-2xl"><QuizRunner area="poker" ex="tells" questions={QUIZ_TELLS} /></div> },
      ]}
    />
  )
}
