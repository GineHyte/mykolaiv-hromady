import { db, rowToHromada } from "../db.js";

const SELECT_ALL = "SELECT * FROM hromady ORDER BY name";
const SELECT_ONE = "SELECT * FROM hromady WHERE id = ?";

export function listHromady(req, res) {
  const rows = db.prepare(SELECT_ALL).all();
  res.json(rows.map(rowToHromada));
}

export function getHromada(req, res) {
  const row = db.prepare(SELECT_ONE).get(req.params.id);
  if (!row) return res.status(404).json({ error: "Громаду не знайдено" });
  res.json(rowToHromada(row));
}

function canModify(user, row) {
  return user.role === "admin" || row.created_by === user.id;
}

export function createHromada(req, res) {
  const h = req.body;
  if (!h.name || !h.name.trim()) {
    return res.status(400).json({ error: "Назва громади обов'язкова" });
  }

  const coords = h.coords;
  const info = db.prepare(`
    INSERT INTO hromady (name, type, district, head, email, phone, site, lat, lng, partners, memos, created_by)
    VALUES (@name, @type, @district, @head, @email, @phone, @site, @lat, @lng, @partners, @memos, @createdBy)
  `).run({
    name: h.name.trim(),
    type: h.type || "Міська",
    district: h.district || "",
    head: h.head || "",
    email: h.email || "",
    phone: h.phone || "",
    site: h.site || "",
    lat: coords ? coords[0] : null,
    lng: coords ? coords[1] : null,
    partners: JSON.stringify(h.partners || []),
    memos: JSON.stringify(h.memos || []),
    createdBy: req.user.id,
  });

  const row = db.prepare(SELECT_ONE).get(info.lastInsertRowid);
  res.status(201).json(rowToHromada(row));
}

export function updateHromada(req, res) {
  const existing = db.prepare(SELECT_ONE).get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Громаду не знайдено" });
  if (!canModify(req.user, existing)) {
    return res.status(403).json({ error: "Ви можете редагувати лише власні громади" });
  }

  const h = req.body;
  if (!h.name || !h.name.trim()) {
    return res.status(400).json({ error: "Назва громади обов'язкова" });
  }

  const coords = h.coords;
  db.prepare(`
    UPDATE hromady SET
      name = @name, type = @type, district = @district, head = @head,
      email = @email, phone = @phone, site = @site,
      lat = @lat, lng = @lng, partners = @partners, memos = @memos
    WHERE id = @id
  `).run({
    id: req.params.id,
    name: h.name.trim(),
    type: h.type || "Міська",
    district: h.district || "",
    head: h.head || "",
    email: h.email || "",
    phone: h.phone || "",
    site: h.site || "",
    lat: coords ? coords[0] : null,
    lng: coords ? coords[1] : null,
    partners: JSON.stringify(h.partners || []),
    memos: JSON.stringify(h.memos || []),
  });

  const row = db.prepare(SELECT_ONE).get(req.params.id);
  res.json(rowToHromada(row));
}

export function deleteHromada(req, res) {
  const existing = db.prepare(SELECT_ONE).get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Громаду не знайдено" });
  if (!canModify(req.user, existing)) {
    return res.status(403).json({ error: "Ви можете видаляти лише власні громади" });
  }

  db.prepare("DELETE FROM hromady WHERE id = ?").run(req.params.id);
  res.status(204).end();
}
