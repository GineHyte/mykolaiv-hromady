# mykolaiv-hromady

Monitoring internationaler Beziehungen der Hromady (Gemeinden) der Oblast Mykolaiv.

## Struktur

- `frontend/` — React (Vite) App, Karte + Verwaltung der Gromady-Daten. Siehe `frontend/README.md`.
- `backend/` — Express + SQLite REST-API. Siehe `backend/README.md`.
- `legacy/index.html` — die ursprüngliche Single-File-Version (statisch, Daten nur in `localStorage` des Browsers). Nur als Referenz, nicht mehr aktiv gepflegt.

## Warum zwei Projekte?

GitHub Pages hostet nur statische Dateien (Frontend-Build). Für gemeinsame, dauerhaft gespeicherte Daten braucht es einen echten Server — das übernimmt `backend/`, gehostet auf einem eigenen Server, mit SQLite als Datenbank. Details zur Anbindung stehen in `backend/README.md`.
