# Backend

Express + SQLite REST API for die Hromady-Monitoring-App.

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

Server läuft auf `http://localhost:4000`. SQLite-DB liegt in `data/hromady.sqlite` (wird beim ersten Start automatisch angelegt und mit den Seed-Daten befüllt).

## Accounts & Rechte

Der initiale Admin-Account wird bei **jedem Serverstart** aus den `.env`-Variablen `ADMIN_USERNAME` und `ADMIN_PASSWORD` angelegt bzw. aktualisiert (Passwort-Hash wird per `bcryptjs` neu berechnet, falls sich das Passwort geändert hat). Weitere Nutzer registrieren sich selbst über `/api/auth/register` (Rolle immer `user`); Adminrechte vergibt ein bestehender Admin über das Dashboard (`PATCH /api/admin/users/:id/role`).

- `ADMIN_USERNAME` / `ADMIN_PASSWORD` fehlen → Seeding wird übersprungen (Warnung im Log), bestehender Account bleibt unverändert.
- `JWT_SECRET` ist Pflicht — ohne diese Variable startet der Server nicht (`throw` beim Import von `src/auth.js`). Für Produktion einen langen zufälligen Wert setzen, z. B. `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.
- `JWT_EXPIRES_IN` (Default `12h`) steuert die Gültigkeit des Tokens.
- Jeder Request mit Token wird gegen die DB geprüft (nicht nur gegen den Token-Inhalt) — Bann, Kick und Rollenänderung wirken dadurch sofort, auch bei bereits ausgestellten Tokens.
- Rechte auf Hromady-Datensätze: **Ersteller** (`created_by`) darf eigene Einträge bearbeiten/löschen, **Admin** darf alles. Altbestand ohne `created_by` (z. B. Seed-Daten) kann nur ein Admin bearbeiten.

Login:

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin","password":"..."}'
# => { "token": "...", "user": { "id": 1, "email": "admin", "role": "admin" } }
```

Den erhaltenen Token als `Authorization: Bearer <token>` bei geschützten Requests mitschicken.

## API

| Methode | Pfad                        | Auth   | Beschreibung                          |
|---------|-----------------------------|--------|----------------------------------------|
| GET     | `/api/health`               | –      | Health-Check                           |
| POST    | `/api/auth/register`        | –      | Neuen Nutzer-Account anlegen           |
| POST    | `/api/auth/login`           | –      | Login, liefert JWT                     |
| GET     | `/api/auth/me`              | ✅     | Aktuellen Token prüfen                 |
| GET     | `/api/hromady`              | –      | Alle Hromady                           |
| GET     | `/api/hromady/:id`          | –      | Eine Hromada                           |
| POST    | `/api/hromady`              | ✅     | Neue Hromada anlegen (wird Ersteller)  |
| PUT     | `/api/hromady/:id`          | ✅ own | Hromada aktualisieren                  |
| DELETE  | `/api/hromady/:id`          | ✅ own | Hromada löschen                        |
| GET     | `/api/admin/overview`       | 👑     | Dashboard-Kennzahlen (Nutzer, Bans, Hromady, ...) |
| GET     | `/api/admin/users`          | 👑     | Alle Nutzer inkl. Rolle/Bann/Anzahl Hromady |
| PATCH   | `/api/admin/users/:id/ban`  | 👑     | Nutzer sperren (+ sofortiger Kick)     |
| PATCH   | `/api/admin/users/:id/unban`| 👑     | Sperre aufheben                        |
| PATCH   | `/api/admin/users/:id/kick` | 👑     | Alle aktiven Tokens des Nutzers invalidieren |
| PATCH   | `/api/admin/users/:id/role` | 👑     | Rolle setzen (`user`/`admin`)          |
| DELETE  | `/api/admin/users/:id`      | 👑     | Nutzer löschen (eigene Hromady werden verwaist) |

`✅ own` = eingeloggt, nur eigene Datensätze (Admin darf immer). `👑` = eingeloggt **und** Rolle `admin`. Der letzte verbleibende Admin kann nicht gebannt, degradiert oder gelöscht werden; Admins können sich nicht selbst bannen/löschen.

## Deployment auf eigenem Server

- `.env` mit echter `CORS_ORIGIN` (die GitHub-Pages-URL des Frontends), `ADMIN_USERNAME`, `ADMIN_PASSWORD` und einem zufälligen `JWT_SECRET` setzen.
- Prozess mit `pm2` oder systemd laufen lassen, dahinter nginx als Reverse-Proxy mit HTTPS (Let's Encrypt) — Browser blockt sonst Mixed-Content, da GitHub Pages HTTPS erzwingt.
- `data/hromady.sqlite` regelmäßig sichern (Backup), liegt nur auf diesem Server, nicht im Repo.
