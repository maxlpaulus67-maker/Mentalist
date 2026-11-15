import { NEUTRAL, type FaceParams } from './Face'
import type { T } from '../../lib/i18n'

export type EmotionId = 'freude' | 'trauer' | 'wut' | 'angst' | 'ueberraschung' | 'ekel' | 'verachtung'
type Region = 'brows' | 'eyes' | 'nose' | 'mouth' | 'cheeks'

export interface Emotion {
  id: EmotionId
  name: T
  preset: Partial<FaceParams>
  regions: Region[]
  cues: T[]          // Woran erkennt man sie?
  function: T        // Wozu dient sie?
  pitfall: T         // Typischer Denkfehler
  /** Erklärung, wenn man stattdessen X geantwortet hat */
  vs: Partial<Record<EmotionId, T>>
}

export const EMOTIONS: Emotion[] = [
  {
    id: 'freude', name: { de: 'Freude', en: 'Joy' },
    preset: { cornerL: 1, cornerR: 1, cheek: 1, eyeLower: 0.45, mouthOpen: 0.25, mouthWidth: 0.4 },
    regions: ['mouth', 'cheeks', 'eyes'],
    cues: [
      { de: 'Beide Mundwinkel ziehen symmetrisch schräg nach oben.', en: 'Both lip corners pull up and back symmetrically.' },
      { de: 'Die Wangen heben sich, unter den Augen bilden sich Polster.', en: 'The cheeks rise and bunch up beneath the eyes.' },
      { de: 'Krähenfüße an den äußeren Augenwinkeln – das Zeichen eines echten (Duchenne-)Lächelns.', en: "Crow's feet at the outer eye corners – the mark of a genuine (Duchenne) smile." },
      { de: 'Die Augen werden von unten schmaler, die Brauen bleiben entspannt.', en: 'The eyes narrow from below; the brows stay relaxed.' },
    ],
    function: { de: 'Signalisiert Wohlwollen und Zugehörigkeit; belohnt soziale Bindung.', en: 'Signals goodwill and belonging; rewards social bonding.' },
    pitfall: { de: 'Ein Lächeln nur mit dem Mund (ohne Augenbeteiligung) ist oft höflich oder sozial – nicht zwingend falsch, aber kein Beweis für Freude.', en: 'A smile with the mouth only (no eye involvement) is often polite or social – not necessarily fake, but no proof of joy.' },
    vs: {
      verachtung: { de: 'Verachtung hebt nur EINEN Mundwinkel. Bei Freude sind beide oben und die Augen machen mit.', en: 'Contempt raises only ONE lip corner. In joy both are up and the eyes join in.' },
      ueberraschung: { de: 'Bei Überraschung öffnet sich der Mund rund, die Brauen gehen hoch – die Wangen heben sich nicht.', en: 'In surprise the mouth drops open and the brows go up – the cheeks do not rise.' },
    },
  },
  {
    id: 'trauer', name: { de: 'Trauer', en: 'Sadness' },
    preset: { browInner: 1, browOuter: -0.4, eyeUpper: -0.55, cornerL: -0.8, cornerR: -0.8, lipPress: 0.15 },
    regions: ['brows', 'eyes', 'mouth'],
    cues: [
      { de: 'Die INNEREN Brauenenden ziehen nach oben – die Brauen bilden ein schräges Dach.', en: 'The INNER ends of the brows pull up – the brows form a slanted roof.' },
      { de: 'Die Oberlider hängen, der Blick wirkt schwer und gesenkt.', en: 'The upper eyelids droop; the gaze looks heavy and lowered.' },
      { de: 'Beide Mundwinkel ziehen nach unten, das Kinn kann sich kräuseln.', en: 'Both lip corners pull down; the chin may pucker.' },
      { de: 'Gesamteindruck: Spannung fehlt, das Gesicht „sackt ab“.', en: 'Overall: tension is missing, the face “sags”.' },
    ],
    function: { de: 'Signalisiert Verlust und Hilfebedarf; lädt andere zu Trost ein.', en: 'Signals loss and a need for help; invites comfort from others.' },
    pitfall: { de: 'Die schrägen inneren Brauen sind sehr schwer willentlich zu erzeugen – deshalb ein zuverlässiges Zeichen. Müdigkeit erzeugt hängende Lider, aber keine schrägen Brauen.', en: 'Slanted inner brows are very hard to produce voluntarily – which makes them a reliable sign. Tiredness causes drooping lids, but not slanted brows.' },
    vs: {
      angst: { de: 'Angst hebt ebenfalls die inneren Brauen, aber die Augen sind WEIT aufgerissen und der Mund wird horizontal gedehnt. Bei Trauer hängen die Lider.', en: 'Fear also raises the inner brows, but the eyes open WIDE and the lips stretch sideways. In sadness the lids droop.' },
      verachtung: { de: 'Verachtung ist einseitig. Trauer zieht beide Mundwinkel symmetrisch nach unten.', en: 'Contempt is one-sided. Sadness pulls both lip corners down symmetrically.' },
      wut: { de: 'Bei Wut senken sich die Brauen und ziehen zusammen; bei Trauer gehen die inneren Enden NACH OBEN.', en: 'In anger the brows lower and draw together; in sadness the inner ends go UP.' },
    },
  },
  {
    id: 'wut', name: { de: 'Wut', en: 'Anger' },
    preset: { browLower: 1, browInner: -0.3, eyeUpper: 0.35, eyeLower: 0.75, lipPress: 1, nostril: 0.7, cornerL: -0.1, cornerR: -0.1 },
    regions: ['brows', 'eyes', 'mouth'],
    cues: [
      { de: 'Die Brauen senken sich und ziehen zusammen; zwischen ihnen entstehen senkrechte Falten.', en: 'The brows lower and draw together; vertical lines appear between them.' },
      { de: 'Starrer Blick: Oberlid leicht gehoben, Unterlid gespannt.', en: 'Hard stare: upper lid slightly raised, lower lid tensed.' },
      { de: 'Die Lippen werden aufeinandergepresst und schmal (oder eckig geöffnet).', en: 'The lips press together and thin out (or open in a square shape).' },
      { de: 'Die Nasenflügel blähen sich.', en: 'The nostrils flare.' },
    ],
    function: { de: 'Bereitet darauf vor, ein Hindernis zu beseitigen oder sich gegen Unrecht zu wehren.', en: 'Prepares us to remove an obstacle or stand up against injustice.' },
    pitfall: { de: 'Gesenkte Brauen allein bedeuten oft nur Konzentration oder Blendung. Erst zusammen mit gespannten Lidern und gepressten Lippen spricht es für Wut.', en: 'Lowered brows alone often just mean concentration or glare. Only together with tense lids and pressed lips do they point to anger.' },
    vs: {
      ekel: { de: 'Ekel senkt die Brauen auch etwas, aber das Kennzeichen ist die gerümpfte Nase und die gehobene Oberlippe. Bei Wut sind die Lippen gepresst.', en: 'Disgust lowers the brows a little too, but its hallmark is the wrinkled nose and raised upper lip. In anger the lips are pressed.' },
      trauer: { de: 'Trauer hebt die inneren Brauenenden, Wut zieht sie nach unten zusammen.', en: 'Sadness raises the inner brows; anger pulls them down and together.' },
      verachtung: { de: 'Verachtung ist einseitig und kühl; Wut betrifft das ganze Gesicht, besonders den starren Blick.', en: 'Contempt is one-sided and cool; anger involves the whole face, especially the hard stare.' },
    },
  },
  {
    id: 'angst', name: { de: 'Angst', en: 'Fear' },
    preset: { browInner: 1, browOuter: 0.55, browLower: 0.35, eyeUpper: 1, eyeLower: 0.45, mouthWidth: 1, mouthOpen: 0.3, cornerL: -0.15, cornerR: -0.15 },
    regions: ['brows', 'eyes', 'mouth'],
    cues: [
      { de: 'Die Brauen gehen hoch UND ziehen zusammen – die Linie wird gerade und angespannt.', en: 'The brows go up AND draw together – the line becomes straight and tense.' },
      { de: 'Die Oberlider reißen weit auf, oberhalb der Iris ist Weiß zu sehen; das Unterlid ist gespannt.', en: 'The upper lids open wide, showing white above the iris; the lower lid is tensed.' },
      { de: 'Die Lippen werden horizontal Richtung Ohren gedehnt.', en: 'The lips stretch horizontally towards the ears.' },
      { de: 'Gesamteindruck: Spannung, als wolle das Gesicht gleichzeitig hinsehen und zurückweichen.', en: 'Overall: tension, as if the face wants to look and pull back at the same time.' },
    ],
    function: { de: 'Bereitet auf Flucht oder Erstarren vor; weite Augen vergrößern das Sichtfeld.', en: 'Prepares for flight or freezing; wide eyes enlarge the field of view.' },
    pitfall: { de: 'Angst und Überraschung werden am häufigsten verwechselt. Achte auf die Brauen (gerade & zusammengezogen vs. rund gebogen) und den Mund (gedehnt vs. locker offen).', en: 'Fear and surprise are the most often confused. Watch the brows (straight & drawn together vs. round and curved) and the mouth (stretched vs. loosely open).' },
    vs: {
      ueberraschung: { de: 'Überraschung: Brauen rund und hoch, Mund locker oval geöffnet, keine Spannung. Angst: Brauen zusammengezogen, Unterlid gespannt, Mund horizontal gedehnt.', en: 'Surprise: brows round and high, mouth loosely open in an oval, no tension. Fear: brows drawn together, lower lid tensed, mouth stretched sideways.' },
      trauer: { de: 'Trauer hat hängende Lider; Angst reißt die Augen weit auf.', en: 'Sadness has drooping lids; fear opens the eyes wide.' },
    },
  },
  {
    id: 'ueberraschung', name: { de: 'Überraschung', en: 'Surprise' },
    preset: { browInner: 1, browOuter: 1, eyeUpper: 1, mouthOpen: 0.9, mouthWidth: -0.5 },
    regions: ['brows', 'eyes', 'mouth'],
    cues: [
      { de: 'Die Brauen heben sich rund und hoch, quer über die Stirn ziehen Falten.', en: 'The brows rise high and curved; horizontal lines cross the forehead.' },
      { de: 'Die Augen öffnen sich weit, das Unterlid bleibt aber entspannt.', en: 'The eyes open wide, but the lower lid stays relaxed.' },
      { de: 'Der Kiefer fällt locker herab, der Mund ist oval geöffnet.', en: 'The jaw drops loosely; the mouth opens in an oval.' },
      { de: 'Sehr kurz: Überraschung dauert selten länger als eine Sekunde und geht dann in eine andere Emotion über.', en: 'Very brief: surprise rarely lasts more than a second before turning into another emotion.' },
    ],
    function: { de: 'Unterbricht laufendes Verhalten und richtet die Aufmerksamkeit auf etwas Neues.', en: 'Interrupts ongoing behaviour and directs attention to something new.' },
    pitfall: { de: 'Hält eine „Überraschung“ mehrere Sekunden an, ist sie oft gespielt.', en: 'If “surprise” lasts several seconds, it is often faked.' },
    vs: {
      angst: { de: 'Bei Angst ziehen die Brauen zusammen, das Unterlid spannt sich und der Mund dehnt sich zur Seite. Überraschung bleibt locker und rund.', en: 'In fear the brows draw together, the lower lid tenses and the mouth stretches sideways. Surprise stays loose and round.' },
      freude: { de: 'Freude hebt die Mundwinkel und die Wangen – Überraschung öffnet nur den Kiefer.', en: 'Joy lifts the lip corners and cheeks – surprise only drops the jaw.' },
    },
  },
  {
    id: 'ekel', name: { de: 'Ekel', en: 'Disgust' },
    preset: { noseWrinkle: 1, upperLip: 1, browLower: 0.5, eyeLower: 0.6, cheek: 0.3, cornerL: -0.3, cornerR: -0.3, mouthOpen: 0.08 },
    regions: ['nose', 'mouth', 'brows'],
    cues: [
      { de: 'Die Nase rümpft sich, auf dem Nasenrücken entstehen Querfalten.', en: 'The nose wrinkles; horizontal creases form across the bridge.' },
      { de: 'Die Oberlippe hebt sich, oft werden obere Zähne sichtbar.', en: 'The upper lip rises, often exposing the upper teeth.' },
      { de: 'Die Brauen senken sich leicht, die Augen werden von unten schmaler.', en: 'The brows lower slightly; the eyes narrow from below.' },
      { de: 'Die Falte von den Nasenflügeln zu den Mundwinkeln vertieft sich.', en: 'The fold from the nostrils to the lip corners deepens.' },
    ],
    function: { de: 'Schützt vor Giftigem und Verdorbenem – auch im übertragenen, moralischen Sinn.', en: 'Protects against poison and rot – also in a figurative, moral sense.' },
    pitfall: { de: 'Schon eine kurze, leichte Hebung der Oberlippe kann Abneigung gegen eine Person oder Idee verraten.', en: 'Even a brief, slight raise of the upper lip can betray dislike of a person or idea.' },
    vs: {
      wut: { de: 'Wut: gepresste Lippen, starrer Blick, keine gerümpfte Nase. Ekel: Nase und Oberlippe ziehen nach oben.', en: 'Anger: pressed lips, hard stare, no wrinkled nose. Disgust: nose and upper lip pull up.' },
      verachtung: { de: 'Verachtung ist einseitig (ein Mundwinkel). Ekel ist symmetrisch und sitzt um die Nase.', en: 'Contempt is one-sided (one lip corner). Disgust is symmetrical and centred around the nose.' },
      trauer: { de: 'Trauer hebt die inneren Brauenenden; Ekel konzentriert sich um Nase und Oberlippe.', en: 'Sadness raises the inner brows; disgust concentrates around the nose and upper lip.' },
    },
  },
  {
    id: 'verachtung', name: { de: 'Verachtung', en: 'Contempt' },
    preset: { cornerR: 0.75, cornerL: -0.05, lipPress: 0.35, eyeUpper: -0.2 },
    regions: ['mouth'],
    cues: [
      { de: 'Nur EIN Mundwinkel zieht sich nach oben und leicht zur Seite.', en: 'Only ONE lip corner tightens up and slightly to the side.' },
      { de: 'Neben diesem Mundwinkel entsteht oft ein kleines Grübchen.', en: 'A small dimple often appears next to that corner.' },
      { de: 'Der Rest des Gesichts bleibt ruhig, manchmal mit leicht gesenkten Lidern oder gehobenem Kinn.', en: 'The rest of the face stays calm, sometimes with slightly lowered lids or a raised chin.' },
      { de: 'Die einzige asymmetrische Basisemotion.', en: 'The only asymmetrical basic emotion.' },
    ],
    function: { de: 'Signalisiert moralische Überlegenheit – „ich stehe über dir/dem“.', en: 'Signals moral superiority – “I am above you/this”.' },
    pitfall: { de: 'Verachtung wird leicht für ein schiefes Lächeln gehalten. Ohne Wangen- und Augenbeteiligung und nur einseitig: eher Verachtung.', en: 'Contempt is easily mistaken for a lopsided smile. One-sided and without cheek or eye involvement: more likely contempt.' },
    vs: {
      freude: { de: 'Freude ist symmetrisch und erreicht die Augen. Verachtung hebt nur einen Mundwinkel.', en: 'Joy is symmetrical and reaches the eyes. Contempt raises only one lip corner.' },
      ekel: { de: 'Ekel rümpft die Nase und hebt die ganze Oberlippe; Verachtung bleibt seitlich am Mundwinkel.', en: 'Disgust wrinkles the nose and lifts the whole upper lip; contempt stays at one lip corner.' },
    },
  },
]

