import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AREAS } from '../lib/areas'
import { useLang } from '../lib/i18n'
import LangSwitch from './LangSwitch'

const MAIN = [
  { to: '/', de: 'Start', en: 'Home', icon: '⌂' },
  { to: '/bereiche', de: 'Bereiche', en: 'Areas', icon: '▦' },
  { to: '/statistik', de: 'Statistik', en: 'Stats', icon: '↗' },
  { to: '/info', de: 'Hinweis', en: 'About', icon: 'ⓘ' },
]

export default function Layout() {
  const loc = useLocation()
  const { t } = useLang()
  useEffect(() => { window.scrollTo(0, 0) }, [loc.pathname])
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl">
      {/* Seitenleiste ab Laptop */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col gap-1 border-r border-ink-700 p-5 lg:flex">
        <div className="mb-6">
          <div className="font-serif text-2xl text-gold-300">Mentalist Lab</div>
          <div className="text-xs uppercase tracking-[0.2em] text-ink-400">{t('Beobachten · Lesen · Folgern', 'Observe · Read · Deduce')}</div>
          <LangSwitch className="mt-3" />
        </div>
        {MAIN.map((m) => (
          <NavLink key={m.to} to={m.to} end className={({ isActive }) => `rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-ink-700 text-gold-300' : 'text-ink-400 hover:text-ink-200'}`}>
            <span className="mr-2 inline-block w-4 text-center">{m.icon}</span>{t(m.de, m.en)}
          </NavLink>
        ))}
        <div className="gold-rule my-4" />
        <div className="space-y-0.5 overflow-y-auto">
          {AREAS.map((a) => (
            <NavLink key={a.id} to={`/bereich/${a.id}`} className={({ isActive }) => `block rounded-lg px-3 py-1.5 text-sm ${isActive ? 'bg-ink-700 text-gold-300' : 'text-ink-400 hover:text-ink-200'}`}>
              <span className="mr-2 inline-block w-4 text-center text-gold-500">{a.icon}</span>{t(a.title)}
            </NavLink>
          ))}
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 pb-28 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6 lg:px-10 lg:pb-10">
        <Outlet />
      </main>

      {/* Untere Navigation mobil/iPad */}
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-ink-700 bg-ink-900/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-xl grid-cols-4">
          {MAIN.map((m) => (
            <NavLink key={m.to} to={m.to} end={m.to === '/'} className={({ isActive }) => `flex flex-col items-center gap-0.5 py-2.5 text-[11px] ${isActive ? 'text-gold-400' : 'text-ink-400'}`}>
              <span className="text-lg leading-none">{m.icon}</span>{t(m.de, m.en)}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
