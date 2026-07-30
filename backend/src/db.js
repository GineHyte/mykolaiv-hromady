import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import { COORDS, SEED } from "./seed.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "..", "data", "hromady.sqlite");

export const db = new DatabaseSync(DB_PATH);
db.exec("PRAGMA journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS hromady (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT,
    district TEXT,
    head TEXT,
    email TEXT,
    phone TEXT,
    site TEXT,
    lat REAL,
    lng REAL,
    partners TEXT NOT NULL DEFAULT '[]',
    memos TEXT NOT NULL DEFAULT '[]'
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

function seedAdminFromEnv() {
  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "";

  if (!password) {
    console.warn("ADMIN_PASSWORD не задано в .env — адмін-акаунт не створено/не оновлено.");
    return;
  }
  if (!email) {
    console.warn("ADMIN_EMAIL не задано в .env — адмін-акаунт не створено/не оновлено.");
    return;
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  db.prepare(`
    INSERT INTO users (email, password_hash, role)
    VALUES (@email, @passwordHash, 'admin')
    ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash
  `).run({ email, passwordHash });
}

seedAdminFromEnv();

function seedIfEmpty() {
  const { count } = db.prepare("SELECT COUNT(*) AS count FROM hromady").get();
  if (count > 0) return;

  const insert = db.prepare(`
    INSERT INTO hromady (name, type, district, head, email, phone, site, lat, lng, partners, memos)
    VALUES (@name, @type, @district, @head, @email, @phone, @site, @lat, @lng, @partners, @memos)
  `);

  db.exec("BEGIN");
  try {
    for (const h of SEED) {
      const coords = h.coords || COORDS[h.name] || null;
      insert.run({
        name: h.name,
        type: h.type,
        district: h.district,
        head: h.head || "",
        email: h.email || "",
        phone: h.phone || "",
        site: h.site || "",
        lat: coords ? coords[0] : null,
        lng: coords ? coords[1] : null,
        partners: JSON.stringify(h.partners || []),
        memos: JSON.stringify(h.memos || []),
      });
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
}

seedIfEmpty();

export function rowToHromada(row) {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    district: row.district,
    head: row.head,
    email: row.email,
    phone: row.phone,
    site: row.site,
    coords: row.lat != null && row.lng != null ? [row.lat, row.lng] : null,
    partners: JSON.parse(row.partners || "[]"),
    memos: JSON.parse(row.memos || "[]"),
  };
}
