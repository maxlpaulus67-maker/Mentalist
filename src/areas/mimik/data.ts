import { NEUTRAL, type FaceParams } from './Face'

export type EmotionId = 'freude' | 'trauer' | 'wut' | 'angst' | 'ueberraschung' | 'ekel' | 'verachtung'
type Region = 'brows' | 'eyes' | 'nose' | 'mouth' | 'cheeks'

export interface Emotion {
  id: EmotionId
  name: string
  preset: Partial<FaceParams>
  regions: Region[]
  cues: string[]          // Woran erkennt man sie?
  function: string         // Wozu dient sie?
  pitfall: string          // Typischer Denkfehler
  /** Erklärung, wenn man stattdessen X geantwortet hat */
  vs: Partial<Record<EmotionId, string>>
}

export const EMOTIONS: Emotion[] = [
  {
    id: 'freude', name: 'Freude',
    preset: { cornerL: 1, cornerR: 1, cheek: 1, eyeLower: 0.45, mouthOpen: 0.25, mouthWidth: 0.4 },
    regions: ['mouth', 'cheeks', 'eyes'],
    cues: [
      'Beide Mundwinkel ziehen symmetrisch schräg nach oben.',
      'Die Wangen heben sich, unter den Augen bilden sich Polster.',
      'Krähenfüße an den äußeren Augenwinkeln – das Zeichen eines echten (Duchenne-)Lächelns.',
      'Die Augen werden von unten schmaler, die Brauen bleiben entspannt.',
    ],
    function: 'Signalisiert Wohlwollen und Zugehörigkeit; belohnt soziale Bindung.',
    pitfall: 'Ein Lächeln nur mit dem Mund (ohne Augenbeteiligung) ist oft höflich oder sozial – nicht zwingend falsch, aber kein Beweis für Freude.',
    vs: {
      verachtung: 'Verachtung hebt nur EINEN Mundwinkel. Bei Freude sind beide oben und die Augen machen mit.',
      ueberraschung: 'Bei Überraschung öffnet sich der Mund rund, die Brauen gehen hoch – die Wangen heben sich nicht.',
    },
  },
  {
    id: 'trauer', name: 'Trauer',
    preset: { browInner: 1, browOuter: -0.4, eyeUpper: -0.55, cornerL: -0.8, cornerR: -0.8, lipPress: 0.15 },
    regions: ['brows', 'eyes', 'mouth'],
    cues: [
      'Die INNEREN Brauenenden ziehen nach oben – die Brauen bilden ein schräges Dach.',
      'Die Oberlider hängen, der Blick wirkt schwer und gesenkt.',
      'Beide Mundwinkel ziehen nach unten, das Kinn kann sich kräuseln.',
      'Gesamteindruck: Spannung fehlt, das Gesicht „sackt ab“.',
    ],
    function: 'Signalisiert Verlust und Hilfebedarf; lädt andere zu Trost ein.',
    pitfall: 'Die schrägen inneren Brauen sind sehr schwer willentlich zu erzeugen – deshalb ein zuverlässiges Zeichen. Müdigkeit erzeugt hängende Lider, aber keine schrägen Brauen.',
    vs: {
      angst: 'Angst hebt ebenfalls die inneren Brauen, aber die Augen sind WEIT aufgerissen und der Mund wird horizontal gedehnt. Bei Trauer hängen die Lider.',
      verachtung: 'Verachtung ist einseitig. Trauer zieht beide Mundwinkel symmetrisch nach unten.',
      wut: 'Bei Wut senken sich die Brauen und ziehen zusammen; bei Trauer gehen die inneren Enden NACH OBEN.',
    },
  },
  {
    id: 'wut', name: 'Wut',
    preset: { browLower: 1, browInner: -0.3, eyeUpper: 0.35, eyeLower: 0.75, lipPress: 1, nostril: 0.7, cornerL: -0.1, cornerR: -0.1 },
    regions: ['brows', 'eyes', 'mouth'],
    cues: [
      'Die Brauen senken sich und ziehen zusammen; zwischen ihnen entstehen senkrechte Falten.',
      'Starrer Blick: Oberlid leicht gehoben, Unterlid gespannt.',
      'Die Lippen werden aufeinandergepresst und schmal (oder eckig geöffnet).',
      'Die Nasenflügel blähen sich.',
    ],
    function: 'Bereitet darauf vor, ein Hindernis zu beseitigen oder sich gegen Unrecht zu wehren.',
    pitfall: 'Gesenkte Brauen allein bedeuten oft nur Konzentration oder Blendung. Erst zusammen mit gespannten Lidern und gepressten Lippen spricht es für Wut.',
    vs: {
      ekel: 'Ekel senkt die Brauen auch etwas, aber das Kennzeichen ist die gerümpfte Nase und die gehobene Oberlippe. Bei Wut sind die Lippen gepresst.',
      trauer: 'Trauer hebt die inneren Brauenenden, Wut zieht sie nach unten zusammen.',
      verachtung: 'Verachtung ist einseitig und kühl; Wut betrifft das ganze Gesicht, besonders den starren Blick.',
    },
  },
  {
    id: 'angst', name: 'Angst',
    preset: { browInner: 1, browOuter: 0.55, browLower: 0.35, eyeUpper: 1, eyeLower: 0.45, mouthWidth: 1, mouthOpen: 0.3, cornerL: -0.15, cornerR: -0.15 },
    regions: ['brows', 'eyes', 'mouth'],
    cues: [
      'Die Brauen gehen hoch UND ziehen zusammen – die Linie wird gerade und angespannt.',
      'Die Oberlider reißen weit auf, oberhalb der Iris ist Weiß zu sehen; das Unterlid ist gespannt.',
      'Die Lippen werden horizontal Richtung Ohren gedehnt.',
      'Gesamteindruck: Spannung, als wolle das Gesicht gleichzeitig hinsehen und zurückweichen.',
    ],
    function: 'Bereitet auf Flucht oder Erstarren vor; weite Augen vergrößern das Sichtfeld.',
    pitfall: 'Angst und Überraschung werden am häufigsten verwechselt. Achte auf die Brauen (gerade & zusammengezogen vs. rund gebogen) und den Mund (gedehnt vs. locker offen).',
    vs: {
      ueberraschung: 'Überraschung: Brauen rund und hoch, Mund locker oval geöffnet, keine Spannung. Angst: Brauen zusammengezogen, Unterlid gespannt, Mund horizontal gedehnt.',
      trauer: 'Trauer hat hängende Lider; Angst reißt die Augen weit auf.',
    },
  },
  {
    id: 'ueberraschung', name: 'Überraschung',
    preset: { browInner: 1, browOuter: 1, eyeUpper: 1, mouthOpen: 0.9, mouthWidth: -0.5 },
    regions: ['brows', 'eyes', 'mouth'],
    cues: [
      'Die Brauen heben sich rund und hoch, quer über die Stirn ziehen Falten.',
      'Die Augen öffnen sich weit, das Unterlid bleibt aber entspannt.',
      'Der Kiefer fällt locker herab, der Mund ist oval geöffnet.',
      'Sehr kurz: Überraschung dauert selten länger als eine Sekunde und geht dann in eine andere Emotion über.',
    ],
    function: 'Unterbricht laufendes Verhalten und richtet die Aufmerksamkeit auf etwas Neues.',
    pitfall: 'Hält eine „Überraschung“ mehrere Sekunden an, ist sie oft gespielt.',
    vs: {
      angst: 'Bei Angst ziehen die Brauen zusammen, das Unterlid spannt sich und der Mund dehnt sich zur Seite. Überraschung bleibt locker und rund.',
      freude: 'Freude hebt die Mundwinkel und die Wangen – Überraschung öffnet nur den Kiefer.',
    },
  },
  {
    id: 'ekel', name: 'Ekel',
    preset: { noseWrinkle: 1, upperLip: 1, browLower: 0.5, eyeLower: 0.6, cheek: 0.3, cornerL: -0.3, cornerR: -0.3, mouthOpen: 0.08 },
    regions: ['nose', 'mouth', 'brows'],
    cues: [
      'Die Nase rümpft sich, auf dem Nasenrücken entstehen Querfalten.',
      'Die Oberlippe hebt sich, oft werden obere Zähne sichtbar.',
      'Die Brauen senken sich leicht, die Augen werden von unten schmaler.',
      'Die Falte von den Nasenflügeln zu den Mundwinkeln vertieft sich.',
    ],
    function: 'Schützt vor Giftigem und Verdorbenem – auch im übertragenen, moralischen Sinn.',
    pitfall: 'Schon eine kurze, leichte Hebung der Oberlippe kann Abneigung gegen eine Person oder Idee verraten.',
    vs: {
      wut: 'Wut: gepresste Lippen, starrer Blick, keine gerümpfte Nase. Ekel: Nase und Oberlippe ziehen nach oben.',
      verachtung: 'Verachtung ist einseitig (ein Mundwinkel). Ekel ist symmetrisch und sitzt um die Nase.',
      trauer: 'Trauer hebt die inneren Brauenenden; Ekel konzentriert sich um Nase und Oberlippe.',
    },
  },
  {
    id: 'verachtung', name: 'Verachtung',
    preset: { cornerR: 0.75, cornerL: -0.05, lipPress: 0.35, eyeUpper: -0.2 },
    regions: ['mouth'],
    cues: [
      'Nur EIN Mundwinkel zieht sich nach oben und leicht zur Seite.',
      'Neben diesem Mundwinkel entsteht oft ein kleines Grübchen.',
      'Der Rest des Gesichts bleibt ruhig, manchmal mit leicht gesenkten Lidern oder gehobenem Kinn.',
      'Die einzige asymmetrische Basisemotion.',
    ],
    function: 'Signalisiert moralische Überlegenheit – „ich stehe über dir/dem“.',
    pitfall: 'Verachtung wird leicht für ein schiefes Lächeln gehalten. Ohne Wangen- und Augenbeteiligung und nur einseitig: eher Verachtung.',
    vs: {
      freude: 'Freude ist symmetrisch und erreicht die Augen. Verachtung hebt nur einen Mundwinkel.',
      ekel: 'Ekel rümpft die Nase und hebt die ganze Oberlippe; Verachtung bleibt seitlich am Mundwinkel.',
    },
  },
]

