import { PageTitle, Disclaimer } from '../components/ui'
import { useLang } from '../lib/i18n'
import LangSwitch from '../components/LangSwitch'

export default function Info() {
  const { t } = useLang()
  return (
    <div className="max-w-2xl space-y-5 leading-relaxed">
      <PageTitle kicker={t('Bevor du loslegst', 'Before you start')} title={t('Ehrlicher Hinweis', 'Honest note')} />
      <div className="flex items-center gap-3 text-sm text-ink-400">{t('Sprache', 'Language')} <LangSwitch /></div>
      <Disclaimer />
      <p>{t('Mentalist Lab trainiert Aufmerksamkeit, Wahrnehmung und sauberes Schlussfolgern. Es macht dich nicht zum Gedankenleser, und es gibt kein einzelnes Signal, das eine Lüge verrät – auch keine Mikroexpression.',
        'Mentalist Lab trains attention, perception and clean reasoning. It won’t make you a mind reader, and there is no single signal that gives away a lie – not even a micro-expression.')}</p>
      <h2 className="text-2xl">{t('Die drei Regeln', 'The three rules')}</h2>
      <ol className="list-decimal space-y-2 pl-5">
        <li><b className="text-gold-300">{t('Baseline zuerst.', 'Baseline first.')}</b> {t('Wie verhält sich die Person, wenn sie entspannt ist? Nur Abweichungen davon sind interessant.', 'How does the person behave when relaxed? Only deviations from that are interesting.')}</li>
        <li><b className="text-gold-300">{t('Mehrere Signale zusammen.', 'Several signals together.')}</b> {t('Ein Signal ist Zufall, drei stimmige Signale sind ein Hinweis.', 'One signal is chance; three consistent signals are a clue.')}</li>
        <li><b className="text-gold-300">{t('Kontext beachten.', 'Mind the context.')}</b> {t('Verschränkte Arme können Ablehnung bedeuten – oder dass der Raum kalt ist.', 'Crossed arms can mean rejection – or that the room is cold.')}</li>
      </ol>
      <h2 className="text-2xl">{t('Fair bleiben', 'Play fair')}</h2>
      <p>{t('Nutze das Gelernte, um besser zuzuhören und Menschen besser zu verstehen – nicht, um sie zu manipulieren oder bloßzustellen. Einschätzungen sind Wahrscheinlichkeiten, keine Urteile.',
        'Use what you learn to listen better and understand people better – not to manipulate or expose them. Reads are probabilities, not verdicts.')}</p>
      <h2 className="text-2xl">{t('Daten & Offline', 'Data & offline')}</h2>
      <p>{t('Die App läuft komplett offline, ohne Konto und ohne Server. Dein Fortschritt liegt nur in diesem Browser auf diesem Gerät. Zum Installieren: im Browser-Menü „Zum Startbildschirm hinzufügen“ bzw. „App installieren“ wählen.',
        'The app runs fully offline, with no account and no server. Your progress is stored only in this browser on this device. To install: choose “Add to Home Screen” or “Install app” in the browser menu.')}</p>
      <p className="text-xs text-ink-400">{t('Alle Gesichter sind gezeichnete Illustrationen, alle Texte und Fälle eigens für diese App geschrieben. Inspiriert vom Stil klassischer TV-Mentalisten; keine Verbindung zu einer Serie.',
        'All faces are drawn illustrations; all texts and cases were written for this app. Inspired by the style of classic TV mentalists; not affiliated with any series.')}</p>
    </div>
  )
}
