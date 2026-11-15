import type { T } from './i18n'

export type AreaId =
  | 'mimik' | 'koerper' | 'beobachtung' | 'schluss'
  | 'cold' | 'poker' | 'palast' | 'notizen'

export interface AreaMeta { id: AreaId; nr: number; title: T; subtitle: T; icon: string; ready: boolean }

export const AREAS: AreaMeta[] = [
  { id: 'mimik', nr: 1, title: { de: 'Mimik', en: 'Facial Expressions' }, subtitle: { de: 'Die 7 Basisemotionen & Blitz-Training', en: 'The 7 basic emotions & flash training' }, icon: '◉', ready: true },
  { id: 'koerper', nr: 2, title: { de: 'Körpersprache', en: 'Body Language' }, subtitle: { de: 'Haltung, Hände, Füße, Distanz, Stimme', en: 'Posture, hands, feet, distance, voice' }, icon: '⟟', ready: true },
  { id: 'beobachtung', nr: 3, title: { de: 'Beobachtung', en: 'Observation' }, subtitle: { de: 'Szenen einprägen, Details abrufen', en: 'Memorise scenes, recall details' }, icon: '◎', ready: true },
  { id: 'schluss', nr: 4, title: { de: 'Schlussfolgern', en: 'Deduction' }, subtitle: { de: 'Kleine Fälle im Detektiv-Stil', en: 'Small detective-style cases' }, icon: '⌕', ready: true },
  { id: 'cold', nr: 5, title: { de: 'Cold Reading', en: 'Cold Reading' }, subtitle: { de: 'Barnum-Aussagen durchschauen', en: 'See through Barnum statements' }, icon: '✶', ready: true },
  { id: 'poker', nr: 6, title: { de: 'Poker', en: 'Poker' }, subtitle: { de: 'Pot Odds, Positionen, Tells', en: 'Pot odds, positions, tells' }, icon: '♠', ready: true },
  { id: 'palast', nr: 7, title: { de: 'Gedächtnispalast', en: 'Memory Palace' }, subtitle: { de: 'Wörter, Zahlen, Karten merken', en: 'Remember words, numbers, cards' }, icon: '⌂', ready: true },
  { id: 'notizen', nr: 8, title: { de: 'Feldnotizen', en: 'Field Notes' }, subtitle: { de: 'Einschätzungen im echten Leben prüfen', en: 'Check real-life reads' }, icon: '✎', ready: true },
]

export const areaById = (id: string) => AREAS.find((a) => a.id === id)
