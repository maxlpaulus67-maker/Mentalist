import { PageTitle, Disclaimer } from '../components/ui'

export default function Info() {
  return (
    <div className="max-w-2xl space-y-5 leading-relaxed">
      <PageTitle kicker="Bevor du loslegst" title="Ehrlicher Hinweis" />
      <Disclaimer />
      <p>Mentalist Lab trainiert Aufmerksamkeit, Wahrnehmung und sauberes Schlussfolgern. Es macht dich nicht zum Gedankenleser, und es gibt kein einzelnes Signal, das eine Lüge verrät – auch keine Mikroexpression.</p>
      <h2 className="text-2xl">Die drei Regeln</h2>
      <ol className="list-decimal space-y-2 pl-5">
        <li><b className="text-gold-300">Baseline zuerst.</b> Wie verhält sich die Person, wenn sie entspannt ist? Nur Abweichungen davon sind interessant.</li>
        <li><b className="text-gold-300">Mehrere Signale zusammen.</b> Ein Signal ist Zufall, drei stimmige Signale sind ein Hinweis.</li>
        <li><b className="text-gold-300">Kontext beachten.</b> Verschränkte Arme können Ablehnung bedeuten – oder dass der Raum kalt ist.</li>
      </ol>
      <h2 className="text-2xl">Fair bleiben</h2>
      <p>Nutze das Gelernte, um besser zuzuhören und Menschen besser zu verstehen – nicht, um sie zu manipulieren oder bloßzustellen. Einschätzungen sind Wahrscheinlichkeiten, keine Urteile.</p>
      <h2 className="text-2xl">Daten & Offline</h2>
      <p>Die App läuft komplett offline, ohne Konto und ohne Server. Dein Fortschritt liegt nur in diesem Browser auf diesem Gerät. Zum Installieren: im Browser-Menü „Zum Startbildschirm hinzufügen“ bzw. „App installieren“ wählen.</p>
      <p className="text-xs text-ink-400">Alle Gesichter sind gezeichnete Illustrationen, alle Texte und Fälle eigens für diese App geschrieben. Inspiriert vom Stil klassischer TV-Mentalisten; keine Verbindung zu einer Serie.</p>
    </div>
  )
}