export const emotionById = (id: EmotionId) => EMOTIONS.find((e) => e.id === id)!

export type Intensity = 'stark' | 'mittel' | 'subtil'
export const INTENSITY: Record<Intensity, number> = { stark: 1, mittel: 0.65, subtil: 0.38 }
export const INTENSITY_NAME: Record<Intensity | 'alle', T> = {
  alle: { de: 'alle', en: 'all' },
  stark: { de: 'stark', en: 'strong' },
  mittel: { de: 'mittel', en: 'medium' },
  subtil: { de: 'subtil', en: 'subtle' },
}

export function faceFor(id: EmotionId, intensity = 1, mirror = false): FaceParams {
  const pr = emotionById(id).preset
  const out = { ...NEUTRAL }
  for (const k of Object.keys(pr) as (keyof FaceParams)[]) out[k] = (pr[k] ?? 0) * intensity
  if (mirror) [out.cornerL, out.cornerR] = [out.cornerR, out.cornerL]
  return out
}

/** 21 Blitz-Aufgaben: jede Emotion in drei Intensitäten. */
export const BLITZ_ITEMS = EMOTIONS.flatMap((e) =>
  (Object.keys(INTENSITY) as Intensity[]).map((i) => ({ id: `${e.id}-${i}`, emotion: e.id, intensity: i })),
)

