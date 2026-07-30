# Backend

Express + SQLite REST API for die Hromady-Monitoring-App.

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

Server läuft auf `http://localhost:4000`. SQLite-DB liegt in `data/hromady.sqlite` (wird beim ersten Start automatisch angelegt und mit den Seed-Daten befüllt).

## Admin-Account

Der Admin-Account wird bei **jedem Serverstart** aus den `.env`-Variablen `ADMIN_EMAIL` und `ADMIN_PASSWORD` angelegt bzw. aktualisiert (Passwort-Hash wird per `bcryptjs` neu berechnet, falls sich das Passwort geändert hat). Es gibt keine Registrierung — Adminzugang wird ausschließlich über `.env` verwaltet.

- `ADMIN_EMAIL` / `ADMIN_PASSWORD` fehlen → Seeding wird übersprungen (Warnung im Log), bestehender Account bleibt unverändert.
- `JWT_SECRET` ist Pflicht — ohne diese Variable startet der Server nicht (`throw` beim Import von `src/auth.js`). Für Produktion einen langen zufälligen Wert setzen, z. B. `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.
- `JWT_EXPIRES_IN` (Default `12h`) steuert die Gültigkeit des Tokens.

Login:

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"..."}'
# => { "token": "...", "user": { "id": 1, "email": "...", "role": "admin" } }
```

Den erhaltenen Token als `Authorization: Bearer <token>` bei geschützten Requests mitschicken.

## API

| Methode | Pfad               | Auth | Beschreibung          |
|---------|--------------------|------|------------------------|
| GET     | `/api/health`      | –    | Health-Check           |
| POST    | `/api/auth/login`  | –    | Login, liefert JWT      |
| GET     | `/api/auth/me`     | ✅   | Aktuellen Token prüfen  |
| GET     | `/api/hromady`     | –    | Alle Hromady           |
| GET     | `/api/hromady/:id` | –    | Eine Hromada           |
| POST    | `/api/hromady`     | ✅   | Neue Hromada anlegen   |
| PUT     | `/api/hromady/:id` | ✅   | Hromada aktualisieren  |
| DELETE  | `/api/hromady/:id` | ✅   | Hromada löschen        |

## Deployment auf eigenem Server

- `.env` mit echter `CORS_ORIGIN` (die GitHub-Pages-URL des Frontends), `ADMIN_EMAIL`, `ADMIN_PASSWORD` und einem zufälligen `JWT_SECRET` setzen.
- Prozess mit `pm2` oder systemd laufen lassen, dahinter nginx als Reverse-Proxy mit HTTPS (Let's Encrypt) — Browser blockt sonst Mixed-Content, da GitHub Pages HTTPS erzwingt.
- `data/hromady.sqlite` regelmäßig sichern (Backup), liegt nur auf diesem Server, nicht im Repo.
