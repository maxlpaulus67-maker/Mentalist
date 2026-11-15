import { useMemo, useRef, useState } from 'react'
import AreaShell, { type Lesson } from '../../components/AreaShell'
import QuizRunner, { type QuizQuestion } from '../../components/QuizRunner'
import { ProgressBar } from '../../components/ui'
import { record } from '../../lib/store'
import { shuffle } from '../../lib/util'
import { useLang, type T } from '../../lib/i18n'

const o = (de: string, en: string): T => ({ de, en })

const LESSONS: Lesson[] = [
  {
    id: 'cold-barnum', title: o('Der Barnum-Effekt', 'The Barnum effect'),
    paragraphs: [
      o('1948 gab der Psychologe Bertram Forer seinen Studenten angeblich persönliche Persönlichkeitsprofile. In Wahrheit bekamen alle denselben Text. Im Schnitt bewerteten sie ihn als sehr zutreffend.', 'In 1948 psychologist Bertram Forer gave his students supposedly personal personality profiles. In truth they all received the same text. On average they rated it as highly accurate.'),
      o('Barnum-Aussagen klingen persönlich, passen aber auf fast jeden: „Du kannst sehr gesellig sein, brauchst aber auch Zeit für dich.“ „Du hast mehr Potenzial, als du bisher genutzt hast.“', 'Barnum statements sound personal but fit almost anyone: “You can be very sociable but also need time for yourself.” “You have more potential than you have used so far.”'),
      o('Sie funktionieren, weil sie (1) schmeichelhaft sind, (2) beide Seiten eines Gegensatzes abdecken, (3) vage genug sind, dass wir selbst die passende Erinnerung ergänzen.', 'They work because they (1) flatter, (2) cover both sides of an opposite, and (3) are vague enough that we fill in a matching memory ourselves.'),
      o('Warum das lernen? Wer Barnum-Aussagen erkennt, fällt nicht auf Horoskope, „Hellseher“ und manipulative Verkaufsgespräche herein – und merkt, wann eine eigene Einschätzung in Wahrheit nichtssagend ist.', 'Why learn this? If you recognise Barnum statements, you won’t fall for horoscopes, “psychics” and manipulative sales talk – and you’ll notice when your own read is actually empty.'),
    ],
  },
  {
    id: 'cold-techniken', title: o('Techniken des Cold Readings', 'Cold reading techniques'),
    paragraphs: [
      o('Cold Reading ist die Kunst, ohne Vorwissen den Eindruck zu erwecken, man wisse viel über jemanden. Die wichtigsten Techniken:', 'Cold reading is the art of appearing to know a lot about someone without prior knowledge. The main techniques:'),
    ],
    bullets: [
      o('Regenbogen-Ruse: Eine Eigenschaft und ihr Gegenteil gleichzeitig zuschreiben („Du bist oft ruhig, kannst aber auch sehr bestimmt sein“).', 'Rainbow ruse: attributing a trait and its opposite at once (“You are often quiet, but you can also be very assertive”).'),
      o('Schrotflinte (Shotgunning): Viele vage Aussagen schnell hintereinander – die Treffer bleiben im Gedächtnis, die Fehler werden vergessen.', 'Shotgunning: firing many vague statements quickly – the hits stick in memory, the misses are forgotten.'),
      o('Fishing: Fragen als Aussagen tarnen („Ich sehe einen älteren Mann … ein Vater? Großvater?“) und auf Reaktionen achten.', 'Fishing: disguising questions as statements (“I see an older man … a father? grandfather?”) and watching the reactions.'),
      o('Statistische Treffer: Häufige Dinge nennen – eine Schachtel alter Fotos, eine Narbe am Knie, ein Name mit „M“.', 'Statistical hits: naming common things – a box of old photos, a scar on the knee, a name with “M”.'),
      o('Hot Reading: Vorher heimlich recherchierte Informationen (Social Media, Gespräche im Wartebereich).', 'Hot reading: information secretly researched beforehand (social media, conversations in the waiting area).'),
      o('Beobachtung: Kleidung, Alter, Ring, Hände, Sprache – echte Hinweise, verpackt als „Eingebung“.', 'Observation: clothes, age, ring, hands, speech – real clues dressed up as “intuition”.'),
    ],
  },
  {
    id: 'cold-schutz', title: o('Ehrlich bleiben & sich schützen', 'Staying honest & protecting yourself'),
    paragraphs: [
      o('Test für jede Aussage: Würde sie auch auf deine Nachbarin, deinen Onkel und deinen Kollegen passen? Dann sagt sie nichts über dich.', 'Test for any statement: would it also fit your neighbour, your uncle and your colleague? Then it says nothing about you.'),
      o('Zähle die Fehltreffer mit. Wer nur die Treffer erinnert, überschätzt jede Deutung.', 'Count the misses. Remembering only the hits makes you overrate any reading.'),
      o('Für dein eigenes Training: Eine gute Einschätzung ist spezifisch und kann sich als falsch herausstellen („Du kommst gerade vom Sport“). Nur solche Aussagen kannst du in den Feldnotizen ehrlich prüfen.', 'For your own training: a good read is specific and could turn out to be wrong (“You’ve just come from the gym”). Only such statements can be honestly checked in your field notes.'),
      o('Ethik: Cold Reading als Unterhaltung ist in Ordnung, solange das Publikum weiß, dass es eine Technik ist. Menschen in Trauer oder Krisen damit Geld oder Vertrauen abzunehmen, ist Betrug.', 'Ethics: cold reading as entertainment is fine as long as the audience knows it is a technique. Using it to take money or trust from people in grief or crisis is fraud.'),
    ],
  },
]

