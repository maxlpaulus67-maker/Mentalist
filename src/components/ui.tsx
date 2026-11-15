import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useLang } from '../lib/i18n'

export function PageTitle({ kicker, title, children, back }: { kicker?: string; title: string; children?: ReactNode; back?: string }) {
  const { t } = useLang()
  return (
    <header className="mb-6">
      {back && <Link to={back} className="mb-3 inline-block text-sm text-ink-400 hover:text-gold-300">← {t('Zurück', 'Back')}</Link>}
      {kicker && <div className="text-xs uppercase tracking-[0.25em] text-gold-500">{kicker}</div>}
      <h1 className="text-3xl sm:text-4xl">{title}</h1>
      {children && <p className="mt-2 max-w-2xl text-ink-400">{children}</p>}
      <div className="gold-rule mt-4" />
    </header>
  )
}

export function Disclaimer({ compact }: { compact?: boolean }) {
  const { t } = useLang()
  return (
    <div className={`rounded-xl border border-gold-600/30 bg-gold-500/5 ${compact ? 'p-3 text-xs' : 'p-4 text-sm'} text-ink-200`}>
      <span className="font-medium text-gold-300">{t('Ehrlicher Hinweis: ', 'Honest note: ')}</span>
      {t('Das ist kein Lügendetektor. Kein Signal beweist etwas. Einschätzungen sind Wahrscheinlichkeiten – Baseline zuerst, mehrere Signale zusammen, Kontext beachten.',
        'This is not a lie detector. No single signal proves anything. Reads are probabilities – baseline first, several signals together, mind the context.')}
    </div>
  )
}

export function ProgressBar({ value, className = '' }: { value: number; className?: string }) {
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full bg-ink-700 ${className}`}>
      <div className="h-full rounded-full bg-gradient-to-r from-gold-600 to-gold-300 transition-all" style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%` }} />
    </div>
  )
}

export function Tabs<T extends string>({ value, onChange, items }: { value: T; onChange: (v: T) => void; items: { id: T; label: string }[] }) {
  return (
    <div className="mb-5 inline-flex rounded-xl border border-ink-700 bg-ink-800 p-1">
      {items.map((i) => (
        <button key={i.id} onClick={() => onChange(i.id)} className={`rounded-lg px-4 py-2 text-sm transition ${value === i.id ? 'bg-gold-500 text-ink-950' : 'text-ink-400 hover:text-ink-200'}`}>
          {i.label}
        </button>
      ))}
    </div>
  )
}
