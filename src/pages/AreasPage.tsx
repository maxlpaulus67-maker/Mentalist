import { Link } from 'react-router-dom'
import { AREAS } from '../lib/areas'
import { levelInfo, useStore } from '../lib/store'
import { PageTitle, ProgressBar } from '../components/ui'

export default function AreasPage() {
  const { xp } = useStore()
  return (
    <div>
      <PageTitle kicker="Übersicht" title="Bereiche" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {AREAS.map((a) => {
          const L = levelInfo(xp[a.id])
          return (
            <Link key={a.id} to={`/bereich/${a.id}`} className={`card transition hover:border-gold-600 ${a.ready ? '' : 'opacity-60'}`}>
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-gold-600/50 text-lg text-gold-400">{a.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="font-serif text-xl text-gold-300">{a.title}</div>
                  <div className="truncate text-xs text-ink-400">{a.subtitle}</div>
                </div>
                {!a.ready && <span className="chip">bald</span>}
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-ink-400">
                <span>Lv {L.lvl}</span><ProgressBar value={L.progress} />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
