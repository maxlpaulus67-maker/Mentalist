import { useSyncExternalStore } from 'react'
import type { AreaId } from './areas'

export interface Attempt {
  area: AreaId
  ex: string // Übungs-ID
  ok: boolean
  ms?: number // Reaktionszeit
  t: number // Zeitstempel
  d?: string // Detail, z. B. Emotion
}

export interface State {
  v: 1
  attempts: Attempt[]
  xp: Partial<Record<AreaId, number>>
  streak: { count: number; last: string | null }
  lessonsRead: string[]
  settings: Record<string, number | string | boolean>
}

const KEY = 'mentalist-lab:v1'
const MAX_ATTEMPTS = 6000

const fresh = (): State => ({
  v: 1, attempts: [], xp: {}, streak: { count: 0, last: null }, lessonsRead: [], settings: {},
})

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return fresh()
    return { ...fresh(), ...JSON.parse(raw) }
  } catch {
    return fresh()
  }
}

let state: State = load()
const listeners = new Set<() => void>()

function commit(next: State) {
  state = next
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* Speicher voll/gesperrt */ }
  listeners.forEach((l) => l())
}

export function useStore(): State {
  return useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l) }, () => state)
}
export const getState = () => state

export const today = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

function bumpStreak(s: State): State['streak'] {
  const t = today()
  if (s.streak.last === t) return s.streak
  const y = new Date(); y.setDate(y.getDate() - 1)
  const count = s.streak.last === today(y) ? s.streak.count + 1 : 1
  return { count, last: t }
}

/** Streak nur zählen, wenn sie heute noch lebt (heute oder gestern trainiert). */
export function liveStreak(s: State) {
  const y = new Date(); y.setDate(y.getDate() - 1)
  return s.streak.last === today() || s.streak.last === today(y) ? s.streak.count : 0
}

export function record(a: Omit<Attempt, 't'>, xp = a.ok ? 10 : 2) {
  const attempts = [...state.attempts, { ...a, t: Date.now() }].slice(-MAX_ATTEMPTS)
  commit({
    ...state,
    attempts,
    xp: { ...state.xp, [a.area]: (state.xp[a.area] ?? 0) + xp },
    streak: bumpStreak(state),
  })
}

export function addXp(area: AreaId, xp: number) {
  commit({ ...state, xp: { ...state.xp, [area]: (state.xp[area] ?? 0) + xp }, streak: bumpStreak(state) })
}

export function markLessonRead(id: string, area: AreaId) {
  if (state.lessonsRead.includes(id)) return
  commit({ ...state, lessonsRead: [...state.lessonsRead, id], xp: { ...state.xp, [area]: (state.xp[area] ?? 0) + 15 } })
}

export function setSetting(k: string, v: number | string | boolean) {
  commit({ ...state, settings: { ...state.settings, [k]: v } })
}

export function resetAll() { commit(fresh()) }

/** Level-Kurve: Level n benötigt 60·n·(n-1)/2 … wächst sanft. */
export function levelInfo(xp = 0) {
  let lvl = 1, need = 100, rest = xp
  while (rest >= need) { rest -= need; lvl++; need = Math.round(need * 1.25) }
  return { lvl, progress: rest / need, rest, need }
}

export const LEVEL_TITLES = {
  de: ['Neuling', 'Beobachter', 'Spurenleser', 'Analytiker', 'Menschenkenner', 'Mentalist', 'Meister'],
  en: ['Novice', 'Observer', 'Tracker', 'Analyst', 'People Reader', 'Mentalist', 'Master'],
}
export const levelTitle = (lvl: number, lang: 'de' | 'en' = 'de') => LEVEL_TITLES[lang][Math.min(lvl - 1, LEVEL_TITLES[lang].length - 1)]