// ------------------------------------------------------------------
// Lektionen
// ------------------------------------------------------------------
export interface Lesson { id: string; title: T; emotion?: EmotionId; paragraphs: T[] }

export const LESSONS: Lesson[] = [
  {
    id: 'mimik-intro',
    title: { de: 'Grundlagen: Was Gesichter verraten – und was nicht', en: 'Basics: what faces reveal – and what they don’t' },
    paragraphs: [
      { de: 'Die Forschung beschreibt sieben Basisemotionen, deren Gesichtsausdruck in sehr vielen Kulturen ähnlich erkannt wird: Freude, Trauer, Wut, Angst, Überraschung, Ekel und Verachtung.', en: 'Research describes seven basic emotions whose facial expressions are recognised similarly across many cultures: joy, sadness, anger, fear, surprise, disgust and contempt.' },
      { de: 'Eine Makroexpression dauert etwa eine halbe bis vier Sekunden und ist gut sichtbar. Eine Mikroexpression blitzt nur für 1/25 bis 1/2 Sekunde auf – oft dann, wenn jemand ein Gefühl unterdrücken will oder es selbst noch nicht bemerkt hat.', en: 'A macro-expression lasts about half a second to four seconds and is easy to see. A micro-expression flashes for only 1/25 to 1/2 of a second – often when someone is trying to suppress a feeling or hasn’t noticed it yet themselves.' },
      { de: 'Wichtig: Ein Gesichtsausdruck zeigt, DASS ein Gefühl da ist – nicht, WARUM. Angst bei einer Befragung kann bedeuten „ich lüge“ – oder „ich habe Angst, dass man mir nicht glaubt“. Das nennt man den Othello-Fehler.', en: 'Important: an expression shows THAT a feeling is present – not WHY. Fear during questioning can mean “I’m lying” – or “I’m afraid they won’t believe me”. This is called the Othello error.' },
      { de: 'Deshalb gilt immer: Erst die Baseline kennen (wie wirkt die Person, wenn sie entspannt ist?), dann auf Abweichungen achten, mehrere Signale zusammen betrachten und den Kontext prüfen.', en: 'So the rule is always: know the baseline first (how does the person look when relaxed?), then watch for deviations, consider several signals together and check the context.' },
      { de: 'Das Training in diesem Bereich schärft dein Auge, damit dir kurze Ausdrücke überhaupt auffallen. Die Deutung bleibt immer eine Wahrscheinlichkeit, nie ein Beweis.', en: 'The training here sharpens your eye so that brief expressions catch your attention at all. Interpretation always remains a probability, never proof.' },
    ],
  },
  {
    id: 'mimik-regionen',
    title: { de: 'Die drei Zonen des Gesichts', en: 'The three zones of the face' },
    paragraphs: [
      { de: 'Teile das Gesicht gedanklich in drei Zonen: Stirn & Brauen, Augen & Lider, untere Gesichtshälfte (Nase, Wangen, Mund).', en: 'Mentally divide the face into three zones: forehead & brows, eyes & lids, lower face (nose, cheeks, mouth).' },
      { de: 'Die Stirn ist ehrlicher als der Mund. Den Mund kontrollieren wir bewusst (Höflichkeitslächeln), die Muskeln, die die inneren Brauen heben, kann kaum jemand willentlich steuern.', en: 'The forehead is more honest than the mouth. We control the mouth consciously (polite smiles), but hardly anyone can voluntarily control the muscles that raise the inner brows.' },
      { de: 'Die Augenlider sind der Spannungsmesser: weit offen (Aufmerksamkeit, Angst, Überraschung), gespannt (Wut, Konzentration), hängend (Trauer, Müdigkeit), von unten verengt (Freude, Ekel).', en: 'The eyelids are the tension gauge: wide open (attention, fear, surprise), tensed (anger, concentration), drooping (sadness, tiredness), narrowed from below (joy, disgust).' },
      { de: 'Trainingstipp: Schau beim Blitz-Training zuerst auf den Bereich zwischen den Augen. Von dort erfasst du Brauen, Lider und Nasenwurzel gleichzeitig.', en: 'Training tip: in flash training, look first at the spot between the eyes. From there you take in brows, lids and the bridge of the nose at once.' },
    ],
  },
  ...EMOTIONS.map((e) => ({
    id: `mimik-${e.id}`,
    title: e.name,
    emotion: e.id,
    paragraphs: [
      { de: `Wozu: ${e.function.de}`, en: `Purpose: ${e.function.en}` },
      { de: `Achtung: ${e.pitfall.de}`, en: `Watch out: ${e.pitfall.en}` },
    ],
  })),
  {
    id: 'mimik-verwechslung',
    title: { de: 'Die häufigsten Verwechslungen', en: 'The most common mix-ups' },
    paragraphs: [
      { de: 'Angst ↔ Überraschung: Beide reißen die Augen auf. Angst ist angespannt (Brauen zusammen, Unterlid gespannt, Lippen gedehnt), Überraschung locker (runde Brauen, entspanntes Unterlid, Kiefer fällt).', en: 'Fear ↔ Surprise: both open the eyes wide. Fear is tense (brows together, lower lid tensed, lips stretched); surprise is loose (round brows, relaxed lower lid, jaw drops).' },
      { de: 'Wut ↔ Ekel: Beide senken die Brauen. Ekel rümpft die Nase und hebt die Oberlippe, Wut presst die Lippen und starrt.', en: 'Anger ↔ Disgust: both lower the brows. Disgust wrinkles the nose and raises the upper lip; anger presses the lips and stares.' },
      { de: 'Verachtung ↔ Freude: Einseitig gehobener Mundwinkel ohne Augenbeteiligung ist Verachtung, beidseitig mit Krähenfüßen ist Freude.', en: 'Contempt ↔ Joy: one raised lip corner without eye involvement is contempt; both corners with crow’s feet is joy.' },
      { de: 'Trauer ↔ Angst: Beide heben die inneren Brauen. Trauer lässt die Lider hängen, Angst reißt sie auf.', en: 'Sadness ↔ Fear: both raise the inner brows. Sadness lets the lids droop; fear opens them wide.' },
    ],
  },
  {
    id: 'mimik-mikro',
    title: { de: 'Mikroexpressionen trainieren', en: 'Training micro-expressions' },
    paragraphs: [
      { de: 'Beginne im Blitz-Training mit 500 ms und starken Ausdrücken. Erst wenn du über 80 % triffst, verkürze die Zeit oder nimm subtile Ausdrücke hinzu.', en: 'Start flash training at 500 ms with strong expressions. Only once you score above 80 % should you shorten the time or add subtle expressions.' },
      { de: 'Die Maskierung (neutrales Gesicht vor und nach dem Ausdruck) macht die Übung realistischer: Im echten Leben blitzt der Ausdruck zwischen neutralen Momenten auf.', en: 'Masking (a neutral face before and after the expression) makes the exercise more realistic: in real life the expression flashes between neutral moments.' },
      { de: 'Bei 40 ms siehst du die Emotion kaum noch bewusst – Studien zeigen, dass Menschen trotzdem überzufällig richtig liegen. Vertraue deinem ersten Eindruck und antworte zügig.', en: 'At 40 ms you barely see the emotion consciously – yet studies show people are still right more often than chance. Trust your first impression and answer quickly.' },
      { de: 'Kurze, tägliche Einheiten (5–10 Minuten) bringen mehr als seltene lange Sitzungen.', en: 'Short daily sessions (5–10 minutes) beat rare long ones.' },
    ],
  },
]

