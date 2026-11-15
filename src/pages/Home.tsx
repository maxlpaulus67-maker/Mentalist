import { Link } from 'react-router-dom'
import { AREAS } from '../lib/areas'
import { levelInfo, levelTitle, liveStreak, today, useStore } from '../lib/store'
import { Disclaimer, ProgressBar } from '../components/ui'
import { useLang } from '../lib/i18n'
import LangSwitch from '../components/LangSwitch'

export default function Home() {
  const s = useStore()
  const { t, lang } = useLang()
  const streak = liveStreak(s)
  const doneToday = s.settings['daily.last'] === today()
  const todayCount = s.attempts.filter((a) => new Date(a.t).toDateString() === new Date().toDateString()).length
  const totalLvl = AREAS.filter((a) => a.ready).reduce((n, a) => n + levelInfo(s.xp[a.id]).lvl, 0)
  return (
    <div className="space-y-6">
      <header className="pt-2">
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs uppercase tracking-[0.3em] text-gold-500">Mentalist Lab</div>
          <LangSwitch className="lg:hidden" />
        </div>
        <h1 className="mt-1 text-4xl sm:text-5xl">{t('Sieh, was andere übersehen.', 'See what others miss.')}</h1>
        <p className="mt-2 max-w-xl text-ink-400">{t('Beobachten, Menschen lesen, schlussfolgern – jeden Tag ein bisschen schärfer.', 'Observe, read people, deduce – a little sharper every day.')}</p>
      </header>

      <section className="card relative overflow-hidden border-gold-600/40">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold-500/10 blur-2xl" />
        <div className="text-xs uppercase tracking-widest text-gold-500">{t('Tägliches Training · ca. 10 Minuten', 'Daily training · approx. 10 minutes')}</div>
        <h2 className="mt-1 text-2xl">{doneToday ? t('Heute erledigt – stark.', 'Done for today – well done.') : t('Deine Einheit für heute', 'Your session for today')}</h2>
        <p className="mt-1 text-sm text-ink-400">{t('Gemischt aus allen verfügbaren Bereichen.', 'Mixed from all available areas.')}</p>
        <Link to="/training" className="btn-gold mt-4 w-full sm:w-auto">{doneToday ? t('Noch eine Runde', 'One more round') : t('Training starten', 'Start training')}</Link>
      </section>

      <section className="grid grid-cols-3 gap-3 text-center">
        <div className="card"><div className="font-serif text-3xl text-gold-300">{streak}</div><div className="text-xs text-ink-400">{t('Tage Streak', 'Day streak')}</div></div>
        <div className="card"><div className="font-serif text-3xl text-gold-300">{todayCount}</div><div className="text-xs text-ink-400">{t('Aufgaben heute', 'Tasks today')}</div></div>
        <div className="card"><div className="font-serif text-3xl text-gold-300">{totalLvl}</div><div className="text-xs text-ink-400">{t('Gesamtlevel', 'Total level')}</div></div>
      </section>

      <section>
        <h2 className="mb-3 text-2xl">{t('Deine Bereiche', 'Your areas')}</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {AREAS.map((a) => {
            const L = levelInfo(s.xp[a.id])
            return (
              <Link key={a.id} to={`/bereich/${a.id}`} className="card flex items-center gap-3 py-3 transition hover:border-gold-600">
                <span className="w-6 text-center text-gold-400">{a.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate">{t(a.title)}</span>
                    <span className="shrink-0 text-xs text-ink-400">{a.ready ? `Lv ${L.lvl} · ${levelTitle(L.lvl, lang)}` : t('bald', 'soon')}</span>
                  </div>
                  <ProgressBar value={L.progress} className="mt-1.5" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <Disclaimer />
    </div>
  )
}
