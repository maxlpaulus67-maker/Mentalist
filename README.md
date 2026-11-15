# Mentalist Lab

Installierbare, offline-fähige Trainings-App (PWA): beobachten, Menschen lesen, schlussfolgern.
React + Vite + TypeScript + Tailwind. Kein Backend, Fortschritt in `localStorage`.

```bash
npm install
npm run dev      # Entwicklung
npm run build    # Produktions-Build inkl. Service Worker (dist/)
```

## Plan

| # | Bereich | Status |
|---|---------|--------|
| – | Grundstruktur, Navigation, Startseite, Streak, Level, Statistik, Hinweis, Tägliches Training | ✅ |
| 1 | Mimik – 12 Lektionen, Blitz-Training (21 Aufgaben, 500–40 ms), Merkmals-Quiz (22 Fragen), Gesichts-Labor | ✅ |
| 2 | Körpersprache – Lektionen + Quiz | offen |
| 3 | Beobachtung – SVG-Szenen + Detailfragen | offen |
| 4 | Schlussfolgern – Detektiv-Fälle | offen |
| 5 | Cold Reading – Barnum-Sortierübung | offen |
| 6 | Poker – Pot Odds, Positionen, Starthände, Tells (nur Spielgeld) | offen |
| 7 | Gedächtnispalast – Wörter, Zahlen, Karten | offen |
| 8 | Feldnotizen – Tagebuch mit Trefferquote | offen |

## Struktur

- `src/lib/` – Speicher (`store.ts`), Bereichsliste, Hilfsfunktionen
- `src/components/` – Layout/Navigation, UI-Bausteine, wiederverwendbares Quiz, Linienchart
- `src/pages/` – Start, Bereiche, Statistik, Hinweis, Tägliches Training
- `src/areas/<bereich>/` – Inhalte und Übungen je Bereich
- Neue Bereiche: in `pages/AreaPage.tsx` (`IMPL`) und `pages/Daily.tsx` (`STEPS`) eintragen.