// ------------------------------------------------------------------
// Merkmals-Quiz (Wissensfragen)
// ------------------------------------------------------------------
export interface QuizQ { q: T; options: T[]; answer: number; why: T }

const o = (de: string, en: string): T => ({ de, en })

export const QUIZ: QuizQ[] = [
  { q: o('Welches Merkmal unterscheidet ein echtes Lächeln am deutlichsten von einem höflichen?', 'Which feature most clearly separates a genuine smile from a polite one?'), options: [o('Sichtbare Zähne', 'Visible teeth'), o('Krähenfüße an den Augen', 'Crow’s feet at the eyes'), o('Breiter Mund', 'Wide mouth'), o('Gehobene Brauen', 'Raised brows')], answer: 1, why: o('Echte Freude aktiviert den Ringmuskel um die Augen: Wangen heben sich, Krähenfüße entstehen.', 'Genuine joy activates the ring muscle around the eyes: the cheeks rise and crow’s feet appear.') },
  { q: o('Welche Basisemotion ist typischerweise asymmetrisch?', 'Which basic emotion is typically asymmetrical?'), options: [o('Ekel', 'Disgust'), o('Trauer', 'Sadness'), o('Verachtung', 'Contempt'), o('Wut', 'Anger')], answer: 2, why: o('Verachtung hebt nur einen Mundwinkel – als einzige Basisemotion.', 'Contempt raises only one lip corner – the only basic emotion that does.') },
  { q: o('Innere Brauenenden schräg nach oben, Lider hängen, Mundwinkel unten – das ist …', 'Inner brows slanted up, drooping lids, lip corners down – that is …'), options: [o('Angst', 'Fear'), o('Trauer', 'Sadness'), o('Überraschung', 'Surprise'), o('Ekel', 'Disgust')], answer: 1, why: o('Das „Brauendach“ plus hängende Lider ist das klassische Trauer-Muster.', 'The “brow roof” plus drooping lids is the classic sadness pattern.') },
  { q: o('Wie lange dauert eine Mikroexpression ungefähr?', 'Roughly how long does a micro-expression last?'), options: [o('2–4 Sekunden', '2–4 seconds'), o('1/25 bis 1/2 Sekunde', '1/25 to 1/2 second'), o('Genau 1 Sekunde', 'Exactly 1 second'), o('Über 5 Sekunden', 'Over 5 seconds')], answer: 1, why: o('Mikroexpressionen sind extrem kurz: etwa 40 bis 500 Millisekunden.', 'Micro-expressions are extremely brief: about 40 to 500 milliseconds.') },
  { q: o('Gerümpfte Nase und gehobene Oberlippe deuten auf …', 'A wrinkled nose and raised upper lip point to …'), options: [o('Wut', 'Anger'), o('Verachtung', 'Contempt'), o('Ekel', 'Disgust'), o('Angst', 'Fear')], answer: 2, why: o('Ekel konzentriert sich um Nase und Oberlippe.', 'Disgust concentrates around the nose and upper lip.') },
  { q: o('Was unterscheidet Angst von Überraschung?', 'What distinguishes fear from surprise?'), options: [o('Bei Angst ist der Mund rund geöffnet', 'In fear the mouth is open and round'), o('Bei Angst ziehen die Brauen zusammen und die Lippen werden gedehnt', 'In fear the brows draw together and the lips stretch'), o('Überraschung hat ein gespanntes Unterlid', 'Surprise has a tensed lower lid'), o('Es gibt keinen Unterschied', 'There is no difference')], answer: 1, why: o('Angst ist angespannt: Brauen zusammen, Unterlid gespannt, Lippen horizontal gedehnt.', 'Fear is tense: brows together, lower lid tensed, lips stretched sideways.') },
  { q: o('Gesenkte, zusammengezogene Brauen allein bedeuten …', 'Lowered, drawn-together brows on their own mean …'), options: [o('Sicher Wut', 'Definitely anger'), o('Sicher Lüge', 'Definitely lying'), o('Möglicherweise nur Konzentration', 'Possibly just concentration'), o('Trauer', 'Sadness')], answer: 2, why: o('Ein einzelnes Signal ist mehrdeutig. Erst mit gespannten Lidern und gepressten Lippen wird Wut wahrscheinlich.', 'A single signal is ambiguous. Only with tense lids and pressed lips does anger become likely.') },
  { q: o('Was ist der „Othello-Fehler“?', 'What is the “Othello error”?'), options: [o('Emotionen zu übersehen', 'Missing emotions'), o('Die Angst eines ehrlichen Menschen als Zeichen von Lüge zu deuten', 'Reading an honest person’s fear as a sign of lying'), o('Zu lange hinzuschauen', 'Looking for too long'), o('Verachtung mit Freude zu verwechseln', 'Confusing contempt with joy')], answer: 1, why: o('Auch Unschuldige haben Angst – z. B. davor, dass man ihnen nicht glaubt.', 'Innocent people feel fear too – for example, of not being believed.') },
  { q: o('Welche Gesichtszone lässt sich am schwersten willentlich kontrollieren?', 'Which zone of the face is hardest to control voluntarily?'), options: [o('Mund', 'Mouth'), o('Stirn / innere Brauen', 'Forehead / inner brows'), o('Kinn', 'Chin'), o('Nase', 'Nose')], answer: 1, why: o('Den Muskel, der die inneren Brauen hebt, können nur wenige Menschen bewusst steuern.', 'Few people can consciously control the muscle that raises the inner brows.') },
  { q: o('Eine „Überraschung“ hält 5 Sekunden unverändert an. Was ist wahrscheinlich?', 'A “surprise” stays unchanged for 5 seconds. What is likely?'), options: [o('Sehr starke Überraschung', 'Very strong surprise'), o('Sie ist gespielt', 'It is faked'), o('Angst', 'Fear'), o('Freude', 'Joy')], answer: 1, why: o('Echte Überraschung ist sehr kurz und geht schnell in eine andere Emotion über.', 'Genuine surprise is very brief and quickly turns into another emotion.') },
  { q: o('Starrer Blick mit gespanntem Unterlid und gepressten Lippen spricht für …', 'A hard stare with a tensed lower lid and pressed lips suggests …'), options: [o('Trauer', 'Sadness'), o('Wut', 'Anger'), o('Ekel', 'Disgust'), o('Überraschung', 'Surprise')], answer: 1, why: o('Gespannte Lider und gepresste Lippen gehören zum Wut-Muster.', 'Tense lids and pressed lips belong to the anger pattern.') },
  { q: o('Wozu dient die Emotion Ekel ursprünglich?', 'What is the original purpose of disgust?'), options: [o('Zur Flucht', 'Flight'), o('Zum Schutz vor Verdorbenem und Giftigem', 'Protection from rotten and poisonous things'), o('Zur Bindung', 'Bonding'), o('Zum Angriff', 'Attack')], answer: 1, why: o('Ekel schützt vor Schädlichem – später auch im moralischen Sinn.', 'Disgust protects against harm – later also in a moral sense.') },
  { q: o('Was solltest du zuerst kennen, bevor du ein Signal deutest?', 'What should you know first before interpreting a signal?'), options: [o('Den Beruf der Person', 'The person’s job'), o('Die Baseline der Person', 'The person’s baseline'), o('Ihr Alter', 'Their age'), o('Ihre Lieblingsfarbe', 'Their favourite colour')], answer: 1, why: o('Nur Abweichungen vom normalen Verhalten sind aussagekräftig.', 'Only deviations from normal behaviour are meaningful.') },
  { q: o('Weit aufgerissene Augen mit sichtbarem Weiß über der Iris kommen vor bei …', 'Wide-open eyes with white visible above the iris occur in …'), options: [o('Trauer und Ekel', 'Sadness and disgust'), o('Angst und Überraschung', 'Fear and surprise'), o('Wut und Verachtung', 'Anger and contempt'), o('Freude', 'Joy')], answer: 1, why: o('Beide heben das Oberlid stark (AU5).', 'Both strongly raise the upper lid (AU5).') },
  { q: o('Wie reagierst du im Blitz-Training am besten bei 40 ms?', 'How should you respond in flash training at 40 ms?'), options: [o('Lange nachdenken', 'Think it over for a long time'), o('Zügig dem ersten Eindruck folgen', 'Go quickly with your first impression'), o('Immer „Neutral“ wählen', 'Always choose “neutral”'), o('Abbrechen', 'Give up')], answer: 1, why: o('Bei sehr kurzen Zeiten arbeitet die Wahrnehmung unbewusst; Grübeln verschlechtert eher.', 'At very short durations perception works unconsciously; overthinking tends to make it worse.') },
  { q: o('Wozu dient Angst evolutionär?', 'What is the evolutionary purpose of fear?'), options: [o('Bindung', 'Bonding'), o('Vorbereitung auf Flucht oder Erstarren', 'Preparing for flight or freezing'), o('Abwehr von Giftigem', 'Rejecting poison'), o('Ausdruck von Überlegenheit', 'Showing superiority')], answer: 1, why: o('Angst mobilisiert für Flucht oder Erstarren; weite Augen vergrößern das Sichtfeld.', 'Fear mobilises for flight or freezing; wide eyes enlarge the field of view.') },
  { q: o('Ein Mundwinkel hebt sich, daneben entsteht ein Grübchen, Augen bleiben ruhig. Das ist …', 'One lip corner rises, a dimple forms beside it, the eyes stay calm. That is …'), options: [o('Freude', 'Joy'), o('Verachtung', 'Contempt'), o('Ekel', 'Disgust'), o('Trauer', 'Sadness')], answer: 1, why: o('Einseitiges Hochziehen mit Grübchen ist das Kennzeichen der Verachtung.', 'A one-sided pull with a dimple is the hallmark of contempt.') },
  { q: o('Ein Ausdruck zeigt dir …', 'An expression shows you …'), options: [o('… warum jemand etwas fühlt', '… why someone feels something'), o('… dass ein Gefühl da ist, nicht warum', '… that a feeling is present, not why'), o('… ob jemand lügt', '… whether someone is lying'), o('… was jemand denkt', '… what someone is thinking')], answer: 1, why: o('Mimik verrät die Emotion, nicht ihren Auslöser. Der Kontext ist entscheidend.', 'The face reveals the emotion, not its cause. Context is decisive.') },
  { q: o('Senkrechte Falten zwischen den Brauen entstehen vor allem durch …', 'Vertical lines between the brows are mainly caused by …'), options: [o('Heben der Brauen', 'Raising the brows'), o('Zusammenziehen und Senken der Brauen', 'Drawing the brows together and down'), o('Lächeln', 'Smiling'), o('Rümpfen der Nase', 'Wrinkling the nose')], answer: 1, why: o('Der Brauen-Senker (AU4) erzeugt die Zornesfalten.', 'The brow lowerer (AU4) creates the frown lines.') },
  { q: o('Welcher Hinweis spricht beim Lächeln eher für ein gespieltes Gefühl?', 'Which sign suggests a smile is more likely put on?'), options: [o('Es erreicht die Augen', 'It reaches the eyes'), o('Es setzt abrupt ein und endet abrupt', 'It starts and ends abruptly'), o('Es ist symmetrisch', 'It is symmetrical'), o('Die Wangen heben sich', 'The cheeks rise')], answer: 1, why: o('Gespielte Ausdrücke haben oft ein unnatürliches Timing: plötzlicher Beginn, abruptes Ende.', 'Put-on expressions often have unnatural timing: sudden onset, abrupt end.') },
  { q: o('Trauer und Angst teilen welches Merkmal?', 'Which feature do sadness and fear share?'), options: [o('Gehobene innere Brauenenden', 'Raised inner brows'), o('Hochgezogene Mundwinkel', 'Raised lip corners'), o('Gerümpfte Nase', 'Wrinkled nose'), o('Hängende Lider', 'Drooping lids')], answer: 0, why: o('Beide heben die inneren Brauen – die Augen unterscheiden sie.', 'Both raise the inner brows – the eyes tell them apart.') },
  { q: o('Bei welcher Emotion fällt der Kiefer locker nach unten?', 'In which emotion does the jaw drop loosely?'), options: [o('Wut', 'Anger'), o('Überraschung', 'Surprise'), o('Verachtung', 'Contempt'), o('Trauer', 'Sadness')], answer: 1, why: o('Überraschung: Kiefer fällt, Mund oval geöffnet.', 'Surprise: the jaw drops, the mouth opens in an oval.') },
]
