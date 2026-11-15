export type AreaId =
  | 'mimik' | 'koerper' | 'beobachtung' | 'schluss'
  | 'cold' | 'poker' | 'palast' | 'notizen'

export interface AreaMeta {
  id: AreaId
  nr: number
  title: string
  subtitle: string
  icon: string
  ready: boolean
}

export const AREAS: AreaMeta[] = [
  { id: 'mimik', nr: 1, title: 'Mimik', subtitle: 'Die 7 Basisemotionen & Blitz-Training', icon: '◉', ready: true },
  { id: 'koerper', nr: 2, title: 'Körpersprache', subtitle: 'Haltung, Hände, Füße, Distanz, Stimme', icon: '⟟', ready: false },
  { id: 'beobachtung', nr: 3, title: 'Beobachtung', subtitle: 'Szenen einprägen, Details abrufen', icon: '◎', ready: false },
  { id: 'schluss', nr: 4, title: 'Schlussfolgern', subtitle: 'Kleine Fälle im Detektiv-Stil', icon: '⌕', ready: false },
  { id: 'cold', nr: 5, title: 'Cold Reading', subtitle: 'Barnum-Aussagen durchschauen', icon: '✶', ready: false },
  { id: 'poker', nr: 6, title: 'Poker', subtitle: 'Pot Odds, Positionen, Tells', icon: '♠', ready: false },
  { id: 'palast', nr: 7, title: 'Gedächtnispalast', subtitle: 'Wörter, Zahlen, Karten merken', icon: '⌂', ready: false },
  { id: 'notizen', nr: 8, title: 'Feldnotizen', subtitle: 'Einschätzungen im echten Leben prüfen', icon: '✎', ready: false },
]

export const areaById = (id: string) => AREAS.find((a) => a.id === id)
