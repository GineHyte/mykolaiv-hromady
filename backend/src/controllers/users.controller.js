import { db } from "../db.js";

const SELECT_USER = "SELECT * FROM users WHERE id = ?";

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    banned: !!user.banned,
    createdAt: user.created_at,
  };
}

function adminCount(excludeId) {
  const row = db
    .prepare("SELECT COUNT(*) AS count FROM users WHERE role = 'admin' AND id != ?")
    .get(excludeId ?? -1);
  return row.count;
}

export function listUsers(req, res) {
  const rows = db.prepare(`
    SELECT u.*, (SELECT COUNT(*) FROM hromady h WHERE h.created_by = u.id) AS hromady_count
    FROM users u
    ORDER BY u.created_at DESC
  `).all();

  res.json(rows.map((row) => ({ ...publicUser(row), hromadyCount: row.hromady_count })));
}

export function overview(req, res) {
  const users = db.prepare("SELECT COUNT(*) AS count FROM users").get().count;
  const admins = db.prepare("SELECT COUNT(*) AS count FROM users WHERE role = 'admin'").get().count;
  const banned = db.prepare("SELECT COUNT(*) AS count FROM users WHERE banned = 1").get().count;
  const hromady = db.prepare("SELECT COUNT(*) AS count FROM hromady").get().count;
  const unowned = db.prepare("SELECT COUNT(*) AS count FROM hromady WHERE created_by IS NULL").get().count;

  res.json({ users, admins, banned, hromady, unowned });
}

export function banUser(req, res) {
  const target = db.prepare(SELECT_USER).get(req.params.id);
  if (!target) return res.status(404).json({ error: "Користувача не знайдено" });
  if (target.id === req.user.id) {
    return res.status(400).json({ error: "Не можна заблокувати самого себе" });
  }
  if (target.role === "admin" && adminCount(target.id) === 0) {
    return res.status(400).json({ error: "Неможливо заблокувати останнього адміністратора" });
  }

  db.prepare("UPDATE users SET banned = 1, token_version = token_version + 1 WHERE id = ?").run(target.id);
  res.json(publicUser(db.prepare(SELECT_USER).get(target.id)));
}

export function unbanUser(req, res) {
  const target = db.prepare(SELECT_USER).get(req.params.id);
  if (!target) return res.status(404).json({ error: "Користувача не знайдено" });

  db.prepare("UPDATE users SET banned = 0 WHERE id = ?").run(target.id);
  res.json(publicUser(db.prepare(SELECT_USER).get(target.id)));
}

export function kickUser(req, res) {
  const target = db.prepare(SELECT_USER).get(req.params.id);
  if (!target) return res.status(404).json({ error: "Користувача не знайдено" });

  db.prepare("UPDATE users SET token_version = token_version + 1 WHERE id = ?").run(target.id);
  res.json(publicUser(db.prepare(SELECT_USER).get(target.id)));
}

export function setUserRole(req, res) {
  const role = req.body.role;
  if (role !== "admin" && role !== "user") {
    return res.status(400).json({ error: "Роль має бути 'admin' або 'user'" });
  }

  const target = db.prepare(SELECT_USER).get(req.params.id);
  if (!target) return res.status(404).json({ error: "Користувача не знайдено" });

  if (target.role === "admin" && role === "user" && adminCount(target.id) === 0) {
    return res.status(400).json({ error: "Неможливо понизити останнього адміністратора" });
  }

  db.prepare("UPDATE users SET role = ? WHERE id = ?").run(role, target.id);
  res.json(publicUser(db.prepare(SELECT_USER).get(target.id)));
}

export function deleteUser(req, res) {
  const target = db.prepare(SELECT_USER).get(req.params.id);
  if (!target) return res.status(404).json({ error: "Користувача не знайдено" });
  if (target.id === req.user.id) {
    return res.status(400).json({ error: "Не можна видалити самого себе" });
  }
  if (target.role === "admin" && adminCount(target.id) === 0) {
    return res.status(400).json({ error: "Неможливо видалити останнього адміністратора" });
  }

  db.prepare("DELETE FROM users WHERE id = ?").run(target.id);
  res.status(204).end();
}