/** b = passt auf fast jeden (Barnum), s = wirklich spezifisch */
const STATEMENTS: { s: T; kind: 'b' | 's'; why: T }[] = [
  { s: o('Du hast ein großes Bedürfnis, von anderen gemocht und anerkannt zu werden.', 'You have a strong need for other people to like and admire you.'), kind: 'b', why: o('Fast jeder Mensch möchte gemocht werden.', 'Almost everyone wants to be liked.') },
  { s: o('Du kannst sehr gesellig sein, brauchst aber auch Zeit für dich allein.', 'You can be very sociable, but you also need time alone.'), kind: 'b', why: o('Regenbogen-Ruse: beide Seiten werden abgedeckt.', 'Rainbow ruse: both sides are covered.') },
  { s: o('Du hast mehr Potenzial, als du bisher genutzt hast.', 'You have more potential than you have used so far.'), kind: 'b', why: o('Schmeichelhaft und unwiderlegbar.', 'Flattering and impossible to disprove.') },
  { s: o('Du hast dir letzte Woche den linken Knöchel verstaucht.', 'You sprained your left ankle last week.'), kind: 's', why: o('Konkret, überprüfbar, kann eindeutig falsch sein.', 'Concrete, checkable, can be clearly wrong.') },
  { s: o('Manchmal zweifelst du, ob du die richtige Entscheidung getroffen hast.', 'Sometimes you wonder whether you made the right decision.'), kind: 'b', why: o('Zweifel kennt jeder.', 'Everyone knows doubt.') },
  { s: o('Du spielst seit über zehn Jahren Cello.', 'You have played the cello for more than ten years.'), kind: 's', why: o('Sehr spezifisch – trifft auf die wenigsten zu.', 'Very specific – applies to very few people.') },
  { s: o('In deiner Wohnung gibt es eine Schublade mit Dingen, die du eigentlich aussortieren wolltest.', 'There is a drawer in your home with things you meant to sort out.'), kind: 'b', why: o('Statistischer Treffer – fast jeder hat so eine Schublade.', 'Statistical hit – almost everyone has a drawer like that.') },
  { s: o('Du bist heute mit dem Zug aus Hamburg angereist.', 'You travelled here by train from Hamburg today.'), kind: 's', why: o('Ort, Verkehrsmittel und Zeit – leicht zu widerlegen.', 'Place, transport and time – easy to disprove.') },
  { s: o('Du bist ein Mensch, der hohe Ansprüche an sich selbst stellt.', 'You are someone who sets high standards for yourself.'), kind: 'b', why: o('Die meisten sehen sich gern so.', 'Most people like to see themselves that way.') },
  { s: o('Du hast eine ältere Schwester, die Zahnärztin ist.', 'You have an older sister who is a dentist.'), kind: 's', why: o('Mehrere konkrete Details, die alle stimmen müssen.', 'Several concrete details that must all be true.') },
  { s: o('Es gab eine Zeit, in der du dich von jemandem Nahestehendem missverstanden gefühlt hast.', 'There was a time when you felt misunderstood by someone close to you.'), kind: 'b', why: o('Gilt für praktisch jeden Menschen.', 'True of practically everyone.') },
  { s: o('Du trägst eine Brille, nutzt aber heute Kontaktlinsen.', 'You wear glasses but are using contact lenses today.'), kind: 's', why: o('Konkret und überprüfbar.', 'Concrete and checkable.') },
  { s: o('Nach außen wirkst du ruhig, innerlich bist du manchmal unsicher.', 'Outwardly you seem calm, but inside you are sometimes unsure.'), kind: 'b', why: o('Klassische Barnum-Aussage über das „verborgene Ich“.', 'Classic Barnum statement about the “hidden self”.') },
  { s: o('Du hast heute noch nicht gefrühstückt.', 'You haven’t had breakfast yet today.'), kind: 's', why: o('Konkret – auch wenn ein Raten mit ca. 30 % Treffern möglich ist.', 'Concrete – even if a guess would be right about 30 % of the time.') },
  { s: o('Du hast eine Narbe, über deren Entstehung es eine Geschichte gibt.', 'You have a scar with a story behind it.'), kind: 'b', why: o('Statistisch sehr häufig.', 'Statistically very common.') },
  { s: o('Du arbeitest nachts als Krankenpfleger auf einer Intensivstation.', 'You work night shifts as a nurse in intensive care.'), kind: 's', why: o('Beruf, Abteilung und Schicht – sehr spezifisch.', 'Job, ward and shift – very specific.') },
  { s: o('Du magst Veränderungen, aber nur, wenn du sie selbst wählst.', 'You like change, but only when you choose it yourself.'), kind: 'b', why: o('Das gilt für fast alle Menschen.', 'This applies to almost everyone.') },
  { s: o('Dein Lieblingsessen ist Linsensuppe mit Spätzle.', 'Your favourite food is lentil soup with spätzle.'), kind: 's', why: o('Sehr spezifisch, eindeutig prüfbar.', 'Very specific, clearly checkable.') },
  { s: o('Du hast in letzter Zeit über eine größere Veränderung in deinem Leben nachgedacht.', 'Lately you have been thinking about a bigger change in your life.'), kind: 'b', why: o('Fast jeder denkt darüber nach – Job, Wohnung, Beziehung.', 'Almost everyone thinks about this – job, home, relationship.') },
  { s: o('Du bist Linkshänder.', 'You are left-handed.'), kind: 's', why: o('Trifft nur auf ca. 10 % zu – leicht zu prüfen.', 'True for only about 10 % – easy to check.') },
  { s: o('Du bist loyal gegenüber Menschen, die dir wichtig sind.', 'You are loyal to the people who matter to you.'), kind: 'b', why: o('Schmeichelhaft und universell.', 'Flattering and universal.') },
  { s: o('Dein Handy-Display hat einen Sprung in der oberen rechten Ecke.', 'Your phone screen has a crack in the top right corner.'), kind: 's', why: o('Konkret, sichtbar, überprüfbar.', 'Concrete, visible, checkable.') },
  { s: o('Manchmal bist du extrovertiert und freundlich, manchmal eher zurückhaltend und vorsichtig.', 'At times you are extroverted and friendly, at other times reserved and cautious.'), kind: 'b', why: o('Eine der Original-Aussagen aus Forers Experiment.', 'One of the original statements from Forer’s experiment.') },
  { s: o('Du hast vor zwei Jahren einen Marathon unter vier Stunden beendet.', 'Two years ago you finished a marathon in under four hours.'), kind: 's', why: o('Mehrere spezifische, prüfbare Details.', 'Several specific, checkable details.') },
  { s: o('Du hast ein gutes Gespür für Menschen, auch wenn du dich manchmal täuschst.', 'You have a good sense for people, even if you are sometimes wrong.'), kind: 'b', why: o('Schmeichelei plus Absicherung.', 'Flattery plus a safety net.') },
  { s: o('Du hast Angst vor Spinnen, aber nicht vor Schlangen.', 'You are afraid of spiders but not of snakes.'), kind: 's', why: o('Konkrete Kombination, die man klar verneinen kann.', 'A concrete combination that can be clearly denied.') },
  { s: o('Es gibt Momente, in denen du dich fragst, ob andere dich wirklich kennen.', 'There are moments when you wonder whether others really know you.'), kind: 'b', why: o('Universelles Gefühl.', 'A universal feeling.') },
  { s: o('Du heißt mit zweitem Vornamen Johanna.', 'Your middle name is Johanna.'), kind: 's', why: o('Extrem spezifisch.', 'Extremely specific.') },
  { s: o('Du kannst kritisch sein, wenn dir etwas wichtig ist.', 'You can be critical when something matters to you.'), kind: 'b', why: o('Passt auf praktisch jeden.', 'Fits practically everyone.') },
  { s: o('Du bist heute mit einem Kaffeefleck auf dem linken Ärmel losgegangen.', 'You left home today with a coffee stain on your left sleeve.'), kind: 's', why: o('Konkret – und direkt nachprüfbar.', 'Concrete – and directly checkable.') },
]

