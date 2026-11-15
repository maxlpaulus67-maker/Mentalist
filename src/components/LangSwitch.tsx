import { setLang, useLang } from '../lib/i18n'

export default function LangSwitch({ className = '' }: { className?: string }) {
  const { lang } = useLang()
  return (
    <div className={`inline-flex rounded-lg border border-ink-600 p-0.5 text-xs ${className}`} role="group" aria-label="Sprache / Language">
      {(['de', 'en'] as const).map((l) => (
        <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l}
          className={`rounded-md px-2.5 py-1 uppercase tracking-wider ${lang === l ? 'bg-gold-500 text-ink-950' : 'text-ink-400 hover:text-ink-200'}`}>{l}</button>
      ))}
    </div>
  )
}
