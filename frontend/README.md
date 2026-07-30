# Frontend

React (Vite) App für die Hromady-Monitoring-Karte. Redet mit dem `backend/` per REST-API (`VITE_API_URL`).

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

Läuft auf `http://localhost:5173`, erwartet Backend auf `http://localhost:4000` (siehe `.env`).

## Build

```bash
npm run build
```

Output liegt in `dist/` — das ist, was auf GitHub Pages deployt wird.

## Struktur

```
src/
  api/            fetch-Wrapper zum Backend
  context/        HromadyContext — globaler State (Daten, Auswahl, Tabs, Filter, Toast)
  hooks/          useHromady (Daten-CRUD), useToast
  components/
    Header, MapView, Toast, ConfirmModal
    Sidebar/
      Tabs
      ListPanel/    Stats, Filter, Kartenliste
      FormPanel/     Formular inkl. Partner-/Memo-Felder
      DetailPanel/   Detailansicht einer Gromada
  constants/      Auswahllisten (Typen, Bezirke, Status)
  utils/          Export (CSV/JSON), Fallback-Koordinaten
  styles/         index.css (1:1 aus der alten index.html übernommen)
```

## GitHub Pages Deployment

GitHub Pages liefert nur statische Dateien — kein Node-Prozess. Deployment läuft automatisch über `.github/workflows/deploy-pages.yml`:
1. Push auf `main` (mit Änderungen unter `frontend/`) baut `dist/` per `npm run build`.
2. `dist/` wird als Pages-Artifact hochgeladen und deployt.
3. `VITE_API_URL` kommt aus dem Repo-Variable `VITE_API_URL` (Settings → Secrets and variables → Actions → Variables), Fallback ist `https://hromady.petrenko.site/api`.

Einmalig einrichten: Repo-Settings → Pages → Source auf **GitHub Actions** stellen.
