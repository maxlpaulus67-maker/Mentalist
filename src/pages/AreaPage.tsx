import { useParams } from 'react-router-dom'
import { areaById } from '../lib/areas'
import { levelInfo, levelTitle, useStore } from '../lib/store'
import { PageTitle, ProgressBar } from '../components/ui'
import MimikArea from '../areas/mimik/MimikArea'
import { useLang } from '../lib/i18n'

const IMPL: Record<string, () => JSX.Element> = { mimik: MimikArea }

export default function AreaPage() {
  const { areaId = '' } = useParams()
  const area = areaById(areaId)
  const { xp } = useStore()
  const { t, lang } = useLang()
  if (!area) return <p>{t('Bereich nicht gefunden.', 'Area not found.')}</p>
  const L = levelInfo(xp[area.id])
  const Impl = IMPL[area.id]
  return (
    <div>
      <PageTitle kicker={`${t('Bereich', 'Area')} ${area.nr}`} title={t(area.title)}>{t(area.subtitle)}</PageTitle>
      <div className="mb-6 flex items-center gap-3 text-sm">
        <span className="text-gold-300">Level {L.lvl}</span><span className="text-ink-400">{levelTitle(L.lvl, lang)}</span>
        <ProgressBar value={L.progress} className="max-w-48" />
      </div>
      {Impl ? <Impl /> : (
        <div className="card text-ink-400">{t('Dieser Bereich ist in Arbeit und folgt in Kürze.', 'This area is in progress and coming soon.')}</div>
      )}
    </div>
  )
}
