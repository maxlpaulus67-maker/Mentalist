# Mentalist Lab

Installierbare, offline-fähige Trainings-App (PWA): beobachten, Menschen lesen, schlussfolgern.
React + Vite + TypeScript + Tailwind. Kein Backend, Fortschritt in `localStorage`.

```bash
npm install
npm run dev      # Entwicklung
npm run build    # Produktions-Build inkl. Service Worker (dist/)
```

## Plan

| # | Bereich | Inhalt |
|---|---------|--------|
| – | Grundstruktur | Navigation, Start, Streak, Level, Statistik, Hinweis, Tägliches Training, DE/EN |
| 1 | Mimik | 12 Lektionen, Blitz-Training (21 Aufgaben, 500–40 ms), Merkmals-Quiz (22), Gesichts-Labor |
| 2 | Körpersprache | 6 Lektionen, Wissens-Quiz (24), Situationen (10) |
| 3 | Beobachtung | 3 Lektionen, zufällige SVG-Szenen, 20+ Fragetypen, 5 Stufen (30–10 s) |
| 4 | Schlussfolgern | 3 Lektionen, 20 Fälle mit Auflösung |
| 5 | Cold Reading | 3 Lektionen, Sortierübung (30 Aussagen), Techniken-Quiz (10) |
| 6 | Poker | 6 Lektionen, Pot-Odds-Rechner, Call/Fold-Drill (∞), Positionen & Starthände (12), Tells (10) – nur Spielgeld |
| 7 | Gedächtnispalast | 4 Lektionen, Wortlisten (60 Wörter), Zahlen, Kartenreihenfolge |
| 8 | Feldnotizen | 3 Lektionen, Tagebuch, Trefferquote & Kalibrierung, 24 Missionen |

## Struktur

- `src/lib/` – Speicher (`store.ts`), Bereichsliste, Hilfsfunktionen
- `src/components/` – Layout/Navigation, UI-Bausteine, wiederverwendbares Quiz, Linienchart
- `src/pages/` – Start, Bereiche, Statistik, Hinweis, Tägliches Training
- `src/areas/<bereich>/` – Inhalte und Übungen je Bereich
- `src/components/AreaShell.tsx` – gemeinsamer Rahmen für Lektionen/Übungen
- Texte zweisprachig als `{ de, en }`, Übersetzung über `useLang()` in `src/lib/i18n.ts`