export const emotionById = (id: EmotionId) => EMOTIONS.find((e) => e.id === id)!

export type Intensity = 'stark' | 'mittel' | 'subtil'
export const INTENSITY: Record<Intensity, number> = { stark: 1, mittel: 0.65, subtil: 0.38 }

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
export interface Lesson {
  id: string
  title: string
  emotion?: EmotionId
  paragraphs: string[]
}

export const LESSONS: Lesson[] = [
  {
    id: 'mimik-intro',
    title: 'Grundlagen: Was Gesichter verraten – und was nicht',
    paragraphs: [
      'Die Forschung beschreibt sieben Basisemotionen, deren Gesichtsausdruck in sehr vielen Kulturen ähnlich erkannt wird: Freude, Trauer, Wut, Angst, Überraschung, Ekel und Verachtung.',
      'Eine Makroexpression dauert etwa eine halbe bis vier Sekunden und ist gut sichtbar. Eine Mikroexpression blitzt nur für 1/25 bis 1/2 Sekunde auf – oft dann, wenn jemand ein Gefühl unterdrücken will oder es selbst noch nicht bemerkt hat.',
      'Wichtig: Ein Gesichtsausdruck zeigt, DASS ein Gefühl da ist – nicht, WARUM. Angst bei einer Befragung kann bedeuten „ich lüge“ – oder „ich habe Angst, dass man mir nicht glaubt“. Das nennt man den Othello-Fehler.',
      'Deshalb gilt immer: Erst die Baseline kennen (wie wirkt die Person, wenn sie entspannt ist?), dann auf Abweichungen achten, mehrere Signale zusammen betrachten und den Kontext prüfen.',
      'Das Training in diesem Bereich schärft dein Auge, damit dir kurze Ausdrücke überhaupt auffallen. Die Deutung bleibt immer eine Wahrscheinlichkeit, nie ein Beweis.',
    ],
  },
  {
    id: 'mimik-regionen',
    title: 'Die drei Zonen des Gesichts',
    paragraphs: [
      'Teile das Gesicht gedanklich in drei Zonen: Stirn & Brauen, Augen & Lider, untere Gesichtshälfte (Nase, Wangen, Mund).',
      'Die Stirn ist ehrlicher als der Mund. Den Mund kontrollieren wir bewusst (Höflichkeitslächeln), die Muskeln, die die inneren Brauen heben, kann kaum jemand willentlich steuern.',
      'Die Augenlider sind der Spannungsmesser: weit offen (Aufmerksamkeit, Angst, Überraschung), gespannt (Wut, Konzentration), hängend (Trauer, Müdigkeit), von unten verengt (Freude, Ekel).',
      'Trainingstipp: Schau beim Blitz-Training zuerst auf den Bereich zwischen den Augen. Von dort erfasst du Brauen, Lider und Nasenwurzel gleichzeitig.',
    ],
  },
  ...EMOTIONS.map((e) => ({
    id: `mimik-${e.id}`,
    title: e.name,
    emotion: e.id,
    paragraphs: [`Wozu: ${e.function}`, `Achtung: ${e.pitfall}`],
  })),
  {
    id: 'mimik-verwechslung',
    title: 'Die häufigsten Verwechslungen',
    paragraphs: [
      'Angst ↔ Überraschung: Beide reißen die Augen auf. Angst ist angespannt (Brauen zusammen, Unterlid gespannt, Lippen gedehnt), Überraschung locker (runde Brauen, entspanntes Unterlid, Kiefer fällt).',
      'Wut ↔ Ekel: Beide senken die Brauen. Ekel rümpft die Nase und hebt die Oberlippe, Wut presst die Lippen und starrt.',
      'Verachtung ↔ Freude: Einseitig gehobener Mundwinkel ohne Augenbeteiligung ist Verachtung, beidseitig mit Krähenfüßen ist Freude.',
      'Trauer ↔ Angst: Beide heben die inneren Brauen. Trauer lässt die Lider hängen, Angst reißt sie auf.',
    ],
  },
  {
    id: 'mimik-mikro',
    title: 'Mikroexpressionen trainieren',
    paragraphs: [
      'Beginne im Blitz-Training mit 500 ms und starken Ausdrücken. Erst wenn du über 80 % triffst, verkürze die Zeit oder nimm subtile Ausdrücke hinzu.',
      'Die Maskierung (neutrales Gesicht vor und nach dem Ausdruck) macht die Übung realistischer: Im echten Leben blitzt der Ausdruck zwischen neutralen Momenten auf.',
      'Bei 40 ms siehst du die Emotion kaum noch bewusst – Studien zeigen, dass Menschen trotzdem überzufällig richtig liegen. Vertraue deinem ersten Eindruck und antworte zügig.',
      'Kurze, tägliche Einheiten (5–10 Minuten) bringen mehr als seltene lange Sitzungen.',
    ],
  },
]

