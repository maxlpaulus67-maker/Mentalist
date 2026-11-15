import { useEffect } from 'react'
import { setSetting, useStore, getState } from './store'

export type Lang = 'de' | 'en'
/** Zweisprachiger Text */
export type T = { de: string; en: string }

export const detectLang = (): Lang =>
  typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('de') ? 'de' : 'en'

export const currentLang = (): Lang => (getState().settings.lang as Lang) ?? detectLang()
export const setLang = (l: Lang) => setSetting('lang', l)

/** Hook: liefert Sprache und Übersetzer. `t('Deutsch', 'English')` oder `t(textObjekt)`. */
export function useLang() {
  const { settings } = useStore()
  const lang = (settings.lang as Lang) ?? detectLang()
  useEffect(() => { document.documentElement.lang = lang }, [lang])
  function t(de: string, en: string): string
  function t(x: T): string
  function t(a: string | T, b?: string) {
    if (typeof a === 'string') return lang === 'de' ? a : b!
    return a[lang]
  }
  return { lang, t }
}
