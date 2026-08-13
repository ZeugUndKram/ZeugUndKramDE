# zeugundkram.de

Persönliche Spielwiese: eine Vue-3-SPA, die unter [www.zeugundkram.de](https://www.zeugundkram.de) liegt.
Herzstück ist der **Zeugzember** — zwölf Türen, hinter denen jeweils ein kleines
interaktives Projekt steckt (ESC-Beiträge, Jamba-Klingelton-Ranking,
Internet-Zeitmaschine, GBA-Demakes).

## Stack

- Vue 3 (Composition API) + TypeScript
- Vite 7, Vue Router 4 (History-Mode)
- Kein Backend, kein Tracking — reines Static Hosting

## Entwicklung

```sh
npm install
npm run dev          # Dev-Server
npm run type-check   # vue-tsc
npm run build        # Produktions-Build nach dist/
```

## Struktur

| Pfad                  | Inhalt                                                            |
| --------------------- | ----------------------------------------------------------------- |
| `src/assets/base.css` | Design-Tokens (Farben, Fonts, Abstände) — hier zentral anpassen    |
| `src/assets/main.css` | Globale Klassen: `.btn`, `.card`, `.page-centered`                 |
| `src/data/`           | Inhalte als Daten: Social-Links, Zeugzember-Türen                  |
| `src/components/`     | Geteilte Bausteine (`PageIntro`, `ProsePage`, `DoorTile`, …)       |
| `src/views/`          | Seiten, `views/Zeugzember/` die einzelnen Türen                    |

Neue Tür: Komponente unter `src/views/Zeugzember/` anlegen, Route in
`src/router/index.ts` eintragen, Eintrag in `src/data/zeugzember.ts` um `to` ergänzen.

## Deployment

Push auf `main` baut über GitHub Actions und deployed nach GitHub Pages
(`.github/workflows/deploy.yml`). `dist/index.html` wird dabei als `404.html`
dupliziert, damit die History-Routen direkt aufrufbar sind.