// ------------------------------------------------------------------
// Merkmals-Quiz (Wissensfragen)
// ------------------------------------------------------------------
export interface QuizQ { q: string; options: string[]; answer: number; why: string }

export const QUIZ: QuizQ[] = [
  { q: 'Welches Merkmal unterscheidet ein echtes Lächeln am deutlichsten von einem höflichen?', options: ['Sichtbare Zähne', 'Krähenfüße an den Augen', 'Breiter Mund', 'Gehobene Brauen'], answer: 1, why: 'Echte Freude aktiviert den Ringmuskel um die Augen: Wangen heben sich, Krähenfüße entstehen.' },
  { q: 'Welche Basisemotion ist typischerweise asymmetrisch?', options: ['Ekel', 'Trauer', 'Verachtung', 'Wut'], answer: 2, why: 'Verachtung hebt nur einen Mundwinkel – als einzige Basisemotion.' },
  { q: 'Innere Brauenenden schräg nach oben, Lider hängen, Mundwinkel unten – das ist …', options: ['Angst', 'Trauer', 'Überraschung', 'Ekel'], answer: 1, why: 'Das „Brauendach“ plus hängende Lider ist das klassische Trauer-Muster.' },
  { q: 'Wie lange dauert eine Mikroexpression ungefähr?', options: ['2–4 Sekunden', '1/25 bis 1/2 Sekunde', 'Genau 1 Sekunde', 'Über 5 Sekunden'], answer: 1, why: 'Mikroexpressionen sind extrem kurz: etwa 40 bis 500 Millisekunden.' },
  { q: 'Gerümpfte Nase und gehobene Oberlippe deuten auf …', options: ['Wut', 'Verachtung', 'Ekel', 'Angst'], answer: 2, why: 'Ekel konzentriert sich um Nase und Oberlippe.' },
  { q: 'Was unterscheidet Angst von Überraschung?', options: ['Bei Angst ist der Mund rund geöffnet', 'Bei Angst ziehen die Brauen zusammen und die Lippen werden gedehnt', 'Überraschung hat ein gespanntes Unterlid', 'Es gibt keinen Unterschied'], answer: 1, why: 'Angst ist angespannt: Brauen zusammen, Unterlid gespannt, Lippen horizontal gedehnt.' },
  { q: 'Gesenkte, zusammengezogene Brauen allein bedeuten …', options: ['Sicher Wut', 'Sicher Lüge', 'Möglicherweise nur Konzentration', 'Trauer'], answer: 2, why: 'Ein einzelnes Signal ist mehrdeutig. Erst mit gespannten Lidern und gepressten Lippen wird Wut wahrscheinlich.' },
  { q: 'Was ist der „Othello-Fehler“?', options: ['Emotionen zu übersehen', 'Die Angst eines ehrlichen Menschen als Zeichen von Lüge zu deuten', 'Zu lange hinzuschauen', 'Verachtung mit Freude zu verwechseln'], answer: 1, why: 'Auch Unschuldige haben Angst – z. B. davor, dass man ihnen nicht glaubt.' },
  { q: 'Welche Gesichtszone lässt sich am schwersten willentlich kontrollieren?', options: ['Mund', 'Stirn / innere Brauen', 'Kinn', 'Nase'], answer: 1, why: 'Den Muskel, der die inneren Brauen hebt, können nur wenige Menschen bewusst steuern.' },
  { q: 'Eine „Überraschung“ hält 5 Sekunden unverändert an. Was ist wahrscheinlich?', options: ['Sehr starke Überraschung', 'Sie ist gespielt', 'Angst', 'Freude'], answer: 1, why: 'Echte Überraschung ist sehr kurz und geht schnell in eine andere Emotion über.' },
  { q: 'Starrer Blick mit gespanntem Unterlid und gepressten Lippen spricht für …', options: ['Trauer', 'Wut', 'Ekel', 'Überraschung'], answer: 1, why: 'Gespannte Lider und gepresste Lippen gehören zum Wut-Muster.' },
  { q: 'Wozu dient die Emotion Ekel ursprünglich?', options: ['Zur Flucht', 'Zum Schutz vor Verdorbenem und Giftigem', 'Zur Bindung', 'Zum Angriff'], answer: 1, why: 'Ekel schützt vor Schädlichem – später auch im moralischen Sinn.' },
  { q: 'Was solltest du zuerst kennen, bevor du ein Signal deutest?', options: ['Den Beruf der Person', 'Die Baseline der Person', 'Ihr Alter', 'Ihre Lieblingsfarbe'], answer: 1, why: 'Nur Abweichungen vom normalen Verhalten sind aussagekräftig.' },
  { q: 'Weit aufgerissene Augen mit sichtbarem Weiß über der Iris kommen vor bei …', options: ['Trauer und Ekel', 'Angst und Überraschung', 'Wut und Verachtung', 'Freude'], answer: 1, why: 'Beide heben das Oberlid stark (AU5).' },
  { q: 'Wie reagierst du im Blitz-Training am besten bei 40 ms?', options: ['Lange nachdenken', 'Zügig dem ersten Eindruck folgen', 'Immer „Neutral“ wählen', 'Abbrechen'], answer: 1, why: 'Bei sehr kurzen Zeiten arbeitet die Wahrnehmung unbewusst; Grübeln verschlechtert eher.' },
  { q: 'Wozu dient Angst evolutionär?', options: ['Bindung', 'Vorbereitung auf Flucht oder Erstarren', 'Abwehr von Giftigem', 'Ausdruck von Überlegenheit'], answer: 1, why: 'Angst mobilisiert für Flucht oder Erstarren; weite Augen vergrößern das Sichtfeld.' },
  { q: 'Ein Mundwinkel hebt sich, daneben entsteht ein Grübchen, Augen bleiben ruhig. Das ist …', options: ['Freude', 'Verachtung', 'Ekel', 'Trauer'], answer: 1, why: 'Einseitiges Hochziehen mit Grübchen ist das Kennzeichen der Verachtung.' },
  { q: 'Ein Ausdruck zeigt dir …', options: ['… warum jemand etwas fühlt', '… dass ein Gefühl da ist, nicht warum', '… ob jemand lügt', '… was jemand denkt'], answer: 1, why: 'Mimik verrät die Emotion, nicht ihren Auslöser. Der Kontext ist entscheidend.' },
  { q: 'Senkrechte Falten zwischen den Brauen entstehen vor allem durch …', options: ['Heben der Brauen', 'Zusammenziehen und Senken der Brauen', 'Lächeln', 'Rümpfen der Nase'], answer: 1, why: 'Der Brauen-Senker (AU4) erzeugt die Zornesfalten.' },
  { q: 'Welcher Hinweis spricht beim Lächeln eher für ein gespieltes Gefühl?', options: ['Es erreicht die Augen', 'Es setzt abrupt ein und endet abrupt', 'Es ist symmetrisch', 'Die Wangen heben sich'], answer: 1, why: 'Gespielte Ausdrücke haben oft ein unnatürliches Timing: plötzlicher Beginn, abruptes Ende.' },
  { q: 'Trauer und Angst teilen welches Merkmal?', options: ['Gehobene innere Brauenenden', 'Hochgezogene Mundwinkel', 'Gerümpfte Nase', 'Hängende Lider'], answer: 0, why: 'Beide heben die inneren Brauen – die Augen unterscheiden sie.' },
  { q: 'Bei welcher Emotion fällt der Kiefer locker nach unten?', options: ['Wut', 'Überraschung', 'Verachtung', 'Trauer'], answer: 1, why: 'Überraschung: Kiefer fällt, Mund oval geöffnet.' },
]