const TECH_QUIZ: QuizQuestion[] = [
  { q: o('„Du bist meist ruhig, kannst aber auch sehr bestimmt sein.“ Welche Technik?', '“You’re usually calm, but you can also be very assertive.” Which technique?'), options: [o('Regenbogen-Ruse', 'Rainbow ruse'), o('Hot Reading', 'Hot reading'), o('Fishing', 'Fishing'), o('Beobachtung', 'Observation')], answer: 0, why: o('Eine Eigenschaft und ihr Gegenteil gleichzeitig.', 'A trait and its opposite at once.') },
  { q: o('„Ich sehe ein M … Maria? Michael? Jemand aus der Familie?“', '“I see an M … Maria? Michael? Someone in the family?”'), options: [o('Fishing / Schrotflinte', 'Fishing / shotgunning'), o('Hot Reading', 'Hot reading'), o('Regenbogen-Ruse', 'Rainbow ruse'), o('Echte Hellseherei', 'Genuine clairvoyance')], answer: 0, why: o('Viele Möglichkeiten anbieten und auf die Reaktion warten.', 'Offering many options and waiting for a reaction.') },
  { q: o('Ein „Medium“ kennt den Namen deines verstorbenen Hundes, den du auf Social Media erwähnt hast.', 'A “medium” knows the name of your late dog, which you mentioned on social media.'), options: [o('Hot Reading', 'Hot reading'), o('Barnum', 'Barnum'), o('Regenbogen-Ruse', 'Rainbow ruse'), o('Zufall', 'Coincidence')], answer: 0, why: o('Vorab recherchierte Informationen.', 'Information researched in advance.') },
  { q: o('Warum erinnern sich Zuschauer vor allem an die Treffer?', 'Why do audiences mainly remember the hits?'), options: [o('Bestätigungsfehler und selektives Gedächtnis', 'Confirmation bias and selective memory'), o('Weil es nur Treffer gibt', 'Because there are only hits'), o('Hypnose', 'Hypnosis'), o('Weil Fehler leise gesagt werden', 'Because misses are said quietly')], answer: 0, why: o('Wir speichern, was passt, und vergessen, was nicht passt.', 'We store what fits and forget what doesn’t.') },
  { q: o('„In deinem Haus gibt es eine Schachtel mit alten Fotos.“ Welche Technik?', '“There is a box of old photos in your home.” Which technique?'), options: [o('Statistischer Treffer', 'Statistical hit'), o('Hot Reading', 'Hot reading'), o('Echte Eingebung', 'Genuine insight'), o('Fishing', 'Fishing')], answer: 0, why: o('Auf sehr viele Haushalte zutreffend.', 'True for a great many households.') },
  { q: o('Was macht eine Aussage überprüfbar und damit ehrlich testbar?', 'What makes a statement checkable and thus honestly testable?'), options: [o('Sie ist konkret und kann sich als falsch herausstellen', 'It is concrete and could turn out to be wrong'), o('Sie ist schmeichelhaft', 'It is flattering'), o('Sie deckt beide Seiten ab', 'It covers both sides'), o('Sie ist lang', 'It is long')], answer: 0, why: o('Nur widerlegbare Aussagen können Treffer im echten Sinn sein.', 'Only falsifiable statements can be hits in a real sense.') },
  { q: o('Wer führte 1948 das bekannte Experiment zum Barnum-Effekt durch?', 'Who ran the well-known 1948 experiment on the Barnum effect?'), options: [o('Bertram Forer', 'Bertram Forer'), o('Sigmund Freud', 'Sigmund Freud'), o('Paul Ekman', 'Paul Ekman'), o('Harry Houdini', 'Harry Houdini')], answer: 0, why: o('Daher auch „Forer-Effekt“.', 'Hence also “Forer effect”.') },
  { q: o('Ein Leser sagt: „Du arbeitest mit den Händen“ – du hast Schwielen und Farbe an den Fingern.', 'A reader says: “You work with your hands” – you have calluses and paint on your fingers.'), options: [o('Beobachtung als „Eingebung“ verpackt', 'Observation dressed up as “intuition”'), o('Hot Reading', 'Hot reading'), o('Regenbogen-Ruse', 'Rainbow ruse'), o('Magie', 'Magic')], answer: 0, why: o('Echte Hinweise, nur anders präsentiert.', 'Real clues, just presented differently.') },
  { q: o('Wann ist Cold Reading ethisch problematisch?', 'When is cold reading ethically problematic?'), options: [o('Wenn verletzliche Menschen getäuscht werden, um Geld oder Vertrauen zu gewinnen', 'When vulnerable people are deceived for money or trust'), o('Bei einer Zaubershow mit Hinweis', 'At a magic show with a disclaimer'), o('Beim Üben mit Freunden, die Bescheid wissen', 'When practising with friends who know'), o('Nie', 'Never')], answer: 0, why: o('Täuschung zum eigenen Vorteil bei Menschen in Not ist Betrug.', 'Deceiving people in need for your own gain is fraud.') },
  { q: o('Bester Test, ob eine Deutung über dich etwas aussagt?', 'Best test of whether a reading says something about you?'), options: [o('Würde sie auch auf viele andere passen?', 'Would it also fit many others?'), o('Fühlt sie sich gut an?', 'Does it feel good?'), o('Klingt sie geheimnisvoll?', 'Does it sound mysterious?'), o('Ist sie lang?', 'Is it long?')], answer: 0, why: o('Was auf jeden passt, sagt über niemanden etwas.', 'What fits everyone says nothing about anyone.') },
]

