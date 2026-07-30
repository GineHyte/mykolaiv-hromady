import bcrypt from "bcryptjs";
import { db } from "../db.js";
import { signToken } from "../auth.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function publicUser(user) {
  return { id: user.id, email: user.email, role: user.role };
}

export function register(req, res) {
  const email = (req.body.email || "").trim().toLowerCase();
  const password = req.body.password || "";

  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "Некоректний email" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Пароль має містити щонайменше 6 символів" });
  }

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    return res.status(409).json({ error: "Користувач з таким email вже існує" });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const info = db
    .prepare("INSERT INTO users (email, password_hash, role) VALUES (?, ?, 'user')")
    .run(email, passwordHash);

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(info.lastInsertRowid);
  const token = signToken(user);
  res.status(201).json({ token, user: publicUser(user) });
}

export function login(req, res) {
  const email = (req.body.email || "").trim().toLowerCase();
  const password = req.body.password || "";

  if (!email || !password) {
    return res.status(400).json({ error: "Email і пароль обов'язкові" });
  }

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: "Невірний email або пароль" });
  }
  if (user.banned) {
    return res.status(403).json({ error: "Акаунт заблоковано" });
  }

  const token = signToken(user);
  res.json({ token, user: publicUser(user) });
}

export function me(req, res) {
  res.json({ user: req.user });
}