function Sorter({ count = 12, onDone }: { count?: number; onDone?: () => void }) {
  const { t } = useLang()
  const [seed, setSeed] = useState(0)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const set = useMemo(() => shuffle(STATEMENTS).slice(0, count), [seed, count])
  const [i, setI] = useState(0)
  const [chosen, setChosen] = useState<'b' | 's' | null>(null)
  const [score, setScore] = useState(0)
  const at = useRef(performance.now())
  if (i >= set.length) {
    return (
      <div className="card text-center">
        <div className="font-serif text-4xl text-gold-300">{score} / {set.length}</div>
        <p className="mt-2 text-ink-400">{t('richtig einsortiert', 'sorted correctly')}</p>
        {onDone
          ? <button className="btn-gold mt-5" onClick={onDone}>{t('Weiter', 'Next')}</button>
          : <button className="btn-gold mt-5" onClick={() => { setSeed(seed + 1); setI(0); setScore(0); setChosen(null) }}>{t('Nochmal', 'Again')}</button>}
      </div>
    )
  }
  const cur = set[i]
  const pickKind = (k: 'b' | 's') => {
    if (chosen) return
    setChosen(k)
    const ok = k === cur.kind
    if (ok) setScore(score + 1)
    record({ area: 'cold', ex: 'sort', ok, ms: Math.round(performance.now() - at.current) })
  }
  const btn = (k: 'b' | 's', label: string) => {
    const st = !chosen ? 'border-ink-600 hover:border-gold-500' : k === cur.kind ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300' : k === chosen ? 'border-rose-500 bg-rose-500/10 text-rose-300' : 'border-ink-700 opacity-40'
    return <button onClick={() => pickKind(k)} className={`rounded-xl border px-3 py-4 text-sm transition ${st}`}>{label}</button>
  }
  return (
    <div className="card max-w-2xl">
      <div className="mb-3 flex justify-between text-xs text-ink-400"><span>{i + 1} / {set.length}</span><span>{score} {t('richtig', 'correct')}</span></div>
      <ProgressBar value={i / set.length} className="mb-5" />
      <blockquote className="mb-5 border-l-2 border-gold-500 pl-4 font-serif text-2xl leading-snug text-ink-200">{t(`„${cur.s.de}“`, `“${cur.s.en}”`)}</blockquote>
      <div className="grid grid-cols-2 gap-2">
        {btn('b', t('Passt auf fast jeden', 'Fits almost anyone'))}
        {btn('s', t('Wirklich spezifisch', 'Truly specific'))}
      </div>
      {chosen && (
        <div className="mt-4 rounded-xl bg-ink-900/70 p-4 text-sm">
          <div className={chosen === cur.kind ? 'text-emerald-400' : 'text-rose-400'}>{chosen === cur.kind ? t('Richtig.', 'Correct.') : t('Nicht ganz.', 'Not quite.')}</div>
          <p className="mt-1">{t(cur.why)}</p>
          <button className="btn-gold mt-4" onClick={() => { setI(i + 1); setChosen(null); at.current = performance.now() }}>{t('Weiter', 'Next')}</button>
        </div>
      )}
    </div>
  )
}

export default function ColdArea() {
  return (
    <AreaShell
      area="cold"
      lessons={LESSONS}
      exercises={[
        { id: 'sortieren', title: o('Aussagen sortieren', 'Sort statements'), text: o('Passt die Aussage auf fast jeden – oder ist sie wirklich spezifisch?', 'Does the statement fit almost anyone – or is it truly specific?'), badge: o(`${STATEMENTS.length} Aussagen`, `${STATEMENTS.length} statements`), render: () => <Sorter /> },
        { id: 'techniken', title: o('Techniken erkennen', 'Spot the technique'), text: o('Welche Methode steckt hinter der „Eingebung“?', 'Which method is behind the “insight”?'), badge: o(`${TECH_QUIZ.length} Fragen`, `${TECH_QUIZ.length} questions`), render: () => <div className="max-w-2xl"><QuizRunner area="cold" ex="technik" questions={TECH_QUIZ} /></div> },
      ]}
    />
  )
}

export { Sorter, STATEMENTS }
